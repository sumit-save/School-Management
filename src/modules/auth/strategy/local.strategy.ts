import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: "email", passwordField: "password" });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException( 
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: "Email not found.",
                    error: "Unauthorized"
                }
            );
        }
        if (user.is_active === 0 || user.is_deleted === 1) {
            throw new UnauthorizedException( 
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: "User is inactive or deleted.",
                    error: "Unauthorized"
                }
            );
        }
        const isMatched = await this.authService.comparePassword(password, user.password);
        if (!isMatched) {
            throw new UnauthorizedException( 
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: "Password not matched.",
                    error: "Unauthorized"
                }
            );
        }
        delete user.password;
        return user;
    }

}
