import {CanActivate,ExecutionContext,ForbiddenException,Injectable,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/common/decorator';
import { UserRoles } from '../../users/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private metadataReflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<
      Request & { userRole?: UserRoles; userIdentifier?: string }
    >();
const allowedRoles = this.metadataReflector.getAllAndOverride<UserRoles[]>(
  ROLES_KEY,
  [context.getHandler(), context.getClass()],
);
// console.log(allowedRoles);
  if (!allowedRoles || allowedRoles.length === 0) return true;


// console.log(req.userRole);

const currentUserRole = req.userRole;

if (!currentUserRole || !allowedRoles.includes(currentUserRole)) {
  throw new ForbiddenException('admin emasiz');
}

return true;
  }

}
