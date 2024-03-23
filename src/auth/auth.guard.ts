import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from 'src/enum';
import { ExceptionResponse } from 'src/shared';
import { IS_PUBLIC_KEY, ROLES_KEY } from './roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    // private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new ExceptionResponse(
        HttpStatus.UNAUTHORIZED,
        'Xác thực user không thành công',
      );
    }

    // const hasAccess = await this.authService.getUserById(
    //   new Types.ObjectId(payload._id),
    //   token,
    // );

    // if (!hasAccess) {
    //   throw new ExceptionResponse(
    //     HttpStatus.UNAUTHORIZED,
    //     'Xác thực user không thành công',
    //   );
    // }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
    } else {
      if (!requiredRoles.includes(payload?.role)) {
        throw new ExceptionResponse(
          HttpStatus.FORBIDDEN,
          'Không có quyền truy cập',
        );
      }
    }

    request['user'] = payload;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
