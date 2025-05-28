import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { RoleGuard } from '../role/guards';
import { AllowRoles } from '../role/decorators';
import { ROLE_ENUM } from 'src/commons/enums/roles';
import { ApiAccessToken, ApiLogIn } from 'src/swagger/endpoints/auth';

import { FastifyRequest } from 'fastify';

import { AllowAnonymous } from './decorators';

import { LogInUserDTO } from 'src/domains/dtos/user';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify')
  @UseGuards(RoleGuard)
  @AllowRoles(ROLE_ENUM.USER)
  @ApiAccessToken('Verify if the access token is valid')
  async verifyAccessToken(@Req() request: FastifyRequest) {
    return this.authService.verifyAccessToken(request);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @AllowAnonymous()
  @ApiLogIn('Authenticate user and get access token')
  async logIn(@Body() data: LogInUserDTO) {
    return this.authService.generateAccessToken(data);
  }
}
