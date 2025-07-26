/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiConsumes,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { z } from 'zod';
import {
    InsertDocumentTransaction,
    insertDocumentTransactionSchema,
} from '@workspace/database/dist/schema';

// Type for uploaded file
type UploadedFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
};

// Validation schemas
const uploadDocumentSchema = z.object({
    clientId: z.string().min(1),
    businessId: z.string().optional(),
});

const updateTransactionSchema = z.object({
    transactionDate: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
});

const createFolderSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    parentFolderId: z.string().optional(),
});

const submitToHmrcSchema = z.object({
    businessId: z.string().min(1),
    taxYear: z.string().min(1),
    periodKey: z.string().optional(),
});

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload a document' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                clientId: { type: 'string' },
                businessId: { type: 'string' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadDocument(
        @Request() req: { user: { userId: string } },
        @UploadedFile() file: UploadedFile,
        @Body(new ZodValidationPipe(uploadDocumentSchema))
        body: {
            clientId: string;
            businessId: string;
            folderId?: string;
        },
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        return this.documentsService.uploadDocument({
            userId: req.user.userId,
            clientId: body.clientId,
            businessId: body.businessId,
            file: file.buffer.toString('base64'),
            folderId: body.folderId,
        });
    }

    @Get()
    @ApiOperation({ summary: 'Get documents with filters' })
    @ApiQuery({ name: 'clientId', required: false })
    @ApiQuery({ name: 'businessId', required: false })
    @ApiQuery({ name: 'documentType', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'processingStatus', required: false })
    @ApiQuery({ name: 'folderId', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    async getDocuments(
        @Request() req: { user: { userId: string } },
        @Query('clientId') clientId?: string,
        @Query('businessId') businessId?: string,
        @Query('documentType') documentType?: string,
        @Query('status') status?: string,
        @Query('processingStatus') processingStatus?: string,
        @Query('folderId') folderId?: string,
        @Query('search') search?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
    ) {
        return this.documentsService.getDocuments({
            userId: req.user.userId,
            clientId,
            businessId,
            documentType,
            status,
            processingStatus,
            folderId,
            search,
            dateFrom,
            dateTo,
        });
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get document statistics' })
    @ApiQuery({ name: 'clientId', required: false })
    async getDocumentStats(
        @Request() req: { user: { userId: string } },
        @Query('clientId') clientId?: string,
    ) {
        return this.documentsService.getDocumentStats(
            req.user.userId,
            clientId,
        );
    }

    @Get('filtered')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get filtered documents with advanced filtering' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search in filename and description',
    })
    @ApiQuery({
        name: 'clientId',
        required: false,
        description: 'Filter by client ID',
    })
    @ApiQuery({
        name: 'businessId',
        required: false,
        description: 'Filter by business ID',
    })
    @ApiQuery({
        name: 'documentType',
        required: false,
        description: 'Filter by document type',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Filter by status',
    })
    @ApiQuery({
        name: 'processingStatus',
        required: false,
        description: 'Filter by processing status',
    })
    @ApiQuery({
        name: 'dateFrom',
        required: false,
        description: 'Filter from date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'dateTo',
        required: false,
        description: 'Filter to date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'fileSizeMin',
        required: false,
        description: 'Minimum file size in bytes',
        type: 'number',
    })
    @ApiQuery({
        name: 'fileSizeMax',
        required: false,
        description: 'Maximum file size in bytes',
        type: 'number',
    })
    @ApiQuery({
        name: 'aiExtractedTransactionsMin',
        required: false,
        description: 'Minimum AI extracted transactions',
        type: 'number',
    })
    @ApiQuery({
        name: 'aiAccuracyMin',
        required: false,
        description: 'Minimum AI accuracy (0-1)',
        type: 'number',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number',
        type: 'number',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Items per page',
        type: 'number',
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        description: 'Sort field',
    })
    @ApiQuery({
        name: 'sortOrder',
        required: false,
        description: 'Sort order (asc/desc)',
    })
    @ApiResponse({
        status: 200,
        description: 'Filtered documents retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                documents: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            originalFileName: { type: 'string' },
                            fileSize: { type: 'number' },
                            fileType: { type: 'string' },
                            documentType: {
                                type: 'array',
                                items: { type: 'string' },
                            },
                            status: { type: 'string' },
                            processingStatus: { type: 'string' },
                            aiExtractedTransactions: { type: 'number' },
                            aiAccuracy: { type: 'number' },
                            uploadedAt: { type: 'string' },
                            businessId: { type: 'string' },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
    })
    async getFilteredDocuments(
        @Request() req: { user: { userId: string } },
        @Query('search') search?: string,
        @Query('clientId') clientId?: string,
        @Query('businessId') businessId?: string,
        @Query('documentType') documentType?: string,
        @Query('status') status?: string,
        @Query('processingStatus') processingStatus?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('fileSizeMin') fileSizeMin?: string,
        @Query('fileSizeMax') fileSizeMax?: string,
        @Query('aiExtractedTransactionsMin')
        aiExtractedTransactionsMin?: string,
        @Query('aiAccuracyMin') aiAccuracyMin?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
    ) {
        const filters = {
            userId: req.user.userId,
            search,
            clientId,
            businessId,
            documentType,
            status,
            processingStatus,
            dateFrom,
            dateTo,
            fileSizeMin: fileSizeMin ? parseInt(fileSizeMin) : undefined,
            fileSizeMax: fileSizeMax ? parseInt(fileSizeMax) : undefined,
            aiExtractedTransactionsMin: aiExtractedTransactionsMin
                ? parseInt(aiExtractedTransactionsMin)
                : undefined,
            aiAccuracyMin: aiAccuracyMin
                ? parseFloat(aiAccuracyMin)
                : undefined,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            sortBy,
            sortOrder: sortOrder as 'asc' | 'desc' | undefined,
        };

        return this.documentsService.getFilteredDocuments(filters);
    }

    @Get('statistics')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get document statistics' })
    @ApiQuery({
        name: 'clientId',
        required: false,
        description: 'Filter by client ID',
    })
    @ApiQuery({
        name: 'businessId',
        required: false,
        description: 'Filter by business ID',
    })
    @ApiQuery({
        name: 'dateFrom',
        required: false,
        description: 'Filter from date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'dateTo',
        required: false,
        description: 'Filter to date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'documentType',
        required: false,
        description: 'Filter by document type',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Filter by status',
    })
    @ApiResponse({
        status: 200,
        description: 'Document statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                summary: {
                    type: 'object',
                    properties: {
                        totalDocuments: { type: 'number' },
                        totalFileSize: { type: 'number' },
                        averageFileSize: { type: 'number' },
                        totalTransactions: { type: 'number' },
                        averageAccuracy: { type: 'number' },
                    },
                },
                byStatus: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            count: { type: 'number' },
                            totalFileSize: { type: 'number' },
                        },
                    },
                },
                byDocumentType: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            documentType: { type: 'string' },
                            count: { type: 'number' },
                            totalFileSize: { type: 'number' },
                        },
                    },
                },
                byBusiness: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            businessId: { type: 'string' },
                            count: { type: 'number' },
                            totalFileSize: { type: 'number' },
                        },
                    },
                },
                monthlyTrends: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            month: { type: 'string' },
                            documentCount: { type: 'number' },
                            totalFileSize: { type: 'number' },
                            transactionCount: { type: 'number' },
                        },
                    },
                },
            },
        },
    })
    async getDocumentStatistics(
        @Request() req: { user: { userId: string } },
        @Query('clientId') clientId?: string,
        @Query('businessId') businessId?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('documentType') documentType?: string,
        @Query('status') status?: string,
    ) {
        const filters = {
            userId: req.user.userId,
            clientId,
            businessId,
            dateFrom,
            dateTo,
            documentType,
            status,
        };

        return this.documentsService.getDocumentStatistics(filters);
    }

    @Get('categories')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get available document categories' })
    @ApiQuery({
        name: 'clientId',
        required: false,
        description: 'Filter by client ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Document categories retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    category: { type: 'string' },
                    count: { type: 'number' },
                    totalFileSize: { type: 'number' },
                },
            },
        },
    })
    async getDocumentCategories(
        @Request() req: { user: { userId: string } },
        @Query('clientId') clientId?: string,
    ) {
        return this.documentsService.getDocumentCategories(
            req.user.userId,
            clientId,
        );
    }

    @Get('businesses')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get available businesses for documents' })
    @ApiQuery({
        name: 'clientId',
        required: false,
        description: 'Filter by client ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Document businesses retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    businessId: { type: 'string' },
                    businessName: { type: 'string' },
                    count: { type: 'number' },
                    totalFileSize: { type: 'number' },
                },
            },
        },
    })
    async getDocumentBusinesses(
        @Request() req: { user: { userId: string } },
        @Query('clientId') clientId?: string,
    ) {
        return this.documentsService.getDocumentBusinesses(
            req.user.userId,
            clientId,
        );
    }

    @Get('folders')
    @ApiOperation({ summary: 'Get document folders' })
    @ApiQuery({ name: 'clientId', required: false })
    async getFolders(
        @Request() req: { user: { userId: string } },
        @Query('clientId') clientId?: string,
    ) {
        return this.documentsService.getFolders(req.user.userId, clientId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get document by ID' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async getDocumentById(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.getDocumentById(id, req.user.userId);
    }

    @Get(':id/transactions')
    @ApiOperation({ summary: 'Get document transactions' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async getDocumentTransactions(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.getDocumentTransactions(
            id,
            req.user.userId,
        );
    }

    @Post('transactions')
    @ApiOperation({ summary: 'Create a transaction' })
    createTransaction(
        @Request() req: { user: { userId: string } },
        @Body(new ZodValidationPipe(insertDocumentTransactionSchema))
        body: InsertDocumentTransaction,
    ) {
        return this.documentsService.createTransaction({
            ...body,
            userId: req.user.userId,
        });
    }

    @Put('transactions/:id')
    @ApiOperation({ summary: 'Update a transaction' })
    @ApiParam({ name: 'id', description: 'Transaction ID' })
    async updateTransaction(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateTransactionSchema))
        body: {
            transactionDate?: string;
            description?: string;
            category?: string;
            amount?: number;
            currency?: string;
            status?: string;
            notes?: string;
        },
    ) {
        return this.documentsService.updateTransaction(id, body);
    }

    @Delete('transactions/:id')
    @ApiOperation({ summary: 'Delete a transaction' })
    @ApiParam({ name: 'id', description: 'Transaction ID' })
    async deleteTransaction(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.deleteTransaction(id, req.user.userId);
    }

    @Post('folders')
    @ApiOperation({ summary: 'Create a document folder' })
    async createFolder(
        @Request() req: { user: { userId: string } },
        @Body(new ZodValidationPipe(createFolderSchema))
        body: {
            name: string;
            description?: string;
            color?: string;
            icon?: string;
            parentFolderId?: string;
        },
        @Query('clientId') clientId: string,
    ) {
        return this.documentsService.createFolder(
            req.user.userId,
            clientId,
            body,
        );
    }

    @Post('folders/:folderId/assign/:documentId')
    @ApiOperation({ summary: 'Assign document to folder' })
    @ApiParam({ name: 'folderId', description: 'Folder ID' })
    @ApiParam({ name: 'documentId', description: 'Document ID' })
    async assignDocumentToFolder(
        @Request() req: { user: { userId: string } },
        @Param('folderId') folderId: string,
        @Param('documentId') documentId: string,
    ) {
        return this.documentsService.assignDocumentToFolder(
            documentId,
            folderId,
        );
    }

    @Delete('folders/:folderId/assign/:documentId')
    @ApiOperation({ summary: 'Remove document from folder' })
    @ApiParam({ name: 'folderId', description: 'Folder ID' })
    @ApiParam({ name: 'documentId', description: 'Document ID' })
    async removeDocumentFromFolder(
        @Request() req: { user: { userId: string } },
        @Param('folderId') folderId: string,
        @Param('documentId') documentId: string,
    ) {
        return this.documentsService.removeDocumentFromFolder(
            documentId,
            folderId,
        );
    }

    @Post(':id/submit-to-hmrc')
    @ApiOperation({ summary: 'Submit document transactions to HMRC' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async submitToHmrc(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Body(new ZodValidationPipe(submitToHmrcSchema))
        body: {
            businessId: string;
            taxYear: string;
            periodKey?: string;
        },
    ) {
        return this.documentsService.submitToHmrc(id, req.user.userId, body);
    }

    @Get(':id/download-url')
    @ApiOperation({ summary: 'Get presigned download URL for document' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async getDocumentDownloadUrl(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Query('expiresIn') expiresIn?: string,
    ) {
        return this.documentsService.getDocumentDownloadUrl(
            id,
            req.user.userId,
            expiresIn ? parseInt(expiresIn) : 3600,
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete document and its S3 file' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async deleteDocument(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.deleteDocument(id, req.user.userId);
    }

    @Get('hmrc/submissions')
    @ApiOperation({ summary: 'Get HMRC submissions' })
    @ApiQuery({ name: 'clientId', required: false })
    async getHmrcSubmissions(
        @Request() req: { user: { userId: string } },
        @Query('clientId') clientId?: string,
    ) {
        return this.documentsService.getHmrcSubmissions(
            req.user.userId,
            clientId,
        );
    }

    @Post('transactions/bulk')
    @ApiOperation({ summary: 'Create multiple transactions in bulk' })
    async createBulkTransactions(
        @Request() req: { user: { userId: string } },
        @Body()
        body: {
            documentId: string;
            transactions: Array<{
                transactionDate: string;
                description: string;
                category: string;
                amount: number;
                currency?: string;
                isAIGenerated?: boolean;
                aiConfidence?: number;
                notes?: string;
            }>;
        },
    ) {
        return this.documentsService.createBulkTransactions(
            req.user.userId,
            body.documentId,
            body.transactions,
        );
    }

    @Put('transactions/bulk')
    @ApiOperation({ summary: 'Update multiple transactions in bulk' })
    async updateBulkTransactions(
        @Request() req: { user: { userId: string } },
        @Body()
        body: {
            transactions: Array<{
                id: string;
                transactionDate?: string;
                description?: string;
                category?: string;
                amount?: number;
                currency?: string;
                status?: string;
                notes?: string;
            }>;
        },
    ) {
        return this.documentsService.updateBulkTransactions(
            req.user.userId,
            body.transactions,
        );
    }

    @Delete('transactions/bulk')
    @ApiOperation({ summary: 'Delete multiple transactions in bulk' })
    async deleteBulkTransactions(
        @Request() req: { user: { userId: string } },
        @Body() body: { transactionIds: string[] },
    ) {
        return this.documentsService.deleteBulkTransactions(
            req.user.userId,
            body.transactionIds,
        );
    }

    @Post(':id/process')
    @ApiOperation({ summary: 'Trigger AI processing for a document' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async processDocument(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.processDocument(id, req.user.userId);
    }

    @Get(':id/processing-status')
    @ApiOperation({ summary: 'Get document processing status' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async getDocumentProcessingStatus(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.getDocumentProcessingStatus(
            id,
            req.user.userId,
        );
    }

    @Post(':id/approve-all')
    @ApiOperation({ summary: 'Approve all transactions in a document' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async approveAllTransactions(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.approveAllTransactions(
            id,
            req.user.userId,
        );
    }

    @Post(':id/export')
    @ApiOperation({ summary: 'Export document transactions' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async exportDocumentTransactions(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Body()
        body: {
            format: 'csv' | 'excel' | 'pdf';
            includeMetadata?: boolean;
        },
    ) {
        return this.documentsService.exportDocumentTransactions(
            id,
            req.user.userId,
            body.format,
            // body.includeMetadata ?? false,
        );
    }

    @Post('transactions/:id/approve')
    @ApiOperation({ summary: 'Approve a single transaction' })
    @ApiParam({ name: 'id', description: 'Transaction ID' })
    async approveTransaction(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.approveTransaction(id, req.user.userId);
    }

    @Post('transactions/:id/reject')
    @ApiOperation({ summary: 'Reject a single transaction' })
    @ApiParam({ name: 'id', description: 'Transaction ID' })
    async rejectTransaction(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Body() body: { reason?: string },
    ) {
        return this.documentsService.rejectTransaction(
            id,
            req.user.userId,
            body.reason,
        );
    }

    @Post(':id/documents-with-transactions')
    @ApiOperation({ summary: 'Upload a document with transactions' })
    async uploadDocumentWithTransactions(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Body()
        body: {
            transactions: any[];
            clientId: string;
            businessId: string;
        },
    ) {
        return this.documentsService.uploadDocumentWithTransactions(
            req.user.userId,
            id,
            body.clientId,
            body.businessId,
            body.transactions,
        );
    }

    @Put(':id/transactions')
    @ApiOperation({ summary: 'Update transactions for a document' })
    @ApiParam({ name: 'id', description: 'Document ID' })
    async updateDocumentTransactions(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Body()
        body: {
            transactions: Array<{
                id?: string;
                transactionDate?: string;
                description?: string;
                category?: string;
                amount?: number;
                currency?: string;
                status?: string;
                notes?: string;
                type?: string;
            }>;
        },
    ) {
        return this.documentsService.updateDocumentTransactions(
            id,
            body.transactions,
            req.user.userId,
        );
    }

    // Remote document endpoints
    @Get('remote')
    @ApiOperation({ summary: 'Get remote documents for a client' })
    @ApiQuery({ name: 'clientId', required: true })
    @ApiQuery({ name: 'documentType', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'search', required: false })
    async getRemoteDocuments(
        @Request() req: { user: { userId: string } },
        @Query('clientId') clientId: string,
        @Query('documentType') documentType?: string,
        @Query('status') status?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('search') search?: string,
    ) {
        return this.documentsService.getRemoteDocuments(
            req.user.userId,
            clientId,
            {
                documentType,
                status,
                dateFrom,
                dateTo,
                search,
            },
        );
    }

    @Post('remote/:id/sync')
    @ApiOperation({ summary: 'Sync a remote document' })
    @ApiParam({ name: 'id', description: 'Remote Document ID' })
    async syncRemoteDocument(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Body()
        body: {
            clientId: string;
            businessId?: string;
        },
    ) {
        return this.documentsService.syncRemoteDocument(
            id,
            req.user.userId,
            body.clientId,
            body.businessId,
        );
    }

    @Get('remote/:id/status')
    @ApiOperation({ summary: 'Get remote document sync status' })
    @ApiParam({ name: 'id', description: 'Remote Document ID' })
    async getRemoteDocumentStatus(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
    ) {
        return this.documentsService.getRemoteDocumentStatus(
            id,
            req.user.userId,
        );
    }

    @Post('remote/refresh')
    @ApiOperation({ summary: 'Refresh all remote documents for a client' })
    async refreshRemoteDocuments(
        @Request() req: { user: { userId: string } },
        @Body() body: { clientId: string },
    ) {
        return this.documentsService.refreshRemoteDocuments(
            req.user.userId,
            body.clientId,
        );
    }
}
