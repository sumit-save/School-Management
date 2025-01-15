import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AllBoardDto } from './dto/all-board.dto';
import { Board } from './entity/board.entity';
import { Roles } from '../auth/decorator/roles.decorator';
import { RoleType } from '../auth/enum/roles.enum';
import { RolesGuard } from '../auth/guard/roles-guard';
import { JwtGuard } from '../auth/guard/jwt-guard';
import { Auth } from '../auth/decorator/auth.decorator';


@Controller('/api/board')
export class BoardController {
    constructor(private readonly boardService: BoardService) { }

    // Create a new board
    @Post("/create")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard)
    async create(@Auth() auth: any, @Body() createBoardDto: CreateBoardDto): Promise<any> {
        return this.boardService.create(auth, createBoardDto);
    }

    // All board
    @Get("/all")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async all(@Query() allBoardDto: AllBoardDto): Promise<Board[]> {
        return this.boardService.all(allBoardDto);
    }

    // Show specific board
    @Get("/view/:id")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async show(@Param("id", ParseIntPipe) id: number): Promise<Board | null> {
        return this.boardService.show(id);
    }

    // Update specific board
    @Put("/edit/:id")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async update(@Auth() auth: any, @Param("id", ParseIntPipe) id: number, @Body() updateBoardDto: UpdateBoardDto): Promise<any> {
        return this.boardService.update(auth, id, updateBoardDto);
    }

    // Remove specific board
    @Delete("/remove/:id")
    @Roles(RoleType.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async remove(@Auth() auth: any, @Param("id", ParseIntPipe) id: number): Promise<any> {
        return this.boardService.remove(auth, id);
    }

}
