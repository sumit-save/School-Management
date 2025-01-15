import { IsNotEmpty, IsString, IsEmail, IsInt, Min, IsEnum, IsIn } from 'class-validator';
import { SchoolType } from '../enum/school-type.enum';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Board } from 'src/modules/board/entity/board.entity';

export class CreateSchoolDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsInt()
    @Min(1900)
    @IsNotEmpty()
    established_year: number;

    @IsInt()
    @IsNotEmpty()
    board_id: number;

    @IsEnum(SchoolType)
    @IsNotEmpty()
    school_type: SchoolType;

    @IsInt()
    @Min(0)
    total_students: number;

    @IsInt()
    @Min(0)
    total_teachers: number;

    @IsString()
    image: string;

    @IsInt()
    @IsIn([0, 1])
    is_active: number;
}
