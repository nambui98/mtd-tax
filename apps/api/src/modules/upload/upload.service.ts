import { Injectable, Logger } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { S3Service } from './s3.service';

export interface FileValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    maxSize: number;
    allowedTypes: string[];
    estimatedProcessingTime: number;
}

export interface UploadProgress {
    uploadId: string;
    fileName: string;
    totalChunks: number;
    uploadedChunks: number;
    progress: number;
    status: 'initiated' | 'uploading' | 'completed' | 'failed' | 'aborted';
    error?: string;
}

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name);
    private readonly uploadProgress = new Map<string, UploadProgress>();

    constructor(
        private readonly documentsService: DocumentsService,
        private readonly s3Service: S3Service,
    ) {}

    validateFile(fileInfo: {
        fileName: string;
        fileSize: number;
        mimeType: string;
        documentType: string;
    }): FileValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        const maxSize = 100 * 1024 * 1024; // 100MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/tiff',
            'image/tif',
        ];

        // Check file size
        if (fileInfo.fileSize > maxSize) {
            errors.push(
                `File size (${this.formatFileSize(fileInfo.fileSize)}) exceeds maximum limit of ${this.formatFileSize(maxSize)}`,
            );
        } else if (fileInfo.fileSize > 10 * 1024 * 1024) {
            warnings.push(
                'Large file detected. Consider using chunked upload for better reliability.',
            );
        }

        // Check file type
        if (!allowedTypes.includes(fileInfo.mimeType)) {
            errors.push(`File type ${fileInfo.mimeType} is not supported`);
        }

        // Check file extension
        const fileExtension = fileInfo.fileName.split('.').pop()?.toLowerCase();
        const allowedExtensions = [
            'pdf',
            'doc',
            'docx',
            'xls',
            'xlsx',
            'jpg',
            'jpeg',
            'png',
            'tiff',
            'tif',
        ];
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            errors.push(`File extension .${fileExtension} is not supported`);
        }

        // Check document type
        const validDocumentTypes = [
            'receipt',
            'invoice',
            'statement',
            'tax',
            'other',
        ];
        if (!validDocumentTypes.includes(fileInfo.documentType)) {
            errors.push(`Invalid document type: ${fileInfo.documentType}`);
        }

        // Estimate processing time based on file size and type
        const estimatedProcessingTime = this.estimateProcessingTime(
            fileInfo.fileSize,
            fileInfo.mimeType,
        );

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            maxSize,
            allowedTypes,
            estimatedProcessingTime,
        };
    }

    async processDocumentWithAI(documentId: string): Promise<void> {
        try {
            this.logger.log(
                `Starting AI processing for document ${documentId}`,
            );
            // Update document status to processing
            await this.documentsService.updateDocumentStatus(
                documentId,
                'processing',
            );
            // Simulate AI processing steps
            await this.simulateAIProcessing(documentId);
            // Update document status to completed
            await this.documentsService.updateDocumentStatus(
                documentId,
                'completed',
            );
            this.logger.log(
                `AI processing completed for document ${documentId}`,
            );
        } catch (error) {
            this.logger.error(
                `AI processing failed for document ${documentId}:`,
                error,
            );
            await this.documentsService.updateDocumentStatus(
                documentId,
                'error',
            );
            throw error;
        }
    }

    updateUploadProgress(
        uploadId: string,
        progress: Partial<UploadProgress>,
    ): void {
        const currentProgress = this.uploadProgress.get(uploadId) || {
            uploadId,
            fileName: '',
            totalChunks: 0,
            uploadedChunks: 0,
            progress: 0,
            status: 'initiated' as const,
        };

        const updatedProgress = { ...currentProgress, ...progress };

        // Calculate progress percentage
        if (updatedProgress.totalChunks > 0) {
            updatedProgress.progress = Math.round(
                (updatedProgress.uploadedChunks / updatedProgress.totalChunks) *
                    100,
            );
        }

        this.uploadProgress.set(uploadId, updatedProgress);
    }

    getUploadProgress(uploadId: string): UploadProgress | null {
        return this.uploadProgress.get(uploadId) || null;
    }

    cleanupUploadProgress(uploadId: string): void {
        this.uploadProgress.delete(uploadId);
    }

    validateChunkUpload(
        uploadId: string,
        partNumber: number,
        totalParts: number,
        chunkSize: number,
    ): boolean {
        // Validate part number
        if (partNumber < 1 || partNumber > totalParts) {
            throw new Error(
                `Invalid part number: ${partNumber}. Must be between 1 and ${totalParts}`,
            );
        }

        // Validate chunk size (must be at least 5MB except for the last part)
        const minChunkSize = 5 * 1024 * 1024; // 5MB
        if (partNumber < totalParts && chunkSize < minChunkSize) {
            throw new Error(
                `Chunk size must be at least ${this.formatFileSize(minChunkSize)} for all parts except the last`,
            );
        }

        // Check if upload exists
        const progress = this.getUploadProgress(uploadId);
        if (!progress) {
            throw new Error(`Upload ${uploadId} not found`);
        }

        return true;
    }

    async handleUploadError(uploadId: string, error: Error): Promise<void> {
        this.logger.error(`Upload error for ${uploadId}:`, error);

        // Update progress with error
        this.updateUploadProgress(uploadId, {
            status: 'failed',
            error: error.message,
        });

        // Clean up S3 multipart upload if it exists
        try {
            await this.s3Service.abortMultipartUpload(uploadId);
        } catch (cleanupError) {
            this.logger.error(
                `Failed to cleanup S3 upload ${uploadId}:`,
                cleanupError,
            );
        }

        // Clean up progress after a delay
        setTimeout(() => {
            this.cleanupUploadProgress(uploadId);
        }, 60000); // 1 minute delay
    }

    private formatFileSize(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (
            parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
        );
    }

    private estimateProcessingTime(fileSize: number, mimeType: string): number {
        // Base processing time in seconds
        let baseTime = 30; // 30 seconds base

        // Adjust based on file size
        if (fileSize > 50 * 1024 * 1024) {
            baseTime += 60; // +1 minute for files > 50MB
        } else if (fileSize > 10 * 1024 * 1024) {
            baseTime += 30; // +30 seconds for files > 10MB
        }

        // Adjust based on file type
        if (mimeType.includes('image')) {
            baseTime += 15; // Images take longer to process
        } else if (mimeType.includes('spreadsheet')) {
            baseTime += 20; // Excel files take longer
        }

        return baseTime;
    }

    private async simulateAIProcessing(documentId: string): Promise<void> {
        // Simulate different processing steps
        const steps = [
            { name: 'Analyzing document structure', duration: 2000 },
            { name: 'Extracting text content', duration: 3000 },
            { name: 'Identifying transaction patterns', duration: 4000 },
            { name: 'Categorizing transactions', duration: 3000 },
            { name: 'Validating extracted data', duration: 2000 },
        ];

        for (const step of steps) {
            this.logger.log(
                `AI Processing Step: ${step.name} for document ${documentId}`,
            );
            await new Promise((resolve) => setTimeout(resolve, step.duration));
        }

        // Simulate creating some sample transactions
        // const sampleTransactions = [
        //     {
        //         transactionDate: new Date().toISOString().split('T')[0],
        //         description: 'Sample transaction 1',
        //         category: 'SALES_INCOME',
        //         amount: 1000.0,
        //         isAIGenerated: true,
        //         aiConfidence: 0.95,
        //     },
        //     {
        //         transactionDate: new Date().toISOString().split('T')[0],
        //         description: 'Sample transaction 2',
        //         category: 'OFFICE_EXPENSES',
        //         amount: -250.0,
        //         isAIGenerated: true,
        //         aiConfidence: 0.87,
        //     },
        // ];

        // Create transactions in the database
        // await this.documentsService.createBulkTransactions(
        //     'system', // userId
        //     documentId,
        //     sampleTransactions,
        // );

        // // Update document with AI processing results
        // await this.documentsService.updateDocument(documentId, {
        //     aiExtractedTransactions: sampleTransactions.length,
        //     aiAccuracy: 0.91,
        //     processedAt: new Date(),
        // });
    }

    getUploadStatistics(): {
        totalUploads: number;
        successfulUploads: number;
        failedUploads: number;
        averageProcessingTime: number;
        totalFileSize: number;
    } {
        // This would typically query the database for real statistics
        // For now, return mock data
        return {
            totalUploads: 150,
            successfulUploads: 142,
            failedUploads: 8,
            averageProcessingTime: 45, // seconds
            totalFileSize: 2.5 * 1024 * 1024 * 1024, // 2.5GB
        };
    }

    async cleanupExpiredUploads(): Promise<void> {
        const now = Date.now();
        const expiredUploads: string[] = [];

        for (const [uploadId, progress] of this.uploadProgress.entries()) {
            // Consider uploads expired after 1 hour of inactivity
            if (
                progress.status === 'initiated' &&
                now - progress.uploadedChunks * 60000 > 3600000
            ) {
                expiredUploads.push(uploadId);
            }
        }

        for (const uploadId of expiredUploads) {
            try {
                await this.s3Service.abortMultipartUpload(uploadId);
                this.uploadProgress.delete(uploadId);
                this.logger.log(`Cleaned up expired upload: ${uploadId}`);
            } catch (error) {
                this.logger.error(
                    `Failed to cleanup expired upload ${uploadId}:`,
                    error,
                );
            }
        }
    }
}
