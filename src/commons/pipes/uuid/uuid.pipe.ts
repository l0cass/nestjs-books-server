import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

import { I18nService } from 'nestjs-i18n';

import { isUUID } from 'class-validator';
import { UUID } from 'crypto';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  constructor(private readonly i18n: I18nService) {}

  transform(value: unknown): UUID {
    if (!isUUID(value)) {
      throw new BadRequestException(
        this.i18n.t('services.USER.ERRORS.INVALID_ID'),
      );
    }

    return value as UUID;
  }
}
