import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,ExtractJwt} from 'passport-jwt'
import { ConfigService } from "@nestjs/config";
import { envConfig } from "src/utils/envValidation";
import { PrismaService } from "src/prisma/prisma.service";
import { Admin } from "prisma/generated/prisma/client";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private configService:ConfigService<envConfig>, private prisma:PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_SECRET_KEY")
        })
    }

    async validate(payload:{id: string, name: string, email: string}): Promise<Omit<Admin, 'password'>> {
        const admin = await this.prisma.admin.findUnique({where: {id: payload.id}, omit: {password: true}})
        if(!admin){
            throw new UnauthorizedException("Admin account no longer exists")
        }
        return {
         ...admin
        }


    }


}