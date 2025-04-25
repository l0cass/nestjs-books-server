import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, MaxLength } from 'class-validator';

import { i18nValidationMessage } from 'nestjs-i18n';

export class DeleteUserDTO {
  @IsString({
    message: i18nValidationMessage('validations.USER.PASSWORD.STRING'),
  })
  @IsStrongPassword(
    {
      minLength: 3,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: i18nValidationMessage('validations.USER.PASSWORD.STRONG', {
        minLength: 3,
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
    minLength: 3,
    maxLength: 30,
    required: true,
    example: 'passW@rd1',
  })
  password: string;
}
