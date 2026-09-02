import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names, letting later Tailwind utilities win over
 * conflicting earlier ones. Every component in this package composes its
 * variants through `cn` so a caller's `className` can always override.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
