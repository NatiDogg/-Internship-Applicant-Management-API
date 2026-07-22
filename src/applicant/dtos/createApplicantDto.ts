import {IsEmail, IsEnum, IsNotEmpty,IsOptional,IsString} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InternshipTrack } from 'prisma/generated/prisma/enums';
export class CreateApplicantDto{
    @ApiProperty({ example: 'Abebe Kebede', description: 'Full name of the applicant' })
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    name!: string

    @ApiProperty({ example: 'abebe@example.com', description: 'Unique applicant email address' })
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({},{message: 'Please provide a valid email'})
    email!: string

    @ApiPropertyOptional({ example: '+251954912958', description: 'Optional contact phone number' })
    @IsOptional()
    @IsString({message: 'Phone must be a string'})
    phone!: string

    @ApiProperty({ 
    enum: InternshipTrack, 
    example: InternshipTrack.BACKEND_DEVELOPMENT,
    description: 'Internship track applied for' })
    @IsEnum(InternshipTrack,{message: 'Invalid internship track'})
    @IsNotEmpty({ message: 'Track is required' })
    track!: InternshipTrack 


   @ApiPropertyOptional({ example: 'Strong Node.js background', description: 'Optional initial notes' })
   @IsOptional()
   @IsString({ message: 'Notes must be a string' })
   notes?: string;


   
}

