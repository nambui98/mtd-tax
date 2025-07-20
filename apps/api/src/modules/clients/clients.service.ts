/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { UpdateClientDto } from './dto/update-client.dto';
import {
    clientsTable,
    InsertClient,
    usersTable,
    ClientType,
} from '@workspace/database';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { Database } from '@workspace/database';
import { desc, eq, and, ilike, or } from 'drizzle-orm';
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
