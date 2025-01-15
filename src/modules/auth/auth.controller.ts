import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalGuard } from "./guard/local-guard";
import { JwtGuard } from "./guard/jwt-guard";
import { Auth } from "./decorator/auth.decorator";
import { Roles } from "./decorator/roles.decorator";
import { RolesGuard } from "./guard/roles-guard";
import { RoleType } from "./enum/roles.enum";

@Controller("/api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Login
    @Post("/login")
    @UseGuards(LocalGuard)
    async login(@Auth() auth: any): Promise<any> {
        return this.authService.login(auth);
    }

    // Logout
    @Post("/logout")
    @Roles(RoleType.Admin, RoleType.EndUser)
    @UseGuards(JwtGuard, RolesGuard)
    async logout(@Auth() auth: any): Promise<any> {
        return this.authService.logout(auth);
    }

}