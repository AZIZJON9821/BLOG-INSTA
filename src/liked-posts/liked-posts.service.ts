import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikedPostDto } from './dto/create-liked-post.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class LikedPostService {
  constructor(private readonly prisma: PrismaService) {} 

  create(data: CreateLikedPostDto) {
    return this.prisma.likedPost.create({ data });
  }

  findAll() {
    return this.prisma.likedPost.findMany({
      include: { user: true, post: true },
    });
  }

  async findOne(id: number) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
    }
    const likedPost = await this.prisma.likedPost.findUnique({ where: { id: numericId }, include: { user: true, post: true } });
    if (!likedPost) {
      throw new NotFoundException('Bunday ID ga ega like topilmadi 😔');
    }
    return likedPost;
  }

async remove(id: number) {
  try {
    return await this.prisma.likedPost.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Bunday ID ga ega like topilmadi 😔');
    }
    throw error; 
  }
}
}
