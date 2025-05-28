import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';
export class CreateLikedPostDto {
  @ApiProperty({ description: 'ID of the user who liked the post' })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({ description: 'ID of the post that was liked' })
  @IsNumber()
  @IsPositive()
  postId: number;
}
