import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Post } from '@prisma/client';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePostDto, image?: string) {
    const userIdNumber = Number(data.userId);

    const newPost = await this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        userId: userIdNumber,
        image: image,
      },
    });

    this.sendTelegramMessage(newPost).catch((err) =>
      console.error('Telegram xabari yuborishda xatolik:', err.message),
    );

    return newPost;
  } 

  async findAll() {
    const posts = await this.prisma.post.findMany({
      include: { user: true, likedBy: true, comments: true, savedBy: true },
    });
    const baseUrl = 'http://localhost:3000/uploads/';
    return posts.map((post) => ({
      ...post,
      imageUrl: post.image ? baseUrl + post.image : null,
    }));
  }

  async findOne(id: number, page: number = 1, pageSize: number = 10) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(
        'ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌',
      );
    }

    const post = await this.prisma.post.findUnique({
      where: { id: numericId },
      include: { 
        user: true, 
        likedBy: true, 
        comments: {
          skip: (page - 1) * pageSize,
          take: pageSize,
        },
        savedBy: true 
      },
    });

    if (!post) {
      throw new NotFoundException('Bunday ID ga ega post topilmadi 😔');
    }

    return post;
  }

  async update(id: number, data: UpdatePostDto, image?: Express.Multer.File) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(
        'ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌',
      );
    }
    try {
      return await this.prisma.post.update({
        where: {
          id,
        },
        data: {
          ...data,
          image: image ? image.filename : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Bunday ID ga ega post topilmadi 😔');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(
        'ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌',
      );
    }
    try {
      return await this.prisma.post.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Bunday ID ga ega post topilmadi 😔');
      }
      throw error;
    }
  }

 
private async sendTelegramMessage(post: Post) {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id: post.userId },
    });
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `🆕 <b>Yangi post yaratildi</b>:\n\n🆔 <b>PostID:</b> ${post.id}\n📝 <b>Title:</b> ${post.title}\n📝 <b>Content:</b> ${post.content}\n📝 <b>Username:</b> ${user?.name}\n📝 <b>Useremail:</b> ${user?.email}\n👤 <b>UserID:</b> ${post.userId}\n👇<b>like va comment👇</b>\n<b>@Gojo_sakuro_bot</b>`;

    if (post.image) {
      const filePath = path.resolve('uploads', post.image);

      if (!fs.existsSync(filePath)) {
        console.warn('Rasm topilmadi:', filePath);
        return;
      }

      const fileSize = fs.statSync(filePath).size;
      const MAX_SIZE = 100 * 1024 * 1024; 

      if (fileSize > MAX_SIZE) {
        throw new BadRequestException('Rasm hajmi 10MB dan oshmasligi kerak ❌');
      }

      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('caption', message);
      form.append('parse_mode', 'HTML');
      form.append('photo', fs.createReadStream(filePath)); 

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

      const res = await fetch(telegramUrl, {
        method: 'POST',
        body: form as any,
      });

      console.log('✅ Telegramga photo yuborildi:');
    } else {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const res = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message + `\n📎 <b>Rasm fayli:</b> yo‘q`,
          parse_mode: 'HTML',
        }),
      });

      const result = await res.text();
      console.log('✅ Telegramga text yuborildi:', result);
    }
  } catch (err) {
    console.error('❌ Telegramga xabar yuborishda xatolik:', err.message);
  }
}}