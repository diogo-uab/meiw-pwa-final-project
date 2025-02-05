import type { NavigationGuard, RouteLocationNormalizedGeneric, Router } from 'vue-router';
import { toast } from 'vue3-toastify';
import { includesRole, Role } from '@pwa/shared';
import { getMyUserInfo } from '../api/api';
import { useAuthStore } from "../stores/auth.store";

const checkRouteRequiresAuth = (route: RouteLocationNormalizedGeneric): boolean =>
  !route.meta.isPublic;

const checkCanAccessRouteWithRole = (route: RouteLocationNormalizedGeneric, role?: Role): boolean =>
  route.meta.requiresRole
    ? !role
      ? false
      : includesRole(role, route.meta.requiresRole)
    : true;

/**
 * Initial auth guard, runs only once on the first app navigation.
 * Attempts to fetch the user info, if the user was logged in before (tokens are saved),
 * and refreshes the access token if needed.
 *
 * If the target route requires authentication, the guard awaits for the process to finish so that
 * `authGuard` is be able to assert the user is authenticated and has the required role (if applicable).
 *
 * Otherwise, if the route is public, the guard doesn't wait for it to finish, and allows
 * the user to navigate to the target public route while the process runs.
 */
const initialAuthGuard: NavigationGuard = async (to) => {
  const authStore = useAuthStore();
  const fetchUser = async () => {
    try {
      const { data } = await getMyUserInfo({ metadata: { skipNavigateLoginOnFailedRefresh: true } });
      authStore.setUserData(data);
      return data;
    } catch (e) {
      authStore.logout();
    }
  };

  const getMyUserInfoPromise =
    !authStore.hasAnyValidToken ? Promise.resolve() : fetchUser();

  // Route requires auth, we await for getMyUserInfoPromise to finish so that the
  // `authGuard` can confirm that the user is authenticated.
  // Otherwise, we can proceed while `getMyUserInfoPromise` is still running.
  if (checkRouteRequiresAuth(to))
    await getMyUserInfoPromise;

  authStore.initialAuthGuardDone = true;
};

/**
 * Main auth guard, responsible for confirming that the user is authenticated
 * before navigating to a non public route, and checks if the user has the required role
 * for the target route (if route requires a minimum role).
 */
const authGuard: NavigationGuard = (to) => {
  const authStore = useAuthStore();
  if (checkRouteRequiresAuth(to) && !authStore.isAuthenticated)
    return { name: 'login', replace: true };

  if (!checkCanAccessRouteWithRole(to, authStore.user?.role)) {
    toast('Oops, it seems you don\'t have permission to access that page', { type: 'error' });
    return { name: 'home', replace: true };
  }
};

/**
 * Adds `redirect` query param when navigating to auth pages (login, register).
 *
 * The default redirect param is either `from.query.redirect`, if set, or `from.fullPath`.
 */
const addRedirectQueryParamRoutesGuard: NavigationGuard = (to, from) => {
  const authRoutes: (string | Symbol)[] = ['login', 'register'];
  if (
    // Ignore if not auth route
    !(to.name && authRoutes.includes(to.name)) ||
    // Ignore if already has redirect query param
    to.query.redirect ||
     // Ignore for home route if it doesn't have any query params
    ((from.name === 'home' || from.path === '/') && !Object.keys(from.query).length) ||
    // Ignore if navigating from an auth page (i.e from login to register)
    // and redirect is not already set
    (!(from.query.redirect) && (from.name && authRoutes.includes(from.name)))
  ) return;

  return {
    ...to,
    query: {
      ...to.query,
      redirect: from.query.redirect || from.fullPath,
    },
  };
};

export const setupAuthGuards = (router: Router) => {
  /**
   * `router.beforeEach` returns a function that removes the registered guard.
   * See [Vue Router Api](https://router.vuejs.org/api/interfaces/Router.html#beforeEach-) for more details.
   *
   * That function is stored in the `removeInitialAuthGuard` variable,
   * the initial auth guard is executed, and the guard is removed, so it runs only once.
   */
  const removeInitialAuthGuard = router.beforeEach(async (...args) => {
    removeInitialAuthGuard();
    return initialAuthGuard(...args);
  });

  router.beforeEach(authGuard);
  router.beforeEach(addRedirectQueryParamRoutesGuard);
};
