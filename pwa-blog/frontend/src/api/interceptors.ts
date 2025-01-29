import { AxiosError } from 'axios';
import type { Router } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { AUTHORIZATION_HEADER_KEY, axiosClient, prefixAccessToken, refreshToken } from './api';

export const setupAxiosInterceptors = (router: Router): void => {
  axiosClient.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      const authStore = useAuthStore();
      const originalConfig = err.config;

      if (
        !authStore.refreshToken || // Refresh token is not set
        !originalConfig || originalConfig.metadata?.skipAttemptRefreshToken || // Retry disabled
        !err.response || err.response.status !== 401 || // Error was not due to authentication
        !!originalConfig.__RETRY__ // Request was already retried
      ) return Promise.reject(err);

      originalConfig.__RETRY__ = true;

      try {
        // Refresh token
        const response = await refreshToken({ refreshToken: authStore.refreshToken });
        // Update auth store
        authStore.login(response.data);
        // Retry original request
        return axiosClient({
          ...originalConfig,
          headers: {
            ...originalConfig.headers,
            [AUTHORIZATION_HEADER_KEY]: prefixAccessToken(response.data.accessToken),
          },
        });
      } catch (e) {
        authStore.logout();

        if (!originalConfig.metadata?.skipNavigateLoginOnFailedRefresh)
          router.replace({ name: 'login' });

        return Promise.reject(e);
      }
    },
  );
};
