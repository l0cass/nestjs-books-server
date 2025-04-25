import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { FastifyRequest } from 'fastify';

import { isUUID } from 'class-validator';
import { I18n, I18nService, i18nValidationMessage } from 'nestjs-i18n';

@Injectable()
export class UUIDInterceptor implements NestInterceptor {
  constructor(private readonly i18nService: I18nService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const params = request.params as { id: string };
    const id = params.id;

    if (!isUUID(id)) {
      throw new BadRequestException(
        this.i18nService.t('services.USER.ERRORS.INVALID_ID'),
      );
    }

    return next.handle();
  }
}
