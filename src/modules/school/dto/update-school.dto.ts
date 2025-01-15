import { IsNotEmpty, IsString, IsEmail, IsInt, Min, IsEnum, IsIn } from 'class-validator';
import { SchoolType } from '../enum/school-type.enum';

export class UpdateSchoolDto {
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

    @IsEnum(SchoolType)
    @IsNotEmpty()
    school_type: SchoolType;

    @IsInt()
    @IsNotEmpty()
    board_id: number;

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
