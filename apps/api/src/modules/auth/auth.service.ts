import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import {
    InsertCompany,
    InsertUser,
    usersTable,
    companiesTable,
    InsertHMRC,
} from '@workspace/database/dist/schema';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { Database } from '@workspace/database';

@Injectable()
export class AuthService {
    constructor(
        private readonly cognitoService: CognitoService,
        @Inject(DATABASE_CONNECTION) private readonly db: Database,
    ) {}

    async login(username: string, password: string) {
        const tokens = await this.cognitoService.login(username, password);
        return {
            success: true,
            data: tokens,
        };
    }

    async signup(signupDto: {
        user: InsertUser & InsertHMRC;
        company: InsertCompany;
    }) {
        // Validate passwords match
        if (signupDto.user.password !== signupDto.user.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        // 1. Create user in Cognito
        const cognitoResult = await this.cognitoService.signup(
            signupDto.user.email,
            signupDto.user.password,
            signupDto.user.email,
        );

        if (!cognitoResult.success) {
            throw new BadRequestException('Failed to create user in Cognito');
        }

        // 2. Create user and company in database using transaction
        return await this.db.transaction(async (tx) => {
            // Create user
            const userData: InsertUser = {
                firstName: signupDto.user.firstName,
                lastName: signupDto.user.lastName,
                email: signupDto.user.email,
                phoneNumber: signupDto.user.phoneNumber,
                jobTitle: signupDto.user.jobTitle,
                practiceType: signupDto.user.practiceType,
                password: signupDto.user.password,
                confirmPassword: signupDto.user.confirmPassword,
            };

            const [user] = await tx
                .insert(usersTable)
                .values([userData])
                .returning();

            // Create company
            const companyData = {
                name: signupDto.company.name,
                companyNumber: signupDto.company.companyNumber || null,
                vatNumber: signupDto.company.vatNumber || null,
                addressLine1: signupDto.company.addressLine1,
                addressLine2: signupDto.company.addressLine2 || null,
                city: signupDto.company.city,
                postcode: signupDto.company.postcode,
                phoneNumber: signupDto.company.phoneNumber || null,
                ownerId: user.id,
            };

            const [company] = await tx
                .insert(companiesTable)
                .values([companyData])
                .returning();

            return {
                success: true,
                data: {
                    user,
                    company,
                    cognitoUserSub: cognitoResult.userSub,
                },
            };
        });
    }

    async verifyOTP(email: string, otp: string) {
        const result = await this.cognitoService.verifyOTP(email, otp);
        console.log(result);
        return {
            success: true,
            data: result,
        };
    }

    async signInWithPassword(email: string, password: string) {
        const result = await this.cognitoService.signInWithPassword(
            email,
            password,
        );
        return result;
        // return {
        //     success: true,
        //     data: result,
        // };
    }
}
