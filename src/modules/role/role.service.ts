import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { I18nService } from 'nestjs-i18n';

import { InjectRepository } from '@nestjs/typeorm';
import { Admin, User } from 'src/domains/entities';
import { Repository } from 'typeorm';

import { Result } from 'src/commons/interfaces/result';

import { ROLE_ENUM } from 'src/commons/enums/roles';

@Injectable()
export class RoleService {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  readonly logger: Logger = new Logger(RoleService.name);

  async promoteToAdmin(id: string): Promise<Result> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(
          this.i18n.translate('services.USER.NOT_FOUND'),
        );
      }

      if (!user.roles.includes(ROLE_ENUM.ADMIN)) {
        user.roles = [...user.roles, ROLE_ENUM.ADMIN];
        await this.userRepository.save(user);
      }

      const existingAdmin = await this.adminRepository.findOne({
        where: { user: { id } },
        relations: ['user'],
      });

      if (!existingAdmin) {
        const admin = this.adminRepository.create({ user });

        await this.adminRepository.save(admin);
      }

      return {
        message: this.i18n.translate(
          'services.USER.MESSAGES.PROMOTED_TO_ADMIN',
        ),
      };
    } catch (error) {
      this.logger.error((error as Error).message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        this.i18n.translate('services.USER.MESSAGES.PROMOTED_TO_ADMIN_FAILED'),
      );
    }
  }
}
