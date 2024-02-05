import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, User } from "@prisma/client";
import { ROLE_KEY } from "../decorator/role.decorator";
import { Request } from "express";

export default class RoleGuard implements CanActivate {
    constructor(@Inject(Reflector) private reflector: Reflector) {}
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [context.getHandler()]);
        if(!requiredRoles) return true;
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as User
        return requiredRoles.some(role => role === user.role);
    }
}