import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AllSchoolDto } from './dto/all-school.dto';
import { School } from './entity/school.entity';
import { Roles } from '../auth/decorator/roles.decorator';
import { RoleType } from '../auth/enum/roles.enum';
import { RolesGuard } from '../auth/guard/roles-guard';
import { JwtGuard } from '../auth/guard/jwt-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('/api/school')
export class SchoolController {
    constructor(private readonly schoolService: SchoolService) { }

    // Create a new school
    @Post("/create")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard)
    async create(@Auth() auth: any, @Body() createSchoolDto: CreateSchoolDto): Promise<any> {
        return this.schoolService.create(auth, createSchoolDto);
    }

    // All school
    @Get("/all")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async all(@Query() allSchoolDto: AllSchoolDto): Promise<School[]> {
        return this.schoolService.all(allSchoolDto);
    }

    // Show specific school
    @Get("/view/:id")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async show(@Param("id", ParseIntPipe) id: number): Promise<School | null> {
        return this.schoolService.show(id);
    }

    // Update specific school
    @Put("/edit/:id")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async update(@Auth() auth: any, @Param("id", ParseIntPipe) id: number, @Body() updateSchoolDto: UpdateSchoolDto): Promise<any> {
        return this.schoolService.update(auth, id, updateSchoolDto);
    }

    // Remove specific school
    @Delete("/remove/:id")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async remove(@Auth() auth: any, @Param("id", ParseIntPipe) id: number): Promise<any> {
        return this.schoolService.remove(auth, id);
    }

    // Upload image
    @Post("/upload")
    @UseInterceptors(FileInterceptor("file", {
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Invalid file type. only jpeg, jpg, and png are allowed.',
                    error: 'Bad request'
                }, HttpStatus.BAD_REQUEST), false);
            }
        }
    }))
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async upload(@UploadedFile() file: Express.Multer.File): Promise<any> {
        return this.schoolService.upload(file);
    }

}
