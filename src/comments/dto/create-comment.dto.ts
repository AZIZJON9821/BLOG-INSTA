import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'The post id' })
  @IsNumber()
  @IsPositive()
  postId: number;

  @ApiProperty({ example: 1, description: 'The user id' })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({ example: 'This is a comment', description: 'The comment content' })
  @IsString()
  @MinLength(1)
  content: string;
}

