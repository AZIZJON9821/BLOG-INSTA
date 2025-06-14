import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: 'az@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
