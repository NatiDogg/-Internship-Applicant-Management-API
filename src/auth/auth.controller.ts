import { Controller, Post,Get, HttpCode, HttpStatus, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/loginDto';
import {ApiTags, ApiOperation,ApiBearerAuth} from '@nestjs/swagger'
import { CurrentUser } from './decorators/currentUserDecorator';
import { Admin } from 'prisma/generated/prisma/client';
import { JwtAuthGuard } from './guards/jwtAuthGuard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin login' })
    async loginUser(@Body() loginDetails:LoginDto){
        return await this.authService.login(loginDetails)

    }
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current loggedin admin profile' })
    async getProfile(@CurrentUser() admin:Omit<Admin, 'password'>){
           return {admin: admin}
    }
}
