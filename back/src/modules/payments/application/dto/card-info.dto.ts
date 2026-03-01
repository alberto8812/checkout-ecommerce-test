import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class CardInfoDto {
    @ApiProperty({ example: '4242 4242 4242 4242' })
    @IsString()
    @Matches(/^[0-9\s]{12,23}$/)
    number: string;

    @ApiProperty({ example: 'JUAN PEREZ' })
    @IsString()
    cardHolder: string;

    @ApiProperty({ example: '08/29', description: 'Formato MM/AA' })
    @IsString()
    @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    expiry: string;

    @ApiProperty({ example: '123' })
    @IsString()
    @Matches(/^\d{3,4}$/)
    cvv: string;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(36)
    installments?: number;
}
