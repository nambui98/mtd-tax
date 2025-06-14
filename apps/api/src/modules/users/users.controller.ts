import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    InsertHMRC,
    InsertUser,
    insertUserSchema,
    UpdateUserDto,
    updateUserSchema,
    User,
} from '@workspace/database/dist/index';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UsePipes(new ZodValidationPipe(insertUserSchema))
    async create(
        @Body()
        createUserDto: InsertUser &
            InsertHMRC & { passwordHash: string; otpSecret: string },
    ): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }
    @Patch(':id')
    @UsePipes(new ZodValidationPipe(updateUserSchema))
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
