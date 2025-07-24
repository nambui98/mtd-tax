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
    documentType: z.string().min(1),
    folderId: z.string().optional(),
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
                documentType: { type: 'string' },
                folderId: { type: 'string' },
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
            businessId?: string;
            documentType: string;
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
            documentType: body.documentType,
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
        return this.documentsService.deleteTransaction(id);
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
}
