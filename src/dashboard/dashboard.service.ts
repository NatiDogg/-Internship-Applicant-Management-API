import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InternshipTrack,ApplicationStatus } from 'prisma/generated/prisma/enums';
@Injectable()
export class DashboardService {

      constructor(private  prisma:PrismaService){}

    async getApplicantSummary(){

          const [totalApplicants,statusCounts,trackCounts,recentApplicants] = await Promise.all([
              this.prisma.applicant.count({where: {deletedAt: null}}),
              this.prisma.applicant.groupBy({by: ['status'], where: {deletedAt: null},_count:{_all: true}}),
              this.prisma.applicant.groupBy({
                     by: ['track'],
                    where: {deletedAt: null},
                     _count: { _all: true },
                }),
                this.prisma.applicant.findMany({where: {deletedAt:null}, take: 5, orderBy: {createdAt: 'desc'}, select: {id: true, name: true,email: true,track: true,status: true, createdAt: true,}})
          ])
          const byStatus = Object.values(ApplicationStatus).reduce((acc, status) => {
             const match = statusCounts.find((item) => item.status === status);
             acc[status] = match ? match._count._all : 0;
              return acc;
            }, {} as Record<ApplicationStatus, number>);

            const byTrack = Object.values(InternshipTrack).reduce((acc,track)=>{
                const match = trackCounts.find((item) => item.track === track);
                acc[track] = match ? match._count._all : 0;
                 return acc;
            },{} as Record<InternshipTrack, number>)

          return {
            success: true,
            message: 'Applicant Summary retrieved Successfully',
            data:{
                totalApplicants: totalApplicants,
                statusCount:byStatus ,
                trackCounts: byTrack,
                recentApplicants: recentApplicants
            }
          }
    }
}
