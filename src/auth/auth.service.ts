import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import {  LoginDto, RegisterDto } from './dtos';
import { UserRoles } from 'src/users/enums/roles.enum';
import { Role, User } from '@prisma/client';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import { SendOtpDto } from './dtos/send-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto) {
    await this.verifyUniqueEmail(userData.email);

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        role: userData.role as Role || UserRoles.USER,
      },
      select:{
        id: true,
        email: true,
        name: true,
        role: true,
        
      }
    });
    await this.sendTelegramMessage(newUser);
    
    return {
      status: 'success',
      details: {
        message: 'Tokenni login qilgandan keyin olasiz 🚀',
        userInfo: newUser,
      },
    };

  }



  async login(credentials: LoginDto) {
    const user = await this.findUserByEmail(credentials.email);

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ConflictException('Notogri parol 🔐');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
    };
  }

  async findAll() {
    return this.prisma.user.findMany();
  }





  private async verifyUniqueEmail(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email ro‘yxatdan o‘tgan');
    }
  }

  private async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ConflictException('Topilmadi');
    }

    return user;
  }


  private async sendTelegramMessage(user: { name: string; email: string ; role: string}) {  
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = `🆕 Yangi foydalanuvchi yaratildi:\n\n👤 Ismi: ${user.name}\n📧 Email: ${user.email}\n❗Role: ${user.role}`;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });
    } catch (err) {
      console.error('Telegramga xabar yuborishda xato:', err.message);
    }
  }

async sendOtpToEmail(email: SendOtpDto) {
  const user = await this.prisma.user.findUnique({ where: { email: email.email } });

  if (!user) {
    throw new ConflictException('Bunday emaildagi foydalanuvchi topilmadi');
  }

  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  await this.prisma.user.update({
    where: { email: email.email },
    data: {
      verificationCode: otpCode,
    },
  });

  await this.sendEmailVerificationCode(email.email, otpCode);

  return {
    status: 'jonatildi',
    message: '4 xonali OTP kod emailga yuborildi ✉️',
  };
}


private async sendEmailVerificationCode(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Hack 👨‍💻" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: '🔐 Sizning OTP kodingiz',
    text: `📝 Sizning 4 xonali OTP kodingiz: ${code}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP yuborildi: ${email}`);
    console.log(`Email yuborish holati: ${info.response}`);
  } catch (error) {
    console.error('Email yuborishda xato:', error.message);
  }
}



}
