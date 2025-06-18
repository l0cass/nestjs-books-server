import {
  IsString,
  MaxLength,
  IsStrongPassword,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDTO {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validations.USER.DISPLAY_NAME.STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validations.USER.DISPLAY_NAME.MIN_LENGTH', {
      minLength: 3,
    }),
  })
  @MaxLength(30, {
    message: i18nValidationMessage('validations.USER.DISPLAY_NAME.MAX_LENGTH', {
      maxLength: 30,
    }),
  })
  @ApiProperty({
    type: 'string',
    minLength: 3,
    maxLength: 30,
    nullable: true,
    example: 'John Doe',
  })
  displayName: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validations.USER.USERNAME.STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validations.USER.USERNAME.MIN_LENGTH', {
      minLength: 3,
    }),
  })
  @MaxLength(30, {
    message: i18nValidationMessage('validations.USER.USERNAME.MAX_LENGTH', {
      maxLength: 30,
    }),
  })
  @ApiProperty({
    type: 'string',
    minLength: 3,
    maxLength: 30,
    nullable: true,
    example: 'john_doe',
  })
  username: string;

  @IsOptional()
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
    nullable: true,
    example: 'passW@rd1',
  })
  password: string;
}
