import {
    pgTable,
    text,
    integer,
    decimal,
    boolean,
    timestamp,
    date,
    jsonb,
    uuid,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable, clientsTable } from './index';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

export const typeOfBusinessEnum = pgEnum('type_of_business', [
    'self-employment',
    'uk-property',
    'foreign-property',
    'property-unspecified',
]);
// Documents table
export const documentsTable = pgTable('documents', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
    clientId: uuid('clientId')
        .notNull()
        .references(() => clientsTable.id),
    businessId: text('businessId'),
    fileName: text('fileName').notNull(),
    originalFileName: text('originalFileName').notNull(),
    fileSize: integer('fileSize').notNull(),
    fileType: text('fileType').notNull(),
    mimeType: text('mimeType').notNull(),
    filePath: text('filePath').notNull(),
    documentType: text('documentType').notNull(),
    status: text('status').notNull().default('uploaded'),
    processingStatus: text('processingStatus').notNull().default('pending'),
    aiExtractedTransactions: integer('aiExtractedTransactions').default(0),
    aiAccuracy: decimal('aiAccuracy', { precision: 3, scale: 2 }).default(
        '0.00',
    ),
    hmrcSubmissionId: text('hmrcSubmissionId'),
    hmrcBusinessId: text('hmrcBusinessId'),
    hmrcClientId: text('hmrcClientId'),
    metadata: jsonb('metadata'),
    uploadedAt: timestamp('uploadedAt').notNull().defaultNow(),
    processedAt: timestamp('processedAt'),
    submittedToHmrcAt: timestamp('submittedToHmrcAt'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Document transactions table
export const documentTransactionsTable = pgTable('document_transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    documentId: uuid('documentId')
        .notNull()
        .references(() => documentsTable.id, { onDelete: 'cascade' }),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),

    clientId: uuid('clientId')
        .notNull()
        .references(() => clientsTable.id),
    businessId: text('businessId'),
    transactionDate: date('transactionDate').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('GBP'),
    status: text('status').notNull().default('pending'),
    isAIGenerated: boolean('isAIGenerated').notNull().default(false),
    aiConfidence: decimal('aiConfidence', { precision: 3, scale: 2 }).default(
        '0.00',
    ),
    hmrcTransactionId: text('hmrcTransactionId'),
    hmrcCategory: text('hmrcCategory'),
    hmrcBusinessId: text('hmrcBusinessId'),
    hmrcClientId: text('hmrcClientId'),
    notes: text('notes'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Document folders table
export const documentFoldersTable = pgTable('document_folders', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
    clientId: uuid('clientId')
        .notNull()
        .references(() => clientsTable.id),
    name: text('name').notNull(),
    description: text('description'),
    color: text('color').default('#2563eb'),
    icon: text('icon').default('folder'),
    parentFolderId: uuid('parentFolderId'),
    isDefault: boolean('isDefault').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Document folder assignments table
export const documentFolderAssignmentsTable = pgTable(
    'document_folder_assignments',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        documentId: uuid('documentId')
            .notNull()
            .references(() => documentsTable.id, { onDelete: 'cascade' }),
        folderId: uuid('folderId')
            .notNull()
            .references(() => documentFoldersTable.id, { onDelete: 'cascade' }),
        assignedAt: timestamp('assignedAt').notNull().defaultNow(),
    },
);

// HMRC submissions table
export const hmrcSubmissionsTable = pgTable('hmrc_submissions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
    clientId: uuid('clientId')
        .notNull()
        .references(() => clientsTable.id),
    businessId: text('businessId').notNull(),
    documentId: uuid('documentId').references(() => documentsTable.id, {
        onDelete: 'set null',
    }),
    submissionType: text('submissionType').notNull(),
    taxYear: text('taxYear').notNull(),
    periodKey: text('periodKey'),
    status: text('status').notNull().default('draft'),
    hmrcSubmissionId: text('hmrcSubmissionId'),
    hmrcResponse: jsonb('hmrcResponse'),
    submittedAt: timestamp('submitted_at'),
    processedAt: timestamp('processed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// HMRC transactions table
export const hmrcTransactionsTable = pgTable('hmrc_transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
    clientId: uuid('clientId')
        .notNull()
        .references(() => clientsTable.id),
    businessId: text('businessId').notNull(),
    documentTransactionId: uuid('documentTransactionId').references(
        () => documentTransactionsTable.id,
        { onDelete: 'set null' },
    ),
    hmrcTransactionId: text('hmrcTransactionId').notNull(),
    transactionType: text('transactionType').notNull(),
    category: text('category').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('GBP'),
    transactionDate: date('transactionDate').notNull(),
    description: text('description').notNull(),
    status: text('status').notNull().default('pending'),
    hmrcResponse: jsonb('hmrcResponse'),
    submittedAt: timestamp('submitted_at'),
    processedAt: timestamp('processed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Relations
export const documentsRelations = relations(
    documentsTable,
    ({ many, one }) => ({
        transactions: many(documentTransactionsTable),
        folderAssignments: many(documentFolderAssignmentsTable),
        hmrcSubmissions: many(hmrcSubmissionsTable),
        user: one(usersTable, {
            fields: [documentsTable.userId],
            references: [usersTable.id],
        }),
        client: one(clientsTable, {
            fields: [documentsTable.clientId],
            references: [clientsTable.id],
        }),
    }),
);

export const documentTransactionsRelations = relations(
    documentTransactionsTable,
    ({ one, many }) => ({
        document: one(documentsTable, {
            fields: [documentTransactionsTable.documentId],
            references: [documentsTable.id],
        }),
        hmrcTransactions: many(hmrcTransactionsTable),
        user: one(usersTable, {
            fields: [documentTransactionsTable.userId],
            references: [usersTable.id],
        }),
        client: one(clientsTable, {
            fields: [documentTransactionsTable.clientId],
            references: [clientsTable.id],
        }),
    }),
);

export const documentFoldersRelations = relations(
    documentFoldersTable,
    ({ many, one }) => ({
        folderAssignments: many(documentFolderAssignmentsTable),
        parentFolder: one(documentFoldersTable, {
            fields: [documentFoldersTable.parentFolderId],
            references: [documentFoldersTable.id],
            relationName: 'parent_child_folders',
        }),
        childFolders: many(documentFoldersTable, {
            relationName: 'parent_child_folders',
        }),
        user: one(usersTable, {
            fields: [documentFoldersTable.userId],
            references: [usersTable.id],
        }),
        client: one(clientsTable, {
            fields: [documentFoldersTable.clientId],
            references: [clientsTable.id],
        }),
    }),
);

export const documentFolderAssignmentsRelations = relations(
    documentFolderAssignmentsTable,
    ({ one }) => ({
        document: one(documentsTable, {
            fields: [documentFolderAssignmentsTable.documentId],
            references: [documentsTable.id],
        }),
        folder: one(documentFoldersTable, {
            fields: [documentFolderAssignmentsTable.folderId],
            references: [documentFoldersTable.id],
        }),
    }),
);

export const hmrcSubmissionsRelations = relations(
    hmrcSubmissionsTable,
    ({ one }) => ({
        document: one(documentsTable, {
            fields: [hmrcSubmissionsTable.documentId],
            references: [documentsTable.id],
        }),
        user: one(usersTable, {
            fields: [hmrcSubmissionsTable.userId],
            references: [usersTable.id],
        }),
        client: one(clientsTable, {
            fields: [hmrcSubmissionsTable.clientId],
            references: [clientsTable.id],
        }),
    }),
);

export const hmrcTransactionsRelations = relations(
    hmrcTransactionsTable,
    ({ one }) => ({
        documentTransaction: one(documentTransactionsTable, {
            fields: [hmrcTransactionsTable.documentTransactionId],
            references: [documentTransactionsTable.id],
        }),
        user: one(usersTable, {
            fields: [hmrcTransactionsTable.userId],
            references: [usersTable.id],
        }),
        client: one(clientsTable, {
            fields: [hmrcTransactionsTable.clientId],
            references: [clientsTable.id],
        }),
    }),
);

export const insertDocumentSchema = createInsertSchema(documentsTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export const insertDocumentTransactionSchema = createInsertSchema(
    documentTransactionsTable,
).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertDocumentTransaction = z.infer<
    typeof insertDocumentTransactionSchema
>;
