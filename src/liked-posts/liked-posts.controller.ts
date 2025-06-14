import { Controller, Get, Post, Body, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LikedPostService } from './liked-posts.service';
import { CreateLikedPostDto } from './dto/create-liked-post.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator';
import { UserRoles } from 'src/common/enums';

@ApiBearerAuth()
@ApiTags('Liked Posts ❤️')
@UseGuards(AuthGuard, RolesGuard)
@Controller('liked-posts')
export class LikedPostController {
  constructor(private readonly likedPostService: LikedPostService) {}

  
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Post()
  @ApiOperation({ summary: 'Create a new liked post 📌' })
  @ApiResponse({ status: 201, description: 'The liked post has been successfully created. 🎉' })
  @ApiResponse({ status: 400, description: 'Bad Request. 🚫' })
  create(@Body() createDto: CreateLikedPostDto) {
    return this.likedPostService.create(createDto);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get()
  @ApiOperation({ summary: 'Find all liked posts 🔍' })
  @ApiResponse({ status: 200, description: 'Return all liked posts. 📋' })
  findAll() {
    return this.likedPostService.findAll();
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Find a liked post by ID 🔍' })
  @ApiResponse({ status: 200, description: 'Return the liked post. 📋' })
  @ApiResponse({ status: 404, description: 'Liked post not found. ❌' })
  findOne(@Param('id') id: string) {
    return this.likedPostService.findOne(+id);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove a liked post by ID ❌' })
  @ApiResponse({ status: 200, description: 'The liked post has been successfully removed. 🗑️' })
  @ApiResponse({ status: 404, description: 'Liked post not found. ❌' })
  remove(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
    }
    return this.likedPostService.remove(+id);
  }
}

