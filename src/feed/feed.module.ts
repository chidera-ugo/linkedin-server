import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './feed.controller';
import { FeedPostEntity } from './models/post.entity';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedPostEntity])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
