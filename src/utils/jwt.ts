import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { envConfig } from "./envValidation";
import jwt from 'jsonwebtoken'
@Injectable()

export class JwtTokenService{
       constructor(private configService:ConfigService<envConfig>){}

     createAccessToken(userPayload:{id: string, name: string, email: string}){

      return jwt.sign(userPayload,this.configService.getOrThrow<string>('JWT_ACCESS_KEY_SECRET'),{expiresIn: '30m'})

     }
     verifyAccessToken(token: string){
      return jwt.verify(token,this.configService.getOrThrow<string>('JWT_ACCESS_KEY_SECRET')) as {id: string, name: string, email: string}

     }

}