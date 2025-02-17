import * as bcrypt from "bcryptjs";
import * as moment from "moment";
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { School } from "../school/entity/school.entity";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AllUserDto } from './dto/all-user.dto';
import { UserType } from "./enum/user-type.enum";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(School) private readonly schoolRepository: Repository<School>
    ) { }

    async create(user: any, createUserDto: CreateUserDto): Promise<any> {
        try {
            const email = await this.userRepository.findOne({ where: { email: createUserDto.email, is_deleted: 0 } });
            if (email) {
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Email already taken",
                    error: "Conflict"
                };
            };
            const school = await this.schoolRepository.findOne({ where: { id: createUserDto.school_id } });
            if (createUserDto.role === UserType.Teacher && !createUserDto.school_id) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "School id is required if selected role as teacher.",
                    error: "Bad Request"
                };
            }
            if (createUserDto.role === UserType.Teacher && !school) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "School detail not found",
                    error: "Not Found"
                };
            }
            const hash = await bcrypt.hash(createUserDto.password, 10);
            const insObj = {
                ...createUserDto,
                school: school,
                password: hash,
                created_by: user?.id,
                created_at: new Date()
            };
            const newUser = this.userRepository.create(insObj);
            const savedUser = await this.userRepository.save(newUser);
            return {
                statusCode: HttpStatus.CREATED,
                message: "User detail added successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "An error occurred while fetching the user.",
                    error: "Internal server error"
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async all(allUserDto: AllUserDto): Promise<any> {
        try {
            var { search, start_date, end_date, sort, order, page, limit } = allUserDto;
            let pageSize = page ? parseInt(page) : 1;
            let limitSize = limit ? parseInt(limit) : 10;
            let sortKey = sort ? sort : 'created_at';
            let orderValue = order ? order : 'DESC';
            const options: FindManyOptions<User> = {
                where: { is_deleted: 0 },
                order: { [sortKey]: orderValue },
                skip: ((pageSize - 1) * limitSize),
                take: limitSize,
                relations: ['school', 'school.board'],
                select: ['id', 'name', 'email', 'address', 'role', 'is_active', 'created_by', 'created_at', 'school']
            };
            if (search) {
                options.where = { ...options.where, name: Like(`%${search}%`) };
            }
            if (start_date) {
                options.where = { ...options.where, created_at: MoreThanOrEqual(moment(start_date).startOf('day').toDate()) };
            }
            if (end_date) {
                options.where = { ...options.where, created_at: LessThanOrEqual(moment(end_date).endOf('day').toDate()) };
            }
            const [users, totalCount] = await this.userRepository.findAndCount(options);
            const totalPages = Math.ceil(totalCount / limitSize).toString();
            return {
                statusCode: HttpStatus.OK,
                message: "User's details fetched successfully.",
                data: {
                    records: users,
                    pagination: { totalPages, totalRecords: totalCount.toString() }
                }
            };
        } catch (error) {
            console.error(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while fetching the users.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async show(id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: id },
                relations: ['school', 'school.board'],
                select: ['id', 'name', 'email', 'password', 'address', 'role', 'is_active', 'created_by', 'created_at', 'school']
            });
            if (!user) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "User detail not found.",
                    error: "Not found"
                };
            }
            return {
                statusCode: HttpStatus.OK,
                message: "User detail fetched successfully.",
                data: user
            }
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "An error occurred while fetching the user.",
                    error: "Internal server error"
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(user: any, id: number, updateUserDto: UpdateUserDto): Promise<any> {
        try {
            const record = await this.userRepository.findOne({ where: { id: id } });
            if (!record) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "User detail not found.",
                    error: "Not found"
                };
            }
            const school = await this.schoolRepository.findOne({ where: { id: updateUserDto.school_id } });
            if (updateUserDto.role === UserType.Teacher && !updateUserDto.school_id) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "School id is required if selected role as teacher.",
                    error: "Bad Request"
                };
            }
            if (updateUserDto.role === UserType.Teacher && !school) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "School detail not found",
                    error: "Not Found"
                };
            }
            const upObj = { ...updateUserDto, school: school, updated_by: user?.id, updated_at: new Date() };
            const updatedUser = await this.userRepository.save({ id, ...upObj });
            return {
                statusCode: HttpStatus.OK,
                message: "User detail updated successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while updating the user.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async remove(user: any, id: number): Promise<any> {
        try {
            const record = await this.userRepository.findOne({ where: { id: id } });
            if (!record) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "User detail not found.",
                    error: "Not found"
                };
            }
            const upObj = { is_deleted: 1, deleted_by: user?.id, deleted_at: new Date() };
            const removedUser = await this.userRepository.update(id, upObj);
            return {
                statusCode: HttpStatus.OK,
                message: "User detail removed successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while removing the user.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
