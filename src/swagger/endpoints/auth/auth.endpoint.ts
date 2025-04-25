import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { LogInUserDTO } from 'src/domains/dtos/user';

export function ApiAccessToken(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Token is valid',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          username: { type: 'string' },
          displayName: { type: 'string' },
          roles: { type: 'array', items: { type: 'string' } },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Token not provided' }),
    ApiResponse({ status: 401, description: 'User not found' }),
    ApiResponse({ status: 401, description: 'Invalid or expired token' }),
  );
}

export function ApiLogIn(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: LogInUserDTO }),
    ApiResponse({
      status: 200,
      description: 'Successfully authenticated',
      schema: {
        type: 'object',
        properties: { accessToken: { type: 'string' } },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Email or password do not match',
    }),
  );
}
