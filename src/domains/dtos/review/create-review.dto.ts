import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateReviewDTO {
  @IsString({
    message: i18nValidationMessage('validations.REVIEW.TITLE.STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validations.REVIEW.TITLE.MIN_LENGTH', {
      minLength: 3,
    }),
  })
  @MaxLength(60, {
    message: i18nValidationMessage('validations.REVIEW.TITLE.MAX_LENGTH', {
      maxLength: 60,
    }),
  })
  @ApiProperty({
    type: 'string',
    minLength: 3,
    maxLength: 60,
    example: 'Why Harry Potter is the best book ever',
  })
  title: string;

  @IsString({
    message: i18nValidationMessage('validations.REVIEW.CONTENT.STRING'),
  })
  @MinLength(10, {
    message: i18nValidationMessage('validations.REVIEW.CONTENT.MIN_LENGTH', {
      minLength: 10,
    }),
  })
  @MaxLength(5000, {
    message: i18nValidationMessage('validations.REVIEW.CONTENT.MAX_LENGTH', {
      maxLength: 5000,
    }),
  })
  @ApiProperty({
    type: 'string',
    minLength: 10,
    maxLength: 5000,
    example: 'Harry Potter is the best book ever because it is a great story',
  })
  content: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validations.REVIEW.AUTHOR.STRING'),
  })
  @MinLength(2, {
    message: i18nValidationMessage('validations.REVIEW.AUTHOR.MIN_LENGTH', {
      minLength: 2,
    }),
  })
  @MaxLength(100, {
    message: i18nValidationMessage('validations.REVIEW.AUTHOR.MAX_LENGTH', {
      maxLength: 100,
    }),
  })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      minLength: 2,
      maxLength: 100,
      example: 'J. K. Rowling',
    },
  })
  authors: string[];

  @IsInt({
    message: i18nValidationMessage('validations.REVIEW.RATING.NUMBER'),
  })
  @Min(1, {
    message: i18nValidationMessage('validations.REVIEW.RATING.MIN_VALUE', {
      min: 1,
    }),
  })
  @Max(5, {
    message: i18nValidationMessage('validations.REVIEW.RATING.MAX_VALUE', {
      max: 5,
    }),
  })
  @ApiProperty({
    type: 'number',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  rating: number;
}
