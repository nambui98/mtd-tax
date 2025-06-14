import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class VatReturnDto {
    @ApiProperty({ description: 'Period key for the VAT return' })
    @IsString()
    periodKey: string;

    @ApiProperty({ description: 'VAT due on sales and other outputs' })
    @IsNumber()
    vatDueSales: number;

    @ApiProperty({
        description: 'VAT due on acquisitions from other EC Member States',
    })
    @IsNumber()
    vatDueAcquisitions: number;

    @ApiProperty({ description: 'Total VAT due' })
    @IsNumber()
    totalVatDue: number;

    @ApiProperty({ description: 'VAT reclaimed on purchases and other inputs' })
    @IsNumber()
    vatReclaimedCurrPeriod: number;

    @ApiProperty({ description: 'Net VAT due' })
    @IsNumber()
    netVatDue: number;

    @ApiProperty({
        description:
            'Total value of sales and all other outputs excluding any VAT',
    })
    @IsNumber()
    totalValueSalesExVAT: number;

    @ApiProperty({
        description:
            'Total value of purchases and all other inputs excluding any VAT',
    })
    @IsNumber()
    totalValuePurchasesExVAT: number;

    @ApiProperty({
        description:
            'Total value of all supplies of goods and related costs, excluding any VAT, to other EC member states',
    })
    @IsNumber()
    totalValueGoodsSuppliedExVAT: number;

    @ApiProperty({
        description:
            'Total value of acquisitions of goods and related costs, excluding any VAT, from other EC member states',
    })
    @IsNumber()
    totalAcquisitionsExVAT: number;

    @ApiProperty({ description: 'Final submission flag' })
    @IsOptional()
    @IsString()
    finalised?: boolean;
}
