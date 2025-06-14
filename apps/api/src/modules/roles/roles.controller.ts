import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/guards/roles.guard';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get('my-roles')
    @ApiOperation({ summary: 'Get current user roles' })
    @ApiResponse({
        status: 200,
        description: 'User roles retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getMyRoles(@Request() req: { user: { sub: string } }) {
        return this.rolesService.getUserRoles(req.user.sub);
    }

    @Get('my-permissions')
    @ApiOperation({ summary: 'Get current user permissions' })
    @ApiResponse({
        status: 200,
        description: 'User permissions retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getMyPermissions(@Request() req: { user: { sub: string } }) {
        return this.rolesService.getUserPermissions(req.user.sub);
    }

    @Get()
    @Roles('admin')
    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    getAllRoles() {
        return this.rolesService.getAllRoles();
    }

    @Get('permissions')
    @Roles('admin')
    @ApiOperation({ summary: 'Get all permissions' })
    @ApiResponse({
        status: 200,
        description: 'Permissions retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    getAllPermissions() {
        return this.rolesService.getAllPermissions();
    }

    @Get(':roleName/permissions')
    @Roles('admin')
    @ApiOperation({ summary: 'Get role permissions' })
    @ApiResponse({
        status: 200,
        description: 'Role permissions retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    getRolePermissions(@Param('roleName') roleName: string) {
        return this.rolesService.getRolePermissions(roleName);
    }

    @Post('users/:userId/roles/:roleName')
    @Roles('admin')
    @ApiOperation({ summary: 'Assign role to user' })
    @ApiResponse({ status: 201, description: 'Role assigned successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Role or user not found' })
    assignRoleToUser(
        @Param('userId') userId: string,
        @Param('roleName') roleName: string,
    ) {
        return this.rolesService.assignRoleToUser(userId, roleName);
    }

    @Delete('users/:userId/roles/:roleName')
    @Roles('admin')
    @ApiOperation({ summary: 'Remove role from user' })
    @ApiResponse({ status: 200, description: 'Role removed successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Role or user not found' })
    removeRoleFromUser(
        @Param('userId') userId: string,
        @Param('roleName') roleName: string,
    ) {
        return this.rolesService.removeRoleFromUser(userId, roleName);
    }

    @Post(':roleName/permissions/:permissionName')
    @Roles('admin')
    @ApiOperation({ summary: 'Assign permission to role' })
    @ApiResponse({
        status: 201,
        description: 'Permission assigned successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Role or permission not found' })
    assignPermissionToRole(
        @Param('roleName') roleName: string,
        @Param('permissionName') permissionName: string,
    ) {
        return this.rolesService.assignPermissionToRole(
            roleName,
            permissionName,
        );
    }

    @Delete(':roleName/permissions/:permissionName')
    @Roles('admin')
    @ApiOperation({ summary: 'Remove permission from role' })
    @ApiResponse({
        status: 200,
        description: 'Permission removed successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Role or permission not found' })
    removePermissionFromRole(
        @Param('roleName') roleName: string,
        @Param('permissionName') permissionName: string,
    ) {
        return this.rolesService.removePermissionFromRole(
            roleName,
            permissionName,
        );
    }
}
