import { Injectable,OnModuleInit,OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'prisma/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { envConfig } from 'src/utils/envValidation';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    constructor( configService: ConfigService<envConfig>){
        const adapter = new PrismaPg({connectionString: configService.get<string>("DATABASE_URL") })
        super({adapter})
    }
     async onModuleInit() {
        
    }
    async onModuleDestroy() {
        await this.$disconnect()
    }
}
