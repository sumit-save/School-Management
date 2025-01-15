import { Module } from "@nestjs/common";
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "./entity/school.entity";
import { Board } from "../board/entity/board.entity";

@Module({
    imports: [TypeOrmModule.forFeature([School, Board])],
    controllers: [SchoolController],
    providers: [SchoolService]
})
export class SchoolModule { }