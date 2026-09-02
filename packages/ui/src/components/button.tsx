import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../lib/cn';

const buttonVariants = cva(
	'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				primary: 'bg-accent text-fg-inverse hover:bg-accent-hover',
				secondary: 'bg-muted text-fg-strong hover:bg-border',
				outline: 'border border-border bg-transparent text-fg-strong hover:bg-muted',
				ghost: 'bg-transparent text-fg hover:bg-muted hover:text-fg-strong',
				destructive: 'bg-danger text-white hover:opacity-90',
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-4 text-sm',
				lg: 'h-12 px-6 text-base',
				icon: 'size-10',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	},
);

export type ButtonProps = ComponentPropsWithRef<'button'> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
	return (
		<button
			className={cn(buttonVariants({ variant, size }), className)}
			type={type}
			{...props}
		/>
	);
}

export { buttonVariants };
