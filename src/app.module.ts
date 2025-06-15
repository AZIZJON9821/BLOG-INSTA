import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './users/users.module';
import { PostModule } from './posts/posts.module';
import { LikedPostModule } from './liked-posts/liked-posts.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { ExelModule } from './exel/exel.module';
import { BotModule } from './bot/bot.module';
import { PostSaveModule } from './post-save/post-save.module';
import { ReportModule } from './report/report.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PostModule,
    LikedPostModule,
    CommentsModule,
    PostSaveModule,
    ReportModule,
    ExelModule,
    BotModule,
  ],
})
export class AppModule {}
