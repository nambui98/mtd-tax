import { pgTable, uuid, varchar, timestamp, foreignKey, unique, text, boolean, date, integer, numeric, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const businessType = pgEnum("business_type", ['sole_trader', 'landlord', 'partnership'])
export const clientCategory = pgEnum("client_category", ['standard', 'premium', 'vip'])
export const clientStatus = pgEnum("client_status", ['mtd_ready', 'mtd_not_ready', 'action_needed', 'critical_issues'])
export const clientType = pgEnum("client_type", ['individual', 'landlord', 'both'])
export const practiceType = pgEnum("practice_type", ['accountancy_practice', 'bookkeeping_service', 'tax_advisory_firm'])
export const typeOfBusiness = pgEnum("type_of_business", ['self-employment', 'uk-property', 'foreign-property', 'property-unspecified'])
export const userRole = pgEnum("user_role", ['admin', 'user', 'staff', 'client'])
export const userType = pgEnum("user_type", ['tier1_taxpayer', 'tier2_taxpayer', 'accountant', 'admin'])


export const roles = pgTable("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: userRole().notNull(),
	description: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const rolePermissions = pgTable("role_permissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	roleId: uuid("role_id").notNull(),
	permissionId: uuid("permission_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_permissions_role_id_roles_id_fk"
		}),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.id],
			name: "role_permissions_permission_id_permissions_id_fk"
		}),
]);

export const permissions = pgTable("permissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("permissions_name_unique").on(table.name),
]);

export const userRoles = pgTable("user_roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	roleId: uuid("role_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_roles_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "user_roles_role_id_roles_id_fk"
		}),
]);

export const companies = pgTable("companies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	companyNumber: varchar("company_number", { length: 50 }),
	vatNumber: varchar("vat_number", { length: 50 }),
	addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
	addressLine2: varchar("address_line_2", { length: 255 }),
	city: varchar({ length: 100 }).notNull(),
	postcode: varchar({ length: 20 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 50 }),
	ownerId: uuid("owner_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "companies_owner_id_users_id_fk"
		}),
]);

export const hmrcTokens = pgTable("hmrc_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	accessToken: text("access_token").notNull(),
	refreshToken: text("refresh_token").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "hmrc_tokens_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 50 }),
	jobTitle: varchar("job_title", { length: 150 }),
	practiceType: practiceType("practice_type").default('accountancy_practice'),
	hmrcConnected: boolean("hmrc_connected").default(false),
	agentReferenceNumber: varchar("agent_reference_number", { length: 20 }),
	utr: varchar({ length: 10 }),
	nino: varchar({ length: 9 }),
	hmrcGatewayCredentials: text("hmrc_gateway_credentials"),
	authorityToAct: boolean("authority_to_act").default(false),
	hmrcConnectedAt: timestamp("hmrc_connected_at", { mode: 'string' }),
	isActive: boolean("is_active").default(true),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	otpSecret: varchar("otp_secret", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	emailVerified: boolean("email_verified").default(false),
	userType: userType("user_type").default('tier1_taxpayer'),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const clients = pgTable("clients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clientType: clientType("client_type").notNull(),
	mtdStatus: boolean("mtd_status").default(false).notNull(),
	title: varchar({ length: 100 }).notNull(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	dob: date().notNull(),
	nationalInsuranceNumber: varchar("national_insurance_number", { length: 10 }).notNull(),
	uniqueTaxpayerReference: varchar("unique_taxpayer_reference", { length: 10 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 20 }),
	addressLine1: varchar("address_line_1", { length: 100 }).notNull(),
	addressLine2: varchar("address_line_2", { length: 100 }),
	city: varchar({ length: 100 }).notNull(),
	county: varchar({ length: 100 }),
	postcode: varchar({ length: 100 }).notNull(),
	assignedTo: uuid("assigned_to"),
	clientCategory: clientCategory("client_category"),
	notes: text(),
	sendWelcomeEmail: boolean("send_welcome_email").default(false),
	hmrcAuthorization: boolean("hmrc_authorization").default(false),
	hmrcConnected: boolean("hmrc_connected").default(false),
	status: clientStatus().default('mtd_ready').notNull(),
	deadline: date(),
	totalRevenue: integer("total_revenue"),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	invitationId: varchar("invitation_id", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.assignedTo],
			foreignColumns: [users.id],
			name: "clients_assigned_to_users_id_fk"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "clients_created_by_users_id_fk"
		}),
	unique("clients_email_unique").on(table.email),
]);

export const assignments = pgTable("assignments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clientId: uuid("client_id").notNull(),
	staffUserId: uuid("staff_user_id").notNull(),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "assignments_client_id_clients_id_fk"
		}),
	foreignKey({
			columns: [table.staffUserId],
			foreignColumns: [users.id],
			name: "assignments_staff_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "assignments_created_by_users_id_fk"
		}),
]);

export const documentFolderAssignments = pgTable("document_folder_assignments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid().notNull(),
	folderId: uuid().notNull(),
	assignedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "document_folder_assignments_documentId_documents_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [documentFolders.id],
			name: "document_folder_assignments_folderId_document_folders_id_fk"
		}).onDelete("cascade"),
]);

export const documentFolders = pgTable("document_folders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	clientId: uuid().notNull(),
	name: text().notNull(),
	description: text(),
	color: text().default('#2563eb'),
	icon: text().default('folder'),
	parentFolderId: uuid(),
	isDefault: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "document_folders_userId_users_id_fk"
		}),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "document_folders_clientId_clients_id_fk"
		}),
]);

export const documentTransactions = pgTable("document_transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid().notNull(),
	userId: uuid().notNull(),
	clientId: uuid().notNull(),
	businessId: text(),
	transactionDate: date().notNull(),
	description: text().notNull(),
	category: text().notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: text().default('GBP').notNull(),
	status: text().default('pending').notNull(),
	isAiGenerated: boolean().default(false).notNull(),
	aiConfidence: numeric({ precision: 3, scale:  2 }).default('0.00'),
	hmrcTransactionId: text(),
	hmrcCategory: text(),
	hmrcBusinessId: text(),
	hmrcClientId: text(),
	notes: text(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "document_transactions_documentId_documents_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "document_transactions_userId_users_id_fk"
		}),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "document_transactions_clientId_clients_id_fk"
		}),
]);

export const hmrcSubmissions = pgTable("hmrc_submissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	clientId: uuid().notNull(),
	businessId: text().notNull(),
	documentId: uuid(),
	submissionType: text().notNull(),
	taxYear: text().notNull(),
	periodKey: text(),
	status: text().default('draft').notNull(),
	hmrcSubmissionId: text(),
	hmrcResponse: jsonb(),
	submittedAt: timestamp("submitted_at", { mode: 'string' }),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "hmrc_submissions_userId_users_id_fk"
		}),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "hmrc_submissions_clientId_clients_id_fk"
		}),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "hmrc_submissions_documentId_documents_id_fk"
		}).onDelete("set null"),
]);

export const hmrcTransactions = pgTable("hmrc_transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	clientId: uuid().notNull(),
	businessId: text().notNull(),
	documentTransactionId: uuid(),
	hmrcTransactionId: text().notNull(),
	transactionType: text().notNull(),
	category: text().notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: text().default('GBP').notNull(),
	transactionDate: date().notNull(),
	description: text().notNull(),
	status: text().default('pending').notNull(),
	hmrcResponse: jsonb(),
	submittedAt: timestamp("submitted_at", { mode: 'string' }),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "hmrc_transactions_userId_users_id_fk"
		}),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "hmrc_transactions_clientId_clients_id_fk"
		}),
	foreignKey({
			columns: [table.documentTransactionId],
			foreignColumns: [documentTransactions.id],
			name: "hmrc_transactions_documentTransactionId_document_transactions_i"
		}).onDelete("set null"),
]);

export const documents = pgTable("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	clientId: uuid().notNull(),
	businessId: text(),
	filePath: text().notNull(),
	status: text().default('uploaded').notNull(),
	processingStatus: text().default('pending').notNull(),
	aiExtractedTransactions: integer().default(0),
	aiAccuracy: numeric({ precision: 3, scale:  2 }).default('0.00'),
	hmrcSubmissionId: text(),
	hmrcBusinessId: text(),
	hmrcClientId: text(),
	metadata: jsonb(),
	uploadedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	processedAt: timestamp({ mode: 'string' }),
	submittedToHmrcAt: timestamp({ mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	documentType: text().array().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "documents_userId_users_id_fk"
		}),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "documents_clientId_clients_id_fk"
		}),
]);
