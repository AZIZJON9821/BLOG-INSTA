import { Module } from '@nestjs/common';
import { LikedPostService } from './liked-posts.service';
import { LikedPostController } from './liked-posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [LikedPostController],
  providers: [LikedPostService, PrismaService],
  exports: [LikedPostService],
})
export class LikedPostModule {}
