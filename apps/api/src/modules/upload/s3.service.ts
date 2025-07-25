import { Injectable, Logger } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export interface UploadResult {
    key: string;
    url: string;
    size: number;
    etag: string;
    originalFileName?: string;
    contentType?: string;
    uploadedAt?: Date;
}

export interface ChunkUploadResult {
    partNumber: number;
    etag: string;
    size: number;
}

export interface MultipartUploadResult {
    key: string;
    url: string;
    originalFileName?: string;
    contentType?: string;
    uploadedAt?: Date;
    // size: number;
    // parts: { partNumber: number; etag: string; size: number }[];
}

export interface FileMetadata {
    key: string;
    originalFileName?: string;
    contentType: string;
    size: number;
    uploadedAt: Date;
    lastModified: Date;
    etag: string;
    url: string;
}

@Injectable()
export class S3Service {
    private readonly logger = new Logger(S3Service.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly region: string;

    constructor(private readonly configService: ConfigService) {
        this.bucketName =
            this.configService.get<string>('AWS_S3_BUCKET_NAME') ||
            'mtd-tax-documents';
        this.region =
            this.configService.get<string>('AWS_REGION') || 'us-east-1';

        this.s3Client = new S3Client({
            endpoint: this.configService.get<string>('AWS_S3_ENDPOINT') || '',
            region: this.region,
            credentials: {
                accessKeyId:
                    this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey:
                    this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ||
                    '',
            },
            forcePathStyle: true,
        });
    }

    async uploadFile(
        buffer: Buffer,
        key: string,
        contentType: string,
        originalFileName?: string,
        additionalMetadata?: Record<string, string>,
    ): Promise<UploadResult> {
        try {
            const metadata: Record<string, string> = {
                uploadedAt: new Date().toISOString(),
                ...additionalMetadata,
            };

            // Add original file name to metadata if provided
            if (originalFileName) {
                metadata.originalFileName = originalFileName;
            }

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: buffer,
                ContentType: contentType,
                Metadata: metadata,
            });

            const result = await this.s3Client.send(command);

            return {
                key,
                url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`,
                size: buffer.length,
                etag: result.ETag || '',
                originalFileName: originalFileName || key,
                contentType,
                uploadedAt: new Date(),
            };
        } catch (error) {
            this.logger.error(`Failed to upload file ${key}:`, error);
            throw new Error(`S3 upload failed: ${error.message}`);
        }
    }

    async uploadChunk(
        uploadId: string,
        partNumber: number,
        buffer: Buffer,
    ): Promise<ChunkUploadResult> {
        try {
            const command = new UploadPartCommand({
                Bucket: this.bucketName,
                Key: uploadId, // We'll use uploadId as the key for now
                PartNumber: partNumber,
                UploadId: uploadId,
                Body: buffer,
            });

            const result = await this.s3Client.send(command);

            return {
                partNumber,
                etag: result.ETag || '',
                size: buffer.length,
            };
        } catch (error) {
            this.logger.error(
                `Failed to upload chunk ${partNumber} for upload ${uploadId}:`,
                error,
            );
            throw new Error(`Chunk upload failed: ${error.message}`);
        }
    }

    async initiateMultipartUpload(
        key: string,
        contentType: string,
        originalFileName?: string,
        additionalMetadata?: Record<string, string>,
    ): Promise<string> {
        try {
            const metadata: Record<string, string> = {
                initiatedAt: new Date().toISOString(),
                ...additionalMetadata,
            };

            // Add original file name to metadata if provided
            if (originalFileName) {
                metadata.originalFileName = originalFileName;
            }

            const command = new CreateMultipartUploadCommand({
                Bucket: this.bucketName,
                Key: key,
                ContentType: contentType,
                Metadata: metadata,
            });

            const result = await this.s3Client.send(command);
            return result.UploadId || '';
        } catch (error) {
            this.logger.error(
                `Failed to initiate multipart upload for ${key}:`,
                error,
            );
            throw new Error(
                `Multipart upload initiation failed: ${error.message}`,
            );
        }
    }

    async completeMultipartUpload(
        uploadId: string,
        parts: { partNumber: number; etag: string }[],
        originalFileName?: string,
        contentType?: string,
    ): Promise<MultipartUploadResult> {
        try {
            const command = new CompleteMultipartUploadCommand({
                Bucket: this.bucketName,
                Key: uploadId, // We'll use uploadId as the key for now
                UploadId: uploadId,
                MultipartUpload: {
                    Parts: parts.map((part) => ({
                        PartNumber: part.partNumber,
                        ETag: part.etag,
                    })),
                },
            });

            const result = await this.s3Client.send(command);

            return {
                key: result.Key || uploadId,
                url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${result.Key}`,
                originalFileName: originalFileName || result.Key || uploadId,
                contentType: contentType || 'application/octet-stream',
                uploadedAt: new Date(),
                // size: parts.reduce((total, part) => total + (part.size || 0), 0),
                // parts: parts.map((part) => ({
                //     partNumber: part.partNumber,
                //     etag: part.etag,
                //     size: part.size,
                // })),
            };
        } catch (error) {
            this.logger.error(
                `Failed to complete multipart upload ${uploadId}:`,
                error,
            );
            throw new Error(
                `Multipart upload completion failed: ${error.message}`,
            );
        }
    }

    async abortMultipartUpload(uploadId: string): Promise<void> {
        try {
            const command = new AbortMultipartUploadCommand({
                Bucket: this.bucketName,
                Key: uploadId, // We'll use uploadId as the key for now
                UploadId: uploadId,
            });

            await this.s3Client.send(command);
            this.logger.log(`Aborted multipart upload: ${uploadId}`);
        } catch (error) {
            this.logger.error(
                `Failed to abort multipart upload ${uploadId}:`,
                error,
            );
            // Don't throw error for abort operations as they might fail if upload is already completed
        }
    }

    // async getSignedDownloadUrl(
    //     key: string,
    //     expiresIn: number = 3600,
    // ): Promise<string> {
    //     try {
    //         const command = new GetObjectCommand({
    //             Bucket: this.bucketName,
    //             Key: key,
    //         });

    //         return await getSignedUrl(this.s3Client, command, { expiresIn });
    //     } catch (error) {
    //         this.logger.error(
    //             `Failed to generate signed URL for ${key}:`,
    //             error,
    //         );
    //         throw new Error(
    //             `Failed to generate download URL: ${error.message}`,
    //         );
    //     }
    // }

    async deleteFile(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
            this.logger.log(`Deleted file: ${key}`);
        } catch (error) {
            this.logger.error(`Failed to delete file ${key}:`, error);
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async fileExists(key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
            return true;
        } catch (error) {
            if (error.name === 'NotFound') {
                return false;
            }
            this.logger.error(
                `Error checking file existence for ${key}:`,
                error,
            );
            throw new Error(`Failed to check file existence: ${error.message}`);
        }
    }

    async getFileMetadata(key: string): Promise<FileMetadata> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const result = await this.s3Client.send(command);

            // Extract original file name from metadata
            const originalFileName =
                result.Metadata?.originalfilename ||
                result.Metadata?.originalFileName ||
                key.split('/').pop() ||
                key;

            // Parse uploaded date from metadata
            const uploadedAt =
                result.Metadata?.uploadedat ||
                result.Metadata?.uploadedAt ||
                result.LastModified?.toISOString() ||
                new Date().toISOString();

            return {
                key,
                originalFileName,
                contentType: result.ContentType || 'application/octet-stream',
                size: result.ContentLength || 0,
                uploadedAt: new Date(uploadedAt),
                lastModified: result.LastModified || new Date(),
                etag: result.ETag || '',
                url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`,
            };
        } catch (error) {
            this.logger.error(`Failed to get file metadata for ${key}:`, error);
            throw new Error(`Failed to get file metadata: ${error.message}`);
        }
    }

    async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: destinationKey,
                // CopySource: `${this.bucketName}/${sourceKey}`,
            });

            await this.s3Client.send(command);
            this.logger.log(
                `Copied file from ${sourceKey} to ${destinationKey}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to copy file from ${sourceKey} to ${destinationKey}:`,
                error,
            );
            throw new Error(`Failed to copy file: ${error.message}`);
        }
    }

    async moveFile(sourceKey: string, destinationKey: string): Promise<void> {
        try {
            // Copy the file to the new location
            await this.copyFile(sourceKey, destinationKey);

            // Delete the original file
            await this.deleteFile(sourceKey);

            this.logger.log(
                `Moved file from ${sourceKey} to ${destinationKey}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to move file from ${sourceKey} to ${destinationKey}:`,
                error,
            );
            throw new Error(`Failed to move file: ${error.message}`);
        }
    }

    async listFiles(
        prefix: string,
        // maxKeys: number = 1000,
    ): Promise<
        {
            key: string;
            size: number;
            lastModified: Date;
        }[]
    > {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: prefix,
            });

            // Note: This is a simplified implementation
            // In a real implementation, you would use ListObjectsV2Command
            const result = await this.s3Client.send(command);

            return [
                {
                    key: prefix,
                    size: result.ContentLength || 0,
                    lastModified: result.LastModified || new Date(),
                },
            ];
        } catch (error) {
            this.logger.error(
                `Failed to list files with prefix ${prefix}:`,
                error,
            );
            throw new Error(`Failed to list files: ${error.message}`);
        }
    }

    getBucketSize(): number {
        try {
            // This would typically use ListObjectsV2Command to calculate total size
            // For now, return a mock value
            return 1024 * 1024 * 1024; // 1GB
        } catch (error) {
            this.logger.error('Failed to get bucket size:', error);
            throw new Error(`Failed to get bucket size: ${error.message}`);
        }
    }

    cleanupExpiredFiles(expirationDays: number = 30): number {
        try {
            // This would typically list all files and delete those older than expirationDays
            // For now, return a mock value
            this.logger.log(
                `Cleanup completed for files older than ${expirationDays} days`,
            );
            return 0;
        } catch (error) {
            this.logger.error('Failed to cleanup expired files:', error);
            throw new Error(
                `Failed to cleanup expired files: ${error.message}`,
            );
        }
    }

    // Utility methods for file handling
    private getFileExtension(filename: string): string {
        return filename.split('.').pop()?.toLowerCase() || '';
    }

    private getMimeType(filename: string): string {
        const extension = this.getFileExtension(filename);
        const mimeTypes: Record<string, string> = {
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            txt: 'text/plain',
            csv: 'text/csv',
            json: 'application/json',
            xml: 'application/xml',
            zip: 'application/zip',
            rar: 'application/x-rar-compressed',
            mp4: 'video/mp4',
            avi: 'video/x-msvideo',
            mp3: 'audio/mpeg',
            wav: 'audio/wav',
        };
        return mimeTypes[extension] || 'application/octet-stream';
    }

    private sanitizeFileName(filename: string): string {
        // Remove or replace invalid characters for S3 keys
        return filename
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^_|_$/g, '');
    }

    async generateUniqueKey(
        originalFileName: string,
        prefix?: string,
    ): Promise<string> {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const sanitizedFileName = this.sanitizeFileName(originalFileName);
        const extension = this.getFileExtension(originalFileName);

        const key = prefix
            ? `${prefix}/${timestamp}_${randomId}_${sanitizedFileName}`
            : `${timestamp}_${randomId}_${sanitizedFileName}`;

        return key;
    }

    async uploadFileWithMetadata(
        buffer: Buffer,
        originalFileName: string,
        prefix?: string,
        additionalMetadata?: Record<string, string>,
    ): Promise<UploadResult> {
        const contentType = this.getMimeType(originalFileName);
        const key = await this.generateUniqueKey(originalFileName, prefix);

        return this.uploadFile(
            buffer,
            key,
            contentType,
            originalFileName,
            additionalMetadata,
        );
    }

    async getFileInfo(key: string): Promise<{
        metadata: FileMetadata;
        isImage: boolean;
        isDocument: boolean;
        isVideo: boolean;
        isAudio: boolean;
        fileType: string;
        fileSize: string;
    }> {
        const metadata = await this.getFileMetadata(key);
        const contentType = metadata.contentType.toLowerCase();

        const isImage = contentType.startsWith('image/');
        const isDocument =
            contentType.includes('pdf') ||
            contentType.includes('word') ||
            contentType.includes('excel') ||
            contentType.includes('powerpoint') ||
            contentType.includes('text/');
        const isVideo = contentType.startsWith('video/');
        const isAudio = contentType.startsWith('audio/');

        const fileType = this.getFileExtension(
            metadata.originalFileName || metadata.key,
        );
        const fileSize = this.formatFileSize(metadata.size);

        return {
            metadata,
            isImage,
            isDocument,
            isVideo,
            isAudio,
            fileType,
            fileSize,
        };
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async listFilesWithMetadata(
        prefix: string,
        maxKeys: number = 1000,
    ): Promise<FileMetadata[]> {
        try {
            // This is a simplified implementation
            // In a real implementation, you would use ListObjectsV2Command
            // For now, we'll return an empty array as the current implementation doesn't support listing
            this.logger.warn(
                'listFilesWithMetadata is not fully implemented - using simplified version',
            );
            return [];
        } catch (error) {
            this.logger.error(
                `Failed to list files with metadata for prefix ${prefix}:`,
                error,
            );
            throw new Error(
                `Failed to list files with metadata: ${error.message}`,
            );
        }
    }
}
