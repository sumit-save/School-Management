import { ConfigService } from "@nestjs/config";

export const redisConfig = (configService: ConfigService): any => {
    return {
        host: configService.get<string>("redis.host"),
        port: configService.get<number>("redis.port"),
        password: configService.get<string>('redis.password'),
        db: configService.get<number>('redis.database') 
    };
}
