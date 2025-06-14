import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostSaveDto } from './dto/create-post-save.dto';
import { DeletePostSaveDto } from './dto/delete-postsave.dto';

@Injectable()
export class PostSaveService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostSaveDto) {
    try {
      return await this.prisma.postSave.create({
        data: {
          userId: dto.userId,
          postId: dto.postId,


        },
      });
    } catch (error) {
      throw new Error('Post allaqachon saqlangan bo‘lishi mumkin.');
    }
  }

  async findAllByUser(userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID kiritilishi kerak');
    }

    return this.prisma.postSave.findMany({
      where: { userId },
      include: {
        post: true,
      },
    });
  }

  async remove(dto: DeletePostSaveDto) {
    const { postId, userId } = dto;

    if (!postId || !userId) {
      throw new BadRequestException('Post va user ID larini kiritish shart');
    }

    try {
      return await this.prisma.postSave.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Bunday ID ga ega post allaqachon o‘chirilgan');
      }
      throw error;
    }
  }
}
