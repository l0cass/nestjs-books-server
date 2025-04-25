import {
  IsString,
  MaxLength,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDTO {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validations.USER.DISPLAY_NAME.STRING'),
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
    nullable: true,
    example: 'passW@rd1',
  })
  password: string;
}
