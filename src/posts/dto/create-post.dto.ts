import { IsString, IsNumber, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ description: 'Title of the post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content of the post' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID of the user who created the post' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({
      required: false,
      type: 'string',
      format: 'binary',
      description: 'Post rasmi (image)',
    })
    @IsOptional()
    image?: any;
  

}


