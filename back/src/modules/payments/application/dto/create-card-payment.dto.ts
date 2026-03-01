import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { CardInfoDto } from './card-info.dto';
import { ShippingInfoDto } from './shipping-info.dto';

export class CreateCardPaymentDto {
    @ApiProperty({ example: 'prod_12345' })
    @IsString()
    productId: string;

    @ApiProperty({ example: 1, default: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity = 1;

    @ApiProperty({ type: () => CardInfoDto })
    @ValidateNested()
    @Type(() => CardInfoDto)
    card: CardInfoDto;

    @ApiProperty({ type: () => ShippingInfoDto })
    @ValidateNested()
    @Type(() => ShippingInfoDto)
    shipping: ShippingInfoDto;
}
