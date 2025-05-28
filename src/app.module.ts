import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { PostModule } from './posts/posts.module';
import { LikedPostModule } from './liked-posts/liked-posts.module';

@Module({
  imports: [UserModule, PostModule, LikedPostModule],
})
export class AppModule {}