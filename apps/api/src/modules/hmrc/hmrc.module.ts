import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HmrcService } from './hmrc.service';
import { HmrcController } from './hmrc.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [ConfigModule, DatabaseModule],
    controllers: [HmrcController],
    providers: [HmrcService],
    exports: [HmrcService],
})
export class HmrcModule {}
