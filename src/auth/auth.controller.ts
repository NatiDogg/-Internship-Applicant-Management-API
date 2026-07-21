import { Controller, Post,Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/loginDto';
import {ApiTags, ApiOperation,ApiBearerAuth} from '@nestjs/swagger'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin login' })
    async loginUser(loginDetails:LoginDto){
        return await this.authService.login(loginDetails)

    }
    @Get('me')
    @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current loggedin admin profile' })
    async getProfile(){

    }
}
