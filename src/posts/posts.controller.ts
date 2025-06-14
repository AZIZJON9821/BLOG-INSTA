import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation,  ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator';
import { UserRoles } from 'src/users/enums/roles.enum';


@ApiBearerAuth()
@ApiTags('Posts 📝')
@UseGuards(AuthGuard, RolesGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

@Post()
@Roles(UserRoles.ADMIN, UserRoles.USER)
@ApiOperation({ summary: 'Create a new post ✨' })
@ApiConsumes('multipart/form-data')
@ApiResponse({ status: 201, description: 'The post has been successfully created 🎉' })
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    limits: { fileSize: Infinity }, 
  }),
)
create(
  @UploadedFile() file: Express.Multer.File, 
  @Body() createPostDto: CreatePostDto,
) {
  const image = file?.filename ;
  return this.postService.create(createPostDto, image  );
}

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Get all posts 📃' })
  @ApiResponse({ status: 200, description: 'The list of posts 📜' })
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Get a single post by id 🔍' })
  @ApiResponse({ status: 200, description: 'The post 📄' })
  findOne(@Param('id') id: string, @Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
    return this.postService.findOne(+id, page, pageSize);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.postService.update(+id, dto, image);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a post by id 🗑️' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted ❌' })
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.postService.remove(+id);
  }
}

