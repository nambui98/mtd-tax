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
} from '@nestjs/common';
import { HmrcService } from './hmrc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
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
        @Param('utr') utr: string,
        @Query('arn') arn?: string,
        @Query('service') service?: string,
        @Query('knownFact') knownFact?: string,
        @Req() req?: any,
    ) {
        // Validate UTR format (should be 10 digits)
        if (!/^\d{10}$/.test(utr)) {
            throw new BadRequestException(
                'Invalid UTR format. UTR must be exactly 10 digits.',
            );
        }
        console.log(req.user);

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
            await this.hmrcService.getClientAgencyRelationshipByUtr(
                req?.user?.userId || 'anonymous',
                arn,
                utr,
                services,
                knownFact,
            );

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
        @Body() body: { utr: string; agencyId: string },
        @Req() req: any,
    ) {
        const { utr, agencyId } = body;

        // Validate UTR format (should be 10 digits)
        if (!/^\d{10}$/.test(utr)) {
            throw new BadRequestException(
                'Invalid UTR format. UTR must be exactly 10 digits.',
            );
        }

        // Validate agency ID format (should start with ARN)
        // if (!/^ARN\d+$/.test(agencyId)) {
        //     throw new BadRequestException(
        //         'Invalid agency ID format. Agency ID must start with ARN followed by numbers.',
        //     );
        // }

        try {
            const relationship = await this.hmrcService.checkAgencyRelationship(
                req.user.userId,
                agencyId,
                utr,
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
        @Body() body: { utr: string; agencyId: string; knownFact?: string },
        @Req() req: any,
    ) {
        const { utr, agencyId, knownFact } = body;
        console.log(req.user);
        // Validate UTR format (should be 10 digits)
        if (!/^\d{10}$/.test(utr)) {
            throw new BadRequestException(
                'Invalid UTR format. UTR must be exactly 10 digits.',
            );
        }

        // Validate agency ID format (should start with ARN)
        // if (!/^ARN\d+$/.test(agencyId)) {
        //     throw new BadRequestException(
        //         'Invalid agency ID format. Agency ID must start with ARN followed by numbers.',
        //     );
        // }
        console.log(req.user);

        const result = await this.hmrcService.requestAgencyRelationship(
            req.user.userId,
            agencyId,
            utr,
            knownFact,
        );

        return result;
    }

    @Get('pending-invitations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get pending relationship invitations' })
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
                            invitationId: {
                                type: 'string',
                                example: 'inv-123456',
                            },
                            clientId: { type: 'string', example: '1234567890' },
                            clientIdType: { type: 'string', example: 'utr' },
                            service: {
                                type: 'array',
                                items: { type: 'string' },
                                example: ['MTD-IT'],
                            },
                            status: { type: 'string', example: 'pending' },
                            createdDate: {
                                type: 'string',
                                example: '2024-01-01T00:00:00Z',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getPendingInvitations(
        @Query('agencyId') agencyId: string,
        @Req() req: any,
    ) {
        // Validate agency ID format (should start with ARN)
        // if (!/^ARN\d+$/.test(agencyId)) {
        //     throw new BadRequestException(
        //         'Invalid agency ID format. Agency ID must start with ARN followed by numbers.',
        //     );
        // }

        const result = await this.hmrcService.getPendingInvitations(
            req.user.userId,
            agencyId,
        );

        return result;
    }

    private getUserArn(): Promise<{ agentReferenceNumber?: string } | null> {
        // This would typically query your users table to get the ARN
        // For now, return null to require ARN as parameter
        return Promise.resolve(null);
    }
}
