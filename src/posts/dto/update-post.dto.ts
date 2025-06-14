import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Post rasmi (ixtiyoriy)',
  })
  @IsOptional()
  image?: any; 

}

