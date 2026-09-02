import type { ComponentPropsWithRef } from 'react';
import { cn } from '../lib/cn';

export type SpinnerProps = ComponentPropsWithRef<'span'> & {
	label?: string;
};

export function Spinner({ className, label = 'Loading', ...props }: SpinnerProps) {
	return (
		<span
			aria-label={label}
			className={cn(
				'inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent',
				className,
			)}
			role="status"
			{...props}
		/>
	);
}
