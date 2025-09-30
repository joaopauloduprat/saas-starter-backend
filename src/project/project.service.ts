import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found or access denied');
    }

    return project;
  }

  async update(id: string, userId: string, data: UpdateProjectDto) {
    await this.findOne(id, userId);

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
