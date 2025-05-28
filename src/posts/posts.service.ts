import { LikedPost } from './../../generated/prisma/index.d';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {} 

 create(data: CreatePostDto) {
  return this.prisma.post.create({
    data: {
      title: data.title,
      userId: data.userId,
    },
  });
}


  findAll() {
    return this.prisma.post.findMany({ include: { user: true, likedBy: true } });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id }, include: { user: true, likedBy: true } });
  }

  update(id: number, data: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
