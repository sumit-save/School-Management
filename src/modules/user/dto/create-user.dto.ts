import { IsEmail, IsNotEmpty, IsString, Length, IsEnum, IsInt, IsIn, IsOptional } from "class-validator";
import { UserType } from "../enum/user-type.enum";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  role: UserType;

  @IsOptional()
  school_id: number;

  @IsInt()
  @IsIn([0, 1])
  is_active: number;
}
