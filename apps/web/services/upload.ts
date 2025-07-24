import { api } from './api';

export interface UploadProgress {
    uploadId: string;
    fileName: string;
    totalChunks: number;
    uploadedChunks: number;
    progress: number;
    status: 'initiated' | 'uploading' | 'completed' | 'failed' | 'aborted';
    error?: string;
}

export interface FileValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    maxSize: number;
    allowedTypes: string[];
    estimatedProcessingTime: number;
}

export interface UploadResult {
    documentId: string;
    fileName: string;
    fileSize: number;
    uploadStatus: 'completed';
    processingStatus: 'pending';
    s3Url: string;
}

export interface ChunkedUploadConfig {
    uploadId: string;
    fileName: string;
    filePath: string;
    chunkSize: number;
    totalChunks: number;
}

export const uploadService = {
    // Validate file before upload
    validateFile: async (
        file: File,
        documentType: string,
    ): Promise<FileValidationResult> => {
        const response = await api.post('/upload/document/validate', {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            documentType,
        });
        return response.data.data;
    },
    uploadFile: async (
        file: File,
        onProgress?: (progress: number) => void,
    ): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    onProgress(progress);
                }
            },
        });
        return response.data.data;
    },

    // Upload single file
    uploadDocument: async (
        file: File,
        data: {
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
        onProgress?: (progress: number) => void,
    ): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('clientId', data.clientId);
        if (data.businessId) formData.append('businessId', data.businessId);
        formData.append('documentType', data.documentType);
        if (data.folderId) formData.append('folderId', data.folderId);

        const response = await api.post('/upload/document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    onProgress(progress);
                }
            },
        });

        return response.data.data;
    },

    // Initiate chunked upload for large files
    initiateChunkedUpload: async (
        file: File,
        data: {
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
    ): Promise<ChunkedUploadConfig> => {
        const response = await api.post('/upload/document/initiate', {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            clientId: data.clientId,
            businessId: data.businessId,
            documentType: data.documentType,
            folderId: data.folderId,
        });

        return response.data.data;
    },

    // Upload chunk for large files
    uploadChunk: async (
        chunk: Blob,
        uploadId: string,
        partNumber: number,
        totalParts: number,
        fileName: string,
        data: {
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
        onProgress?: (progress: number) => void,
    ): Promise<
        | UploadResult
        | {
              uploadId: string;
              partNumber: number;
              totalParts: number;
              uploadStatus: string;
          }
    > => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('partNumber', partNumber.toString());
        formData.append('totalParts', totalParts.toString());
        formData.append('fileName', fileName);
        formData.append('clientId', data.clientId);
        if (data.businessId) formData.append('businessId', data.businessId);
        formData.append('documentType', data.documentType);
        if (data.folderId) formData.append('folderId', data.folderId);

        const response = await api.post('/upload/document/chunk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    onProgress(progress);
                }
            },
        });

        return response.data.data;
    },

    // Abort chunked upload
    abortUpload: async (uploadId: string): Promise<void> => {
        await api.post('/upload/document/abort', { uploadId });
    },

    // Get upload progress
    getUploadProgress: async (
        uploadId: string,
    ): Promise<UploadProgress | null> => {
        try {
            const response = await api.get(`/upload/progress/${uploadId}`);
            return response.data.data;
        } catch {
            return null;
        }
    },

    // Upload file with automatic chunking for large files
    uploadFileWithChunking: async (
        file: File,
        data: {
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
        onProgress?: (progress: number) => void,
        onChunkProgress?: (chunkProgress: number) => void,
    ): Promise<UploadResult> => {
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
        const MAX_SINGLE_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

        // For small files, use single upload
        if (file.size <= MAX_SINGLE_UPLOAD_SIZE) {
            return uploadService.uploadDocument(file, data, onProgress);
        }
        // Initiate chunked upload
        const config = await uploadService.initiateChunkedUpload(file, data);
        // For large files, use chunked upload
        try {
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            let uploadedChunks = 0;

            // Upload chunks
            for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
                const start = (partNumber - 1) * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                await uploadService.uploadChunk(
                    chunk,
                    config.uploadId,
                    partNumber,
                    totalChunks,
                    file.name,
                    data,
                    onChunkProgress,
                );

                uploadedChunks++;
                if (onProgress) {
                    const overallProgress = Math.round(
                        (uploadedChunks / totalChunks) * 100,
                    );
                    onProgress(overallProgress);
                }
            }

            // The last chunk upload should return the final result
            const finalChunk = file.slice((totalChunks - 1) * CHUNK_SIZE);
            const result = await uploadService.uploadChunk(
                finalChunk,
                config.uploadId,
                totalChunks,
                totalChunks,
                file.name,
                data,
                onChunkProgress,
            );

            return result as UploadResult;
        } catch (error) {
            // Abort upload on error
            try {
                await uploadService.abortUpload(config.uploadId);
            } catch (abortError) {
                console.error('Failed to abort upload:', abortError);
            }
            throw error;
        }
    },

    // Upload multiple files
    uploadMultipleFiles: async (
        files: File[],
        data: {
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
        onFileProgress?: (fileIndex: number, progress: number) => void,
        onOverallProgress?: (progress: number) => void,
    ): Promise<UploadResult[]> => {
        const results: UploadResult[] = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
            try {
                const result = await uploadService.uploadFileWithChunking(
                    files[i]!,
                    data,
                    (progress) => {
                        if (onFileProgress) {
                            onFileProgress(i, progress);
                        }
                    },
                );

                results.push(result);

                if (onOverallProgress) {
                    const overallProgress = Math.round(
                        ((i + 1) / totalFiles) * 100,
                    );
                    onOverallProgress(overallProgress);
                }
            } catch (error) {
                console.error(
                    `Failed to upload file ${files[i]?.name}:`,
                    error,
                );
                // Continue with other files
            }
        }

        return results;
    },

    // Validate and upload with retry logic
    validateAndUpload: async (
        file: File,
        data: {
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
        onProgress?: (progress: number) => void,
        maxRetries: number = 3,
    ): Promise<UploadResult> => {
        // Validate file first
        const validation = await uploadService.validateFile(
            file,
            data.documentType,
        );
        if (!validation.isValid) {
            throw new Error(
                `File validation failed: ${validation.errors.join(', ')}`,
            );
        }

        // Upload with retry logic
        let lastError: Error;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await uploadService.uploadFileWithChunking(
                    file,
                    data,
                    onProgress,
                );
            } catch (error) {
                lastError = error as Error;
                console.warn(`Upload attempt ${attempt} failed:`, error);

                if (attempt < maxRetries) {
                    // Wait before retry (exponential backoff)
                    await new Promise((resolve) =>
                        setTimeout(resolve, Math.pow(2, attempt) * 1000),
                    );
                }
            }
        }

        throw lastError!;
    },

    // Get upload statistics
    getUploadStatistics: async (): Promise<{
        totalUploads: number;
        successfulUploads: number;
        failedUploads: number;
        averageProcessingTime: number;
        totalFileSize: number;
    }> => {
        const response = await api.get('/upload/statistics');
        return response.data.data;
    },

    // Format file size for display
    formatFileSize: (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Get supported file types
    getSupportedFileTypes: (): string[] => {
        return [
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
    },

    // Get supported file extensions
    getSupportedFileExtensions: (): string[] => {
        return [
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
    },

    // Check if file type is supported
    isFileTypeSupported: (file: File): boolean => {
        const supportedTypes = uploadService.getSupportedFileTypes();
        const supportedExtensions = uploadService.getSupportedFileExtensions();

        // Check MIME type
        if (supportedTypes.includes(file.type)) {
            return true;
        }

        // Check file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension ? supportedExtensions.includes(extension) : false;
    },

    // Get maximum file size
    getMaxFileSize: (): number => {
        return 100 * 1024 * 1024; // 100MB
    },

    // Check if file size is within limits
    isFileSizeValid: (file: File): boolean => {
        return file.size <= uploadService.getMaxFileSize();
    },
};
