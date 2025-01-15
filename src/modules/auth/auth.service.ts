import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/entity/user.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async login(user: any): Promise<any> {
        try {
            const payload = { id: user.id, name: user.name, role: user.role };
            const token = this.jwtService.sign(payload);
            return {
                statusCode: HttpStatus.OK,
                message: "User login successfully",
                data: { token: token }
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while user login.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async logout(user: any): Promise<any> {
        try {
            return {
                statusCode: HttpStatus.OK,
                message: "User logout successfully",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while user logout.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        const result = await this.userRepository.findOne({ where: { email: username } });
        return result;
    }

    async comparePassword(password: string, storePassword: string): Promise<boolean> {
        const result = await bcrypt.compare(password, storePassword);
        return result;
    }

}