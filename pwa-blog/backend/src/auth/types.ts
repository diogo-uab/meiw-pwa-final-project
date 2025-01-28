export type JWTPayload = {
  /** User._id */
  sub: string;
  email: string;
  /** JWT Type */
  type: 'access' | 'refresh';
};
