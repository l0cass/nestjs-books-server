import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from 'src/domains/entities';

import { I18nService } from 'nestjs-i18n';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateUserDTO,
  LogInUserDTO,
  UpdateUserDTO,
} from 'src/domains/dtos/user';

import { Result } from 'src/commons/interfaces/result';

import * as bcrypt from 'bcryptjs';
import { ROLE_ENUM } from 'src/commons/enums/roles';
import { DeleteUserDTO } from 'src/domains/dtos/user/delete-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public readonly logger: Logger = new Logger(UserService.name);

  async create(data: CreateUserDTO): Promise<Result> {
    try {
      const userExists = await this.userRepository.findOneBy({
        email: data.email,
      });

      if (userExists) {
        throw new ConflictException(
          this.i18n.translate('services.USER.ERRORS.EXISTS'),
        );
      }

      const salt = await bcrypt.genSalt(10);
      const encryptPassword = await bcrypt.hash(data.password, salt);

      const newUser = this.userRepository.create({
        ...data,
        passwordHash: encryptPassword,
      });

      await this.userRepository.save(newUser);

      return { message: this.i18n.translate('services.USER.SUCCESS.CREATED') };
    } catch (error) {
      this.logger.error((error as Error).message);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        this.i18n.translate('services.USER.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async update(id: string, data: UpdateUserDTO): Promise<Result> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(
          this.i18n.translate('services.USER.ERRORS.NOT_FOUND'),
        );
      }

      await this.userRepository.update(id, {
        ...data,
        updatedAt: new Date(),
      });

      return { message: this.i18n.translate('services.USER.SUCCESS.UPDATED') };
    } catch (error) {
      this.logger.error((error as Error).message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        this.i18n.translate('services.USER.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async delete(id: string, data?: DeleteUserDTO): Promise<Result> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(
          this.i18n.translate('services.USER.ERRORS.NOT_FOUND'),
        );
      }

      if (!user.roles.includes(ROLE_ENUM.ADMIN)) {
        if (!data) {
          throw new BadRequestException(
            this.i18n.translate('services.USER.ERRORS.MISSING_DATA'),
          );
        }

        const compareEncryptedPassword = await bcrypt.compare(
          data.password,
          user.passwordHash,
        );

        if (!compareEncryptedPassword) {
          throw new UnauthorizedException(
            this.i18n.translate('services.AUTH.ERRORS.PASSWORD_NOT_MATCH'),
          );
        }
      }

      await this.userRepository.update(id, { deletedAt: new Date() });

      return { message: this.i18n.translate('services.USER.SUCCESS.DELETED') };
    } catch (error) {
      this.logger.error((error as Error).message);
      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(
        this.i18n.translate('services.USER.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        select: ['id', 'email', 'username', 'displayName'],
      });
    } catch (error) {
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.USER.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const [data, total] = await this.userRepository.findAndCount({
        select: ['id', 'email', 'username', 'displayName'],
        skip: (page - 1) * limit,
        take: limit,
      });

      return { data, total, page, limit };
    } catch (error) {
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.USER.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['email', 'username', 'displayName'],
      });

      if (!user) {
        throw new NotFoundException(
          this.i18n.translate('services.USER.ERRORS.NOT_FOUND'),
        );
      }

      return user;
    } catch (error) {
      this.logger.error((error as Error).message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        this.i18n.translate('services.USER.ERRORS.INTERNAL_SERVER_ERROR'),
      );
    }
  }
}
