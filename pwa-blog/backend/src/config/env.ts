/** Application config env vars */
export const config = {
  port: process.env.PWA_BLOG_BACKEND__PORT || 3000,
  logLEvel: process.env.PWA_BLOG_BACKEND__LOG_LEVEL || 'verbose',
  isProduction: process.env.NODE_ENV === 'production',
  mongodbConnectionURL:
    process.env.PWA_BACKEND__MONGODB_CONNECTION_URL ||
    'mongodb://localhost:27017/pwa-blog',
  auth: {
    jwtSecret: process.env.PWA_BACKEND__JWT_SECRET || 'random-jwt-secret',
    jwtAccessDurationSeconds:
      Number(process.env.PWA_BACKEND__JWT_ACCESS_DURATION_SECONDS) ||
      1 * 60 * 60, // 1 hour
    jwtRefreshDurationSeconds:
      Number(process.env.PWA_BACKEND__JWT_DURATION_DURATION_SECONDS) ||
      10 * 60 * 60 * 24, // 10 days
    passwordSaltOrRounds:
      Number(process.env.PWA_BACKEND__PASSWORD_SALT_ROUNDS) || 10,
  },
  seed: {
    initialAdminUser: {
      name: process.env.PWA_BACKEND_ADMIN_USER_NAME || 'PWA Blog',
      email:
        process.env.PWA_BACKEND_ADMIN_USER_EMAIL ||
        'pwa-blog-admin@example.com',
      password: process.env.PWA_BACKEND_ADMIN_USER_PASSWORD || 'password',
    },
  },
} as const;
