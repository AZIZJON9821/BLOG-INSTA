import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService,    private readonly jwtService: JwtService,
  ) {} 

  async create(payload: CreateUserDto, image?: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ConflictException('Email mavjud emas yoki royhatdan o`tgan ❗');
    }
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: passwordHash,
        role: payload.role,
        image: image ?? null,
      },
    });
    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      data:user
    };
  }
  findAll() {
    return this.prisma.user.findMany({
      include: { posts: true, likedPosts: true , comments: true, savedPosts:true},
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { posts: true, likedPosts: true, comments: true,savedPosts:true },
    });
  }


  async updateImage(id: number, data: UpdateImageDto, image: string) {
    try{return await this.prisma.user.update({
      where: { id },
      data: {
        image,
      },
    });
  }
  catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Bunday ID ga ega post topilmadi  add😔');
    }
    throw error;
  }
}

  async update(id: number, data: UpdateUserDto, image?: string) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          image : image
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Bunday ID ga ega post topilmadi  add😔');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.likedPost.deleteMany({ where: { userId: id } });
      await this.prisma.post.deleteMany({ where: { userId: id } });
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Bunday ID ga ega comment topilmadi 😔');
      }
      throw error;
    }
  }


}
