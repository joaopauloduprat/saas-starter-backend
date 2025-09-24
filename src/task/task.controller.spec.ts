import { Task } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';

describe('TaskController', () => {
  let controller: TaskController;
  let mockTaskService: DeepMockProxy<TaskService>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'First',
      status: 'todo',
      projectId: '1',
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Second',
      status: 'in-progress',
      projectId: '1',
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: mockDeep<TaskService>() }],
    }).compile();

    controller = module.get(TaskController);
    mockTaskService = module.get(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    mockTaskService.create.mockResolvedValue(mockTasks[0]);

    const task = await controller.create('1', {
      id: '3',
      title: 'Task 1',
      description: 'First',
      status: 'todo',
      projectId: '1',
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(task).toEqual(mockTasks[0]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockTaskService.create).toHaveBeenCalledWith('1', {
      id: '3',
      title: 'Task 1',
      description: 'First',
      status: 'todo',
      projectId: '1',
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should return all tasks from a project', async () => {
    mockTaskService.findAll.mockResolvedValue(mockTasks);

    const tasks = await controller.findAll('1');

    expect(tasks).toEqual(mockTasks);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockTaskService.findAll).toHaveBeenCalledWith('1');
  });

  it('should return one task', async () => {
    mockTaskService.findOne.mockResolvedValue(mockTasks[0]);

    const task = await controller.findOne('1', '1');

    expect(task).toEqual(mockTasks[0]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockTaskService.findOne).toHaveBeenCalledWith('1', '1');
  });

  it('should update a task', async () => {
    mockTaskService.update.mockResolvedValue({
      ...mockTasks[0],
      title: 'Updated Task',
    });

    const updated = await controller.update('1', '1', {
      title: 'Updated Task',
    });

    expect(updated.title).toBe('Updated Task');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockTaskService.update).toHaveBeenCalledWith('1', '1', {
      title: 'Updated Task',
    });
  });

  it('should delete a task', async () => {
    mockTaskService.delete.mockResolvedValue(mockTasks[1]);

    const deleted = await controller.remove('1', '2');

    expect(deleted).toEqual(mockTasks[1]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockTaskService.delete).toHaveBeenCalledWith('1', '2');
  });
});
