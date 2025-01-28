import { z } from 'zod';

/**
 * User Role enumerator, defined from least privileged to most privileged.
 */
export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const RoleSchema = z.nativeEnum(Role);

/**
 * List of ˋRolesˋ ordered from least privileged to most privileged.
 */
export const ROLES_LIST = [Role.User, Role.Admin] as const;

/**
 * Returns a `boolean` indicating if `role` includes the target `targetRole`.
 *
 * e.g A user with `Role.Admin` has both `Role.Admin` and `Role.User`
 */
export const includesRole = (role: Role, targetRole: Role): boolean => {
  const index = ROLES_LIST.indexOf(targetRole);
  if (index === -1) return false;
  return ROLES_LIST
    .slice(index, ROLES_LIST.length)
    .includes(role);
};
