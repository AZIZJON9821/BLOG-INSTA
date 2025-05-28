import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { PostModule } from './posts/posts.module';
import { LikedPostModule } from './liked-posts/liked-posts.module';
import { ConfigModule } from '@nestjs/config';

@Module({

  imports: [ ConfigModule.forRoot({
      isGlobal: true,
    }),UserModule, PostModule, LikedPostModule],
})
export class AppModule {}