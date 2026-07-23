import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  imports: [AuthModule]
})
export class DashboardModule {}
