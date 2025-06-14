import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { Database } from '@workspace/database';
import {
    rolesTable,
    permissionsTable,
    rolePermissionsTable,
    userRolesTable,
} from '@workspace/database/dist/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class RolesService {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

    async getUserRoles(userId: string) {
        const roles = await this.db
            .select({
                id: rolesTable.id,
                name: rolesTable.name,
                description: rolesTable.description,
            })
            .from(userRolesTable)
            .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
            .where(eq(userRolesTable.userId, userId));

        return roles;
    }

    async getUserPermissions(userId: string) {
        const permissions = await this.db
            .select({
                name: permissionsTable.name,
                description: permissionsTable.description,
            })
            .from(userRolesTable)
            .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
            .innerJoin(
                rolePermissionsTable,
                eq(rolePermissionsTable.roleId, rolesTable.id),
            )
            .innerJoin(
                permissionsTable,
                eq(rolePermissionsTable.permissionId, permissionsTable.id),
            )
            .where(eq(userRolesTable.userId, userId));

        return permissions;
    }

    async assignRoleToUser(userId: string, roleName: string) {
        const [role] = await this.db
            .select()
            .from(rolesTable)
            .where(eq(rolesTable.name, roleName as 'admin' | 'user'))
            .limit(1);

        if (!role) {
            throw new NotFoundException(`Role ${roleName} not found`);
        }

        const [userRole] = await this.db
            .insert(userRolesTable)
            .values({
                userId,
                roleId: role.id,
            })
            .returning();

        return userRole;
    }

    async removeRoleFromUser(userId: string, roleName: string) {
        const [role] = await this.db
            .select()
            .from(rolesTable)
            .where(eq(rolesTable.name, roleName as 'admin' | 'user'))
            .limit(1);

        if (!role) {
            throw new NotFoundException(`Role ${roleName} not found`);
        }

        await this.db
            .delete(userRolesTable)
            .where(
                and(
                    eq(userRolesTable.userId, userId),
                    eq(userRolesTable.roleId, role.id),
                ),
            );
    }

    async assignPermissionToRole(roleName: string, permissionName: string) {
        const [role] = await this.db
            .select()
            .from(rolesTable)
            .where(eq(rolesTable.name, roleName as 'admin' | 'user'))
            .limit(1);

        if (!role) {
            throw new NotFoundException(`Role ${roleName} not found`);
        }

        const [permission] = await this.db
            .select()
            .from(permissionsTable)
            .where(eq(permissionsTable.name, permissionName))
            .limit(1);

        if (!permission) {
            throw new NotFoundException(
                `Permission ${permissionName} not found`,
            );
        }

        const [rolePermission] = await this.db
            .insert(rolePermissionsTable)
            .values({
                roleId: role.id,
                permissionId: permission.id,
            })
            .returning();

        return rolePermission;
    }

    async removePermissionFromRole(roleName: string, permissionName: string) {
        const [role] = await this.db
            .select()
            .from(rolesTable)
            .where(eq(rolesTable.name, roleName as 'admin' | 'user'))
            .limit(1);

        if (!role) {
            throw new NotFoundException(`Role ${roleName} not found`);
        }

        const [permission] = await this.db
            .select()
            .from(permissionsTable)
            .where(eq(permissionsTable.name, permissionName))
            .limit(1);

        if (!permission) {
            throw new NotFoundException(
                `Permission ${permissionName} not found`,
            );
        }

        await this.db
            .delete(rolePermissionsTable)
            .where(
                and(
                    eq(rolePermissionsTable.roleId, role.id),
                    eq(rolePermissionsTable.permissionId, permission.id),
                ),
            );
    }

    async getAllRoles() {
        return this.db.select().from(rolesTable);
    }

    async getAllPermissions() {
        return this.db.select().from(permissionsTable);
    }

    async getRolePermissions(roleName: string) {
        const [role] = await this.db
            .select()
            .from(rolesTable)
            .where(eq(rolesTable.name, roleName as 'admin' | 'user'))
            .limit(1);

        if (!role) {
            throw new NotFoundException(`Role ${roleName} not found`);
        }

        const permissions = await this.db
            .select({
                name: permissionsTable.name,
                description: permissionsTable.description,
            })
            .from(rolePermissionsTable)
            .innerJoin(
                permissionsTable,
                eq(rolePermissionsTable.permissionId, permissionsTable.id),
            )
            .where(eq(rolePermissionsTable.roleId, role.id));

        return permissions;
    }
}
