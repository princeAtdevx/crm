import type { ComponentPropsWithRef } from 'react';
import { cn } from '../lib/cn';

export type LabelProps = ComponentPropsWithRef<'label'>;

export function Label({ className, ...props }: LabelProps) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: this is the primitive itself — htmlFor and children come from the caller, and the rule cannot see through the props spread.
		<label
			className={cn(
				'font-medium text-fg-strong text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				className,
			)}
			{...props}
		/>
	);
}
