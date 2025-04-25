import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin, User } from 'src/domains/entities';

import { Reflector } from '@nestjs/core';
import { RoleGuard } from './guards';
import { RoleService } from './role.service';

import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin])],
  providers: [Reflector, RoleGuard, RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
