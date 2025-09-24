import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import type { Task } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

import { TaskService } from './task.service';

@UseGuards(AuthGuard('jwt'))
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() body: Task,
  ): Promise<Task> {
    return this.taskService.create(projectId, body);
  }

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.taskService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.taskService.findOne(projectId, id);
  }

  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() body: Partial<Task>,
  ) {
    return this.taskService.update(projectId, id, body);
  }

  @Delete(':id')
  remove(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.taskService.delete(projectId, id);
  }
}
