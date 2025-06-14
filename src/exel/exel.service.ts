import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportPostsToExcel(res: Response) {
    const posts = await this.prisma.post.findMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Posts');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Content', key: 'content', width: 50 },
      { header: 'Image', key: 'image', width: 50 },
      { header: 'User ID', key: 'userId', width: 20 },

    ];

    posts.forEach((post) => {
      worksheet.addRow({
        id: post.id,
        title: post.title,
        content : post.content,
        image: post.image,
        userId: post.userId,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Hisobot.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportUsersToExcel(res: Response) {
    const users = await this.prisma.user.findMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Image', key: 'image', width: 20 },
      
    ];

    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
}
