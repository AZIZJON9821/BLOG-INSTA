import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'secret',
    description: 'The password of the user',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

@ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'Foydalanuvchining rasmi (image)',
  })
  @IsOptional()
  image?: any;

}

