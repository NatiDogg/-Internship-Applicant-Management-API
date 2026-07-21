import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dtos/loginDto';
import { JwtTokenService } from 'src/utils/jwt';
import { matchPassword } from 'src/utils/bcryptJs';
import { Admin } from 'prisma/generated/prisma/client';

@Injectable()
export class AuthService {
  
    constructor(private prisma:PrismaService, private readonly jwtTokenService:JwtTokenService){}

    async login(loginDetails: LoginDto){
        const normalizedEmail = loginDetails.email.toLowerCase()
        const admin = await this.prisma.admin.findUnique({where:{
            email: normalizedEmail
        }})
        if(!admin){
            throw new UnauthorizedException("Invalid Credentials!")
        }
        const comparePassword = await matchPassword(loginDetails.password,admin.password)
        if(!comparePassword){
              throw new UnauthorizedException("Invalid Credentials!")
        }

        const {password, ...safeAdmin} = admin
        return this.generateResponseToken(safeAdmin, 'Admin loggedin Successfully')        
    }

    private generateResponseToken(user:Omit<Admin, 'password'>, message: string){
            const accessToken = this.jwtTokenService.createAccessToken({id: user.id, name: user.name, email: user.email})
            return {
                success: true,
                message: message,
                admin: user,
                accessToken: accessToken
            }

    }



}
