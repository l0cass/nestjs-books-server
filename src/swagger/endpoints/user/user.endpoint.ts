import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import {
  UserResponseDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from 'src/domains/dtos/user';

export function ApiFindUsersAllPaginated(summary: string) {
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
      description: 'List of users retrieved successfully',
      type: UserResponseDTO,
      isArray: true,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiFindOneById(summary: string) {
  return applyDecorators(
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary }),
    ApiParam({ name: 'id', description: 'User ID', required: true }),
    ApiResponse({
      status: 200,
      description: 'User found',
      type: UserResponseDTO,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiCreateUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
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
    ApiBearerAuth('Authorization'),
    ApiBody({ type: UpdateUserDTO }),
    ApiResponse({ status: 200, description: 'User updated successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiAdminUpdateUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
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
    ApiBearerAuth('Authorization'),
    ApiResponse({ status: 200, description: 'User deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiAdminDeleteUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
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
