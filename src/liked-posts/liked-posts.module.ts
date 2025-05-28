import { Module } from '@nestjs/common';
import { LikedPostService } from './liked-posts.service';
import { LikedPostController } from './liked-posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LikedPostController],
  providers: [LikedPostService],
  exports: [LikedPostService], // Agar boshqa modullarda ham foydalanmoqchi bo'lsangiz, bu qatorda bo'lishi kerak
})
export class LikedPostModule {}
