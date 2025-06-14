import { Module } from '@nestjs/common';
import { ExportService } from './exel.service';
import { ExportController } from './exel.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:  [PrismaModule,AuthModule],
  controllers: [ExportController],
  providers: [ExportService, PrismaService],
})
export class ExelModule {}
