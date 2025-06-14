import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService,PrismaService],
  exports: [CommentsService]
})
export class CommentsModule {}
