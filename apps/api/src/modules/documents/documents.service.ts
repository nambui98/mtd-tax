/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { Database } from '@workspace/database';
import { eq, and, desc, asc, like, sql, inArray } from 'drizzle-orm';
import {
    documentsTable,
    documentTransactionsTable,
    documentFoldersTable,
    documentFolderAssignmentsTable,
    hmrcSubmissionsTable,
    hmrcTransactionsTable,
    InsertDocumentTransaction,
} from '@workspace/database/dist/schema';
import { HmrcService } from '../hmrc/hmrc.service';
import { S3Service, UploadResult } from '../upload/s3.service';
import { randomUUID } from 'crypto';

export interface UploadDocumentDto {
    userId: string; // This will be a UUID string
    clientId: string; // This will be a UUID string
    businessId?: string;
    file: string;
    folderId?: string;
}

export interface CreateTransactionDto {
    documentId: string;
    userId: string; // This will be a UUID string
    clientId: string; // This will be a UUID string
    businessId?: string;
    transactionDate: string;
    description: string;
    category: string;
    amount: number;
    currency?: string;
    isAIGenerated?: boolean;
    aiConfidence?: number;
    notes?: string;
}

export interface UpdateTransactionDto {
    transactionDate?: string;
    description?: string;
    category?: string;
    amount?: number;
    currency?: string;
    status?: string;
    notes?: string;
}

export interface DocumentFilters {
    userId: string; // This will be a UUID string
    clientId?: string; // This will be a UUID string
    businessId?: string;
    documentType?: string;
    status?: string;
    processingStatus?: string;
    folderId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}

@Injectable()
export class DocumentsService {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: Database,
        private readonly hmrcService: HmrcService,
        private readonly s3Service: S3Service,
    ) {}

    async uploadDocument(dto: UploadDocumentDto): Promise<any> {
        const { userId, clientId, businessId, file } = dto;

        try {
            // Upload file to S3
            const s3Result: UploadResult = await this.s3Service.uploadFile(
                Buffer.from(file, 'base64'),
                `${userId}/${clientId}/${Date.now()}-${Math.random().toString(36).substring(7)}`,
                'application/octet-stream',
            );

            // Create document record in database
            const [document] = await this.db
                .insert(documentsTable)
                .values({
                    userId,
                    clientId,
                    fileName: s3Result.key,
                    originalFileName: s3Result.key,
                    fileSize: s3Result.size,
                    fileType: s3Result.etag,
                    mimeType: s3Result.etag,
                    businessId: businessId || null,
                    filePath: s3Result.url,
                    status: 'uploaded',
                    processingStatus: 'pending',
                })
                .returning();

            // Start AI processing in background
            // await this.processDocumentWithAI(document.id);

            return {
                id: document.id,
                documentType: document.documentType,
                status: document.status,
                processingStatus: document.processingStatus,
                uploadedAt: document.uploadedAt,
                s3Key: s3Result.key,
                s3Url: s3Result.url,
                s3Size: s3Result.size,
            };
        } catch (error) {
            throw new BadRequestException(
                `Failed to upload document: ${error.message}`,
            );
        }
    }

    async updateDocumentStatus(
        documentId: string,
        status: 'pending' | 'processing' | 'completed' | 'error',
    ): Promise<void> {
        await this.db
            .update(documentsTable)
            .set({
                processingStatus: status,
                updatedAt: new Date(),
            })
            .where(eq(documentsTable.id, documentId));
    }

    processDocumentWithAI(documentId: string): void {
        console.log(documentId);

        // Simulate AI processing
        // setTimeout(async () => {
        //     try {
        //         // Update processing status
        //         await this.db
        //             .update(documentsTable)
        //             .set({
        //                 processingStatus: 'processing',
        //                 updatedAt: new Date(),
        //             })
        //             .where(eq(documentsTable.id, documentId));
        //         // Simulate extracted transactions
        //         const mockTransactions = [
        //             {
        //                 transactionDate: new Date().toISOString().split('T')[0],
        //                 description: 'AI Extracted Transaction 1',
        //                 category: 'SALES_INCOME',
        //                 amount: 1000.0,
        //                 isAIGenerated: true,
        //                 aiConfidence: 0.95,
        //             },
        //             {
        //                 transactionDate: new Date().toISOString().split('T')[0],
        //                 description: 'AI Extracted Transaction 2',
        //                 category: 'OFFICE_EXPENSES',
        //                 amount: -250.0,
        //                 isAIGenerated: true,
        //                 aiConfidence: 0.88,
        //             },
        //         ];
        //         // Create transactions
        //         for (const transaction of mockTransactions) {
        //             await this.createTransaction({
        //                 documentId,
        //                 userId: 'system',
        //                 clientId: 'system',
        //                 transactionDate: transaction.transactionDate,
        //                 description: transaction.description,
        //                 category: transaction.category,
        //                 amount: transaction.amount,
        //                 isAIGenerated: transaction.isAIGenerated,
        //                 aiConfidence: transaction.aiConfidence,
        //             });
        //         }
        //         // Update document status
        //         await this.db
        //             .update(documentsTable)
        //             .set({
        //                 processingStatus: 'completed',
        //                 aiExtractedTransactions: mockTransactions.length,
        //                 aiAccuracy: 0.92,
        //                 processedAt: new Date(),
        //                 updatedAt: new Date(),
        //             })
        //             .where(eq(documentsTable.id, documentId));
        //     } catch (error) {
        //         console.error('AI processing error:', error);
        //         await this.db
        //             .update(documentsTable)
        //             .set({
        //                 processingStatus: 'error',
        //                 updatedAt: new Date(),
        //             })
        //             .where(eq(documentsTable.id, documentId));
        //     }
        // }, 3000); // Simulate 3-second processing
    }

    createTransaction(dto: InsertDocumentTransaction): any {
        console.log(dto);

        // const [transaction] = await this.db
        //     .insert(documentTransactionsTable)
        //     .values({
        //         documentId: dto.documentId as any as string,
        //         userId: dto.userId as string,
        //         clientId: dto.clientId as string,
        //         businessId: dto.businessId as string,
        //         transactionDate: new Date(dto.transactionDate),
        //         description: dto.description,
        //         category: dto.category,
        //         amount: dto.amount,
        //         currency: dto.currency || 'GBP',
        //         status: 'pending',
        //         isAIGenerated: dto.isAIGenerated || false,
        //         aiConfidence: dto.aiConfidence || 0.0,
        //         notes: dto.notes,
        //     })
        //     .returning();
        // return transaction;
        return null;
    }

    async updateTransaction(
        transactionId: string,
        dto: UpdateTransactionDto,
    ): Promise<any> {
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (dto.transactionDate)
            updateData.transactionDate = new Date(dto.transactionDate);
        if (dto.description) updateData.description = dto.description;
        if (dto.category) updateData.category = dto.category;
        if (dto.amount !== undefined) updateData.amount = dto.amount;
        if (dto.currency) updateData.currency = dto.currency;
        if (dto.status) updateData.status = dto.status;
        if (dto.notes) updateData.notes = dto.notes;

        const [transaction] = await this.db
            .update(documentTransactionsTable)
            .set(updateData)
            .where(eq(documentTransactionsTable.id, transactionId))
            .returning();

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    async deleteTransaction(transactionId: string): Promise<void> {
        const result = await this.db
            .delete(documentTransactionsTable)
            .where(eq(documentTransactionsTable.id, transactionId));

        if (!result) {
            throw new NotFoundException('Transaction not found');
        }
    }

    async getDocuments(filters: DocumentFilters): Promise<any[]> {
        const conditions = [eq(documentsTable.userId, filters.userId)];

        if (filters.clientId) {
            conditions.push(eq(documentsTable.clientId, filters.clientId));
        }
        if (filters.businessId) {
            conditions.push(eq(documentsTable.businessId, filters.businessId));
        }
        if (filters.documentType) {
            conditions.push(
                inArray(documentsTable.documentType, [[filters.documentType]]),
            );
        }
        if (filters.status) {
            conditions.push(eq(documentsTable.status, filters.status));
        }
        if (filters.processingStatus) {
            conditions.push(
                eq(documentsTable.processingStatus, filters.processingStatus),
            );
        }
        if (filters.search) {
            conditions.push(
                like(documentsTable.filePath, `%${filters.search}%`),
            );
        }
        if (filters.dateFrom) {
            conditions.push(
                sql`${documentsTable.uploadedAt} >= ${filters.dateFrom}`,
            );
        }
        if (filters.dateTo) {
            conditions.push(
                sql`${documentsTable.uploadedAt} <= ${filters.dateTo}`,
            );
        }

        const query = this.db
            .select({
                id: documentsTable.id,
                userId: documentsTable.userId,
                clientId: documentsTable.clientId,
                businessId: documentsTable.businessId,
                filePath: documentsTable.filePath,
                originalFileName: documentsTable.originalFileName,
                fileSize: documentsTable.fileSize,
                fileType: documentsTable.fileType,
                mimeType: documentsTable.mimeType,
                documentType: documentsTable.documentType,
                status: documentsTable.status,
                processingStatus: documentsTable.processingStatus,
                aiExtractedTransactions: documentsTable.aiExtractedTransactions,
                aiAccuracy: documentsTable.aiAccuracy,
                uploadedAt: documentsTable.uploadedAt,
                processedAt: documentsTable.processedAt,
                createdAt: documentsTable.createdAt,
                updatedAt: documentsTable.updatedAt,
            })
            .from(documentsTable)
            .where(and(...conditions))
            .orderBy(desc(documentsTable.uploadedAt));

        return query;
    }

    async getDocumentById(documentId: string, userId: string): Promise<any> {
        const document = await this.db
            .select()
            .from(documentsTable)
            .where(
                and(
                    eq(documentsTable.id, documentId),
                    eq(documentsTable.userId, userId),
                ),
            )
            .limit(1);

        if (!document.length) {
            throw new NotFoundException('Document not found');
        }

        return document[0];
    }

    async getDocumentDownloadUrl(
        documentId: string,
        userId: string,
        expiresIn: number = 3600,
    ): Promise<{ downloadUrl: string }> {
        const document = await this.getDocumentById(documentId, userId);

        if (!document.fileName) {
            throw new NotFoundException('Document file not found');
        }

        // const presignedUrl = await this.s3Service.getPresignedUrl(
        //     document.fileName,
        //     expiresIn,
        // );
        console.log(expiresIn);

        const test = '1111111111111111111';

        return { downloadUrl: test };
    }

    async deleteDocument(documentId: string, userId: string): Promise<void> {
        const document = await this.getDocumentById(documentId, userId);

        if (document.fileName) {
            // Delete from S3
            await this.s3Service.deleteFile(document.fileName);
        }

        // Delete from database
        await this.db
            .delete(documentsTable)
            .where(
                and(
                    eq(documentsTable.id, documentId),
                    eq(documentsTable.userId, userId),
                ),
            );
    }

    async getDocumentTransactions(
        documentId: string,
        userId: string,
    ): Promise<any[]> {
        await this.getDocumentById(documentId, userId);

        return this.db
            .select()
            .from(documentTransactionsTable)
            .where(
                and(
                    eq(documentTransactionsTable.documentId, documentId),
                    eq(documentTransactionsTable.userId, userId),
                ),
            )
            .orderBy(asc(documentTransactionsTable.transactionDate));
    }

    async getFolders(userId: string, clientId?: string): Promise<any[]> {
        const conditions = [eq(documentFoldersTable.userId, userId)];

        if (clientId) {
            conditions.push(eq(documentFoldersTable.clientId, clientId));
        }

        return this.db
            .select()
            .from(documentFoldersTable)
            .where(and(...conditions))
            .orderBy(asc(documentFoldersTable.name));
    }

    async createFolder(
        userId: string,
        clientId: string,
        data: {
            name: string;
            description?: string;
            color?: string;
            icon?: string;
            parentFolderId?: string;
        },
    ): Promise<any> {
        const [folder] = await this.db
            .insert(documentFoldersTable)
            .values({
                id: randomUUID(),
                userId,
                clientId,
                name: data.name,
                description: data.description,
                color: data.color || '#2563eb',
                icon: data.icon || 'folder',
                parentFolderId: data.parentFolderId,
            })
            .returning();

        return folder;
    }

    async assignDocumentToFolder(
        documentId: string,
        folderId: string,
    ): Promise<void> {
        await this.db
            .insert(documentFolderAssignmentsTable)
            .values({
                id: randomUUID(),
                documentId,
                folderId,
            })
            .onConflictDoNothing();
    }

    async removeDocumentFromFolder(
        documentId: string,
        folderId: string,
    ): Promise<void> {
        await this.db
            .delete(documentFolderAssignmentsTable)
            .where(
                and(
                    eq(documentFolderAssignmentsTable.documentId, documentId),
                    eq(documentFolderAssignmentsTable.folderId, folderId),
                ),
            );
    }

    async submitToHmrc(
        documentId: string,
        userId: string,
        data: {
            businessId: string;
            taxYear: string;
            periodKey?: string;
        },
    ): Promise<any> {
        const document = await this.getDocumentById(documentId, userId);
        const transactions = await this.getDocumentTransactions(
            documentId,
            userId,
        );

        if (!transactions.length) {
            throw new BadRequestException('No transactions to submit');
        }

        // Create HMRC submission record
        const [submission] = await this.db
            .insert(hmrcSubmissionsTable)
            .values({
                id: randomUUID(),
                userId,
                clientId: document.clientId,
                businessId: data.businessId,
                documentId,
                submissionType: 'document_transactions',
                taxYear: data.taxYear,
                periodKey: data.periodKey,
                status: 'draft',
            })
            .returning();

        // Submit transactions to HMRC
        try {
            // const accessToken = await this.hmrcService.getAccessToken(userId);
            // const arn = await this.hmrcService.getArn(userId);

            // Submit each transaction to HMRC
            for (const transaction of transactions) {
                const hmrcTransactionId = await this
                    .submitTransactionToHmrc
                    // transaction,
                    // accessToken,
                    // arn,
                    // data.businessId,
                    ();

                // Create HMRC transaction record
                await this.db.insert(hmrcTransactionsTable).values({
                    id: randomUUID(),
                    userId,
                    clientId: document.clientId,
                    businessId: data.businessId,
                    documentTransactionId: transaction.id,
                    hmrcTransactionId,
                    transactionType:
                        transaction.amount > 0 ? 'income' : 'expense',
                    category: transaction.category,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    transactionDate: transaction.transactionDate,
                    description: transaction.description,
                    status: 'submitted',
                    submittedAt: new Date(),
                });
            }

            // Update submission status
            await this.db
                .update(hmrcSubmissionsTable)
                .set({
                    status: 'submitted',
                    submittedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(hmrcSubmissionsTable.id, submission.id));

            // Update document status
            await this.db
                .update(documentsTable)
                .set({
                    status: 'submitted_to_hmrc',
                    submittedToHmrcAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(documentsTable.id, documentId));

            return submission;
        } catch (error) {
            // Update submission status to failed
            await this.db
                .update(hmrcSubmissionsTable)
                .set({
                    status: 'failed',
                    hmrcResponse: { error: error.message },
                    updatedAt: new Date(),
                })
                .where(eq(hmrcSubmissionsTable.id, submission.id));

            throw new BadRequestException(
                `Failed to submit to HMRC: ${error.message}`,
            );
        }
    }

    private submitTransactionToHmrc() // transaction: any,
    // accessToken: string,
    // arn: string,
    // businessId: string,
    : any {
        // This would integrate with actual HMRC API
        // For now, return a mock transaction ID
        // return `HMRC_TXN_${randomUUID()}`;
        return null;
    }

    async getHmrcSubmissions(
        userId: string,
        clientId?: string,
    ): Promise<any[]> {
        const conditions = [eq(hmrcSubmissionsTable.userId, userId)];

        if (clientId) {
            conditions.push(eq(hmrcSubmissionsTable.clientId, clientId));
        }

        return this.db
            .select()
            .from(hmrcSubmissionsTable)
            .where(and(...conditions))
            .orderBy(desc(hmrcSubmissionsTable.createdAt));
    }

    async createBulkTransactions(
        userId: string,
        documentId: string,
        transactions: Array<{
            transactionDate: string;
            description: string;
            category: string;
            amount: number;
            currency?: string;
            isAIGenerated?: boolean;
            aiConfidence?: number;
            notes?: string;
        }>,
    ): Promise<any[]> {
        const document = await this.getDocumentById(documentId, userId);
        const createdTransactions = [];

        for (const transaction of transactions) {
            const transactionData = {
                documentId,
                userId: document.userId,
                clientId: document.clientId,
                businessId: document.businessId,
                transactionDate: transaction.transactionDate,
                description: transaction.description,
                category: transaction.category,
                amount: transaction.amount.toString(),
                currency: transaction.currency || 'GBP',
                status: 'pending',
                isAIGenerated: transaction.isAIGenerated || false,
                aiConfidence: (transaction.aiConfidence || 0.0).toString(),
                notes: transaction.notes,
            };

            const [createdTransaction] = await this.db
                .insert(documentTransactionsTable)
                .values(transactionData)
                .returning();

            createdTransactions.push(createdTransaction);
        }

        return createdTransactions;
    }

    async updateBulkTransactions(
        userId: string,
        transactions: Array<{
            id: string;
            transactionDate?: string;
            description?: string;
            category?: string;
            amount?: number;
            currency?: string;
            status?: string;
            notes?: string;
        }>,
    ): Promise<any[]> {
        const updatedTransactions = [];

        for (const transaction of transactions) {
            const updateData: any = {
                updatedAt: new Date(),
            };

            if (transaction.transactionDate)
                updateData.transactionDate = new Date(
                    transaction.transactionDate,
                );
            if (transaction.description)
                updateData.description = transaction.description;
            if (transaction.category)
                updateData.category = transaction.category;
            if (transaction.amount !== undefined)
                updateData.amount = transaction.amount;
            if (transaction.currency)
                updateData.currency = transaction.currency;
            if (transaction.status) updateData.status = transaction.status;
            if (transaction.notes) updateData.notes = transaction.notes;

            const [updatedTransaction] = await this.db
                .update(documentTransactionsTable)
                .set(updateData)
                .where(eq(documentTransactionsTable.id, transaction.id))
                .returning();

            if (updatedTransaction) {
                updatedTransactions.push(updatedTransaction);
            }
        }

        return updatedTransactions;
    }

    async deleteBulkTransactions(
        userId: string,
        transactionIds: string[],
    ): Promise<void> {
        await this.db
            .delete(documentTransactionsTable)
            .where(
                and(
                    inArray(documentTransactionsTable.id, transactionIds),
                    eq(documentTransactionsTable.userId, userId),
                ),
            );
    }

    async processDocument(documentId: string, userId: string): Promise<any> {
        await this.getDocumentById(documentId, userId);

        // Update processing status
        await this.db
            .update(documentsTable)
            .set({
                processingStatus: 'processing',
                updatedAt: new Date(),
            })
            .where(eq(documentsTable.id, documentId));

        // Start AI processing in background
        this.processDocumentWithAI(documentId);

        return {
            message: 'Document processing started',
            documentId,
            status: 'processing',
        };
    }

    async getDocumentProcessingStatus(
        documentId: string,
        userId: string,
    ): Promise<any> {
        const document = await this.getDocumentById(documentId, userId);

        return {
            documentId,
            processingStatus: document.processingStatus,
            aiExtractedTransactions: document.aiExtractedTransactions,
            aiAccuracy: document.aiAccuracy,
            processedAt: document.processedAt,
            uploadedAt: document.uploadedAt,
        };
    }

    async approveAllTransactions(
        documentId: string,
        userId: string,
    ): Promise<any> {
        await this.getDocumentById(documentId, userId);

        const result = await this.db
            .update(documentTransactionsTable)
            .set({
                status: 'approved',
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(documentTransactionsTable.documentId, documentId),
                    eq(documentTransactionsTable.userId, userId),
                ),
            )
            .returning();

        return {
            message: `${result.length} transactions approved`,
            approvedCount: result.length,
        };
    }

    async exportDocumentTransactions(
        documentId: string,
        userId: string,
        format: 'csv' | 'excel' | 'pdf' = 'csv',
    ): Promise<any> {
        const document = await this.getDocumentById(documentId, userId);
        const transactions = await this.getDocumentTransactions(
            documentId,
            userId,
        );

        // For now, return the data in the requested format
        // In a real implementation, you would generate actual files
        return {
            format,
            documentId,
            documentName: document.originalFileName,
            transactionCount: transactions.length,
            data: transactions,
            downloadUrl: `/api/documents/${documentId}/export/${format}`,
        };
    }

    async approveTransaction(
        transactionId: string,
        userId: string,
    ): Promise<any> {
        const [transaction] = await this.db
            .update(documentTransactionsTable)
            .set({
                status: 'approved',
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(documentTransactionsTable.id, transactionId),
                    eq(documentTransactionsTable.userId, userId),
                ),
            )
            .returning();

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    async rejectTransaction(
        transactionId: string,
        userId: string,
        reason?: string,
    ): Promise<any> {
        const [transaction] = await this.db
            .update(documentTransactionsTable)
            .set({
                status: 'rejected',
                notes: reason ? `Rejected: ${reason}` : 'Transaction rejected',
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(documentTransactionsTable.id, transactionId),
                    eq(documentTransactionsTable.userId, userId),
                ),
            )
            .returning();

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    async getDocumentStats(userId: string, clientId?: string): Promise<any> {
        const conditions = [eq(documentsTable.userId, userId)];

        if (clientId) {
            conditions.push(eq(documentsTable.clientId, clientId));
        }

        const documents = await this.db
            .select({
                status: documentsTable.status,
                processingStatus: documentsTable.processingStatus,
                documentType: documentsTable.documentType,
            })
            .from(documentsTable)
            .where(and(...conditions));

        const stats = {
            total: documents.length,
            byStatus: {} as Record<string, number>,
            byProcessingStatus: {} as Record<string, number>,
            byDocumentType: {} as Record<string, number>,
            totalTransactions: 0,
            totalAmount: 0,
        };

        documents.forEach((doc) => {
            stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
            // Handle possible array values for processingStatus and documentType
            const processingStatuses = Array.isArray(doc.processingStatus)
                ? doc.processingStatus
                : [doc.processingStatus];
            processingStatuses.forEach((status) => {
                stats.byProcessingStatus[status] =
                    (stats.byProcessingStatus[status] || 0) + 1;
            });

            const documentTypes = Array.isArray(doc.documentType)
                ? doc.documentType
                : [doc.documentType];
            documentTypes?.forEach((type) => {
                if (type) {
                    stats.byDocumentType[type] =
                        (stats.byDocumentType[type] || 0) + 1;
                }
            });
        });

        // Get transaction stats
        const transactionConditions = [
            eq(documentTransactionsTable.userId, userId),
        ];
        if (clientId) {
            transactionConditions.push(
                eq(documentTransactionsTable.clientId, clientId),
            );
        }

        const transactions = await this.db
            .select({
                amount: documentTransactionsTable.amount,
            })
            .from(documentTransactionsTable)
            .where(and(...transactionConditions));

        stats.totalTransactions = transactions.length;
        stats.totalAmount = transactions.reduce(
            (sum, txn) => sum + Number(txn.amount),
            0,
        );

        return stats;
    }

    async uploadDocumentWithTransactions(
        userId: string,
        documentId: string,
        clientId: string,
        businessId: string,
        transactions: Array<{
            transactionDate: string;
            description: string;
            category: string;
            amount: number;
            currency?: string;
            isAIGenerated?: boolean;
            aiConfidence?: number;
            notes?: string;
            type?: string;
        }>,
    ): Promise<any> {
        if (!transactions.length) {
            throw new BadRequestException('No transactions to approve');
        }

        const documentType = transactions.map(
            (transaction) => transaction.type || 'transaction',
        );

        // Create document and transactions in a transaction
        const result = await this.db.transaction(async (tx) => {
            // Create document
            const [document] = await tx
                .update(documentsTable)
                .set({
                    status: 'uploaded',
                    processingStatus: 'pending',
                    documentType: documentType,
                })
                .where(eq(documentsTable.id, documentId))
                .returning();

            // Convert transactions to database format
            const transactionsToInsert = transactions.map((transaction) => ({
                documentId: document.id,
                userId,
                clientId,
                businessId: businessId || null,
                transactionDate: transaction.transactionDate,
                description: transaction.description,
                category: transaction.category,
                amount: transaction.amount.toString(),
                currency: transaction.currency || 'GBP',
                status: 'approved',
                isAIGenerated: transaction.isAIGenerated || false,
                aiConfidence: (transaction.aiConfidence || 0).toString(),
                notes: transaction.notes,
            }));

            // Insert transactions
            const insertedTransactions = await tx
                .insert(documentTransactionsTable)
                .values(transactionsToInsert)
                .returning();

            // Update document status
            await tx
                .update(documentsTable)
                .set({
                    status: 'processed',
                    processingStatus: 'completed',
                    aiExtractedTransactions: insertedTransactions.length,
                })
                .where(eq(documentsTable.id, document.id));

            return {
                document,
                insertedTransactions,
            };
        });

        return {
            approvedCount: result.insertedTransactions.length,
            transactions: result.insertedTransactions,
            documentId: result.document.id,
        };
    }
}
