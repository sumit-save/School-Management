import * as moment from 'moment';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AllBoardDto } from './dto/all-board.dto';
import { Board } from './entity/board.entity';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board) private boardRepository: Repository<Board>
    ) { }

    async create(user: any, createBoardDto: CreateBoardDto): Promise<any> {
        try {
            const board = await this.boardRepository.findOne({ where: { name: createBoardDto.name, is_deleted: 0 } });
            if (board) {
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Board detail already exists.",
                    error: "Conflict",
                };
            }
            const insObj = { ...createBoardDto, created_by: user?.id, created_at: new Date() };
            const newBoard = this.boardRepository.create(insObj);
            const savedBoard = await this.boardRepository.save(newBoard);
            return {
                statusCode: HttpStatus.CREATED,
                message: "Board detail created successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while creating the board.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async all(allBoardDto: AllBoardDto): Promise<any> {
        try {
            var { search, start_date, end_date, sort, order, page, limit } = allBoardDto;
            let pageSize = page ? parseInt(page) : 1;
            let limitSize = limit ? parseInt(limit) : 10;
            let sortKey = sort ? sort : 'created_at';
            let orderValue = order ? order : 'DESC';
            const options: FindManyOptions<Board> = {
                where: { is_deleted: 0 },
                order: { [sortKey]: orderValue },
                skip: ((pageSize - 1) * limitSize),
                take: limitSize,
                select: ['id', 'name', 'address', 'phone', 'email', 'established_year', 'is_active', 'created_by', 'created_at']
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
            const [boards, totalCount] = await this.boardRepository.findAndCount(options);
            const totalPages = Math.ceil(totalCount / limitSize).toString();
            return {
                statusCode: HttpStatus.OK,
                message: "Board's details fetched successfully.",
                data: {
                    records: boards,
                    pagination: { totalPages, totalRecords: totalCount.toString() }
                }
            };
        } catch (error) {
            console.error(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while fetching the boards.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async show(id: number): Promise<any> {
        try {
            const board = await this.boardRepository.findOne({
                where: { id: id },
                select: ['id', 'name', 'address', 'phone', 'email', 'established_year', 'is_active', 'created_by', 'created_at']
            });
            if (!board) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "Board detail not found.",
                    error: "Not found"
                };
            }
            return {
                statusCode: HttpStatus.OK,
                message: "Board detail fetched successfully.",
                data: board
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while fetching the board.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(user: any, id: number, updateBoardDto: UpdateBoardDto): Promise<any> {
        try {
            const board = await this.boardRepository.findOne({ where: { id: id } });
            if (!board) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "Board detail not found.",
                    error: "Not found"
                };
            }
            const upObj = { ...updateBoardDto, updated_by: user?.id, updated_at: new Date() };
            const updatedBoard = await this.boardRepository.update(id, upObj);
            return {
                statusCode: HttpStatus.OK,
                message: "Board detail updated successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while updating the board.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async remove(user: any, id: number): Promise<any> {
        try {
            const board = await this.boardRepository.findOne({ where: { id: id } });
            if (!board) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "Board detail not found.",
                    error: "Not found"
                };
            }
            const upObj = { is_deleted: 1, deleted_by: user?.id, deleted_at: new Date() };
            const removedBoard = await this.boardRepository.update(id, upObj);
            return {
                statusCode: HttpStatus.OK,
                message: "Board detail removed successfully.",
                data: null
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred while removing the board.',
                    error: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
