import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class WompiSignatureDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    properties: string[];

    @ApiProperty()
    @IsString()
    checksum: string;
}

class WompiTransactionDataDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    status: string;

    @ApiProperty()
    @IsString()
    reference: string;

    @ApiProperty()
    @IsInt()
    amount_in_cents: number;

    @ApiProperty()
    @IsString()
    currency: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    payment_method_type?: string;
}

class WompiDataWrapperDto {
    @ApiProperty({ type: () => WompiTransactionDataDto })
    @ValidateNested()
    @Type(() => WompiTransactionDataDto)
    transaction: WompiTransactionDataDto;
}

export class WompiWebhookDto {
    @ApiProperty()
    @IsString()
    event: string;

    @ApiProperty({ type: () => WompiDataWrapperDto })
    @IsObject()
    @ValidateNested()
    @Type(() => WompiDataWrapperDto)
    data: WompiDataWrapperDto;

    @ApiProperty({ type: () => WompiSignatureDto })
    @ValidateNested()
    @Type(() => WompiSignatureDto)
    signature: WompiSignatureDto;

    @ApiProperty({ name: 'sent_at' })
    @IsString()
    sent_at: string;
}
