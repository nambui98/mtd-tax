import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { HmrcModule } from '../hmrc/hmrc.module';
import { DatabaseModule } from 'src/database/database.module';
import { S3Module } from '../upload/s3.module';

@Module({
    imports: [HmrcModule, DatabaseModule, S3Module],
    controllers: [DocumentsController],
    providers: [DocumentsService],
    exports: [DocumentsService],
})
export class DocumentsModule {}
