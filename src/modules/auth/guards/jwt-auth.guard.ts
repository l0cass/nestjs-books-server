import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

import { FastifyRequest } from 'fastify';

import { ALLOW_ANONYMOUS_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  readonly logger: Logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowAnonymous = this.reflector.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (allowAnonymous) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const payload = await this.authService.verifyAccessToken(request);

    request['user'] = { ...payload, id: payload.sub };

    return true;
  }
}
