import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ShippingInfoDto {
    @ApiProperty({ example: 'Juan Perez' })
    @IsString()
    fullName: string;

    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Cra 15 # 32-11' })
    @IsString()
    address: string;

    @ApiProperty({ example: 'Bogotá' })
    @IsString()
    city: string;

    @ApiProperty({ example: '110111' })
    @IsString()
    @Length(4, 10)
    postalCode: string;

    @ApiProperty({ example: 'CO' })
    @IsString()
    country: string;
}
