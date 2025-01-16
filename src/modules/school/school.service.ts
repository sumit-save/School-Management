import * as path from 'path';
import * as fs from "fs";
import * as moment from 'moment';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AllSchoolDto } from './dto/all-school.dto';
import { School } from './entity/school.entity';
import { Board } from '../board/entity/board.entity';

@Injectable()
export class SchoolService {
    constructor(
        @InjectRepository(School) private readonly schoolRepository: Repository<School>,
        @InjectRepository(Board) private readonly boardRepository: Repository<Board>
    ) { }

    async create(user: any, createSchoolDto: CreateSchoolDto): Promise<any> {
        try {
            const school = await this.schoolRepository.findOne({ where: { name: createSchoolDto.name, is_deleted: 0 } });
            if (school) {
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "School detail already exists.",
                    error: "Conflict"
                };
            }
            const board = await this.boardRepository.findOne({ where: { id: createSchoolDto.board_id } });
            if (!board) {
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Board detail not found.",
                    error: "Conflict"
                };
            }
            const insObj = { ...createSchoolDto, board: board, created_by: user?.id, created_at: new Date() };
            const newSchool = this.schoolRepository.create(insObj);
            const savedSchool = await this.schoolRepository.save(newSchool);
            return {
                statusCode: HttpStatus.CREATED,
                message: "School detail created successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while creating the school.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async all(allSchoolDto: AllSchoolDto): Promise<any> {
        try {
            var { search, start_date, end_date, sort, order, page, limit } = allSchoolDto;
            let pageSize = page ? parseInt(page) : 1;
            let limitSize = limit ? parseInt(limit) : 10;
            let sortKey = sort ? sort : 'created_at';
            let orderValue = order ? order : 'DESC';
            const options: FindManyOptions<School> = {
                where: { is_deleted: 0 },
                order: { [sortKey]: orderValue },
                skip: ((pageSize - 1) * limitSize),
                take: limitSize,
                relations: ['board'],
                select: ['id', 'name', 'address', 'phone', 'email', 'established_year', 'school_type', 'total_students', 'total_teachers', 'image', 'is_active', 'created_by', 'created_at']
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
            let [schools, totalCount] = await this.schoolRepository.findAndCount(options);
            schools = schools.map((item) => {
                const modifiedItem = { ...item, board: { ...item.board } };
                delete modifiedItem.board.updated_by;
                delete modifiedItem.board.updated_at;
                delete modifiedItem.board.is_deleted;
                delete modifiedItem.board.deleted_by;
                delete modifiedItem.board.deleted_at;
                return modifiedItem;
            });
            const totalPages = Math.ceil(totalCount / limitSize).toString();
            return {
                statusCode: HttpStatus.OK,
                message: "School's details fetched successfully.",
                data: {
                    records: schools,
                    pagination: { totalPages, totalRecords: totalCount.toString() }
                }
            };
        } catch (error) {
            console.error(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while fetching the schools.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async show(id: number): Promise<any> {
        try {
            const school = await this.schoolRepository.findOne({
                where: { id: id },
                relations: ['board'],
                select: ['id', 'name', 'address', 'phone', 'email', 'established_year', 'school_type', 'board', 'total_students', 'total_teachers', 'image', 'is_active', 'created_by', 'created_at']
            });
            delete school.board.updated_by;
            delete school.board.updated_at;
            delete school.board.is_deleted;
            delete school.board.deleted_by;
            delete school.board.deleted_at;
            if (!school) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "School detail not found.",
                    error: "Not found"
                };
            }
            return {
                statusCode: HttpStatus.OK,
                message: "School detail fetched successfully.",
                data: school
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while fetching the school.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(user: any, id: number, updateSchoolDto: UpdateSchoolDto): Promise<any> {
        try {
            const school = await this.schoolRepository.findOne({ where: { id: id }, relations: ['board'] });
            if (!school) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "School detail not found.",
                    error: "Not found"
                };
            }
            const board = await this.boardRepository.findOne({ where: { id: updateSchoolDto.board_id } });
            if (!board) {
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Board detail not found.",
                    error: "Conflict"
                };
            }
            const upObj = { ...updateSchoolDto, board: board, updated_by: user?.id, updated_at: new Date() };
            const updatedSchool = await this.schoolRepository.save({ id, ...upObj });
            return {
                statusCode: HttpStatus.OK,
                message: "School detail updated successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while updating the school.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async remove(user: any, id: number): Promise<any> {
        try {
            const school = await this.schoolRepository.findOne({ where: { id: id } });
            if (!school) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "School detail not found.",
                    error: "Not found"
                };
            }
            const upObj = { is_deleted: 1, deleted_by: user?.id, deleted_at: new Date() };
            const removedSchool = await this.schoolRepository.update(id, upObj);
            return {
                statusCode: HttpStatus.OK,
                message: "School detail removed successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while removing the school.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async upload(file: Express.Multer.File): Promise<any> {
        try {
            const uploadPath = path.join(process.cwd(), 'uploads');
            const filename = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(uploadPath, filename);
            const fileUrl = `http://localhost:3000/uploads/${filename}`;
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            const data = fs.writeFileSync(filePath, file.buffer);
            console.log(data);
            return {
                statusCode: HttpStatus.OK,
                message: "School image uploaded successfully.",
                data: { path: fileUrl }
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while uploading school image.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
