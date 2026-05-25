import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token!: string;
}

export class AuthTokensResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  access_token!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refresh_token!: string;

  @ApiProperty({ example: 900 })
  @IsNumber()
  expires_in!: number;
}
