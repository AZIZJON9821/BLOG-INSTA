import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LikedPostService } from './liked-posts.service';
import { CreateLikedPostDto } from './dto/create-liked-post.dto';

@ApiTags('Liked Posts ❤️')
@Controller('liked-posts')
export class LikedPostController {
  constructor(private readonly likedPostService: LikedPostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new liked post 📌' })
  @ApiResponse({ status: 201, description: 'The liked post has been successfully created. 🎉' })
  @ApiResponse({ status: 400, description: 'Bad Request. 🚫' })
  create(@Body() createDto: CreateLikedPostDto) {
    return this.likedPostService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all liked posts 🔍' })
  @ApiResponse({ status: 200, description: 'Return all liked posts. 📋' })
  findAll() {
    return this.likedPostService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a liked post by ID 🔍' })
  @ApiResponse({ status: 200, description: 'Return the liked post. 📋' })
  @ApiResponse({ status: 404, description: 'Liked post not found. ❌' })
  findOne(@Param('id') id: string) {
    return this.likedPostService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a liked post by ID ❌' })
  @ApiResponse({ status: 200, description: 'The liked post has been successfully removed. 🗑️' })
  @ApiResponse({ status: 404, description: 'Liked post not found. ❌' })
  remove(@Param('id') id: string) {
    return this.likedPostService.remove(+id);
  }
}

