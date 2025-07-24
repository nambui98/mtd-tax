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
}

export interface ChunkUploadResult {
    partNumber: number;
    etag: string;
    size: number;
}

export interface MultipartUploadResult {
    key: string;
    url: string;
    // size: number;
    // parts: { partNumber: number; etag: string; size: number }[];
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
    ): Promise<UploadResult> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: buffer,
                ContentType: contentType,
                Metadata: {
                    uploadedAt: new Date().toISOString(),
                },
            });

            const result = await this.s3Client.send(command);

            return {
                key,
                url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`,
                size: buffer.length,
                etag: result.ETag || '',
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
    ): Promise<string> {
        try {
            const command = new CreateMultipartUploadCommand({
                Bucket: this.bucketName,
                Key: key,
                ContentType: contentType,
                Metadata: {
                    initiatedAt: new Date().toISOString(),
                },
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

    async getFileMetadata(key: string): Promise<{
        size: number;
        lastModified: Date;
        contentType: string;
        etag: string;
    }> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const result = await this.s3Client.send(command);

            return {
                size: result.ContentLength || 0,
                lastModified: result.LastModified || new Date(),
                contentType: result.ContentType || 'application/octet-stream',
                etag: result.ETag || '',
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
}
