import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Protected, Roles } from '../common/decorator';
import { AuthGuard, RolesGuard } from '../common/guards';
import { UserRoles } from '../users/enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Report 📝')
@UseGuards(AuthGuard, RolesGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Create a new report 📝' })
  @ApiResponse({ status: 201, description: 'Report created successfully 🎉' })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }
  @Get()
  @Roles( UserRoles.ADMIN)
  @ApiOperation({ summary: 'Get all reports 📝' })
  @ApiResponse({ status: 200, description: 'Reports found successfully 👍' })
  findAll() {
    return this.reportService.findAll();
  }
  @Get(':id')
  @Roles ( UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Get a report by id 📝' })
  @ApiResponse({ status: 200, description: 'Report found successfully 👍' })
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }
  @Patch(':id')
  @Roles ( UserRoles.ADMIN)
  @ApiOperation({ summary: 'Update a report by id 📝' })
  @ApiResponse({ status: 200, description: 'Report updated successfully 👍' })
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  @Roles ( UserRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a report by id 🚫' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully 👍' })
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}

