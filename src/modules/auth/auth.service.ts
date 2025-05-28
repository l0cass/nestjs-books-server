import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { I18nService } from 'nestjs-i18n';

import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domains/entities';
import { Repository } from 'typeorm';

import { IncomingHttpHeaders } from 'http';

import { FastifyRequest } from 'fastify';

import { SignInUserDTO } from 'src/domains/dtos/auth';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly i18n: I18nService,

    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  readonly logger: Logger = new Logger(AuthService.name);

  async verifyAccessToken(request: FastifyRequest): Promise<Payload> {
    const headers = request.headers;

    const accessToken = this.extractTokenFromHeader(headers);

    if (!accessToken) {
      throw new UnauthorizedException(
        this.i18n.translate('services.AUTH.ERRORS.TOKEN_NOT_PROVIDED'),
      );
    }

    try {
      const payload: Payload = await this.jwtService.verifyAsync(accessToken);
      const { sub: id } = payload;

      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('services.USER.NOT_FOUND'),
        );
      }

      const { username, displayName, roles } = user;

      return {
        ...payload,
        roles,
        username,
        displayName,
      };
    } catch (_) {
      throw new UnauthorizedException(
        this.i18n.translate('services.AUTH.ERRORS.TOKEN_NOT_VALID'),
      );
    }
  }

  async generateAccessToken(
    data: SignInUserDTO,
  ): Promise<{ user: User; accessToken: string }> {
    try {
      const user = await this.userRepository.findOneBy({ email: data.email });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('services.AUTH.ERRORS.INVALID_CREDENTIALS'),
        );
      }

      const compareEncryptedPassword = await bcrypt.compare(
        data.password,
        user.passwordHash,
      );

      if (!compareEncryptedPassword) {
        throw new UnauthorizedException(
          this.i18n.translate('services.AUTH.ERRORS.INVALID_CREDENTIALS'),
        );
      }

      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        roles: user.roles,
        username: user.username,
        displayName: user.displayName,
      } as Payload);

      return { user, accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error((error as Error).message);
      throw new InternalServerErrorException(
        this.i18n.translate('services.AUTH.ERRORS.LOGIN_FAILED'),
      );
    }
  }

  private extractTokenFromHeader(
    headers: IncomingHttpHeaders,
  ): string | undefined {
    if (!headers?.authorization) return undefined;

    const [type, authorization] = headers.authorization.split(' ');

    return type === 'Bearer' ? authorization : undefined;
  }
}
