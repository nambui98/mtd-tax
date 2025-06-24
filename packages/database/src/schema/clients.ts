import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    pgEnum,
    text,
    date,
    integer,
} from 'drizzle-orm/pg-core';
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from 'drizzle-zod';
import z from 'zod/v3';
import { usersTable } from './users';

export const clientTypeEnum = pgEnum('client_type', [
    'individual',
    'landlord',
    'both',
]);
export const clientCategoryEnum = pgEnum('client_category', [
    'standard',
    'premium',
    'vip',
]);
export const businessTypeEnum = pgEnum('business_type', [
    'sole_trader',
    'landlord',
    'partnership',
]);
export const clientStatusEnum = pgEnum('client_status', [
    'mtd_ready',
    'mtd_not_ready',
    'action_needed',
    'critical_issues',
]);

export type ClientType = (typeof clientTypeEnum.enumValues)[number];
export type ClientCategory = (typeof clientCategoryEnum.enumValues)[number];

export const clientsTable = pgTable('clients', {
    id: uuid('id').primaryKey().defaultRandom(),
    clientType: clientTypeEnum('client_type').notNull(),
    mtdStatus: boolean('mtd_status').notNull().default(false),
    title: varchar('title', { length: 100 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    nationalInsuranceNumber: varchar('national_insurance_number', {
        length: 10,
    }).notNull(),
    uniqueTaxpayerReference: varchar('unique_taxpayer_reference', {
        length: 10,
    }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number', { length: 20 }),
    addressLine1: varchar('address_line_1', { length: 100 }).notNull(),
    addressLine2: varchar('address_line_2', { length: 100 }),
    city: varchar('city', { length: 100 }).notNull(),
    county: varchar('county', { length: 100 }),
    postcode: varchar('postcode', { length: 100 }).notNull(),
    assignedTo: uuid('assigned_to').references(() => usersTable.id),
    clientCategory: clientCategoryEnum('client_category'),
    notes: text('notes'),
    sendWelcomeEmail: boolean('send_welcome_email').default(false),
    hmrcAuthorization: boolean('hmrc_authorization').default(false),
    hmrcConnected: boolean('hmrc_connected').default(false),
    status: clientStatusEnum('status').notNull().default('mtd_ready'),
    deadline: date('deadline').notNull(),
    totalRevenue: integer('total_revenue').notNull(),
    createdBy: uuid('created_by')
        .references(() => usersTable.id)
        .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Zod schemas for validation
export const insertClientSchema = createInsertSchema(clientsTable).omit({
    createdAt: true,
    updatedAt: true,
});
export const selectClientSchema = createSelectSchema(clientsTable);

export const updateClientSchema = createUpdateSchema(clientsTable);

export type Client = typeof clientsTable.$inferSelect;
export type NewClient = typeof clientsTable.$inferInsert;

// export type CreateClientDto = typeof clientsTable.$inferInsert;
// export type UpdateClientDto = z.infer<typeof updateClientSchema>;
// export type InsertClientDto = z.infer<typeof insertClientSchema>;
export type ClientResponse = typeof clientsTable.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
