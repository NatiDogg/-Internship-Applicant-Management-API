import { PartialType } from '@nestjs/swagger';
import { CreateApplicantDto } from './createApplicantDto';

export class UpdateApplicantDto extends PartialType(CreateApplicantDto) {}