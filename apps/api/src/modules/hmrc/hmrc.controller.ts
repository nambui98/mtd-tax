import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { HmrcService } from './hmrc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { VatReturnDto } from './dto/vat-return.dto';

@ApiTags('HMRC')
@Controller('hmrc')
export class HmrcController {
    constructor(private readonly hmrcService: HmrcService) {}

    @Get('authorize')
    @ApiOperation({ summary: 'Get HMRC authorization URL' })
    @ApiResponse({ status: 200, description: 'Returns the authorization URL' })
    async getAuthorizationUrl(@Query('state') state: string) {
        return {
            url: await this.hmrcService.getAuthorizationUrl(state),
        };
    }

    @Get('callback')
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
            req.user.id,
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
    async getVatObligations(@Req() req: any, @Query('vrn') vrn: string) {
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
    async submitVatReturn(
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
    async getVatLiabilities(@Req() req: any, @Query('vrn') vrn: string) {
        return this.hmrcService.getVatLiabilities(req.user.id, vrn);
    }
}
