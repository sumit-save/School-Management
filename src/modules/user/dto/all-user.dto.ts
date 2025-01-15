import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class AllUserDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsDateString()
    @IsOptional()
    start_date?: string;

    @IsDateString()
    @IsOptional()
    end_date?: string;

    @IsString()
    @IsOptional()
    sort?: string;

    @IsEnum(['ASC', 'DESC'])
    @IsOptional()
    order?: 'ASC' | 'DESC' = 'DESC'

    @IsString()
    @IsOptional()
    page?: string = "1";

    @IsString()
    @IsOptional()
    limit?: string = "10";
}