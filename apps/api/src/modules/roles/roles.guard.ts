import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { rolesTable, userRolesTable } from '@workspace/database/dist/schema';
import { eq } from 'drizzle-orm';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(DATABASE_CONNECTION) private readonly db: PostgresJsDatabase,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            return false;
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            // Get user roles from database
            const userRoles = await this.db
                .select({
                    roleName: rolesTable.name,
                })
                .from(userRolesTable)
                .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
                .where(eq(userRolesTable.userId, payload.sub));

            const userRoleNames = userRoles.map(
                (ur: { roleName: string }) => ur.roleName,
            );

            return requiredRoles.some((role) => userRoleNames.includes(role));
        } catch {
            return false;
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
