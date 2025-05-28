import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts 📝')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post ✨'})
  @ApiResponse({ status: 201, description: 'The post has been successfully created 🎉' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts 📃' })
  @ApiResponse({ status: 200, description: 'The list of posts 📜' })
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by id 🔍' })
  @ApiResponse({ status: 200, description: 'The post 📄' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post by id ✏️' })
  @ApiResponse({ status: 200, description: 'The post has been successfully updated 🔄' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by id 🗑️' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted ❌' })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}

