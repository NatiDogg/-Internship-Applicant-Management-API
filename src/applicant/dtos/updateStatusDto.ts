import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStatus } from "prisma/generated/prisma/enums";
export class UpdateStatusDto{
     @ApiProperty({ 
    enum: ApplicationStatus, 
    example: ApplicationStatus.SHORTLISTED,
    description: 'New application status' 
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(ApplicationStatus, {message: 'Invalid application status'})
  status!:ApplicationStatus
  
}