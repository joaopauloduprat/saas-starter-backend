import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: { $connect: jest.fn(), $disconnect: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call $connect on init', async () => {
    await service.$connect();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('should call $disconnect on destroy', async () => {
    await service.$disconnect();
    expect(service.$disconnect).toHaveBeenCalled();
  });
});
