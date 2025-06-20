import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RoleGuard } from '../role/guards';

import {
  ApiCreateReview,
  ApiUpdateReview,
  ApiFindOneById,
  ApiFindReviewsAllPaginated,
  ApiDeleteReview,
  ApiFindReviewByUserId,
} from 'src/swagger/endpoints/review';

import { UUIDValidationPipe } from 'src/commons/pipes/uuid';

import { CreateReviewDTO, UpdateReviewDTO } from 'src/domains/dtos/review';

import { FastifyRequest } from 'fastify';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(RoleGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiFindReviewsAllPaginated('Get reviews with pagination')
  findPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewService.findPaginated(page, limit);
  }

  @Get(':id')
  @ApiFindOneById('Get review by ID')
  findOneById(@Param('id', UUIDValidationPipe) id: string) {
    return this.reviewService.findOneById(id);
  }

  @Get('user/:id')
  @ApiFindReviewByUserId('Get reviews by User ID with pagination')
  findReviewsByUserId(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('id', UUIDValidationPipe) id: string,
  ) {
    return this.reviewService.findByUserIdPaginated(page, limit, id);
  }

  @Post()
  @ApiCreateReview('Create new review')
  create(@Body() data: CreateReviewDTO) {
    return this.reviewService.create(data);
  }

  @Patch(':id')
  @ApiUpdateReview('Update review by ID')
  updateById(
    @Req() request: FastifyRequest,
    @Param('id') reviewId: string,
    @Body() data: UpdateReviewDTO,
  ) {
    const requestUser = request.user;

    if (!requestUser) {
      throw new UnauthorizedException('Review not found');
    }

    return this.reviewService.update(requestUser.id, reviewId, data);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @ApiDeleteReview('Delete review by ID')
  deleteById(@Req() request: FastifyRequest, @Param('id') reviewId: string) {
    const requestUser = request.user;

    if (!requestUser) {
      throw new UnauthorizedException('Review not found');
    }

    return this.reviewService.delete(requestUser.id, reviewId);
  }
}
