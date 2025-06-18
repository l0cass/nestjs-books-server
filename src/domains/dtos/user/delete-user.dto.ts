import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, MaxLength } from 'class-validator';

import { i18nValidationMessage } from 'nestjs-i18n';

export class DeleteUserDTO {
  @IsStrongPassword(
    {
      minLength: 6,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: i18nValidationMessage('validations.USER.PASSWORD.STRONG', {
        minLength: 6,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      }),
    },
  )
  @MaxLength(128, {
    message: i18nValidationMessage('validations.USER.PASSWORD.MAX_LENGTH', {
      maxLength: 128,
    }),
  })
  @ApiProperty({
    type: 'string',
    minLength: 6,
    maxLength: 128,
    required: true,
    example: 'passW@rd1',
  })
  password: string;
}
