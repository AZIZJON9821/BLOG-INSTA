import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { PostSaveService } from './post-save.service';
import { PostSaveController } from './post-save.controller';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [PostSaveController],
  providers: [PostSaveService, PrismaService],
  exports: [PostSaveService],
})
export class PostSaveModule {}
