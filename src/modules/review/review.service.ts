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

import { IBaseResponse } from 'src/commons/interfaces/base-response';
import { IResponse } from 'src/commons/interfaces/response';
import { IPaginatedResponse } from 'src/commons/interfaces/paginated-response';

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

  async create(data: CreateReviewDTO): Promise<IBaseResponse> {
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
  ): Promise<IBaseResponse> {
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
        updatedAt: new Date().getTime(),
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

  async delete(userId: string, reviewId: string): Promise<IBaseResponse> {
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

  async findAll(): Promise<IResponse<{ reviews: Review[] }>> {
    try {
      const reviews = await this.reviewRepository.find({
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

      return { reviews };
    } catch (error) {
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findPaginated(
    page = 1,
    limit = 10,
  ): Promise<IPaginatedResponse<{ reviews: Review[] }>> {
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

      return { reviews: data, total, page, limit };
    } catch (error) {
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findByUserIdPaginated(
    page = 1,
    limit = 10,
    id: string,
  ): Promise<IPaginatedResponse<{ users: User[] }>> {
    try {
      this.logger.debug('Hello');

      const [data, total] = await this.userRepository.findAndCount({
        where: { id },
        select: {
          id: true,
          username: true,
          reviews: {
            bookReference: true,
            title: true,
            content: true,
            authors: true,
            rating: true,
            publishedAt: true,
            updatedAt: true,
          },
        },
        relations: ['reviews'],
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!data.length) {
        throw new NotFoundException(
          this.i18n.translate('services.REVIEW.ERRORS.NOT_FOUND'),
        );
      }

      return { users: data, total, page, limit };
    } catch (error) {
      this.logger.error((error as Error).message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findOneById(id: string): Promise<IResponse<{ review: Review }>> {
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

      return { review };
    } catch (error) {
      this.logger.error((error as Error).message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        this.i18n.translate('services.REVIEW.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }
}
