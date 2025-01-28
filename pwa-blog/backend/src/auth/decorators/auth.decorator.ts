import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export function Auth(...args: Parameters<typeof Roles>) {
  return applyDecorators(Roles(...args), UseGuards(AuthGuard, RolesGuard));
}
