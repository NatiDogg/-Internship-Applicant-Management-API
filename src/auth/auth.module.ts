import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenService } from 'src/utils/jwt';
import {PassportModule} from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwtStrategy';

@Module({
  imports:[PassportModule.register({defaultStrategy: 'jwt'})],
  providers: [AuthService,JwtTokenService,JwtStrategy],
  controllers: [AuthController],
  exports:[PassportModule]
})
export class AuthModule {}
