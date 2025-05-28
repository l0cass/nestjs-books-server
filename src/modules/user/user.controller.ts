import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

import { RoleGuard } from '../role/guards';
import { ROLE_ENUM } from 'src/commons/enums/roles';
import { AllowRoles } from '../role/decorators';

import { AllowAnonymous } from '../auth/decorators';

import {
  ApiAdminDeleteUser,
  ApiAdminUpdateUser,
  ApiCreateUser,
  ApiFindOneById,
  ApiFindUsersAllPaginated,
  ApiDeleteUser,
  ApiUpdateUser,
} from 'src/swagger/endpoints/user';

import {
  CreateUserDTO,
  DeleteUserDTO,
  UpdateUserDTO,
} from 'src/domains/dtos/user';

import { UUIDValidationPipe } from 'src/commons/pipes/uuid';

import { FastifyRequest } from 'fastify';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.USER)
  @ApiFindUsersAllPaginated('Get all users with pagination')
  findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAllPaginated(page, limit);
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.USER)
  @ApiFindOneById('Get user by ID')
  findOneById(@Param('id', UUIDValidationPipe) id: string) {
    return this.userService.findOneById(id);
  }

  @Post()
  @AllowAnonymous()
  @ApiCreateUser('Create new user')
  create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Patch()
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.USER)
  @ApiUpdateUser('Update current user')
  update(@Req() request: FastifyRequest, @Body() data: UpdateUserDTO) {
    const requestUser = request.user;

    if (!requestUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.userService.update(requestUser.id, data);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.ADMIN)
  @ApiAdminUpdateUser('Update user by ID (Admin only)')
  updateById(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() data: UpdateUserDTO,
  ) {
    return this.userService.update(id, data);
  }

  @Delete()
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.USER)
  @ApiDeleteUser('Delete current user')
  delete(@Req() request: FastifyRequest, @Body() data: DeleteUserDTO) {
    const requestUser = request.user;

    if (!requestUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.userService.delete(requestUser.id, data);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.ADMIN)
  @ApiAdminDeleteUser('Delete user by ID (Admin only)')
  deleteById(@Param('id', UUIDValidationPipe) id: string) {
    return this.userService.delete(id);
  }
}
