import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { School } from '../school/entity/school.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, School])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
