import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Review, User } from 'src/domains/entities';

import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
