import { createRouter, createWebHistory } from 'vue-router';
import { Role } from '@pwa/shared';

const HomePage = () => import('../pages/home.page.vue');
const LoginPage = () => import('../pages/auth/login.page.vue');
const RegisterPage = () => import('../pages/auth/register.page.vue');
const CreateBlogPostPage = () => import('../pages/blog-post/create-blog-post.page.vue');
const BlogPostDetailsPage = () => import('../pages/blog-post/blog-post-details.page.vue');
const UserBlogCommentsPage = () => import('../pages/user/user-blog-comments.page.vue');
const UpdateBlogPostPage = () => import('../pages/blog-post/update-blog-post.page.vue');
const ManageUsersPage = () => import('../pages/user/manage-users.page.vue');
const CreateUserPage = () => import('../pages/user/create-user.page.vue');
const UpdateUserPage = () => import('../pages/user/update-user.page.vue');
const UserProfilePage = () => import('../pages/user/user-profile.page.vue');
const NotFoundPage = () => import('../pages/not-found.page.vue');

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { isPublic: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { isPublic: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { isPublic: true },
    },
    {
      path: '/blog-post/:id',
      name: 'blog-post-details',
      component: BlogPostDetailsPage,
      meta: { isPublic: true },
    },
    {
      path: '/blog-post/new',
      name: 'blog-post-create',
      component: CreateBlogPostPage,
      meta: {
        isPublic: false,
        requiresRole: Role.Admin,
      },
    },
    {
      path: '/blog-post/:id/edit',
      name: 'blog-post-edit',
      component: UpdateBlogPostPage,
      meta: {
        isPublic: false,
        requiresRole: Role.Admin,
      },
    },
    {
      path: '/my/comments',
      name: 'my-comments',
      component: UserBlogCommentsPage,
      meta: { isPublic: false },
    },
    {
      path: '/manage/users',
      name: 'manage-users',
      component: ManageUsersPage,
      meta: {
        isPublic: false,
        requiresRole: Role.Admin,
      },
    },
    {
      path: '/manage/users/create',
      name: 'create-user',
      component: CreateUserPage,
      meta: {
        isPublic: false,
        requiresRole: Role.Admin,
      },
    },
    {
      path: '/manage/users/:id',
      name: 'update-user',
      component: UpdateUserPage,
      meta: {
        isPublic: false,
        requiresRole: Role.Admin,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfilePage,
      meta: { isPublic: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
      meta: { isPublic: true },
    },
  ],
});
