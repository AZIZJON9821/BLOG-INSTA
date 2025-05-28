import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users 👥')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user 📝' }) 
  @ApiResponse({ status: 201, description: 'User successfully created. 👍' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters. ❌' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users 📜' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully. 👍' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID 🔍' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully. 👍' })
  @ApiResponse({ status: 404, description: 'User not found. ❌' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user 📝' })
  @ApiResponse({ status: 200, description: 'User successfully updated. 👍' })
  @ApiResponse({ status: 404, description: 'User not found. ❌' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user 🗑️' })
  @ApiResponse({ status: 200, description: 'User successfully deleted. 👍' })
  @ApiResponse({ status: 404, description: 'User not found. ❌' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

