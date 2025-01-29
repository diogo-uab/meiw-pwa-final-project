import { clsx, type ClassValue } from 'clsx';
import { twMerge as tailwindMergeOriginal } from 'tailwind-merge';

export const twMerge = (...args: ClassValue[]) => tailwindMergeOriginal(clsx(args));
