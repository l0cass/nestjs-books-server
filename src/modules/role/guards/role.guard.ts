import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLE_ENUM } from 'src/commons/enums/roles';
import { ALLOW_ROLE_KEY } from '../decorators';

import { FastifyRequest } from 'fastify';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE_ENUM[]>(
      ALLOW_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const { user } = request;

    if (!user) {
      throw new UnauthorizedException('Unauthenticated user');
    }

    const hasPermission = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return true;
  }
}
