import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import {
    Database,
    insertCompanySchema,
    InsertCompany,
    companiesTable,
} from '@workspace/database';

@Injectable()
export class CompaniesService {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

    async create(createCompanyDto: InsertCompany) {
        const result = insertCompanySchema.safeParse(createCompanyDto);
        if (!result.success) {
            throw new Error('Invalid company data');
        }
        const [company] = await this.db
            .insert(companiesTable)
            .values([result.data])
            .returning();
        return company;
    }
}
