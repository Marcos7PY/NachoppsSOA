import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  // Opcional: el flujo normal usa la cookie httpOnly `refresh_token`. El body es
  // un fallback (p. ej. clientes no-navegador). Plan 1.4.
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  refresh_token?: string;
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
