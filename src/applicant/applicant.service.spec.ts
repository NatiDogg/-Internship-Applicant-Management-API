import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantService } from './applicant.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ApplicantService', () => {
  let service: ApplicantService;

  const mockPrismaService = {
    applicant: {
      count: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicantService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ApplicantService>(ApplicantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return applicants with pagination metadata', async () => {
    const mockApplicants = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];

    // Mock count and findMany for the Promise.all
    mockPrismaService.applicant.count.mockResolvedValue(2);
    mockPrismaService.applicant.findMany.mockResolvedValue(mockApplicants);

    // Passing {} so queryDto isn't undefined
    const result = await service.findAll({});

    expect(result).toEqual({
      data: mockApplicants,
      metaData: {
        total: 2,
        page: 1,
        limit: 5, // Default limit from  service
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    expect(mockPrismaService.applicant.count).toHaveBeenCalled();
    expect(mockPrismaService.applicant.findMany).toHaveBeenCalled();
  });
});