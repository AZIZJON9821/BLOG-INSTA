import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PostController } from './posts.controller';

@Module({
  imports: [PrismaModule],  
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
