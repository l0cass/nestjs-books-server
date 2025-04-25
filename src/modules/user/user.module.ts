import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domains/entities';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
