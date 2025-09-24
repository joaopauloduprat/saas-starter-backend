import { Task } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async create(projectId: string, data: Task): Promise<Task> {
    return this.prismaService.task.create({
      data: { ...data, projectId },
    });
  }

  async findAll(projectId: string): Promise<Task[]> {
    return this.prismaService.task.findMany({
      where: { projectId },
    });
  }

  async findOne(projectId: string, id: string): Promise<Task> {
    const task = await this.prismaService.task.findFirst({
      where: { id, projectId },
    });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);

    return task;
  }

  async update(
    projectId: string,
    id: string,
    data: Partial<Task>,
  ): Promise<Task> {
    await this.findOne(projectId, id);
    return this.prismaService.task.update({
      where: { id },
      data,
    });
  }

  async delete(projectId: string, id: string): Promise<Task> {
    await this.findOne(projectId, id);
    return this.prismaService.task.delete({
      where: { id },
    });
  }
}
