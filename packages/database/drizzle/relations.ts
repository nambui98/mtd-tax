import { relations } from "drizzle-orm/relations";
import { roles, rolePermissions, permissions, users, userRoles, companies, hmrcTokens, clients, assignments, documents, documentFolderAssignments, documentFolders, documentTransactions, hmrcSubmissions, hmrcTransactions } from "./schema";

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id]
	}),
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	rolePermissions: many(rolePermissions),
	userRoles: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({one}) => ({
	user: one(users, {
		fields: [userRoles.userId],
		references: [users.id]
	}),
	role: one(roles, {
		fields: [userRoles.roleId],
		references: [roles.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userRoles: many(userRoles),
	companies: many(companies),
	hmrcTokens: many(hmrcTokens),
	clients_assignedTo: many(clients, {
		relationName: "clients_assignedTo_users_id"
	}),
	clients_createdBy: many(clients, {
		relationName: "clients_createdBy_users_id"
	}),
	assignments_staffUserId: many(assignments, {
		relationName: "assignments_staffUserId_users_id"
	}),
	assignments_createdBy: many(assignments, {
		relationName: "assignments_createdBy_users_id"
	}),
	documentFolders: many(documentFolders),
	documentTransactions: many(documentTransactions),
	hmrcSubmissions: many(hmrcSubmissions),
	hmrcTransactions: many(hmrcTransactions),
	documents: many(documents),
}));

export const companiesRelations = relations(companies, ({one}) => ({
	user: one(users, {
		fields: [companies.ownerId],
		references: [users.id]
	}),
}));

export const hmrcTokensRelations = relations(hmrcTokens, ({one}) => ({
	user: one(users, {
		fields: [hmrcTokens.userId],
		references: [users.id]
	}),
}));

export const clientsRelations = relations(clients, ({one, many}) => ({
	user_assignedTo: one(users, {
		fields: [clients.assignedTo],
		references: [users.id],
		relationName: "clients_assignedTo_users_id"
	}),
	user_createdBy: one(users, {
		fields: [clients.createdBy],
		references: [users.id],
		relationName: "clients_createdBy_users_id"
	}),
	assignments: many(assignments),
	documentFolders: many(documentFolders),
	documentTransactions: many(documentTransactions),
	hmrcSubmissions: many(hmrcSubmissions),
	hmrcTransactions: many(hmrcTransactions),
	documents: many(documents),
}));

export const assignmentsRelations = relations(assignments, ({one}) => ({
	client: one(clients, {
		fields: [assignments.clientId],
		references: [clients.id]
	}),
	user_staffUserId: one(users, {
		fields: [assignments.staffUserId],
		references: [users.id],
		relationName: "assignments_staffUserId_users_id"
	}),
	user_createdBy: one(users, {
		fields: [assignments.createdBy],
		references: [users.id],
		relationName: "assignments_createdBy_users_id"
	}),
}));

export const documentFolderAssignmentsRelations = relations(documentFolderAssignments, ({one}) => ({
	document: one(documents, {
		fields: [documentFolderAssignments.documentId],
		references: [documents.id]
	}),
	documentFolder: one(documentFolders, {
		fields: [documentFolderAssignments.folderId],
		references: [documentFolders.id]
	}),
}));

export const documentsRelations = relations(documents, ({one, many}) => ({
	documentFolderAssignments: many(documentFolderAssignments),
	documentTransactions: many(documentTransactions),
	hmrcSubmissions: many(hmrcSubmissions),
	user: one(users, {
		fields: [documents.userId],
		references: [users.id]
	}),
	client: one(clients, {
		fields: [documents.clientId],
		references: [clients.id]
	}),
}));

export const documentFoldersRelations = relations(documentFolders, ({one, many}) => ({
	documentFolderAssignments: many(documentFolderAssignments),
	user: one(users, {
		fields: [documentFolders.userId],
		references: [users.id]
	}),
	client: one(clients, {
		fields: [documentFolders.clientId],
		references: [clients.id]
	}),
}));

export const documentTransactionsRelations = relations(documentTransactions, ({one, many}) => ({
	document: one(documents, {
		fields: [documentTransactions.documentId],
		references: [documents.id]
	}),
	user: one(users, {
		fields: [documentTransactions.userId],
		references: [users.id]
	}),
	client: one(clients, {
		fields: [documentTransactions.clientId],
		references: [clients.id]
	}),
	hmrcTransactions: many(hmrcTransactions),
}));

export const hmrcSubmissionsRelations = relations(hmrcSubmissions, ({one}) => ({
	user: one(users, {
		fields: [hmrcSubmissions.userId],
		references: [users.id]
	}),
	client: one(clients, {
		fields: [hmrcSubmissions.clientId],
		references: [clients.id]
	}),
	document: one(documents, {
		fields: [hmrcSubmissions.documentId],
		references: [documents.id]
	}),
}));

export const hmrcTransactionsRelations = relations(hmrcTransactions, ({one}) => ({
	user: one(users, {
		fields: [hmrcTransactions.userId],
		references: [users.id]
	}),
	client: one(clients, {
		fields: [hmrcTransactions.clientId],
		references: [clients.id]
	}),
	documentTransaction: one(documentTransactions, {
		fields: [hmrcTransactions.documentTransactionId],
		references: [documentTransactions.id]
	}),
}));