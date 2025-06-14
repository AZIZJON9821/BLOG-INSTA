import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';



@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  create(createReportDto: CreateReportDto) {
    return this.prisma.report.create({
      data: createReportDto,
    });
  }

  findAll() {
    return this.prisma.report.findMany({
      include: {
        user: true,
        post: true,
      },
    });
  }

  async findOne(id: number) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
    }

    const report = await this.prisma.report.findUnique({
      where: { id: numericId },
      include: { user: true, post: true },
    });

    if (!report) {
      throw new NotFoundException('Bunday ID ga ega report topilmadi 😔');
    }
    return report;
  }
  
  async update(id: number, updateReportDto: UpdateReportDto) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
    }
    try {
      return await this.prisma.report.update({
        where: {
          id,
        },
        data: updateReportDto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Bunday ID ga ega post topilmadi  add😔');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
    }
    try {
      await this.prisma.report.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Bunday ID ga ega post topilmadi 😔');
      }
      throw error;
    }
  }
}