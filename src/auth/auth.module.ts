import { AuthGuard } from './../common/guards/auth.guard';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, JwtModule.register({ secret: 'azizjon' })],
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  exports: [AuthService,AuthGuard,  JwtModule],
})
export class AuthModule {}

