import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Request,
    Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Public } from 'src/common/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InsertClient, insertClientSchema } from '@workspace/database';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new client' })
    @ApiResponse({
        status: 200,
        description: 'Client created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                phone: { type: 'string', example: '+1234567890' },
                address: {
                    type: 'string',
                    example: '123 Main St, Anytown, USA',
                },
                city: { type: 'string', example: 'Anytown' },
                state: { type: 'string', example: 'CA' },
                zip: { type: 'string', example: '12345' },
                createdAt: { type: 'string', example: '2021-01-01T00:00:00Z' },
                updatedAt: { type: 'string', example: '2021-01-01T00:00:00Z' },
            },
        },
    })
    async create(
        @Body(new ZodValidationPipe(insertClientSchema))
        createClientDto: InsertClient,
        @Request() req: { user: { userId: string } },
    ) {
        console.log(req.user);
        return this.clientsService.create(createClientDto, req.user.userId);
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all clients' })
    @ApiResponse({
        status: 200,
        description: 'Clients retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john.doe@example.com' },
                    phone: { type: 'string', example: '+1234567890' },
                    address: {
                        type: 'string',
                        example: '123 Main St, Anytown, USA',
                    },
                    city: { type: 'string', example: 'Anytown' },
                    state: { type: 'string', example: 'CA' },
                    zip: { type: 'string', example: '12345' },
                    createdAt: {
                        type: 'string',
                        example: '2021-01-01T00:00:00Z',
                    },
                    updatedAt: {
                        type: 'string',
                        example: '2021-01-01T00:00:00Z',
                    },
                },
            },
        },
    })
    async findAll() {
        return this.clientsService.findAll();
    }
    @Get('my')
    @ApiOperation({ summary: 'Get all clients for current user' })
    @ApiResponse({
        status: 200,
        description: 'Clients retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: 'uuid' },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john.doe@example.com' },
                    phone: { type: 'string', example: '+1234567890' },
                    address: {
                        type: 'string',
                        example: '123 Main St, Anytown, USA',
                    },
                    city: { type: 'string', example: 'Anytown' },
                    state: { type: 'string', example: 'CA' },
                    zip: { type: 'string', example: '12345' },
                    createdAt: {
                        type: 'string',
                        example: '2021-01-01T00:00:00Z',
                    },
                    updatedAt: {
                        type: 'string',
                        example: '2021-01-01T00:00:00Z',
                    },
                },
            },
        },
    })
    async findAllByUser(
        @Request() req: { user: { userId: string } },
        @Query('search') search?: string,
        @Query('businessType') businessType?: string,
        @Query('assignee') assignee?: string,
    ) {
        const hasFilters = search || businessType || assignee;
        return this.clientsService.findAllByUser(
            req.user.userId,
            hasFilters ? { search, businessType, assignee } : undefined,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a client by ID' })
    @ApiResponse({
        status: 200,
        description: 'Client retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                phone: { type: 'string', example: '+1234567890' },
                address: {
                    type: 'string',
                    example: '123 Main St, Anytown, USA',
                },
                city: { type: 'string', example: 'Anytown' },
                state: { type: 'string', example: 'CA' },
                zip: { type: 'string', example: '12345' },
                createdAt: { type: 'string', example: '2021-01-01T00:00:00Z' },
                updatedAt: { type: 'string', example: '2021-01-01T00:00:00Z' },
            },
        },
    })
    async findOne(@Param('id') id: string) {
        return this.clientsService.findOne(+id);
    }
}
