import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
}

