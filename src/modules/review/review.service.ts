import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { I18nService } from 'nestjs-i18n';

import { InjectRepository } from '@nestjs/typeorm';
import { Review, User } from 'src/domains/entities';
import { Repository } from 'typeorm';

import { CreateReviewDTO, UpdateReviewDTO } from 'src/domains/dtos/review';

import { Result } from 'src/commons/interfaces/result';
import { ROLE_ENUM } from 'src/commons/enums/roles';

@Injectable()
export class ReviewService {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  private readonly logger: Logger = new Logger(ReviewService.name);

  async create(data: CreateReviewDTO): Promise<Result> {
    try {
      const newReview = this.reviewRepository.create(data);
      await this.reviewRepository.save(newReview);

      return { message: this.i18n.translate('services.REVIEW.SUCESS.CREATED') };
    } catch (error) {
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async update(
    userId: string,
    reviewId: string,
    data: UpdateReviewDTO,
  ): Promise<Result> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['reviews'],
      });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('services.USER.ERRORS.NOT_FOUND'),
        );
      }

      const review = await this.reviewRepository.findOneBy({ id: reviewId });

      if (!review) {
        throw new NotFoundException(
          this.i18n.translate('services.REVIEW.ERRORS.NOT_FOUND'),
        );
      }

      if (!user.reviews.includes(review)) {
        throw new ForbiddenException(
          this.i18n.translate('services.REVIEW.ERRORS.NOT_OWNED'),
        );
      }

      await this.reviewRepository.update(reviewId, {
        ...data,
        updatedAt: new Date(),
      });

      return { message: this.i18n.translate('services.REVIEW.SUCESS.UPDATED') };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async delete(userId: string, reviewId: string): Promise<Result> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['reviews'],
      });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('services.USER.ERRORS.NOT_FOUND'),
        );
      }

      const review = await this.reviewRepository.findOneBy({ id: reviewId });

      if (!review) {
        throw new NotFoundException(
          this.i18n.translate('services.REVIEW.ERRORS.NOT_FOUND'),
        );
      }

      if (
        !user.roles.includes(ROLE_ENUM.ADMIN) &&
        !user.reviews.some((review) => review.id === reviewId)
      ) {
        throw new ForbiddenException(
          this.i18n.translate('services.REVIEW.ERRORS.FORBIDDEN'),
        );
      }

      await this.reviewRepository.remove(review);

      return { message: this.i18n.translate('services.REVIEW.SUCESS.DELETED') };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findAll(): Promise<Review[]> {
    try {
      return await this.reviewRepository.find({
        select: {
          id: true,
          user: {
            id: true,
            username: true,
          },
          bookReference: true,
          title: true,
          content: true,
          authors: true,
          rating: true,
          publishedAt: true,
          updatedAt: true,
        },
        relations: ['user'],
      });
    } catch (error) {
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
  ): Promise<{
    data: Review[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const [data, total] = await this.reviewRepository.findAndCount({
        select: {
          id: true,
          user: {
            id: true,
            username: true,
          },
          bookReference: true,
          title: true,
          content: true,
          authors: true,
          rating: true,
          publishedAt: true,
          updatedAt: true,
        },
        relations: ['user'],
        skip: (page - 1) * limit,
        take: limit,
      });

      return { data, total, page, limit };
    } catch (error) {
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findOneById(id: string): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({
        where: { id },
        select: {
          id: true,
          user: {
            id: true,
            username: true,
          },
          bookReference: true,
          title: true,
          content: true,
          authors: true,
          rating: true,
          publishedAt: true,
          updatedAt: true,
        },
        relations: ['user'],
      });

      if (!review) {
        throw new NotFoundException(
          this.i18n.translate('services.REVIEW.ERRORS.NOT_FOUND'),
        );
      }

      return review;
    } catch (error) {
      this.logger.error((error as Error).message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }
}
