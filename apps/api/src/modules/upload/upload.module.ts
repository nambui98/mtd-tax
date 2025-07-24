import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { DocumentsModule } from '../documents/documents.module';
import { S3Module } from './s3.module';

@Module({
    imports: [DocumentsModule, S3Module],
    controllers: [UploadController],
    providers: [UploadService],
    exports: [UploadService],
})
export class UploadModule {}
