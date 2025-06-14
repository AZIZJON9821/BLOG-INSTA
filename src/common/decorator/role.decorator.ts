// roles.decorator.ts
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Protected } from './protec.decorator'; 

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => {
  return applyDecorators(
    Protected(true), 
    SetMetadata(ROLES_KEY, roles),
  );
};
