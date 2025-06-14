import { Controller, Post, Body, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { PostSaveService } from './post-save.service';
import { CreatePostSaveDto } from './dto/create-post-save.dto';
import { DeletePostSaveDto } from './dto/delete-postsave.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from '../common/guards';
import { UserRoles } from '../common/enums';
import { Roles } from '../common/decorator';

@ApiBearerAuth()
@ApiTags('Post-save 💾')
@UseGuards(AuthGuard, RolesGuard)
@Controller('post-save')
export class PostSaveController {
  constructor(private readonly postSaveService: PostSaveService) {}

  @Post()
  @Roles(UserRoles.USER)
  @ApiOperation({ summary: 'Create post-save 💾', description: 'Creates a new post-save' })
  @ApiResponse({ status: 201, description: 'Post-save created 🎉' })
  create(@Body() createPostSaveDto: CreatePostSaveDto) {
    return this.postSaveService.create(createPostSaveDto);
  }

  @Get()
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  @ApiOperation({ summary: 'Get all post-saves for user 👥', description: 'Get all post-saves for user' })
  @ApiResponse({ status: 200, description: 'Post-saves found 👍' })
  findAllByUser(@Query('userId') userId: string) {
    return this.postSaveService.findAllByUser(Number(userId));
  }

  @Delete()
  @Roles(UserRoles.USER)
  @ApiOperation({ summary: 'Delete post-save 🗑️', description: 'Deletes a post-save' })
  @ApiResponse({ status: 200, description: 'Post-save deleted 👋' })
  remove(@Body() deletePostSaveDto: DeletePostSaveDto) {
    return this.postSaveService.remove(deletePostSaveDto);
  }
}

