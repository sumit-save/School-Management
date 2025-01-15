import { IsNotEmpty, IsString, IsEmail, IsInt, Min, IsIn } from 'class-validator';

export class UpdateBoardDto {
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
    @IsIn([0, 1])
    is_active: number;
}
