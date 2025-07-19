import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Request,
    Query,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Public } from 'src/common/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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

    @Get('by-utr/:utr')
    @ApiOperation({ summary: 'Get client-agency relationship by UTR' })
    @ApiParam({
        name: 'utr',
        description: 'Unique Taxpayer Reference (10-digit number)',
        example: '1234567890',
    })
    @ApiResponse({
        status: 200,
        description: 'Client-agency relationship retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                client: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        email: {
                            type: 'string',
                            example: 'john.doe@example.com',
                        },
                        utr: { type: 'string', example: '1234567890' },
                        clientType: { type: 'string', example: 'individual' },
                        mtdStatus: { type: 'boolean', example: true },
                        status: { type: 'string', example: 'mtd_ready' },
                        hmrcConnected: { type: 'boolean', example: true },
                        hmrcAuthorization: { type: 'boolean', example: true },
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
                relationship: {
                    type: 'object',
                    properties: {
                        assignedStaff: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'uuid' },
                                firstName: { type: 'string', example: 'Jane' },
                                lastName: { type: 'string', example: 'Smith' },
                                email: {
                                    type: 'string',
                                    example: 'jane.smith@agency.com',
                                },
                                jobTitle: {
                                    type: 'string',
                                    example: 'Senior Tax Advisor',
                                },
                                practiceType: {
                                    type: 'string',
                                    example: 'accountancy_practice',
                                },
                                agentReferenceNumber: {
                                    type: 'string',
                                    example: 'ARN123456',
                                },
                                utr: { type: 'string', example: '9876543210' },
                            },
                        },
                        createdBy: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'uuid' },
                                firstName: { type: 'string', example: 'Admin' },
                                lastName: { type: 'string', example: 'User' },
                                email: {
                                    type: 'string',
                                    example: 'admin@agency.com',
                                },
                                jobTitle: {
                                    type: 'string',
                                    example: 'Practice Manager',
                                },
                                practiceType: {
                                    type: 'string',
                                    example: 'accountancy_practice',
                                },
                                agentReferenceNumber: {
                                    type: 'string',
                                    example: 'ARN123456',
                                },
                                utr: { type: 'string', example: '1111111111' },
                            },
                        },
                        relationshipType: {
                            type: 'string',
                            example: 'assigned',
                        },
                        isActive: { type: 'boolean', example: true },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Client not found' })
    @ApiResponse({ status: 400, description: 'Invalid UTR format' })
    async getClientAgencyRelationshipByUtr(@Param('utr') utr: string) {
        // Validate UTR format (should be 10 digits)
        if (!/^\d{10}$/.test(utr)) {
            throw new BadRequestException(
                'Invalid UTR format. UTR must be exactly 10 digits.',
            );
        }

        const relationship =
            await this.clientsService.findClientAgencyRelationshipByUtr(utr);

        if (!relationship) {
            throw new NotFoundException(
                'Client not found with the provided UTR.',
            );
        }

        return relationship;
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
