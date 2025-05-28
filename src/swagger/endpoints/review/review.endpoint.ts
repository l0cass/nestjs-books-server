import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateReviewDTO, UpdateReviewDTO } from 'src/domains/dtos/review';

export function ApiFindReviewsAllPaginated(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'Items per page',
    }),
    ApiResponse({
      status: 200,
      description: 'List of reviews retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
              },
            },
            bookReference: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                authors: { type: 'array', items: { type: 'string' } },
                thumbnailUrl: { type: 'string' },
              },
            },
            title: { type: 'string' },
            content: { type: 'string' },
            authors: { type: 'string' },
            rating: { type: 'number' },
            publishedAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiFindOneById(summary: string) {
  return applyDecorators(
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary }),
    ApiParam({ name: 'id', description: 'Review ID', required: true }),
    ApiResponse({
      status: 200,
      description: 'Review found',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
            },
          },
          bookReference: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              authors: { type: 'array', items: { type: 'string' } },
              thumbnailUrl: { type: 'string' },
            },
          },
          title: { type: 'string' },
          content: { type: 'string' },
          authors: { type: 'string' },
          rating: { type: 'number' },
          publishedAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiCreateReview(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
    ApiBody({ type: CreateReviewDTO }),
    ApiResponse({ status: 201, description: 'Review created successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiUpdateReview(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
    ApiBody({ type: UpdateReviewDTO }),
    ApiResponse({ status: 200, description: 'Review updated successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Authorization to perform this action is not accepted',
    }),
    ApiResponse({ status: 404, description: 'Review not found' }),
  );
}

export function ApiDeleteReview(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
    ApiParam({ name: 'id', description: 'Review ID', required: true }),
    ApiResponse({ status: 200, description: 'Review deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 401, description: 'User not found' }),
    ApiResponse({
      status: 403,
      description: 'Authorization to perform this action is not accepted',
    }),
    ApiResponse({ status: 404, description: 'Review not found' }),
  );
}
