import type {
  UserDtoType,
  AuthResponseDtoType,
  LoginRequestDtoType,
  RegisterRequestDtoType,
  RefreshTokenRequestDtoType,
  CreateUserDtoType,
  UpdateUserDtoType,
  UpdateUserProfileDtoType,
  UpdateUserPasswordDtoType,
  CreateBlogPostDtoType,
  UpdateBlogPostDtoType,
  BlogPostResponseDtoType,
  CreateBlogCommentDtoType,
  UpdateBlogCommentDtoType,
  BlogCommentResponseDtoType,
  VerifyAvailableEmailRequestDtoType,
  VerifyAvailableEmailResponseDtoType,
} from '@pwa/shared';
import Axios, { type AxiosHeaderValue, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth.store';

export const AUTHORIZATION_HEADER_KEY = 'Authorization';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const axiosClient = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

/* ---------------------------------- Auth ---------------------------------- */
export const login = (data: LoginRequestDtoType) => axiosClient.post<AuthResponseDtoType>(
  '/auth/login',
  data, {
  metadata: { skipAttemptRefreshToken: true } },
);

export const register = (data: RegisterRequestDtoType) => axiosClient.post<AuthResponseDtoType>(
  '/auth/register',
  data,
  { metadata: { skipAttemptRefreshToken: true } },
);

export const refreshToken = (data: RefreshTokenRequestDtoType) =>
  axiosClient.post<AuthResponseDtoType>(
    '/auth/refresh',
    data,
    { metadata: { skipAttemptRefreshToken: true } },
  );

/* ---------------------------------- User ---------------------------------- */
export const getMyUserInfo = (config?: AxiosRequestConfig) =>
  axiosClient.get<UserDtoType>('/user/me', config);

export const updateUserProfile = (data: UpdateUserProfileDtoType) =>
  axiosClient.post<UserDtoType>('/user/profile', data);

export const updateUserPassword = (data: UpdateUserPasswordDtoType) =>
  axiosClient.post('/user/password', data);

export const getAllUsers = () => axiosClient.get<UserDtoType[]>('/user');

export const getUserById = (id: string) => axiosClient.get(`/user/${id}`);

export const createUser = (data: CreateUserDtoType) => axiosClient.post<UserDtoType>('/user', data);

export const updateUser = (id: string, data: UpdateUserDtoType) =>
  axiosClient.put<UserDtoType>(`/user/${id}`, data);

export const deleteUser = (id: string) => axiosClient.delete(`/user/${id}`);

export const verifyAvailableEmail = (data: VerifyAvailableEmailRequestDtoType) =>
  axiosClient.post<VerifyAvailableEmailResponseDtoType>('/user/verify-available-email', data);

/* ------------------------------- Blog Posts ------------------------------- */
export const getBlogPosts = (search?: string) => axiosClient
  .get<BlogPostResponseDtoType[]>('/blog-post', search ? { params: { search } } : undefined);

export const getBlogPostById = (id: string) =>
  axiosClient.get<BlogPostResponseDtoType>(`/blog-post/${id}`);

export const createBlogPost = (data: CreateBlogPostDtoType) =>
  axiosClient.post<BlogPostResponseDtoType>('/blog-post', data);

export const updateBlogPost = (id: string, data: UpdateBlogPostDtoType) =>
  axiosClient.put<BlogPostResponseDtoType>(`/blog-post/${id}`, data);

export const deleteBlogPost = (id: string) => axiosClient.delete(`/blog-post/${id}`);

/* ------------------------------ Blog Comments ----------------------------- */
export const getBlogCommentsByPostId = (id: string) =>
  axiosClient.get<BlogCommentResponseDtoType[]>(`/blog-comment/post/${id}`);

export const getBlogCommentsByUserId = (id: string) =>
  axiosClient.get<BlogCommentResponseDtoType[]>(`/blog-comment/user/${id}`);

export const createBlogComment = (data: CreateBlogCommentDtoType) =>
  axiosClient.post<BlogCommentResponseDtoType>('/blog-comment', data);

export const updateBlogComment = (id: string, data: UpdateBlogCommentDtoType) =>
  axiosClient.put<BlogCommentResponseDtoType>(`/blog-comment/${id}`, data);

export const deleteBlogComment = (id: string) => axiosClient.delete(`/blog-comment/${id}`);


/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */
export const prefixAccessToken = (token: string) => `Bearer ${token}`;

export const setDefaultRequestHeader = (key: string, value: AxiosHeaderValue): void => {
  axiosClient.defaults.headers[key] = value;
};

export const setDefaultAuthorizationHeader = (accessToken?: string | null) => {
  if (accessToken) {
    setDefaultRequestHeader(AUTHORIZATION_HEADER_KEY, prefixAccessToken(accessToken));
    return;
  }

  const authStore = useAuthStore();
  setDefaultRequestHeader(
    AUTHORIZATION_HEADER_KEY,
    authStore.accessToken ? prefixAccessToken(authStore.accessToken) : null,
  );
};

export const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (!error || !Axios.isAxiosError<{ message?: string }>(error))
    return defaultMessage;
  return error.response?.data?.message || defaultMessage;
};
