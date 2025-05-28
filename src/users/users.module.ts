import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:  [PrismaModule], // PrismaModule import qilinmaydi, chunki PrismaService to'g'ridan-to'g'ri import qilinadi
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService], // Agar boshqa modullarda ham foydalanmoqchi bo'lsangiz, bu qatorda bo'lishi kerak
})
export class UserModule {}
