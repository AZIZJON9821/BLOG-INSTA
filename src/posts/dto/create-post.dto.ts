import { IsString, IsNumber, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Title of the post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content of the post' })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ description: 'ID of the author of the post' })
  @IsNumber()
  @IsPositive()
  authorId: number;
}

