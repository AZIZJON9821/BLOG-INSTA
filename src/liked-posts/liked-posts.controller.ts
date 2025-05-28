import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { LikedPostService } from './liked-posts.service';
import { CreateLikedPostDto } from './dto/create-liked-post.dto';

@Controller('liked-posts')
export class LikedPostController {
  constructor(private readonly likedPostService: LikedPostService) {}

  @Post()
  create(@Body() createDto: CreateLikedPostDto) {
    return this.likedPostService.create(createDto);
  }

  @Get()
  findAll() {
    return this.likedPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likedPostService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likedPostService.remove(+id);
  }
}
