import { Inject, Injectable } from '@nestjs/common';
import { UpdateClientDto } from './dto/update-client.dto';
import {
    clientsTable,
    InsertClient,
    usersTable,
    ClientType,
    documentTransactionsTable,
    hmrcTransactionsTable,
} from '@workspace/database';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { Database } from '@workspace/database';
import {
    desc,
    eq,
    and,
    ilike,
    or,
    gte,
    lte,
    sql,
    count,
    sum,
    avg,
    between,
} from 'drizzle-orm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ClientsService {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

    create(createClientDto: InsertClient, userId: string) {
        return this.db
            .insert(clientsTable)
            .values({
                ...createClientDto,
                createdBy: userId,
                dob: createClientDto.dob.toISOString(),
            })
            .returning()
            .then((result) => result[0]); // Return the first (and only) client
    }

    findAll() {
        return this.db.select().from(clientsTable);
    }

    findOne(id: number) {
        return this.db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.id, id.toString()))
            .then((result) => result[0]); // Return the first (and only) client
    }

    update(id: number, updateClientDto: UpdateClientDto) {
        return this.db
            .update(clientsTable)
            .set(updateClientDto)
            .where(eq(clientsTable.id, id.toString()))
            .returning()
            .then((result) => result[0]); // Return the first (and only) updated client
    }

    remove(id: number) {
        return this.db
            .delete(clientsTable)
            .where(eq(clientsTable.id, id.toString()))
            .returning()
            .then((result) => result[0]); // Return the first (and only) deleted client
    }

    findAllByUser(
        userId: string,
        filters?: { search?: string; businessType?: string; assignee?: string },
    ) {
        const baseClause = eq(clientsTable.createdBy, userId);
        const filterClauses = [];
        if (filters) {
            if (filters.search) {
                filterClauses.push(
                    or(
                        ilike(clientsTable.firstName, `%${filters.search}%`),
                        ilike(clientsTable.lastName, `%${filters.search}%`),
                    ),
                );
            }
            if (filters.businessType) {
                filterClauses.push(
                    eq(
                        clientsTable.clientType,
                        filters.businessType as ClientType,
                    ),
                );
            }
            if (filters.assignee) {
                filterClauses.push(
                    eq(clientsTable.assignedTo, filters.assignee),
                );
            }
        }
        const query = this.db
            .select({
                id: clientsTable.id,
                firstName: clientsTable.firstName,
                lastName: clientsTable.lastName,
                email: clientsTable.email,
                clientType: clientsTable.clientType,
                deadline: clientsTable.deadline,
                totalRevenue: clientsTable.totalRevenue,
                invitationId: clientsTable.invitationId,
                assignee: {
                    id: usersTable.id,
                    firstName: usersTable.firstName,
                    lastName: usersTable.lastName,
                },
            })
            .from(clientsTable)
            .leftJoin(usersTable, eq(clientsTable.assignedTo, usersTable.id));
        if (filterClauses.length > 0) {
            return query
                .where(and(baseClause, ...filterClauses))
                .orderBy(desc(clientsTable.createdAt));
        } else {
            return query
                .where(baseClause)
                .orderBy(desc(clientsTable.createdAt));
        }
    }

    async findClientAgencyRelationshipByUtr(utr: string) {
        const client = await this.db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.utr, utr))
            .limit(1);

        if (client.length === 0) {
            throw new NotFoundException('Client not found');
        }

        return client[0];
    }

    async findClientById(id: string) {
        const client = await this.db
            .select({
                id: clientsTable.id,
                firstName: clientsTable.firstName,
                lastName: clientsTable.lastName,
                email: clientsTable.email,
                phoneNumber: clientsTable.phoneNumber,
                addressLine1: clientsTable.addressLine1,
                addressLine2: clientsTable.addressLine2,
                city: clientsTable.city,
                county: clientsTable.county,
                postcode: clientsTable.postcode,
                utr: clientsTable.utr,
                nino: clientsTable.nino,
                clientType: clientsTable.clientType,
                deadline: clientsTable.deadline,
                totalRevenue: clientsTable.totalRevenue,
                invitationId: clientsTable.invitationId,
                assignee: {
                    id: usersTable.id,
                    firstName: usersTable.firstName,
                    lastName: usersTable.lastName,
                    email: usersTable.email,
                },
            })
            .from(clientsTable)
            .leftJoin(usersTable, eq(clientsTable.assignedTo, usersTable.id))
            .where(eq(clientsTable.id, id))
            .limit(1);

        if (client.length === 0) {
            throw new NotFoundException('Client not found');
        }

        return client[0];
    }

    async findClientByUtr(utr: string) {
        const client = await this.db
            .select({
                id: clientsTable.id,
                firstName: clientsTable.firstName,
                lastName: clientsTable.lastName,
                email: clientsTable.email,
                phoneNumber: clientsTable.phoneNumber,
                addressLine1: clientsTable.addressLine1,
                addressLine2: clientsTable.addressLine2,
                city: clientsTable.city,
                county: clientsTable.county,
                postcode: clientsTable.postcode,
                utr: clientsTable.utr,
                clientType: clientsTable.clientType,
                deadline: clientsTable.deadline,
                totalRevenue: clientsTable.totalRevenue,
                invitationId: clientsTable.invitationId,
                assignee: {
                    id: usersTable.id,
                    firstName: usersTable.firstName,
                    lastName: usersTable.lastName,
                    email: usersTable.email,
                },
            })
            .from(clientsTable)
            .leftJoin(usersTable, eq(clientsTable.assignedTo, usersTable.id))
            .where(eq(clientsTable.utr, utr))
            .limit(1);

        if (client.length === 0) {
            throw new NotFoundException('Client not found');
        }

        return client[0];
    }

    getClientTransactions(clientId: string) {
        // Mock data for now - in a real app, you'd have a transactions table
        return [
            {
                id: '1',
                clientId,
                description: 'Client XYZ - Website Development',
                amount: 3500.0,
                type: 'income' as const,
                category: 'Sales / Services',
                date: '2026-06-20',
                createdAt: '2026-06-20T10:00:00Z',
            },
            {
                id: '2',
                clientId,
                description: 'Software Subscriptions',
                amount: 250.0,
                type: 'expense' as const,
                category: 'Office Expenses',
                date: '2026-06-15',
                createdAt: '2026-06-15T10:00:00Z',
            },
            {
                id: '3',
                clientId,
                description: 'Client ABC - Consulting Retainer',
                amount: 2200.0,
                type: 'income' as const,
                category: 'Sales / Services',
                date: '2026-06-10',
                createdAt: '2026-06-10T10:00:00Z',
            },
            {
                id: '4',
                clientId,
                description: 'Business Travel',
                amount: 320.0,
                type: 'expense' as const,
                category: 'Travel & Transport',
                date: '2026-06-08',
                createdAt: '2026-06-08T10:00:00Z',
            },
        ];
    }

    async getFilteredTransactions(
        clientId: string,
        filters: {
            search?: string;
            businessId?: string;
            category?: string;
            status?: string;
            type?: string;
            dateFrom?: string;
            dateTo?: string;
            amountMin?: number;
            amountMax?: number;
            page?: number;
            limit?: number;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
        },
    ) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const offset = (page - 1) * limit;

        // Build where conditions
        const whereConditions = [
            eq(documentTransactionsTable.clientId, clientId),
        ];

        if (filters.search) {
            whereConditions.push(
                ilike(
                    documentTransactionsTable.description,
                    `%${filters.search}%`,
                ),
            );
        }

        if (filters.businessId) {
            whereConditions.push(
                eq(documentTransactionsTable.businessId, filters.businessId),
            );
        }

        if (filters.category) {
            whereConditions.push(
                eq(documentTransactionsTable.category, filters.category),
            );
        }

        if (filters.status) {
            whereConditions.push(
                eq(documentTransactionsTable.status, filters.status),
            );
        }

        if (filters.type) {
            // For type filtering, we need to determine if it's income or expense based on amount
            if (filters.type === 'income') {
                whereConditions.push(
                    sql`${documentTransactionsTable.amount} > 0`,
                );
            } else if (filters.type === 'expense') {
                whereConditions.push(
                    sql`${documentTransactionsTable.amount} < 0`,
                );
            }
        }

        if (filters.dateFrom) {
            whereConditions.push(
                gte(
                    documentTransactionsTable.transactionDate,
                    filters.dateFrom,
                ),
            );
        }

        if (filters.dateTo) {
            whereConditions.push(
                lte(documentTransactionsTable.transactionDate, filters.dateTo),
            );
        }

        if (filters.amountMin !== undefined) {
            whereConditions.push(
                gte(
                    documentTransactionsTable.amount,
                    filters.amountMin.toString(),
                ),
            );
        }

        if (filters.amountMax !== undefined) {
            whereConditions.push(
                lte(
                    documentTransactionsTable.amount,
                    filters.amountMax.toString(),
                ),
            );
        }

        // Build order by
        let orderBy = desc(documentTransactionsTable.transactionDate);
        if (filters.sortBy) {
            const sortField =
                filters.sortBy as keyof typeof documentTransactionsTable;
            if (filters.sortBy in documentTransactionsTable) {
                orderBy =
                    filters.sortOrder === 'asc'
                        ? sql`${documentTransactionsTable[sortField]} ASC`
                        : sql`${documentTransactionsTable[sortField]} DESC`;
            }
        }

        // Get total count
        const totalResult = await this.db
            .select({ count: count() })
            .from(documentTransactionsTable)
            .where(and(...whereConditions));

        const total = totalResult[0]?.count || 0;

        // Get transactions
        const transactions = await this.db
            .select()
            .from(documentTransactionsTable)
            .where(and(...whereConditions))
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);

        return {
            transactions: transactions.map((t) => ({
                id: t.id,
                clientId: t.clientId,
                businessId: t.businessId,
                description: t.description,
                amount: parseFloat(t.amount),
                type: parseFloat(t.amount) > 0 ? 'income' : 'expense',
                category: t.category,
                status: t.status,
                transactionDate: t.transactionDate,
                currency: t.currency,
                documentId: t.documentId,
                createdAt: t.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getTransactionStatistics(
        clientId: string,
        filters: {
            businessId?: string;
            dateFrom?: string;
            dateTo?: string;
            category?: string;
            status?: string;
        },
    ) {
        // Build where conditions
        const whereConditions = [
            eq(documentTransactionsTable.clientId, clientId),
        ];

        if (filters.businessId) {
            whereConditions.push(
                eq(documentTransactionsTable.businessId, filters.businessId),
            );
        }

        if (filters.dateFrom) {
            whereConditions.push(
                gte(
                    documentTransactionsTable.transactionDate,
                    filters.dateFrom,
                ),
            );
        }

        if (filters.dateTo) {
            whereConditions.push(
                lte(documentTransactionsTable.transactionDate, filters.dateTo),
            );
        }

        if (filters.category) {
            whereConditions.push(
                eq(documentTransactionsTable.category, filters.category),
            );
        }

        if (filters.status) {
            whereConditions.push(
                eq(documentTransactionsTable.status, filters.status),
            );
        }

        // Get summary statistics
        const summaryResult = await this.db
            .select({
                totalIncome: sum(
                    sql`CASE WHEN ${documentTransactionsTable.amount} > 0 THEN ${documentTransactionsTable.amount} ELSE 0 END`,
                ),
                totalExpenses: sum(
                    sql`CASE WHEN ${documentTransactionsTable.amount} < 0 THEN ABS(${documentTransactionsTable.amount}) ELSE 0 END`,
                ),
                totalTransactions: count(),
                averageAmount: avg(documentTransactionsTable.amount),
            })
            .from(documentTransactionsTable)
            .where(and(...whereConditions));

        const summary = summaryResult[0];
        const totalIncome = parseFloat(summary?.totalIncome || '0');
        const totalExpenses = parseFloat(summary?.totalExpenses || '0');
        const netProfit = totalIncome - totalExpenses;

        // Get statistics by category
        const categoryStats = await this.db
            .select({
                category: documentTransactionsTable.category,
                count: count(),
                totalAmount: sum(documentTransactionsTable.amount),
                averageAmount: avg(documentTransactionsTable.amount),
            })
            .from(documentTransactionsTable)
            .where(and(...whereConditions))
            .groupBy(documentTransactionsTable.category);

        // Get statistics by status
        const statusStats = await this.db
            .select({
                status: documentTransactionsTable.status,
                count: count(),
                totalAmount: sum(documentTransactionsTable.amount),
            })
            .from(documentTransactionsTable)
            .where(and(...whereConditions))
            .groupBy(documentTransactionsTable.status);

        // Get statistics by business
        const businessStats = await this.db
            .select({
                businessId: documentTransactionsTable.businessId,
                count: count(),
                totalAmount: sum(documentTransactionsTable.amount),
            })
            .from(documentTransactionsTable)
            .where(and(...whereConditions))
            .groupBy(documentTransactionsTable.businessId);

        // Get monthly trends (last 12 months)
        const monthlyTrends = await this.db
            .select({
                month: sql`DATE_TRUNC('month', ${documentTransactionsTable.transactionDate})`,
                income: sum(
                    sql`CASE WHEN ${documentTransactionsTable.amount} > 0 THEN ${documentTransactionsTable.amount} ELSE 0 END`,
                ),
                expenses: sum(
                    sql`CASE WHEN ${documentTransactionsTable.amount} < 0 THEN ABS(${documentTransactionsTable.amount}) ELSE 0 END`,
                ),
                transactionCount: count(),
            })
            .from(documentTransactionsTable)
            .where(and(...whereConditions))
            .groupBy(
                sql`DATE_TRUNC('month', ${documentTransactionsTable.transactionDate})`,
            )
            .orderBy(
                sql`DATE_TRUNC('month', ${documentTransactionsTable.transactionDate}) DESC`,
            )
            .limit(12);

        return {
            summary: {
                totalIncome,
                totalExpenses,
                netProfit,
                totalTransactions: parseInt(
                    summary?.totalTransactions.toString(),
                ),
                averageTransactionAmount: parseFloat(
                    summary?.averageAmount || '0',
                ),
            },
            byCategory: categoryStats.map((stat) => ({
                category: stat.category,
                count: parseInt(stat.count.toString()),
                totalAmount: parseFloat(stat.totalAmount || '0'),
                averageAmount: parseFloat(stat.averageAmount || '0'),
            })),
            byStatus: statusStats.map((stat) => ({
                status: stat.status,
                count: parseInt(stat.count.toString()),
                totalAmount: parseFloat(stat.totalAmount || '0'),
            })),
            byBusiness: businessStats.map((stat) => ({
                businessId: stat.businessId,
                businessName: stat.businessId, // In a real app, you'd join with a businesses table
                count: parseInt(stat.count.toString()),
                totalAmount: parseFloat(stat.totalAmount || '0'),
            })),
            monthlyTrends: monthlyTrends.map((trend) => ({
                month: trend.month,
                income: parseFloat(trend.income || '0'),
                expenses: parseFloat(trend.expenses || '0'),
                netProfit:
                    parseFloat(trend.income || '0') -
                    parseFloat(trend.expenses || '0'),
                transactionCount: parseInt(trend.transactionCount.toString()),
            })),
        };
    }

    async getTransactionCategories(clientId: string) {
        const categories = await this.db
            .select({
                category: documentTransactionsTable.category,
                count: count(),
                totalAmount: sum(documentTransactionsTable.amount),
            })
            .from(documentTransactionsTable)
            .where(eq(documentTransactionsTable.clientId, clientId))
            .groupBy(documentTransactionsTable.category)
            .orderBy(documentTransactionsTable.category);

        return categories.map((cat) => ({
            category: cat.category,
            count: parseInt(cat.count.toString()),
            totalAmount: parseFloat(cat.totalAmount || '0'),
        }));
    }

    async getClientBusinesses(clientId: string) {
        const businesses = await this.db
            .select({
                businessId: documentTransactionsTable.businessId,
                count: count(),
                totalAmount: sum(documentTransactionsTable.amount),
            })
            .from(documentTransactionsTable)
            .where(eq(documentTransactionsTable.clientId, clientId))
            .groupBy(documentTransactionsTable.businessId)
            .orderBy(documentTransactionsTable.businessId);

        return businesses.map((business) => ({
            businessId: business.businessId,
            businessName: business.businessId, // In a real app, you'd join with a businesses table
            count: parseInt(business.count.toString()),
            totalAmount: parseFloat(business.totalAmount || '0'),
        }));
    }

    getClientDocuments(clientId: string) {
        // Mock data for now - in a real app, you'd have a documents table
        return [
            {
                id: '1',
                clientId,
                name: 'April 2026 Bank Statement (Consulting)',
                type: 'pdf',
                size: 1024000,
                uploadDate: '2026-05-15',
                uploadedBy: 'Client Upload',
                status: 'Processed',
                url: 'https://example.com/document1.pdf',
            },
            {
                id: '2',
                clientId,
                name: 'Client XYZ Invoice #2026-042',
                type: 'pdf',
                size: 512000,
                uploadDate: '2026-05-12',
                uploadedBy: 'Client Upload',
                status: 'Processed',
                url: 'https://example.com/document2.pdf',
            },
            {
                id: '3',
                clientId,
                name: 'Client ABC Invoice #2026-043',
                type: 'pdf',
                size: 768000,
                uploadDate: '2026-05-08',
                uploadedBy: 'Client Upload',
                status: 'Processed',
                url: 'https://example.com/document3.pdf',
            },
            {
                id: '4',
                clientId,
                name: 'April 2026 Expense Receipts (Bundle)',
                type: 'zip',
                size: 2048000,
                uploadDate: '2026-05-05',
                uploadedBy: 'Client Upload',
                status: 'Processed',
                url: 'https://example.com/document4.zip',
            },
        ];
    }
}
