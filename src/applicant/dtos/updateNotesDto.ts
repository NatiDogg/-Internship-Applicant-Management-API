import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotesDto{
    @ApiProperty({ 
    example: 'Passed initial technical screening. Strong understanding of NestJS and PostgreSQL.',
    description: 'Internal admin notes (max 1000 characters)' 
  })
    @IsNotEmpty({message: 'Notes field cannot be empty'})
    @IsString({message: 'Notes must be a string'})
    @MaxLength(1000,{message:'Notes must not exceed 1,000 characters'})
    notes!: string
}