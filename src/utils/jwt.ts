import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { envConfig } from "./envValidation";
@Injectable()

export class jwtTokenService{
       constructor(private configService:ConfigService<envConfig>){}

     createAccessToken(){

     }
     verifyAccessToken(){

     }

}