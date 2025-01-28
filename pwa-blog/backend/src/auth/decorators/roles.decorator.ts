import { SetMetadata } from '@nestjs/common';
import { Role } from '@pwa/shared';

export const ROLES_METADATA_KEY = '__ROLES__';
export const Roles = (role?: Role) => SetMetadata(ROLES_METADATA_KEY, role);
