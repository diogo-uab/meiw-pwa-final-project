import { defineStore } from 'pinia';
import {
  Role,
  includesRole,
  type UserType,
  type AuthResponseDtoType,
} from '@pwa/shared';
import {
  AUTHORIZATION_HEADER_KEY,
  setDefaultRequestHeader,
  setDefaultAuthorizationHeader,
} from '../api/api';
import { isFutureDate } from '../utils/date';

const LOCAL_STORAGE_ATUH_KEY = '__AUTH__';

type LocalStorageAuth = {
  accessToken: string,
  refreshToken: string,
  accessTokenExpiresAt: string,
  refreshTokenExpiresAt: string,
};

type AuthState = {
  user: UserType | null,
  accessToken: string | null,
  accessTokenExpiresAt: string | null,
  refreshToken: string | null,
  refreshTokenExpiresAt: string | null,
  initialAuthGuardDone: boolean,
};

const getInitialState = (): AuthState => {
  const localStorageAuthStr = localStorage.getItem(LOCAL_STORAGE_ATUH_KEY);
  const localStorageAuth: LocalStorageAuth | null =
    localStorageAuthStr ? JSON.parse(localStorageAuthStr) : null;
  return {
    user: null,
    accessToken: localStorageAuth?.accessToken || null,
    accessTokenExpiresAt: localStorageAuth?.accessTokenExpiresAt || null,
    refreshToken: localStorageAuth?.refreshToken || null,
    refreshTokenExpiresAt: localStorageAuth?.refreshTokenExpiresAt || null,
    initialAuthGuardDone: false,
  };
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => getInitialState(),
  getters: {
    isAdmin: (state): boolean => !!(state.user && includesRole(state.user.role, Role.Admin)),
    isAuthenticated: (state): boolean => !!(state.user && state.accessToken),
    hasAnyValidToken: (state): boolean => {
      const isValidAccessToken =
        state.accessTokenExpiresAt && isFutureDate(state.accessTokenExpiresAt);
      const isValidRefreshToken =
        state.refreshTokenExpiresAt && isFutureDate(state.refreshTokenExpiresAt);
      return !!(isValidAccessToken || isValidRefreshToken);
    },
  },
  actions: {
    login({
      user,
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    }: AuthResponseDtoType) {
      this.user = user;
      this.accessToken = accessToken;
      this.accessTokenExpiresAt = accessTokenExpiresAt;
      this.refreshToken = refreshToken;
      this.refreshTokenExpiresAt = refreshTokenExpiresAt;

      setDefaultAuthorizationHeader(accessToken);

      const localStorageAuth: LocalStorageAuth =
        { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt };
      localStorage.setItem(LOCAL_STORAGE_ATUH_KEY, JSON.stringify(localStorageAuth));
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      this.accessTokenExpiresAt = null;
      this.refreshToken = null;
      this.refreshTokenExpiresAt = null;

      localStorage.removeItem(LOCAL_STORAGE_ATUH_KEY);
      setDefaultRequestHeader(AUTHORIZATION_HEADER_KEY, null);
    },
    setUserData(user: UserType) {
      this.user = user;
    },
  },
});
