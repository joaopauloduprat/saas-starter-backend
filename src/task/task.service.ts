import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async create(projectId: string, data: CreateTaskDto) {
    return this.prismaService.task.create({
      data: { ...data, projectId },
    });
  }

  async findAll(projectId: string) {
    return this.prismaService.task.findMany({
      where: { projectId },
    });
  }

  async findOne(projectId: string, id: string) {
    const task = await this.prismaService.task.findFirst({
      where: { id, projectId },
    });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);

    return task;
  }

  async update(projectId: string, id: string, data: UpdateTaskDto) {
    await this.findOne(projectId, id);
    return this.prismaService.task.update({
      where: { id },
      data,
    });
  }

  async delete(projectId: string, id: string) {
    await this.findOne(projectId, id);
    return this.prismaService.task.delete({
      where: { id },
    });
  }
}
