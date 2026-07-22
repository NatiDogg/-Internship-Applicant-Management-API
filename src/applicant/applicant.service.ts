import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicantDto } from './dtos/createApplicantDto';
import { ApplicationStatus, Prisma } from 'prisma/generated/prisma/client';
import { QueryApplicantDto } from './dtos/queryApplicantDto';
import { UpdateApplicantDto } from './dtos/updateApplicantDto';
import { UpdateStatusDto } from './dtos/updateStatusDto';
import { UpdateNotesDto } from './dtos/updateNotesDto';
import { success } from 'zod';

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
    async findAll(queryDto:QueryApplicantDto){
       const { page = 1,limit = 5,  search, status, track,  sortBy ='createdAt', sortOrder = 'desc'} = queryDto;
       const skip = (page - 1) * limit;
       const where: Prisma.ApplicantWhereInput = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (track) {
      where.track = track;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, applicants] = await Promise.all([
      this.prisma.applicant.count({ where }),
      this.prisma.applicant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: applicants,
      metaData: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
    }
    async findOne(id: string){
         const applicant = await this.prisma.applicant.findUnique({where: {id}})

         if(!applicant){
            throw new NotFoundException(`Applicant with ID "${id}" not found.`);
         }
         return {
            success: true,
            message: 'Applicant Retrieved Successfully',
            data: applicant
         }
    }
    async updateApplicant(id: string,updateDetails: UpdateApplicantDto){
    if(updateDetails.email){
      updateDetails.email = updateDetails.email.toLowerCase();
    }
    try {
    const updatedApplicant = await this.prisma.applicant.update({
      where: { id },
      data: updateDetails,
    });
    return {
        success: true,
        message: 'Applicant updated Successfully',
        data: updatedApplicant
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      
      if (error.code === 'P2002') {
        throw new BadRequestException('An applicant with this email already exists.');
      }
      
      if (error.code === 'P2025') {
        throw new NotFoundException(`Applicant with ID ${id} not found.`);
      }
    }

    throw error;
  }
           
 

    }

    async updateStatus(id: string,statusDto:UpdateStatusDto){
            const applicant = await this.prisma.applicant.findUnique({where: {id}})
            if(!applicant){
                 throw new NotFoundException(`Applicant with ID "${id}" not found.`);
            }
            const newStatus = statusDto.status;

            if(applicant.status === 'REJECTED' && 
           newStatus === ApplicationStatus.ACCEPTED){
              throw new BadRequestException(
                'Invalid status transition: Applicants cannot move directly from Rejected to Accepted.'
              );
            }
            const result = await this.prisma.applicant.update({
                where:{id},
                data:{status: newStatus}
            })
             return {
        success: true,
        message: 'Applicant status updated Successfully',
        data:result
    }
            


      
    }

    async updateNotes(id: string,notesDto:UpdateNotesDto){
         const applicant = await this.prisma.applicant.findUnique({where: {id}})
         if(!applicant){
                 throw new NotFoundException(`Applicant with ID "${id}" not found.`);
         }
         const result = await this.prisma.applicant.update({
            where:{id},
            data:{
                notes: notesDto.notes
            }
         })
          return {
        success: true,
        message: 'Applicant status updated Successfully',
        data:result
    }
    }

    async removeApplicant(id:string){
        
            const result = await this.prisma.applicant.updateMany({
                where:{id,deletedAt: null},
                data:{
                    deletedAt: new Date()
                }
            })
            if(result.count === 0){
                throw new NotFoundException(`Applicant with ID ${id} not found.`);
            }
            return {
                success: true,
                message: 'Applicant Removed Successfully'
            }
          
    }

}
