import { z } from 'zod';

/** Helper schema able to Mongoose ObjectId to string */
export const IdSchema = z.string({ coerce: true })
  .regex(/^(0x|0h)?[0-9A-F]+$/i, 'Invalid ID') // Hexadecimal
  .length(24, 'Invalid ID');

/** Helper schema able to coerce a `Date` object to a date string in ISO string */
export const TimestampSchema = z.preprocess((arg) => {
  if (arg instanceof Date) return arg.toISOString();
  return arg;
}, z.string().datetime());

/**
 * Helper schema for Mongoose references.
 * Creates a union that can be either the ref `schema` or `IdSchema`.
 */
export const ReferenceSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, IdSchema]);
