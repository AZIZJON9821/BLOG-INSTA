import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PostController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule, AuthModule],  
  providers: [PostService,PrismaService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
