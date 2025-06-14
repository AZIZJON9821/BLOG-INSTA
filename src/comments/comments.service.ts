import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: createCommentDto,
    });
  }

  findAll() {
    return this.prisma.comment.findMany();
  }

  async findOne(id: number) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
      }
      const comment = await this.prisma.comment.findUnique({
        where: {
          id: numericId,
        },
      });
      if (!comment) {
        throw new NotFoundException('Bunday ID ga ega comment topilmadi 😔');
      }
      return comment;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Bunday ID ga ega comment topilmadi 😔');
      }
      throw error;
    }
  }

async update(id: number, updateCommentDto: UpdateCommentDto) {
  try {
    return await this.prisma.comment.update({
      where: {
        id,
      },
      data: updateCommentDto,
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Bunday ID ga ega comment topilmadi 😔');
    }
    throw error; 
  }
}

async remove(id: number) {
  try {
    return await this.prisma.comment.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Bunday ID ga ega comment topilmadi 😔');
    }
    throw error; 
  }
}
}

