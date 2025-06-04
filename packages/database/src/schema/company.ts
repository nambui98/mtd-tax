import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    pgEnum,
    text,
} from 'drizzle-orm/pg-core';
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import z from 'zod';
import { usersTable } from './users';

export const companiesTable = pgTable('companies', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    companyNumber: varchar('company_number', { length: 50 }),
    vatNumber: varchar('vat_number', { length: 50 }),
    addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
    addressLine2: varchar('address_line_2', { length: 255 }),
    city: varchar('city', { length: 100 }).notNull(),
    postcode: varchar('postcode', { length: 20 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 50 }),
    ownerId: uuid('owner_id').references(() => usersTable.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Define relations
export const usersRelations = relations(usersTable, ({ many }) => ({
    companies: many(companiesTable),
}));

export const companiesRelations = relations(companiesTable, ({ one }) => ({
    owner: one(usersTable, {
        fields: [companiesTable.ownerId],
        references: [usersTable.id],
    }),
}));

export const selectCompanySchema = createSelectSchema(companiesTable, {
    ownerId: z.string().optional().nullable(),
});
export const updateCompanySchema = createUpdateSchema(companiesTable);
export const insertCompanySchema = createInsertSchema(companiesTable, {
    ownerId: z.string().optional().nullable(),
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
