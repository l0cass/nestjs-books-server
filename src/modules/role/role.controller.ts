import {
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleGuard } from './guards';
import { AllowRoles } from './decorators';
import { ROLE_ENUM } from 'src/commons/enums/roles';

import { RoleService } from './role.service';

import { ApiPromoteToAdmin } from 'src/swagger/endpoints/role';

import { UUIDValidationPipe } from 'src/commons/pipes/uuid';

@ApiTags('Role Management')
@Controller('roles')
@UseGuards(RoleGuard)
@AllowRoles(ROLE_ENUM.ADMIN)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('promote/admin/:userId')
  @ApiPromoteToAdmin('Promote user to Admin role (Admin only)')
  promoteToAdmin(@Param('userId', UUIDValidationPipe) userId: string) {
    return this.roleService.promoteToAdmin(userId);
  }
}
