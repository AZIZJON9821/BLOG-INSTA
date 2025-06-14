import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { UserRoles } from '../../common/enums';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'aziz',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'aziz@gmail.com',
  })
  @IsEmail({}, { message: 'Email notogri formatda kiritilgan' })
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
    enum: UserRoles,
    default: UserRoles.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles;
  
  @ApiProperty({
      required: false,
      type: 'string',
      format: 'binary',
      description: 'Foydalanuvchining rasmi (image)',
    })
    @IsOptional()
    image?: any;
  
  // image maydoni validator va class-transformer uchun yo'q bo'ladi
}


