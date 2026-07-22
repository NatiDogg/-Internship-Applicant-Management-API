import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicantDto } from './dtos/createApplicantDto';
import { Prisma } from 'prisma/generated/prisma/client';

@Injectable()
export class ApplicantService {

    constructor(private prisma:PrismaService){}

    async createApplicant(applicantDetails:CreateApplicantDto){
           const normalizedEmail = applicantDetails.email.toLowerCase()
        try {
            const newlyCreatedApplicant = await this.prisma.applicant.create({data:{
                
                ...applicantDetails,
                email: normalizedEmail,
              
                

            }})
            return {
                success: true,
                message: 'Applicant Created Successfully',
                data: newlyCreatedApplicant
            }
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                 throw new BadRequestException("An applicant with this email already exists")
            }
            throw error
        }



    }
}
