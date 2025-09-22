import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProjectService } from './project.service';
import type JwtPayload from '../auth/types/jwt-payload';
import { CurrentUser } from '../common/decorators/currentUser.decorator';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() body: { name: string; description?: string },
  ) {
    return this.projectService.create(user.sub, body);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.projectService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.projectService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.projectService.update(id, user.sub, body);
  }

  @Delete(':id')
  delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.projectService.delete(id, user.sub);
  }
}
