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
        const result = await this.db
            .select({
                client: {
                    id: clientsTable.id,
                    firstName: clientsTable.firstName,
                    lastName: clientsTable.lastName,
                    email: clientsTable.email,
                    utr: clientsTable.utr,
                    clientType: clientsTable.clientType,
                    mtdStatus: clientsTable.mtdStatus,
                    status: clientsTable.status,
                    hmrcConnected: clientsTable.hmrcConnected,
                    hmrcAuthorization: clientsTable.hmrcAuthorization,
                    createdAt: clientsTable.createdAt,
                    updatedAt: clientsTable.updatedAt,
                },
                assignedStaff: {
                    id: usersTable.id,
                    firstName: usersTable.firstName,
                    lastName: usersTable.lastName,
                    email: usersTable.email,
                    jobTitle: usersTable.jobTitle,
                    practiceType: usersTable.practiceType,
                    agentReferenceNumber: usersTable.agentReferenceNumber,
                    utr: usersTable.utr,
                },
                createdBy: {
                    id: usersTable.id,
                    firstName: usersTable.firstName,
                    lastName: usersTable.lastName,
                    email: usersTable.email,
                    jobTitle: usersTable.jobTitle,
                    practiceType: usersTable.practiceType,
                    agentReferenceNumber: usersTable.agentReferenceNumber,
                    utr: usersTable.utr,
                },
            })
            .from(clientsTable)
            .leftJoin(usersTable, eq(clientsTable.assignedTo, usersTable.id))
            .where(eq(clientsTable.utr, utr))
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        const clientData = result[0];

        // Get creator details using the createdBy field
        let creatorDetails = null;
        const createdByResult = await this.db
            .select({
                createdBy: clientsTable.createdBy,
            })
            .from(clientsTable)
            .where(eq(clientsTable.utr, utr))
            .limit(1);

        if (createdByResult.length > 0 && createdByResult[0].createdBy) {
            const creatorResult = await this.db
                .select({
                    id: usersTable.id,
                    firstName: usersTable.firstName,
                    lastName: usersTable.lastName,
                    email: usersTable.email,
                    jobTitle: usersTable.jobTitle,
                    practiceType: usersTable.practiceType,
                    agentReferenceNumber: usersTable.agentReferenceNumber,
                    utr: usersTable.utr,
                })
                .from(usersTable)
                .where(eq(usersTable.id, createdByResult[0].createdBy))
                .limit(1);

            if (creatorResult.length > 0) {
                creatorDetails = creatorResult[0];
            }
        }

        return {
            client: clientData.client,
            relationship: {
                assignedStaff: clientData.assignedStaff,
                createdBy: creatorDetails,
                relationshipType: clientData.assignedStaff
                    ? 'assigned'
                    : 'created_only',
                isActive: clientData.client.status !== 'critical_issues',
            },
        };
    }
}
