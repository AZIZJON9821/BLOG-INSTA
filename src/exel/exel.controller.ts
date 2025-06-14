import { Controller, Get, Res } from '@nestjs/common';
import { ExportService } from './exel.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator';
import { UserRoles } from 'src/common/enums';

@ApiBearerAuth()
@ApiTags ('Exel 📃')
@UseGuards(AuthGuard, RolesGuard)
@Controller('excels')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Export posts to Excel 📊' })
  @ApiResponse({ status: 200, description: 'Posts exported successfully 📊' })
  @ApiResponse({ status: 500, description: 'Internal server error 😞' })
  @Get('posts')
  exportPosts(@Res() res: Response) {
    return this.exportService.exportPostsToExcel(res);
  }
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Export users to Excel 👥' })
  @ApiResponse({ status: 200, description: 'Users exported successfully 👥' })
  @ApiResponse({ status: 500, description: 'Internal server error 😞' })
  @Get('users')
  exportUsers(@Res() res: Response) {
    return this.exportService.exportUsersToExcel(res);
  }
}

