import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/guards/jwt-auth.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // lấy ra metadata từ request
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(
        err: any,
        user: TUser,
        // info: any,
        // context: ExecutionContext,
        // status?: any,
    ): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
