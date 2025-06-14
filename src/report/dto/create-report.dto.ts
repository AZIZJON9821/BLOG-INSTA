import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    example: 1,
    description: 'The user id',
  })
  @IsInt()
  userId: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'The post id',
  })
  @IsOptional()
  @IsInt()
  postId?: number;

  @ApiProperty({
    example: 'This is a bad post',
    description: 'The reason of the report',
  })
  @IsString()
  reason: string;
}

