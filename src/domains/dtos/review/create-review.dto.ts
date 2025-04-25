import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateReviewDTO {
  @IsString({
    message: i18nValidationMessage('validations.REVIEW.TITLE.STRING'),
  })
  @MaxLength(60, {
    message: i18nValidationMessage('validations.REVIEW.TITLE.MAX_LENGTH', {
      maxLength: 60,
    }),
  })
  @ApiProperty({
    type: 'string',
    maxLength: 60,
    example: 'Why Harry Potter is the best book ever',
  })
  title: string;

  @IsString({
    message: i18nValidationMessage('validations.REVIEW.CONTENT.STRING'),
  })
  @MaxLength(5000, {
    message: i18nValidationMessage('validations.REVIEW.CONTENT.MAX_LENGTH', {
      maxLength: 5000,
    }),
  })
  @ApiProperty({
    type: 'string',
    maxLength: 5000,
    example: 'Harry Potter is the best book ever because it is a great story',
  })
  content: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validations.REVIEW.AUTHOR.STRING'),
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
      maxLength: 100,
      example: 'J. K. Rowling wrote Harry Potter like no other author',
    },
  })
  authors: string[];

  @IsString({
    message: i18nValidationMessage('validations.REVIEW.RATING.STRING'),
  })
  @MaxLength(1, {
    message: i18nValidationMessage('validations.REVIEW.RATING.MAX_LENGTH', {
      maxLength: 1,
    }),
  })
  @ApiProperty({
    type: 'string',
    maxLength: 1,
    example: '5',
  })
  rating: string;
}
