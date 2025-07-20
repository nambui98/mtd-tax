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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { Public } from 'src/common/guards/jwt-auth.guard';

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

    @Public()
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('staff')
    @ApiOperation({ summary: 'Get all staff users' })
    @ApiResponse({
        status: 200,
        description: 'All staff users',
        schema: {
            type: 'array',
            items: {
                type: 'object',
            },
        },
    })
    getStaffUsers() {
        return this.usersService.getStaffUsers();
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
