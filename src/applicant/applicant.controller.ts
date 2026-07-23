import { Controller,Get,Post,Patch,Param, UseGuards,Query,Body, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import {ApiTags,ApiOperation,ApiResponse,ApiBearerAuth,ApiParam,} from '@nestjs/swagger';
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dtos/createApplicantDto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { QueryApplicantDto } from './dtos/queryApplicantDto';
import { UpdateApplicantDto } from './dtos/updateApplicantDto';
import { UpdateStatusDto } from './dtos/updateStatusDto';
import { UpdateNotesDto } from './dtos/updateNotesDto';
@ApiTags('Applicants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applicants')
export class ApplicantController {

       constructor(private readonly applicantService:ApplicantService){}


       @Post()
       @HttpCode(HttpStatus.CREATED)
       @ApiOperation({ summary: 'Create a new applicant' })
       @ApiResponse({ status: 201, description: 'Applicant successfully created.' })
       @ApiResponse({ status: 400, description: 'Bad Request (Validation failure).' })

       async createApplicant(@Body() applicantDetails:CreateApplicantDto){
           return this.applicantService.createApplicant(applicantDetails)
       }

       @Get()
       @ApiOperation({ summary: 'Get all applicants (Paginated, Filtered, Searched)' })
       @ApiResponse({ status: 200, description: 'Paginated list of applicants with metadata.' })

       async getAll(@Query() queryDto: QueryApplicantDto){
          return this.applicantService.findAll(queryDto)
       }

       @Get(':id')
       @ApiOperation({ summary: 'Get applicant details by ID' })
       @ApiParam({ name: 'id', description: 'Applicant UUID', example: 'cm123abc456' })
       @ApiResponse({ status: 200, description: 'Applicant details returned.' })
       @ApiResponse({ status: 404, description: 'Applicant not found.' })

       async getOne(@Param('id') id: string){
           return this.applicantService.findOne(id)
       }

       @Patch(":id")
       @ApiOperation({ summary: 'Update applicant general information (Name, Email, Phone, Track)' })
       @ApiParam({ name: 'id', description: 'Applicant CUID/UUID', example: 'cm123abc456' })
       @ApiResponse({ status: 200, description: 'Applicant details successfully updated.' })
       @ApiResponse({ status: 404, description: 'Applicant not found.' })

       async updateApplicant(@Param('id') id: string, @Body() applicantDetails:UpdateApplicantDto){
            return this.applicantService.updateApplicant(id,applicantDetails)
       }

       @Patch(":id/status")
       @ApiOperation({ summary: 'Update application status (Pending, Shortlisted, Accepted, Rejected)' })
       @ApiParam({ name: 'id', description: 'Applicant CUID/UUID', example: 'cm123abc456' })
       @ApiResponse({ status: 200, description: 'Status updated successfully.' })
       @ApiResponse({ status: 400, description: 'Invalid status transition (e.g., Rejected -> Accepted).' })
       @ApiResponse({ status: 404, description: 'Applicant not found.' })

       async updateStatus(@Param('id') id: string, @Body() statusDetails:UpdateStatusDto){
           return this.applicantService.updateStatus(id,statusDetails)
       }

       @Patch(':id/notes')
       @ApiOperation({ summary: 'Update admin notes for an applicant (Max 1000 chars)' })
       @ApiParam({ name: 'id', description: 'Applicant CUID/UUID', example: 'cm123abc456' })
       @ApiResponse({ status: 200, description: 'Notes updated successfully.' })
       @ApiResponse({ status: 400, description: 'Notes exceed length limit.' })
       @ApiResponse({ status: 404, description: 'Applicant not found.' })
       async updateNotes(@Param('id') id: string, @Body() updateNotesDetail:UpdateNotesDto){
          return this.applicantService.updateNotes(id,updateNotesDetail)
       }

       @Delete(':id')
       @HttpCode(HttpStatus.OK)
       @ApiOperation({ summary: 'Soft-delete an applicant' })
       @ApiParam({ name: 'id', description: 'Applicant CUID/UUID', example: 'cm123abc456' })
       @ApiResponse({ status: 200, description: 'Applicant soft-deleted successfully.' })
       @ApiResponse({ status: 404, description: 'Applicant not found.' })
       async removeApplicant(@Param('id') id: string){
            return this.applicantService.removeApplicant(id)
       }


       

}
