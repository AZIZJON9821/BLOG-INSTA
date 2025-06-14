import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:  [PrismaModule,AuthModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService], 
})
export class UserModule {}
