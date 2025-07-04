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
            .returning();
    }

    findAll() {
        return this.db.select().from(clientsTable);
    }

    findOne(id: number) {
        return this.db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.id, id.toString()));
    }

    update(id: number, updateClientDto: UpdateClientDto) {
        return this.db
            .update(clientsTable)
            .set(updateClientDto)
            .where(eq(clientsTable.id, id.toString()))
            .returning();
    }

    remove(id: number) {
        return this.db
            .delete(clientsTable)
            .where(eq(clientsTable.id, id.toString()))
            .returning();
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
}
