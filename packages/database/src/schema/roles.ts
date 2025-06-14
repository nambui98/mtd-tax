import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './users';

// Define roles enum
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

// Define roles table
export const rolesTable = pgTable('roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: userRoleEnum('name').notNull(),
    description: varchar('description', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Define permissions table
export const permissionsTable = pgTable('permissions', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    description: varchar('description', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Define role-permissions mapping table
export const rolePermissionsTable = pgTable('role_permissions', {
    id: uuid('id').primaryKey().defaultRandom(),
    roleId: uuid('role_id')
        .references(() => rolesTable.id)
        .notNull(),
    permissionId: uuid('permission_id')
        .references(() => permissionsTable.id)
        .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Define user-roles mapping table
export const userRolesTable = pgTable('user_roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .references(() => usersTable.id)
        .notNull(),
    roleId: uuid('role_id')
        .references(() => rolesTable.id)
        .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Define relations
export const rolesRelations = relations(rolesTable, ({ many }) => ({
    permissions: many(rolePermissionsTable),
    users: many(userRolesTable),
}));

export const permissionsRelations = relations(permissionsTable, ({ many }) => ({
    roles: many(rolePermissionsTable),
}));

export const userRolesRelations = relations(userRolesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userRolesTable.userId],
        references: [usersTable.id],
    }),
    role: one(rolesTable, {
        fields: [userRolesTable.roleId],
        references: [rolesTable.id],
    }),
}));
