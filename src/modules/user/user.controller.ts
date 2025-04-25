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
  UseInterceptors,
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

import { UUIDInterceptor } from 'src/commons/interceptors/uuid';

import {
  CreateUserDTO,
  DeleteUserDTO,
  UpdateUserDTO,
} from 'src/domains/dtos/user';

import { FastifyRequest } from 'fastify';

@ApiTags('Users')
@Controller('user')
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
  @UseInterceptors(UUIDInterceptor)
  findOneById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Post('create')
  @AllowAnonymous()
  @ApiCreateUser('Create new user')
  create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Patch('update')
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

  @Patch('update/:id')
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.ADMIN)
  @ApiAdminUpdateUser('Update user by ID (Admin only)')
  @UseInterceptors(UUIDInterceptor)
  updateById(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    return this.userService.update(id, data);
  }

  @Delete('delete')
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
  e;

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.ADMIN)
  @ApiAdminDeleteUser('Delete user by ID (Admin only)')
  @UseInterceptors(UUIDInterceptor)
  deleteById(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
