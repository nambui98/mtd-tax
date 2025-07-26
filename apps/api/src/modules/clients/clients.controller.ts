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
    UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { InsertClient, insertClientSchema } from '@workspace/database';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
        return this.clientsService.create(createClientDto, req.user.userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get client by UTR' })
    @ApiResponse({
        status: 200,
        description: 'Client retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'uuid' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                utr: { type: 'string', example: '1234567890' },
                clientType: { type: 'string', example: 'individual' },
                totalRevenue: { type: 'number', example: 50000 },
                assignee: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid' },
                        firstName: { type: 'string', example: 'Jane' },
                        lastName: { type: 'string', example: 'Smith' },
                        email: {
                            type: 'string',
                            example: 'jane.smith@agency.com',
                        },
                    },
                },
            },
        },
    })
    async findClientByUtr(@Param('utr') utr: string) {
        return this.clientsService.findClientByUtr(utr);
    }

    @Get('by-utr/:utr')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
    @ApiOperation({ summary: 'Get client by ID' })
    @ApiResponse({
        status: 200,
        description: 'Client retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'uuid' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                utr: { type: 'string', example: '1234567890' },
                clientType: { type: 'string', example: 'individual' },
                totalRevenue: { type: 'number', example: 50000 },
                assignee: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid' },
                        firstName: { type: 'string', example: 'Jane' },
                        lastName: { type: 'string', example: 'Smith' },
                        email: {
                            type: 'string',
                            example: 'jane.smith@agency.com',
                        },
                    },
                },
            },
        },
    })
    async findClientById(@Param('id') id: string) {
        return this.clientsService.findClientById(id);
    }

    @Get(':id/transactions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get client transactions' })
    @ApiResponse({
        status: 200,
        description: 'Client transactions retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: 'uuid' },
                    clientId: { type: 'string', example: 'uuid' },
                    description: {
                        type: 'string',
                        example: 'Client XYZ - Website Development',
                    },
                    amount: { type: 'number', example: 3500.0 },
                    type: {
                        type: 'string',
                        enum: ['income', 'expense'],
                        example: 'income',
                    },
                    category: { type: 'string', example: 'Sales / Services' },
                    date: { type: 'string', example: '2026-06-20' },
                    createdAt: {
                        type: 'string',
                        example: '2026-06-20T10:00:00Z',
                    },
                },
            },
        },
    })
    getClientTransactions(@Param('id') id: string) {
        return this.clientsService.getClientTransactions(id);
    }

    @Get(':id/transactions/filtered')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get filtered client transactions' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search in description',
    })
    @ApiQuery({
        name: 'businessId',
        required: false,
        description: 'Filter by business ID',
    })
    @ApiQuery({
        name: 'category',
        required: false,
        description: 'Filter by category',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Filter by status',
    })
    @ApiQuery({
        name: 'type',
        required: false,
        description: 'Filter by transaction type (income/expense)',
    })
    @ApiQuery({
        name: 'dateFrom',
        required: false,
        description: 'Filter from date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'dateTo',
        required: false,
        description: 'Filter to date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'amountMin',
        required: false,
        description: 'Minimum amount',
    })
    @ApiQuery({
        name: 'amountMax',
        required: false,
        description: 'Maximum amount',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number',
        type: 'number',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Items per page',
        type: 'number',
    })
    @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field' })
    @ApiQuery({
        name: 'sortOrder',
        required: false,
        description: 'Sort order (asc/desc)',
    })
    @ApiResponse({
        status: 200,
        description: 'Filtered transactions retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                transactions: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            clientId: { type: 'string' },
                            businessId: { type: 'string' },
                            description: { type: 'string' },
                            amount: { type: 'number' },
                            type: { type: 'string' },
                            category: { type: 'string' },
                            status: { type: 'string' },
                            transactionDate: { type: 'string' },
                            currency: { type: 'string' },
                            documentId: { type: 'string' },
                            createdAt: { type: 'string' },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
    })
    getFilteredTransactions(
        @Param('id') id: string,
        @Query('search') search?: string,
        @Query('businessId') businessId?: string,
        @Query('category') category?: string,
        @Query('status') status?: string,
        @Query('type') type?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('amountMin') amountMin?: string,
        @Query('amountMax') amountMax?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
    ) {
        return this.clientsService.getFilteredTransactions(id, {
            search,
            businessId,
            category,
            status,
            type,
            dateFrom,
            dateTo,
            amountMin: amountMin ? parseFloat(amountMin) : undefined,
            amountMax: amountMax ? parseFloat(amountMax) : undefined,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            sortBy,
            sortOrder: sortOrder as 'asc' | 'desc' | undefined,
        });
    }

    @Get(':id/transactions/statistics')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get client transaction statistics' })
    @ApiQuery({
        name: 'businessId',
        required: false,
        description: 'Filter by business ID',
    })
    @ApiQuery({
        name: 'dateFrom',
        required: false,
        description: 'Filter from date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'dateTo',
        required: false,
        description: 'Filter to date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'category',
        required: false,
        description: 'Filter by category',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Filter by status',
    })
    @ApiResponse({
        status: 200,
        description: 'Transaction statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                summary: {
                    type: 'object',
                    properties: {
                        totalIncome: { type: 'number' },
                        totalExpenses: { type: 'number' },
                        netProfit: { type: 'number' },
                        totalTransactions: { type: 'number' },
                        averageTransactionAmount: { type: 'number' },
                    },
                },
                byCategory: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            category: { type: 'string' },
                            count: { type: 'number' },
                            totalAmount: { type: 'number' },
                            averageAmount: { type: 'number' },
                        },
                    },
                },
                byStatus: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            count: { type: 'number' },
                            totalAmount: { type: 'number' },
                        },
                    },
                },
                byBusiness: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            businessId: { type: 'string' },
                            businessName: { type: 'string' },
                            count: { type: 'number' },
                            totalAmount: { type: 'number' },
                        },
                    },
                },
                monthlyTrends: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            month: { type: 'string' },
                            income: { type: 'number' },
                            expenses: { type: 'number' },
                            netProfit: { type: 'number' },
                            transactionCount: { type: 'number' },
                        },
                    },
                },
            },
        },
    })
    getTransactionStatistics(
        @Param('id') id: string,
        @Query('businessId') businessId?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('category') category?: string,
        @Query('status') status?: string,
    ) {
        return this.clientsService.getTransactionStatistics(id, {
            businessId,
            dateFrom,
            dateTo,
            category,
            status,
        });
    }

    @Get(':id/transactions/categories')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get available transaction categories for client',
    })
    @ApiResponse({
        status: 200,
        description: 'Transaction categories retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    category: { type: 'string' },
                    count: { type: 'number' },
                    totalAmount: { type: 'number' },
                },
            },
        },
    })
    getTransactionCategories(@Param('id') id: string) {
        return this.clientsService.getTransactionCategories(id);
    }

    @Get(':id/transactions/businesses')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get available businesses for client transactions',
    })
    @ApiResponse({
        status: 200,
        description: 'Client businesses retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    businessId: { type: 'string' },
                    businessName: { type: 'string' },
                    count: { type: 'number' },
                    totalAmount: { type: 'number' },
                },
            },
        },
    })
    getClientBusinesses(@Param('id') id: string) {
        return this.clientsService.getClientBusinesses(id);
    }

    @Get(':id/documents')
    @ApiOperation({ summary: 'Get client documents' })
    @ApiResponse({
        status: 200,
        description: 'Client documents retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: 'uuid' },
                    clientId: { type: 'string', example: 'uuid' },
                    name: {
                        type: 'string',
                        example: 'April 2026 Bank Statement',
                    },
                    type: { type: 'string', example: 'pdf' },
                    size: { type: 'number', example: 1024000 },
                    uploadDate: { type: 'string', example: '2026-05-15' },
                    uploadedBy: { type: 'string', example: 'Client Upload' },
                    status: { type: 'string', example: 'Processed' },
                    url: {
                        type: 'string',
                        example: 'https://example.com/document.pdf',
                    },
                },
            },
        },
    })
    getClientDocuments(@Param('id') id: string) {
        return this.clientsService.getClientDocuments(id);
    }
}
