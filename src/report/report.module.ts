import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [ReportController],
  providers: [ReportService, PrismaService],
  exports: [ReportService],
})
export class ReportModule {}
