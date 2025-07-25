/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Request,
    HttpException,
    HttpStatus,
    BadRequestException,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { DocumentsService } from '../documents/documents.service';
import { S3Service } from './s3.service';
import { randomUUID } from 'crypto';
import { Express } from 'express';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly documentsService: DocumentsService,
        private readonly s3Service: S3Service,
    ) {}

    @Post('file')
    @ApiOperation({ summary: 'Upload a file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File to upload',
                },
            },
            required: ['file', 'clientId', 'documentType'],
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Request() req: { user: { userId: string } },
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
                    new FileTypeValidator({
                        fileType: /(pdf|doc|docx|xls|xlsx|jpg|jpeg|png|tiff)$/,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        try {
            // Validate file
            if (!file) {
                throw new BadRequestException('No file uploaded');
            }

            // Generate unique filename
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${randomUUID()}.${fileExtension}`;
            const filePath = `documents/${req.user.userId}/${fileName}`;

            // Upload to S3
            const uploadResult = await this.s3Service.uploadFile(
                file.buffer,
                filePath,
                file.mimetype,
            );

            // // Create document record
            // const document = await this.documentsService.createDocument({
            //     userId: req.user.userId,
            //     clientId: body.clientId,
            //     businessId: body.businessId,
            //     fileName,
            //     originalFileName: file.originalname,
            //     fileSize: file.size,
            //     fileType: fileExtension || 'unknown',
            //     mimeType: file.mimetype,
            //     filePath,
            //     documentType: body.documentType,
            //     s3Key: uploadResult.key,
            //     s3Url: uploadResult.url,
            // });

            // Start AI processing in background
            // this.uploadService
            //     .processDocumentWithAI(document.id)
            //     .catch((error) => {
            //         console.error('AI processing failed:', error);
            //     });

            return {
                documentId: '',
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype,
                uploadStatus: 'completed',
                processingStatus: 'pending',
                s3Url: uploadResult.url,
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw new HttpException(
                {
                    success: false,
                    message: error.message || 'Upload failed',
                    error: error.code || 'UPLOAD_ERROR',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('document')
    @ApiOperation({ summary: 'Upload a document with processing' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Document file to upload',
                },
                clientId: {
                    type: 'string',
                    description: 'Client ID',
                },
                businessId: {
                    type: 'string',
                    description: 'Business ID (optional)',
                },
                documentType: {
                    type: 'string',
                    enum: ['receipt', 'invoice', 'statement', 'tax', 'other'],
                    description: 'Type of document',
                },
                folderId: {
                    type: 'string',
                    description: 'Folder ID (optional)',
                },
            },
            required: ['file', 'clientId', 'documentType'],
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @Request() req: { user: { userId: string } },
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
                    new FileTypeValidator({
                        fileType: /(pdf|doc|docx|xls|xlsx|jpg|jpeg|png|tiff)$/,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body()
        body: {
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
    ) {
        try {
            // Validate required fields
            if (!body.clientId) {
                throw new BadRequestException('Client ID is required');
            }

            if (!body.documentType) {
                throw new BadRequestException('Document type is required');
            }

            // Validate file
            if (!file) {
                throw new BadRequestException('No file uploaded');
            }

            // Generate unique filename
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${randomUUID()}.${fileExtension}`;
            const filePath = `documents/${req.user.userId}/${body.clientId}/${fileName}`;

            // Upload to S3
            const uploadResult = await this.s3Service.uploadFile(
                file.buffer,
                filePath,
                file.mimetype,
            );

            // Create document record in database
            const document = await this.documentsService.uploadDocument({
                userId: req.user.userId,
                clientId: body.clientId,
                businessId: body.businessId,
                file: file.buffer.toString('base64'),
                folderId: body.folderId,
            });

            return {
                success: true,
                data: {
                    documentId: document.id,
                    fileName: file.originalname,
                    fileSize: file.size,
                    uploadStatus: 'completed',
                    processingStatus: document.processingStatus,
                    s3Url: document.s3Url,
                    documentType: document.documentType,
                    uploadedAt: document.uploadedAt,
                },
                message: 'Document uploaded successfully',
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw new HttpException(
                {
                    success: false,
                    message: error.message || 'Upload failed',
                    error: error.code || 'UPLOAD_ERROR',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('document/chunk')
    @ApiOperation({ summary: 'Upload document in chunks for large files' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                chunk: {
                    type: 'string',
                    format: 'binary',
                    description: 'File chunk',
                },
                uploadId: {
                    type: 'string',
                    description: 'Upload ID for chunked upload',
                },
                partNumber: {
                    type: 'number',
                    description: 'Part number of the chunk',
                },
                totalParts: {
                    type: 'number',
                    description: 'Total number of parts',
                },
                fileName: {
                    type: 'string',
                    description: 'Original file name',
                },
                clientId: {
                    type: 'string',
                    description: 'Client ID',
                },
                documentType: {
                    type: 'string',
                    description: 'Document type',
                },
            },
            required: [
                'chunk',
                'uploadId',
                'partNumber',
                'fileName',
                'clientId',
                'documentType',
            ],
        },
    })
    @UseInterceptors(FileInterceptor('chunk'))
    async uploadDocumentChunk(
        @Request() req: { user: { userId: string } },
        @UploadedFile() chunk: Express.Multer.File,
        @Body()
        body: {
            uploadId: string;
            partNumber: number;
            totalParts: number;
            fileName: string;
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
    ) {
        try {
            // Validate required fields
            if (
                !body.uploadId ||
                !body.partNumber ||
                !body.fileName ||
                !body.clientId ||
                !body.documentType
            ) {
                throw new BadRequestException('Missing required fields');
            }

            // Upload chunk to S3
            const chunkResult = await this.s3Service.uploadChunk(
                body.uploadId,
                body.partNumber,
                chunk.buffer,
            );

            // If this is the last chunk, complete the multipart upload
            if (body.partNumber === body.totalParts) {
                const uploadResult =
                    await this.s3Service.completeMultipartUpload(
                        body.uploadId,
                        [
                            {
                                partNumber: body.partNumber,
                                etag: chunkResult.etag,
                            },
                        ],
                    );

                // Create document record
                // const document = await this.documentsService.createDocument({
                //     userId: req.user.userId,
                //     clientId: body.clientId,
                //     businessId: body.businessId,
                //     fileName:
                //         uploadResult.key.split('/').pop() || body.fileName,
                //     originalFileName: body.fileName,
                //     fileSize: uploadResult.size,
                //     fileType: body.fileName.split('.').pop() || 'unknown',
                //     mimeType: chunk.mimetype,
                //     filePath: uploadResult.key,
                //     documentType: body.documentType,
                //     s3Key: uploadResult.key,
                //     s3Url: uploadResult.url,
                // });

                // Start AI processing
                // this.uploadService
                //     .processDocumentWithAI(document.id)
                //     .catch((error) => {
                //         console.error('AI processing failed:', error);
                //     });

                return {
                    success: true,
                    data: {
                        // documentId: document.id,
                        // fileName: document.originalFileName,
                        // fileSize: document.fileSize,
                        uploadStatus: 'completed',
                        processingStatus: 'pending',
                        s3Url: uploadResult.url,
                    },
                    message: 'Document upload completed successfully',
                };
            }

            return {
                success: true,
                data: {
                    uploadId: body.uploadId,
                    partNumber: body.partNumber,
                    totalParts: body.totalParts,
                    uploadStatus: 'chunk_uploaded',
                },
                message: `Chunk ${body.partNumber} uploaded successfully`,
            };
        } catch (error) {
            console.error('Chunk upload error:', error);
            throw new HttpException(
                {
                    success: false,
                    message: error.message || 'Chunk upload failed',
                    error: error.code || 'CHUNK_UPLOAD_ERROR',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('document/initiate')
    @ApiOperation({ summary: 'Initiate a multipart upload for large files' })
    async initiateUpload(
        @Request() req: { user: { userId: string } },
        @Body()
        body: {
            fileName: string;
            fileSize: number;
            mimeType: string;
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
    ) {
        try {
            // Validate required fields
            if (
                !body.fileName ||
                !body.fileSize ||
                !body.clientId ||
                !body.documentType
            ) {
                throw new BadRequestException('Missing required fields');
            }

            // Validate file size (max 100MB for chunked uploads)
            if (body.fileSize > 100 * 1024 * 1024) {
                throw new BadRequestException(
                    'File size exceeds maximum limit of 100MB',
                );
            }

            // Generate file path
            const fileExtension = body.fileName.split('.').pop();
            const fileName = `${randomUUID()}.${fileExtension}`;
            const filePath = `documents/${req.user.userId}/${body.clientId}/${fileName}`;

            // Initiate multipart upload
            const uploadId = await this.s3Service.initiateMultipartUpload(
                filePath,
                body.mimeType,
            );

            return {
                success: true,
                data: {
                    uploadId,
                    fileName: body.fileName,
                    filePath,
                    chunkSize: 5 * 1024 * 1024, // 5MB chunks
                    totalChunks: Math.ceil(body.fileSize / (5 * 1024 * 1024)),
                },
                message: 'Multipart upload initiated successfully',
            };
        } catch (error) {
            console.error('Initiate upload error:', error);
            throw new HttpException(
                {
                    success: false,
                    message: error.message || 'Failed to initiate upload',
                    error: error.code || 'INITIATE_UPLOAD_ERROR',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('document/abort')
    @ApiOperation({ summary: 'Abort a multipart upload' })
    async abortUpload(
        @Request() req: { user: { userId: string } },
        @Body() body: { uploadId: string },
    ) {
        try {
            if (!body.uploadId) {
                throw new BadRequestException('Upload ID is required');
            }

            await this.s3Service.abortMultipartUpload(body.uploadId);

            return {
                success: true,
                data: {
                    uploadId: body.uploadId,
                    status: 'aborted',
                },
                message: 'Upload aborted successfully',
            };
        } catch (error) {
            console.error('Abort upload error:', error);
            throw new HttpException(
                {
                    success: false,
                    message: error.message || 'Failed to abort upload',
                    error: error.code || 'ABORT_UPLOAD_ERROR',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('document/validate')
    @ApiOperation({ summary: 'Validate file before upload' })
    async validateFile(
        @Body()
        body: {
            fileName: string;
            fileSize: number;
            mimeType: string;
            documentType: string;
        },
    ) {
        try {
            const validation = await this.uploadService.validateFile(body);

            return {
                success: true,
                data: validation,
                message: 'File validation completed',
            };
        } catch (error) {
            console.error('File validation error:', error);
            throw new HttpException(
                {
                    success: false,
                    message: error.message || 'File validation failed',
                    error: error.code || 'VALIDATION_ERROR',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
