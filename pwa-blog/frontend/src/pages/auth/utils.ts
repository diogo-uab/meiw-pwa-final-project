import type { Router, RouteLocationNormalizedLoadedGeneric } from 'vue-router';

export const handleNavigateOnAuthSuccess = (
  route: RouteLocationNormalizedLoadedGeneric,
  router: Router,
) => router.replace(
  typeof route.query.redirect === 'string'
    ? route.query.redirect
    : { name: 'home' },
);
