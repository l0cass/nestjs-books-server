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
  UseInterceptors,
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
  @ApiFindReviewsAllPaginated('Get all reviews with pagination')
  findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewService.findAllPaginated(page, limit);
  }

  @Get(':id')
  @ApiFindOneById('Get review by ID')
  findOneById(@Param('id', UUIDValidationPipe) id: string) {
    return this.reviewService.findOneById(id);
  }

  @Post('create')
  @ApiCreateReview('Create new review')
  create(@Body() data: CreateReviewDTO) {
    return this.reviewService.create(data);
  }

  @Patch('update/:id')
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

  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiDeleteReview('Delete review by ID')
  deleteById(@Req() request: FastifyRequest, @Param('id') reviewId: string) {
    const requestUser = request.user;

    if (!requestUser) {
      throw new UnauthorizedException('Review not found');
    }

    return this.reviewService.delete(requestUser.id, reviewId);
  }
}
