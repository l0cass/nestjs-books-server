import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateUserDTO, UpdateUserDTO } from 'src/domains/dtos/user';

export function ApiFindUsersAllPaginated(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
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
      description: 'List of users retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            displayName: { type: 'string' },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiFindOneById(summary: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary }),
    ApiParam({ name: 'id', description: 'User ID', required: true }),
    ApiResponse({
      status: 200,
      description: 'User found',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          username: { type: 'string' },
          displayName: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiCreateUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiBody({ type: CreateUserDTO }),
    ApiResponse({ status: 201, description: 'User created successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 409,
      description: 'There is already a registered user with this email',
    }),
  );
}

export function ApiUpdateUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiBody({ type: UpdateUserDTO }),
    ApiResponse({ status: 200, description: 'User updated successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiAdminUpdateUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', description: 'User ID', required: true }),
    ApiBody({ type: UpdateUserDTO }),
    ApiResponse({ status: 200, description: 'User updated successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Authorization to perform this action is not accepted',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiDeleteUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'User deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiAdminDeleteUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', description: 'User ID', required: true }),
    ApiResponse({ status: 200, description: 'User deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Authorization to perform this action is not accepted',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}
