import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => {
    return {
        secret: configService.get<string>("jwt.secret"),
        signOptions: { 
            expiresIn: configService.get<string>("jwt.expiry")
        }
    };
}
