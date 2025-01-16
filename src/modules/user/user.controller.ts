import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Roles } from '../auth/decorator/roles.decorator';
import { RoleType } from '../auth/enum/roles.enum';
import { JwtGuard } from '../auth/guard/jwt-guard';
import { RolesGuard } from '../auth/guard/roles-guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { AllUserDto } from './dto/all-user.dto';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // Create a new user
    @Post("/create")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async create(@Auth() user: any, @Body() createUserDto: CreateUserDto): Promise<any> {
        return this.userService.create(user, createUserDto);
    }

    // All user
    @Get("/all")
    @Roles(RoleType.Admin, RoleType.Teacher)
    @UseGuards(JwtGuard, RolesGuard)
    async all(@Query() allUserDto: AllUserDto): Promise<User[]> {
        return this.userService.all(allUserDto);
    }

    // Show specific user
    @Get("/view/:id")
    @Roles(RoleType.Admin, RoleType.Teacher, RoleType.EndUser)
    @UseGuards(JwtGuard, RolesGuard)
    async show(@Param("id", ParseIntPipe) id: number): Promise<User | null> {
        return this.userService.show(id);
    }

    // Update specific user
    @Put("/edit/:id")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async update(@Auth() auth: any, @Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<any> {
        return this.userService.update(auth, id, updateUserDto);
    }

    // Remove specific user
    @Delete("/remove/:id")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async remove(@Auth() auth: any, @Param("id", ParseIntPipe) id: number): Promise<any> {
        return this.userService.remove(auth, id);
    }

}
