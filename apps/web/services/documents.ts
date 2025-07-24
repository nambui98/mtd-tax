import { api } from './api';

export interface Document {
    id: string;
    userId: string;
    clientId: string;
    businessId?: string;
    fileName: string;
    originalFileName: string;
    fileSize: number;
    fileType: string;
    mimeType: string;
    filePath: string;
    documentType: string;
    status: string;
    processingStatus: string;
    aiExtractedTransactions: number;
    aiAccuracy: number;
    hmrcSubmissionId?: string;
    hmrcBusinessId?: string;
    hmrcClientId?: string;
    metadata?: any;
    uploadedAt: string;
    processedAt?: string;
    submittedToHmrcAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentTransaction {
    id: string;
    documentId: string;
    userId: string;
    clientId: string;
    businessId?: string;
    transactionDate: string;
    description: string;
    category: string;
    amount: number;
    currency: string;
    status: string;
    isAIGenerated: boolean;
    aiConfidence: number;
    hmrcTransactionId?: string;
    hmrcCategory?: string;
    hmrcBusinessId?: string;
    hmrcClientId?: string;
    notes?: string;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentFolder {
    id: string;
    userId: string;
    clientId: string;
    name: string;
    description?: string;
    color: string;
    icon: string;
    parentFolderId?: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface HmrcSubmission {
    id: string;
    userId: string;
    clientId: string;
    businessId: string;
    documentId?: string;
    submissionType: string;
    taxYear: string;
    periodKey?: string;
    status: string;
    hmrcSubmissionId?: string;
    hmrcResponse?: any;
    submittedAt?: string;
    processedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentStats {
    total: number;
    byStatus: Record<string, number>;
    byProcessingStatus: Record<string, number>;
    byDocumentType: Record<string, number>;
    totalTransactions: number;
    totalAmount: number;
    aiAccuracy?: number;
}

export interface DocumentFilters {
    clientId?: string;
    businessId?: string;
    documentType?: string;
    status?: string;
    processingStatus?: string;
    folderId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}

export const documentsService = {
    // Upload document
    uploadDocument: async (
        file: File,
        data: {
            clientId: string;
            businessId?: string;
            documentType: string;
            folderId?: string;
        },
    ): Promise<Document> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('clientId', data.clientId);
        if (data.businessId) formData.append('businessId', data.businessId);
        formData.append('documentType', data.documentType);
        if (data.folderId) formData.append('folderId', data.folderId);

        const response = await api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    // Get documents with filters
    getDocuments: async (filters: DocumentFilters): Promise<Document[]> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });

        const response = await api.get(`/documents?${params.toString()}`);
        return response.data.data;
    },

    // Get document by ID
    getDocumentById: async (id: string): Promise<Document> => {
        const response = await api.get(`/documents/${id}`);
        return response.data.data;
    },

    // Get document transactions
    getDocumentTransactions: async (
        documentId: string,
    ): Promise<DocumentTransaction[]> => {
        const response = await api.get(`/documents/${documentId}/transactions`);
        return response.data.data;
    },

    // Create transaction
    createTransaction: async (data: {
        documentId: string;
        clientId: string;
        businessId?: string;
        transactionDate: string;
        description: string;
        category: string;
        amount: number;
        currency?: string;
        isAIGenerated?: boolean;
        aiConfidence?: number;
        notes?: string;
    }): Promise<DocumentTransaction> => {
        const response = await api.post('/documents/transactions', data);
        return response.data.data;
    },

    // Update transaction
    updateTransaction: async (
        id: string,
        data: {
            transactionDate?: string;
            description?: string;
            category?: string;
            amount?: number;
            currency?: string;
            status?: string;
            notes?: string;
        },
    ): Promise<DocumentTransaction> => {
        const response = await api.put(`/documents/transactions/${id}`, data);
        return response.data.data;
    },

    // Delete transaction
    deleteTransaction: async (id: string): Promise<void> => {
        await api.delete(`/documents/transactions/${id}`);
    },

    // Get folders
    getFolders: async (clientId?: string): Promise<DocumentFolder[]> => {
        const params = new URLSearchParams();
        if (clientId) params.append('clientId', clientId);

        const response = await api.get(
            `/documents/folders?${params.toString()}`,
        );
        return response.data.data;
    },

    // Create folder
    createFolder: async (
        clientId: string,
        data: {
            name: string;
            description?: string;
            color?: string;
            icon?: string;
            parentFolderId?: string;
        },
    ): Promise<DocumentFolder> => {
        const response = await api.post(
            `/documents/folders?clientId=${clientId}`,
            data,
        );
        return response.data.data;
    },

    // Assign document to folder
    assignDocumentToFolder: async (
        documentId: string,
        folderId: string,
    ): Promise<void> => {
        await api.post(`/documents/folders/${folderId}/assign/${documentId}`);
    },

    // Remove document from folder
    removeDocumentFromFolder: async (
        documentId: string,
        folderId: string,
    ): Promise<void> => {
        await api.delete(`/documents/folders/${folderId}/assign/${documentId}`);
    },

    // Submit to HMRC
    submitToHmrc: async (
        documentId: string,
        data: {
            businessId: string;
            taxYear: string;
            periodKey?: string;
        },
    ): Promise<HmrcSubmission> => {
        const response = await api.post(
            `/documents/${documentId}/submit-to-hmrc`,
            data,
        );
        return response.data.data;
    },

    // Get HMRC submissions
    getHmrcSubmissions: async (
        clientId?: string,
    ): Promise<HmrcSubmission[]> => {
        const params = new URLSearchParams();
        if (clientId) params.append('clientId', clientId);

        const response = await api.get(
            `/documents/hmrc/submissions?${params.toString()}`,
        );
        return response.data.data;
    },

    // Get document statistics
    getDocumentStats: async (clientId?: string): Promise<DocumentStats> => {
        const params = new URLSearchParams();
        if (clientId) params.append('clientId', clientId);

        const response = await api.get(`/documents/stats?${params.toString()}`);
        return response.data.data;
    },

    // Bulk transaction operations
    createBulkTransactions: async (
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
    ): Promise<DocumentTransaction[]> => {
        const response = await api.post('/documents/transactions/bulk', {
            documentId,
            transactions,
        });
        return response.data.data;
    },

    updateBulkTransactions: async (
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
    ): Promise<DocumentTransaction[]> => {
        const response = await api.put('/documents/transactions/bulk', {
            transactions,
        });
        return response.data.data;
    },

    deleteBulkTransactions: async (transactionIds: string[]): Promise<void> => {
        await api.delete('/documents/transactions/bulk', {
            data: { transactionIds },
        });
    },

    // Document processing
    processDocument: async (documentId: string): Promise<any> => {
        const response = await api.post(`/documents/${documentId}/process`);
        return response.data.data;
    },

    getDocumentProcessingStatus: async (documentId: string): Promise<any> => {
        const response = await api.get(
            `/documents/${documentId}/processing-status`,
        );
        return response.data.data;
    },

    // Transaction approval
    approveAllTransactions: async (documentId: string): Promise<any> => {
        const response = await api.post(`/documents/${documentId}/approve-all`);
        return response.data.data;
    },

    approveTransaction: async (
        transactionId: string,
    ): Promise<DocumentTransaction> => {
        const response = await api.post(
            `/documents/transactions/${transactionId}/approve`,
        );
        return response.data.data;
    },

    rejectTransaction: async (
        transactionId: string,
        reason?: string,
    ): Promise<DocumentTransaction> => {
        const response = await api.post(
            `/documents/transactions/${transactionId}/reject`,
            {
                reason,
            },
        );
        return response.data.data;
    },

    // Export functionality
    exportDocumentTransactions: async (
        documentId: string,
        format: 'csv' | 'excel' | 'pdf' = 'csv',
        includeMetadata?: boolean,
    ): Promise<any> => {
        const response = await api.post(`/documents/${documentId}/export`, {
            format,
            includeMetadata,
        });
        return response.data.data;
    },

    // Get transaction categories
    getTransactionCategories: async (): Promise<any> => {
        const response = await api.get('/documents/categories');
        return response.data.data;
    },

    // Delete document
    deleteDocument: async (documentId: string): Promise<void> => {
        await api.delete(`/documents/${documentId}`);
    },

    // Get document download URL
    getDocumentDownloadUrl: async (
        documentId: string,
    ): Promise<{ downloadUrl: string }> => {
        const response = await api.get(`/documents/${documentId}/download-url`);
        return response.data.data;
    },
};
