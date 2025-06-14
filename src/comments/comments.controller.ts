import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator';
import { UserRoles } from 'src/common/enums';

@ApiBearerAuth()
@ApiTags('Comments 💬')
@UseGuards(AuthGuard, RolesGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Post()
  @ApiOperation({ summary: 'Create a new comment 📝' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created ✨.' })
  @ApiResponse({ status: 400, description: 'Invalid data 🚫.' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get()
  @ApiOperation({ summary: 'Retrieve all comments 📚' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all comments 👍.' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single comment by ID 🔍' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the comment 👀.' })
  @ApiResponse({ status: 404, description: 'Comment not found 😔.' })
  findOne(@Param('id') id: string) {
    
    return this.commentsService.findOne(+id);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment by ID 📝' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully updated 💪.' })
  @ApiResponse({ status: 404, description: 'Comment not found 😔.' })
  @ApiResponse({ status: 400, description: 'Invalid data 🚫.' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
    throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
  }
    return this.commentsService.update(+id, updateCommentDto);
  }

@Roles(UserRoles.ADMIN)
@Delete(':id')
@ApiOperation({ summary: 'Remove a comment by ID 🚮' })
@ApiResponse({ status: 200, description: 'The comment has been successfully removed 👋.' })
@ApiResponse({ status: 404, description: 'Comment not found 😔.' })
@ApiResponse({ status: 400, description: 'Invalid ID format ❌.' })
remove(@Param('id') id: string) {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
  }
  return this.commentsService.remove(numericId);
}

}

