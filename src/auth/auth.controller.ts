import {Controller,Post,Body,Get,OnModuleInit, UseGuards,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Protected, Roles } from 'src/common/decorator';
import { UserRoles } from '../users/enums/roles.enum';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { SendOtpDto } from './dtos/send-otp.dto';

@ApiTags('Authentication 🔐')
@UseGuards(AuthGuard, RolesGuard)
@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

     async onModuleInit() {
    await this.#_seedUsers();
  }

  @Post('register')
  @Protected(false)
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new user account 📝' })
  @ApiResponse({ status: 201, description: 'User created successfully 🎉' })
  async createUser(@Body() userData: RegisterDto) {
    return await this.authService.register(userData);
  }

  @Post('login')
  @Protected(false)
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  @ApiOperation({ summary: 'Login to an existing user account 🔓' })
  @ApiResponse({ status: 200, description: 'User logged in successfully 🚀' })
  async authenticateUser(@Body() credentials: LoginDto) {
    return await this.authService.login(credentials);
  }



@Post('send-otp')
@Protected(false)
@ApiOperation({ summary: 'Emailga 4 xonali OTP yuborish 📩' })
@ApiResponse({ status: 200, description: 'OTP yuborildi' })
async sendOtp(@Body() dto: SendOtpDto) {
  return await this.authService.sendOtpToEmail(dto);
}





  @ApiBearerAuth()
  @Protected(true)
  @Roles(UserRoles.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users 👥' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully 📝' })
  async getAllUsers() {
    return await this.prisma.user.findMany();
  }


async #_seedUsers() {
    const users = [
      {
        name: 'az',
        email: 'az@gmail.com',
        password: 'az123',
        role: UserRoles.ADMIN,
      },
    ];
    for (let u of users) {
      const user = await this.prisma.user.findFirst({ where: { email: u.email } });
      if (!user) {
        const passwordHash = await bcrypt.hash(u.password, 10);
        await this.prisma.user.create({
          data: {
            name: u.name,
            email: u.email,
            password: passwordHash,
            role: u.role,
          },
        });
      }
    }
    console.log("Admin yaratildi");
  }
}

