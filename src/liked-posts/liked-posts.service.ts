import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikedPostDto } from './dto/create-liked-post.dto';

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

  findOne(id: number) {
    return this.prisma.likedPost.findUnique({ where: { id }, include: { user: true, post: true } });
  }

  remove(id: number) {
    return this.prisma.likedPost.delete({ where: { id } });
  }
}
