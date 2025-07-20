import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { HmrcModule } from '../hmrc/hmrc.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [HmrcModule, DatabaseModule],
    controllers: [DocumentsController],
    providers: [DocumentsService],
    exports: [DocumentsService],
})
export class DocumentsModule {}
