import axios, { InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';

type CustomAxiosConfigMetadata = {
  skipAttemptRefreshToken?: boolean,
  skipNavigateLoginOnFailedRefresh?: boolean,
};

// Augment axios
declare module 'axios' {
  export interface InternalAxiosRequestConfig<D = any> {
    metadata?: CustomAxiosConfigMetadata;
    __RETRY__?: boolean,
  }

  export interface AxiosRequestConfig<D = any> {
    metadata?: CustomAxiosConfigMetadata;
    __RETRY__?: boolean,
  }
}

