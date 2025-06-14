import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesService } from './roles.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [
        DatabaseModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '1h',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [RolesGuard, RolesService],
    exports: [RolesGuard, RolesService],
})
export class RolesModule {}
