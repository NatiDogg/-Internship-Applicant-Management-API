import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './utils/envValidation';
import { AuthModule } from './auth/auth.module';
import { ApplicantModule } from './applicant/applicant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    PrismaModule,
    AuthModule,
    ApplicantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
