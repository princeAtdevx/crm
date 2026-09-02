import type { ComponentPropsWithRef } from 'react';
import { cn } from '../lib/cn';

export type InputProps = ComponentPropsWithRef<'input'>;

export function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={cn(
				'flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-fg-strong text-sm outline-none transition-colors placeholder:text-fg/60 focus-visible:border-accent-border focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	);
}
