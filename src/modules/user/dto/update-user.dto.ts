import { IsEmail, IsNotEmpty, IsString, Length, IsEnum, IsInt, IsIn } from "class-validator";
import { UserType } from "../enum/user-type.enum";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  role: UserType;

  @IsInt()
  @IsIn([0, 1])
  is_active: number;
}
