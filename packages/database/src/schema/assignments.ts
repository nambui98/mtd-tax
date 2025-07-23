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
import { relations } from 'drizzle-orm';
import { usersTable } from './users';
import { clientsTable } from './clients';

export const assignmentsTable = pgTable('assignments', {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id')
        .references(() => clientsTable.id)
        .notNull(),
    staffUserId: uuid('staff_user_id')
        .references(() => usersTable.id)
        .notNull(),
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
export const insertAssignmentSchema = createInsertSchema(assignmentsTable).omit(
    {
        createdAt: true,
        updatedAt: true,
    },
);
export const selectAssignmentSchema = createSelectSchema(assignmentsTable);

export const updateAssignmentSchema = createUpdateSchema(assignmentsTable);

export type Assignment = typeof assignmentsTable.$inferSelect;
export type NewAssignment = typeof assignmentsTable.$inferInsert;

export type AssignmentResponse = typeof assignmentsTable.$inferSelect;

export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

// Relations
export const assignmentsRelations = relations(assignmentsTable, ({ one }) => ({
    client: one(clientsTable, {
        fields: [assignmentsTable.clientId],
        references: [clientsTable.id],
    }),
    staffUser: one(usersTable, {
        fields: [assignmentsTable.staffUserId],
        references: [usersTable.id],
    }),
    createdBy: one(usersTable, {
        fields: [assignmentsTable.createdBy],
        references: [usersTable.id],
    }),
}));
