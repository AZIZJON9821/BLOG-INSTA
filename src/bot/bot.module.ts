import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN || '8062643122:AAGHOUnlkpm5dVMb7cmsJENhylMLixjcnkc',
    }),
  ],
  providers: [BotService, PrismaService,],
})
export class BotModule {}

