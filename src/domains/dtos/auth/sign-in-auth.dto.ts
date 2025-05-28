import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInUserDTO {
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validations.USER.EMAIL.INVALID'),
    },
  )
  @MinLength(5, {
    message: i18nValidationMessage('validations.USER.EMAIL.MIN_LENGTH', {
      minLength: 5,
    }),
  })
  @MaxLength(254, {
    message: i18nValidationMessage('validations.USER.EMAIL.MAX_LENGTH', {
      maxLength: 254,
    }),
  })
  @ApiProperty({
    type: 'string',
    minLength: 5,
    maxLength: 254,
    required: true,
    example: 'john@exemple.com',
  })
  email: string;

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
