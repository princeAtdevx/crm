import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../lib/cn';

const badgeVariants = cva(
	'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium text-xs',
	{
		variants: {
			variant: {
				accent: 'border-accent-border bg-accent-soft text-accent',
				neutral: 'border-border bg-muted text-fg',
				success: 'border-transparent bg-success-soft text-success',
				danger: 'border-transparent bg-danger-soft text-danger',
			},
		},
		defaultVariants: {
			variant: 'neutral',
		},
	},
);

export type BadgeProps = ComponentPropsWithRef<'span'> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
