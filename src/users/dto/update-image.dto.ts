import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {

@ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'Foydalanuvchining rasmi (image)',
  })
  @IsOptional()
  image?: any;

}

