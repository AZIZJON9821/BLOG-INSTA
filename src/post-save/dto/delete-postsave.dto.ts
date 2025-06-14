import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeletePostSaveDto {
  @ApiProperty({ example: 1, description: 'The user id' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1, description: 'The post id' })
  @IsInt()
  postId: number;
}

