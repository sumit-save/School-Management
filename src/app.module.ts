import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SchoolModule } from './modules/school/school.module';
import { BoardModule } from './modules/board/board.module';

@Module({
  imports: [
    // Configure environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./src/config/env/.${process.env.ENVIRONMENT || 'development'}.env`,
      load: [appConfig],
    }),
    // Configure type orm
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => databaseConfig(configService)
    }),
    // Import modules
    AuthModule,
    UserModule,
    SchoolModule,
    BoardModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
