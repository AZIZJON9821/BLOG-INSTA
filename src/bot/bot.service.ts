import { Injectable } from '@nestjs/common';
import { Context, Start, Update, Command, Hears } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

interface SessionData {
  email?: string;
  password?: string;
  postId?: number;
  userIdForAction?: number;
}

@Update()
@Injectable()
export class BotService {
  private userStates = new Map<number, string>();
  private sessions = new Map<number, SessionData>();
  private prisma = new PrismaClient();

  constructor(@InjectBot() private readonly bot: Telegraf<any>) {
    this.setBotCommands();
  }

  private async setBotCommands() {
    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Botni boshlash 🚀' },
      { command: 'like', description: 'Postga like bosish 👍' },
      { command: 'comment', description: 'Postga comment qoldirish 💬' },
    ]);
  }

  @Start()
  @Command('start')
  async onStart(@Context() ctx: any) {
    await ctx.reply(
      '👋 Xush kelibsiz! Quyidagi komandalar orqali foydalaning:',
      Markup.keyboard([
        ['🔐 Kirish'],
      ]).resize(),
    );
  }

  @Command('like')
  async onLike(@Context() ctx: any) {
    const userId = ctx.from.id;
    this.userStates.set(userId, 'like_post_id');
    await ctx.reply('🆔 Post ID ni kiriting (Like uchun):');
  }

  @Command('comment')
  async onComment(@Context() ctx: any) {
    const userId = ctx.from.id;
    this.userStates.set(userId, 'comment_post_id');
    await ctx.reply('🆔 Post ID ni kiriting (Komment uchun):');
  }

  @Hears('🔐 Kirish')
  async onLogin(@Context() ctx: any) {
    const userId = ctx.from.id;
    this.userStates.set(userId, 'login_email');
    this.sessions.set(userId, {});
    await ctx.reply('📧 Iltimos, emailingizni kiriting:');
  }

  @Hears(/.*/)
  async onText(@Context() ctx: any) {
    const userId = ctx.from.id;
    const text = ctx.message.text.trim();
    const state = this.userStates.get(userId);
    const session = this.sessions.get(userId) || {};

    switch (state) {
      case 'login_email':
        session.email = text;
        this.userStates.set(userId, 'login_password');
        await ctx.reply('🔑 Parolni kiriting:');
        break;

      case 'login_password':
        session.password = text;
        try {
          const user = await this.prisma.user.findUnique({
            where: { email: session.email },
          });

          if (!user) {
            await ctx.reply('❌ Email yoki parol noto‘g‘ri.');
            break;
          }

          const isPasswordValid = await bcrypt.compare(session.password!, user.password);
          if (isPasswordValid) {
            await ctx.reply(
              `✅ Tizimga kirdingiz!\n👤 Ism: ${user.name}\n🆔 UserID: ${user.id}`,
              Markup.keyboard([[ '👍 Like', '💬 Comment']]).resize(),
            );
          } else {
            await ctx.reply('❌ Email yoki parol noto‘g‘ri.');
          }
        } catch (e) {
          console.error('Login error:', e);
          await ctx.reply('⚠️ Kirishda xatolik yuz berdi.');
        }
        this.userStates.delete(userId);
        break;

      case 'like_post_id':
        session.postId = Number(text);
        this.userStates.set(userId, 'like_user_id');
        await ctx.reply('👤 User ID ni kiriting:');
        break;

      case 'like_user_id':
        try {
          await this.prisma.likedPost.create({
            data: {
              postId: session.postId!,
              userId: Number(text),
            },
          });
          await ctx.reply('🎉 Like muvaffaqiyatli qo‘shildi!\n /start , /like , /comment');
        } catch (e) {
          console.error('Like error:', e);
          await ctx.reply('⚠️ Xatolik yuz berdi yoki oldin like bosilgan!\n /start , /like , /comment');
        }
        this.userStates.delete(userId);
        break;

      case 'comment_post_id':
        session.postId = Number(text);
        this.userStates.set(userId, 'comment_user_id');
        await ctx.reply('👤 User ID ni kiriting:');
        break;

      case 'comment_user_id':
        session.userIdForAction = Number(text);
        this.userStates.set(userId, 'comment_content');
        await ctx.reply('📝 Komment matnini yozing:');
        break;

      case 'comment_content':
        try {
          await this.prisma.comment.create({
            data: {
              postId: session.postId!,
              userId: session.userIdForAction!,
              content: text,
            },
          });
          await ctx.reply('✅ Kommentariya muvaffaqiyatli qo‘shildi!\n /start , /like , /comment');
        } catch (e) {
          console.error('Comment error:', e);
          await ctx.reply('⚠️ Komment saqlashda xatolik yuz berdi!\n /start , /like , /comment');
        }
        this.userStates.delete(userId);
        break;

      default:
        await ctx.reply('ℹ️ Iltimos, quyidagilardan birini tanlang: /start, /like, /comment yoki 🔐 Kirish');
    }

    this.sessions.set(userId, session);
  }
}
