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

import { UUIDInterceptor } from 'src/commons/interceptors/uuid';

@ApiTags('Role Management')
@Controller('role')
@UseGuards(RoleGuard)
@AllowRoles(ROLE_ENUM.ADMIN)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('promote/admin/:id')
  @ApiPromoteToAdmin('Promote user to Admin role (Admin only)')
  @UseInterceptors(UUIDInterceptor)
  promoteToAdmin(@Param('id') id: string) {
    return this.roleService.promoteToAdmin(id);
  }
}
