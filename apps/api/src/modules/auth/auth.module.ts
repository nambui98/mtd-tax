import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CognitoService } from './cognito.service';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
    imports: [ConfigModule, UsersModule, CompaniesModule],
    controllers: [AuthController],
    providers: [AuthService, CognitoService],
    exports: [AuthService],
})
export class AuthModule {}
