import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'az',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'az@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'az123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'USER',
  })
  @IsString()
  role: string; 



}
