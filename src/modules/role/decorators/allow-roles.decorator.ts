import { SetMetadata } from '@nestjs/common';
import { ROLE_ENUM } from 'src/commons/enums/roles';

export const ALLOW_ROLE_KEY = 'allowRoles';
export const AllowRoles = (...roles: ROLE_ENUM[]) =>
  SetMetadata(ALLOW_ROLE_KEY, roles);
