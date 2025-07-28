/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    Req,
    Param,
    BadRequestException,
    NotFoundException,
    Request,
} from '@nestjs/common';
import { HmrcService } from './hmrc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { VatReturnDto } from './dto/vat-return.dto';

@ApiTags('HMRC')
@Controller('hmrc')
export class HmrcController {
    constructor(private readonly hmrcService: HmrcService) {}

    @Post('authorize')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get HMRC authorization URL' })
    @ApiResponse({ status: 200, description: 'Returns the authorization URL' })
    async getAuthorizationUrl(
        @Body() body: { arn?: string; utr?: string; nino?: string },
        @Req() req: any,
    ) {
        const state = Math.random().toString(36).substring(7);
        const url = await this.hmrcService.getAuthorizationUrl(state, {
            userId: req.user.userId,
            ...body,
        });
        return {
            url,
            state,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('callback')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Handle HMRC OAuth callback' })
    @ApiResponse({
        status: 200,
        description: 'Successfully exchanged code for token',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handleCallback(
        @Query('code') code: string,
        @Query('state') state: string,
        @Req() req: any,
    ) {
        const tokens = await this.hmrcService.exchangeCodeForToken(
            req.user.userId,
            code,
        );
        return tokens;
    }

    @Get('vat/obligations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get VAT obligations' })
    @ApiResponse({ status: 200, description: 'Returns VAT obligations' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getVatObligations(@Req() req: any, @Query('vrn') vrn: string) {
        return this.hmrcService.getVatObligations(req.user.id, vrn);
    }

    @Post('vat/returns')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Submit VAT return' })
    @ApiResponse({
        status: 201,
        description: 'VAT return submitted successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    submitVatReturn(
        @Req() req: any,
        @Query('vrn') vrn: string,
        @Body() returnData: VatReturnDto,
    ) {
        return this.hmrcService.submitVatReturn(req.user.id, vrn, returnData);
    }

    @Get('vat/liabilities')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get VAT liabilities' })
    @ApiResponse({ status: 200, description: 'Returns VAT liabilities' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getVatLiabilities(@Req() req: any, @Query('vrn') vrn: string) {
        return this.hmrcService.getVatLiabilities(req.user.id, vrn);
    }

    @Get('client-relationship/:utr')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get client-agency relationship by UTR from HMRC API',
    })
    @ApiParam({
        name: 'utr',
        description: 'Unique Taxpayer Reference (10-digit number)',
        example: '1234567890',
    })
    @ApiParam({
        name: 'arn',
        description: 'Agent Reference Number (ARN) - required query parameter',
        example: 'ARN123456',
        required: false,
    })
    @ApiParam({
        name: 'service',
        description:
            'Tax services to check (comma-separated). Defaults to MTD-IT',
        example: 'MTD-IT,MTD-VAT',
        required: false,
    })
    @ApiParam({
        name: 'knownFact',
        description: 'Additional known fact for verification (e.g., postcode)',
        example: 'AA11 1AA',
        required: false,
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
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getClientAgencyRelationshipByUtr(
        @Param('nino') nino: string,
        @Query('arn') arn?: string,
        @Query('service') service?: string,
        @Query('knownFact') knownFact?: string,
        @Req() req?: any,
    ) {
        // If no ARN provided, try to get it from the authenticated user
        if (!arn && req?.user?.agentReferenceNumber) {
            arn = req.user.agentReferenceNumber;
        }

        if (!arn) {
            throw new BadRequestException(
                'Agent Reference Number (ARN) is required. Provide it as a query parameter ?arn=ARN123456',
            );
        }

        // Parse service parameter (default to MTD-IT)
        const services = service ? service.split(',') : ['MTD-IT'];

        const relationship =
            await this.hmrcService.getClientAgencyRelationshipByUtr({
                agencyId: req?.user?.userId || 'anonymous',
                arn,
                nino,
                service: services,
                knownFact,
            });

        return relationship;
    }

    @Post('check-agency-relationship')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check agency relationship by UTR and agency ID' })
    @ApiResponse({
        status: 200,
        description: 'Agency relationship check completed successfully',
        schema: {
            type: 'object',
            properties: {
                hasRelationship: { type: 'boolean', example: true },
                relationshipData: {
                    type: 'object',
                    properties: {
                        service: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['MTD-IT'],
                        },
                        status: {
                            type: 'string',
                            example: 'active',
                        },
                        arn: { type: 'string', example: 'ARN123456' },
                        clientId: { type: 'string', example: '1234567890' },
                        clientIdType: { type: 'string', example: 'utr' },
                        checkedAt: {
                            type: 'string',
                            example: '2024-01-01T00:00:00Z',
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid request parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Client not found' })
    async checkAgencyRelationship(
        @Body()
        body: { arn?: string; nino: string; knownFact?: string },
        @Req() req: any,
    ) {
        const { arn, nino, knownFact } = body;

        // Validate agency ID format (should start with ARN)
        // if (!/^ARN\d+$/.test(agencyId)) {
        //     throw new BadRequestException(
        //         'Invalid agency ID format. Agency ID must start with ARN followed by numbers.',
        //     );
        // }

        try {
            const relationship = await this.hmrcService.checkAgencyRelationship(
                {
                    agencyId: req.user.userId,
                    arn,
                    nino,
                    knownFact: knownFact ?? '',
                },
            );

            return relationship;
        } catch (error) {
            // If client not found or other HMRC errors, return no relationship
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                return {
                    hasRelationship: false,
                    relationshipData: null,
                };
            }
            throw error;
        }
    }

    @Post('request-agency-relationship')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Request agency relationship by UTR and agency ID',
    })
    @ApiResponse({
        status: 201,
        description: 'Agency relationship request sent successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                invitationId: { type: 'string', example: 'inv-123456' },
                message: {
                    type: 'string',
                    example: 'Relationship invitation sent successfully',
                },
                status: { type: 'string', example: 'pending' },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid request parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Agent not authorized' })
    @ApiResponse({ status: 409, description: 'Relationship already exists' })
    async requestAgencyRelationship(
        @Body()
        body: {
            nino: string;
            knownFact: string;
            arn?: string;
            clientId: string;
        },
        @Req() req: any,
    ) {
        const { nino, knownFact, arn, clientId } = body;

        const result = await this.hmrcService.requestAgencyRelationship({
            agencyId: req.user.userId,
            clientId,
            arn,
            nino,
            knownFact,
        });

        return result;
    }

    @Get('invitations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get pending invitations' })
    @ApiResponse({
        status: 200,
        description: 'Pending invitations retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                invitations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            invitationId: { type: 'string' },
                            clientId: { type: 'string' },
                            clientIdType: { type: 'string' },
                            service: {
                                type: 'array',
                                items: { type: 'string' },
                            },
                            status: {
                                type: 'string',
                                enum: ['Pending', 'Accepted', 'Rejected'],
                            },
                            createdDate: { type: 'string' },
                        },
                    },
                },
            },
        },
    })
    async getPendingInvitations(
        @Request() req: { user: { userId: string } },
        @Query('arn') arn?: string,
    ) {
        return this.hmrcService.getPendingInvitations(req.user.userId, arn);
    }

    @Get('clients/:clientId/businesses')
    @ApiOperation({ summary: 'Get all businesses for a client' })
    @ApiParam({ name: 'clientId', description: 'Client ID (UTR or NI number)' })
    @ApiQuery({
        name: 'clientIdType',
        description: 'Type of client ID',
        enum: ['utr', 'ni'],
        required: false,
    })
    @ApiResponse({
        status: 200,
        description: 'Client businesses retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                businesses: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            businessId: { type: 'string' },
                            businessName: { type: 'string' },
                            businessType: { type: 'string' },
                            tradingName: { type: 'string' },
                            address: {
                                type: 'object',
                                properties: {
                                    line1: { type: 'string' },
                                    line2: { type: 'string' },
                                    line3: { type: 'string' },
                                    line4: { type: 'string' },
                                    postcode: { type: 'string' },
                                    countryCode: { type: 'string' },
                                },
                            },
                            accountingPeriod: {
                                type: 'object',
                                properties: {
                                    startDate: { type: 'string' },
                                    endDate: { type: 'string' },
                                },
                            },
                            accountingType: { type: 'string' },
                            commencementDate: { type: 'string' },
                            cessationDate: { type: 'string' },
                            businessDescription: { type: 'string' },
                            emailAddress: { type: 'string' },
                            websiteAddress: { type: 'string' },
                            contactDetails: {
                                type: 'object',
                                properties: {
                                    phoneNumber: { type: 'string' },
                                    mobileNumber: { type: 'string' },
                                    faxNumber: { type: 'string' },
                                },
                            },
                            bankDetails: {
                                type: 'object',
                                properties: {
                                    accountName: { type: 'string' },
                                    accountNumber: { type: 'string' },
                                    sortCode: { type: 'string' },
                                },
                            },
                            industryClassifications: {
                                type: 'object',
                                properties: {
                                    sicCode: { type: 'string' },
                                    sicDescription: { type: 'string' },
                                },
                            },
                            links: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        href: { type: 'string' },
                                        rel: { type: 'string' },
                                        method: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    async getClientBusinesses(
        @Request() req: { user: { userId: string } },
        @Param('clientId') clientId: string,
        @Query('clientIdType') clientIdType: 'ni' | 'utr' = 'utr',
        @Query('knownFact') knownFact: string,
    ) {
        return this.hmrcService.getClientBusinesses(
            req.user.userId,
            clientId,
            clientIdType,
            knownFact,
        );
    }

    @Get('clients/:clientId/businesses/:businessId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get specific business details for a client' })
    @ApiParam({ name: 'clientId', description: 'Client ID (UTR or NI number)' })
    @ApiParam({ name: 'businessId', description: 'Business ID' })
    @ApiResponse({
        status: 200,
        description: 'Business details retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                businessId: { type: 'string' },
                businessName: { type: 'string' },
                businessType: { type: 'string' },
                tradingName: { type: 'string' },
                address: {
                    type: 'object',
                    properties: {
                        line1: { type: 'string' },
                        line2: { type: 'string' },
                        line3: { type: 'string' },
                        line4: { type: 'string' },
                        postcode: { type: 'string' },
                        countryCode: { type: 'string' },
                    },
                },
                accountingPeriod: {
                    type: 'object',
                    properties: {
                        startDate: { type: 'string' },
                        endDate: { type: 'string' },
                    },
                },
                accountingType: { type: 'string' },
                commencementDate: { type: 'string' },
                cessationDate: { type: 'string' },
                businessDescription: { type: 'string' },
                emailAddress: { type: 'string' },
                websiteAddress: { type: 'string' },
                contactDetails: {
                    type: 'object',
                    properties: {
                        phoneNumber: { type: 'string' },
                        mobileNumber: { type: 'string' },
                        faxNumber: { type: 'string' },
                    },
                },
                bankDetails: {
                    type: 'object',
                    properties: {
                        accountName: { type: 'string' },
                        accountNumber: { type: 'string' },
                        sortCode: { type: 'string' },
                    },
                },
                industryClassifications: {
                    type: 'object',
                    properties: {
                        sicCode: { type: 'string' },
                        sicDescription: { type: 'string' },
                    },
                },
                links: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            href: { type: 'string' },
                            rel: { type: 'string' },
                            method: { type: 'string' },
                        },
                    },
                },
            },
        },
    })
    async getClientBusinessDetails(
        @Request() req: { user: { userId: string } },
        @Param('clientId') clientId: string,
        @Param('businessId') businessId: string,
        @Query('nino') nino: string,
    ) {
        return this.hmrcService.getClientBusinessDetails(
            req.user.userId,
            clientId,
            businessId,
            nino,
        );
    }

    @Get('clients/:clientId/businesses/:businessId/income-summary')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get business income summary' })
    @ApiParam({ name: 'clientId', description: 'Client ID' })
    @ApiParam({ name: 'businessId', description: 'Business ID' })
    @ApiQuery({ name: 'nino', description: 'National Insurance Number' })
    @ApiQuery({
        name: 'taxYear',
        description: 'Tax Year (e.g., 2024-25)',
        required: false,
    })
    @ApiResponse({
        status: 200,
        description: 'Business income summary retrieved successfully',
    })
    async getBusinessIncomeSummary(
        @Request() req: { user: { userId: string } },
        @Param('clientId') clientId: string,
        @Param('businessId') businessId: string,
        @Query('nino') nino: string,
        @Query('typeOfBusiness') typeOfBusiness: string,
        @Query('taxYear') taxYear: string = '2024-25',
    ) {
        return this.hmrcService.getBusinessIncomeSummary(
            req.user.userId,
            nino,
            typeOfBusiness,
            businessId,
            taxYear,
        );
    }

    @Get('clients/:clientId/businesses/:businessId/bsas')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Business Source Adjustable Summary (BSAS)' })
    @ApiParam({ name: 'clientId', description: 'Client ID' })
    @ApiParam({ name: 'businessId', description: 'Business ID' })
    @ApiQuery({ name: 'nino', description: 'National Insurance Number' })
    @ApiQuery({
        name: 'taxYear',
        description: 'Tax Year (e.g., 2024-25)',
        required: false,
    })
    @ApiResponse({
        status: 200,
        description: 'BSAS data retrieved successfully',
    })
    async getBusinessSourceAdjustableSummary(
        @Request() req: { user: { userId: string } },
        @Param('clientId') clientId: string,
        @Param('businessId') businessId: string,
        @Query('nino') nino: string,
        @Query('taxYear') taxYear: string = '2024-25',
    ) {
        return this.hmrcService.getBusinessSourceAdjustableSummary(
            req.user.userId,
            nino,
            businessId,
            taxYear,
        );
    }

    @Get('clients/:clientId/businesses/:businessId/obligations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get business obligations' })
    @ApiParam({ name: 'clientId', description: 'Client ID' })
    @ApiParam({ name: 'businessId', description: 'Business ID' })
    @ApiQuery({ name: 'nino', description: 'National Insurance Number' })
    @ApiQuery({
        name: 'taxYear',
        description: 'Tax Year (e.g., 2024-25)',
        required: false,
    })
    @ApiResponse({
        status: 200,
        description: 'Business obligations retrieved successfully',
    })
    async getBusinessObligations(
        @Request() req: { user: { userId: string } },
        @Param('clientId') clientId: string,
        @Param('businessId') businessId: string,
        @Query('nino') nino: string,
        @Query('taxYear') taxYear: string = '2024-25',
    ) {
        return this.hmrcService.getBusinessObligations(
            req.user.userId,
            nino,
            businessId,
            taxYear,
        );
    }

    @Get('clients/:clientId/businesses/:businessId/comprehensive')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get comprehensive business information' })
    @ApiParam({ name: 'clientId', description: 'Client ID' })
    @ApiParam({ name: 'businessId', description: 'Business ID' })
    @ApiQuery({ name: 'nino', description: 'National Insurance Number' })
    @ApiQuery({
        name: 'taxYear',
        description: 'Tax Year (e.g., 2024-25)',
        required: false,
    })
    @ApiResponse({
        status: 200,
        description:
            'Comprehensive business information retrieved successfully',
    })
    async getComprehensiveBusinessInfo(
        @Request() req: { user: { userId: string } },
        @Param('clientId') clientId: string,
        @Param('businessId') businessId: string,
        @Query('nino') nino: string,
        @Query('typeOfBusiness') typeOfBusiness: string,
        @Query('taxYear') taxYear: string = '2024-25',
    ) {
        return this.hmrcService.getComprehensiveBusinessInfo(
            req.user.userId,
            clientId,
            typeOfBusiness,
            businessId,
            nino,
            taxYear,
        );
    }

    private getUserArn(): Promise<{ agentReferenceNumber?: string } | null> {
        // This would typically query your users table to get the ARN
        // For now, return null to require ARN as parameter
        return Promise.resolve(null);
    }

    @Get('business-types')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all available business types' })
    @ApiResponse({
        status: 200,
        description: 'Business types retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                businessTypes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            code: {
                                type: 'string',
                                example: 'self-employment',
                            },
                            name: {
                                type: 'string',
                                example: 'Self-Employment',
                            },
                            description: {
                                type: 'string',
                                example: 'Self-employed business activities',
                            },
                            category: {
                                type: 'string',
                                enum: ['self-employment', 'property', 'other'],
                            },
                            isActive: { type: 'boolean', example: true },
                        },
                    },
                },
            },
        },
    })
    async getAllBusinessTypes() {
        return this.hmrcService.getAllBusinessTypes();
    }

    @Get('clients/businesses')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all clients businesses' })
    @ApiResponse({
        status: 200,
        description: 'All clients businesses retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                clients: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            clientId: { type: 'string' },
                            clientName: { type: 'string' },
                            clientType: { type: 'string' },
                            businesses: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        businessId: { type: 'string' },
                                        businessName: { type: 'string' },
                                        businessType: { type: 'string' },
                                        tradingName: { type: 'string' },
                                        address: {
                                            type: 'object',
                                            properties: {
                                                line1: { type: 'string' },
                                                line2: { type: 'string' },
                                                line3: { type: 'string' },
                                                line4: { type: 'string' },
                                                postcode: { type: 'string' },
                                                countryCode: { type: 'string' },
                                            },
                                        },
                                        accountingPeriod: {
                                            type: 'object',
                                            properties: {
                                                startDate: { type: 'string' },
                                                endDate: { type: 'string' },
                                            },
                                        },
                                        accountingType: { type: 'string' },
                                        commencementDate: { type: 'string' },
                                        cessationDate: { type: 'string' },
                                        businessDescription: { type: 'string' },
                                        emailAddress: { type: 'string' },
                                        websiteAddress: { type: 'string' },
                                        contactDetails: {
                                            type: 'object',
                                            properties: {
                                                phoneNumber: { type: 'string' },
                                                mobileNumber: {
                                                    type: 'string',
                                                },
                                                faxNumber: { type: 'string' },
                                            },
                                        },
                                        bankDetails: {
                                            type: 'object',
                                            properties: {
                                                accountName: { type: 'string' },
                                                accountNumber: {
                                                    type: 'string',
                                                },
                                                sortCode: { type: 'string' },
                                            },
                                        },
                                        industryClassifications: {
                                            type: 'object',
                                            properties: {
                                                sicCode: { type: 'string' },
                                                sicDescription: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                        links: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    href: { type: 'string' },
                                                    rel: { type: 'string' },
                                                    method: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    async getAllClientsBusinesses(
        @Request() req: { user: { userId: string } },
    ) {
        return this.hmrcService.getAllClientsBusinesses(req.user.userId);
    }

    @Get('clients/businesses/comprehensive')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get comprehensive business information for all clients',
    })
    @ApiQuery({
        name: 'taxYear',
        description: 'Tax Year (e.g., 2024-25)',
        required: false,
    })
    @ApiResponse({
        status: 200,
        description:
            'Comprehensive business information retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                clients: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            clientId: { type: 'string' },
                            clientName: { type: 'string' },
                            clientType: { type: 'string' },
                            businesses: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        businessId: { type: 'string' },
                                        businessName: { type: 'string' },
                                        businessType: { type: 'string' },
                                        businessDetails: { type: 'object' },
                                        incomeSummary: { type: 'object' },
                                        bsasData: { type: 'object' },
                                        obligations: { type: 'object' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    async getComprehensiveBusinessInfoForAllUsers(
        @Request() req: { user: { userId: string } },
        @Query('taxYear') taxYear: string = '2024-25',
    ) {
        return this.hmrcService.getComprehensiveBusinessInfoForAllUsers(
            req.user.userId,
            taxYear,
        );
    }
}
