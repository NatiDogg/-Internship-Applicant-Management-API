import { Controller,Get,UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {

       constructor(private readonly dashboardService:DashboardService){}

       @Get('summary')
       @ApiOperation({ summary: 'Get overview statistics for the admin dashboard' })
       @ApiResponse({status: 200, description: 'Summary analytics including total counts, status breakdown, track breakdown, and recent applications.',
       })
       async getSummary(){
        return this.dashboardService.getApplicantSummary()
       }


}
