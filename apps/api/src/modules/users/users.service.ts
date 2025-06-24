/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database.module';
import {
    Database,
    InsertHMRC,
    InsertUser,
    insertUserSchema,
    rolesTable,
    UpdateUserDto,
    User,
    userRolesTable,
    usersTable,
} from '@workspace/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

    async create(
        createUserDto: InsertUser &
            InsertHMRC & { passwordHash: string; otpSecret: string },
    ): Promise<User> {
        const result = insertUserSchema.safeParse(createUserDto);
        if (!result.success) {
            throw new Error('Invalid user data');
        }
        const [user] = await this.db
            .insert(usersTable)
            .values([
                {
                    ...result.data,
                    passwordHash: createUserDto.passwordHash,
                    otpSecret: createUserDto.otpSecret,
                },
            ])
            .returning();
        return user;
    }

    async findAll(where?: any) {
        // return `This action returns all users`;
        return this.db.select().from(usersTable).where(where);
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async getStaffUsers() {
        return this.db
            .select({
                id: usersTable.id,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
                email: usersTable.email,
                roleName: rolesTable.name,
            })
            .from(usersTable)
            .innerJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
            .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
            .where(eq(rolesTable.name, 'staff'));
    }
}
