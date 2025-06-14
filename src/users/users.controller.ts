import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorator';
import { UserRoles } from './enums';
import { RolesGuard } from '../common/guards/role.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ParseFilePipe } from './pipes/parse-file.pipe';
import { UpdateImageDto } from './dto/update-image.dto';

@ApiBearerAuth()
@ApiTags('Users 👥')
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Foydalanuvchi yaratish 👌' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  create(
    @UploadedFile(
      new ParseFilePipe(['image/png', 'image/jpeg'], 2 * 1024 * 1024),
    )
    image: Express.Multer.File,
    @Body() payload: CreateUserDto,
  ) {
    return this.userService.create(payload, image?.filename);
  }

  @Roles(UserRoles.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish 👀' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar royxati olindi ✅' })
  findAll() {
    return this.userService.findAll();
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get(':id')
  @ApiOperation({ summary: 'ID orqali foydalanuvchini olish ❗' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi topildi ✅' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi ❌' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Put(':id')
  @ApiOperation({ summary: 'Foydalanuvchini yangilash ✏️' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi yangilandi ✅' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi ❌' })
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
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe(['image/png', 'image/jpeg'], 2 * 1024 * 1024),
    )
    image: Express.Multer.File,
    @Body() payload: UpdateUserDto,
  ) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
    }
    return this.userService.update(+id, payload, image?.filename);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Put(':id/image')
  @ApiOperation({ summary: 'Foydalanuvchi rasmi yangilash ✏️' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi rasmi yangilandi ✅' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi ❌' })
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
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  updateImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe(['image/png', 'image/jpeg'], 2 * 1024 * 1024),
    )
    image: Express.Multer.File,
    @Body() payload: UpdateImageDto,
  ) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
    }
    return this.userService.updateImage(+id, payload, image?.filename);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Foydalanuvchini ochirish 🗑️' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi oʻchirildi ✅' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi ❌' })
  remove(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID noto‘g‘ri formatda. Raqam bo‘lishi kerak ❌');
    }
    return this.userService.remove(+id);
  }
}

