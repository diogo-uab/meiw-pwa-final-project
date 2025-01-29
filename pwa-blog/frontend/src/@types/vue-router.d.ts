import type { Role } from '@pwa/shared';

export {}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Defines if a route is public, and doesn't require authentication.
     * By default, every route requires authentication.
     * If set to `true`, `meta.requiresRole` is ignored.
     */
    isPublic?: boolean;
    /**
     * Defines the required `Role` for a route.
     * If not set, any role is allowed.
     * @example { requiresRoles: Role.Admin }
     */
    requiresRole?: Role;
  }
}
