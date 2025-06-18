import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import {
  AuthTokenResponseDTO,
  AuthUserResponseDTO,
  SignInUserDTO,
} from 'src/domains/dtos/auth';

export function ApiAccessToken(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
    ApiResponse({
      status: 200,
      description: 'Token is valid',
      type: AuthUserResponseDTO,
    }),
    ApiResponse({ status: 401, description: 'Token not provided' }),
    ApiResponse({ status: 401, description: 'User not found' }),
    ApiResponse({ status: 401, description: 'Invalid or expired token' }),
  );
}

export function ApiSignIn(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: SignInUserDTO }),
    ApiResponse({
      status: 200,
      description: 'Successfully authenticated',
      type: AuthTokenResponseDTO,
    }),
    ApiResponse({
      status: 401,
      description: 'Email or password do not match',
    }),
  );
}
