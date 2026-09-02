import type { ComponentPropsWithRef } from 'react';
import { cn } from '../lib/cn';

type DivProps = ComponentPropsWithRef<'div'>;

export function Card({ className, ...props }: DivProps) {
	return (
		<div
			className={cn(
				'rounded-card border border-border bg-surface text-fg shadow-card',
				className,
			)}
			{...props}
		/>
	);
}

export function CardHeader({ className, ...props }: DivProps) {
	return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithRef<'h3'>) {
	return (
		<h3
			className={cn('font-medium text-fg-strong text-lg tracking-tight', className)}
			{...props}
		/>
	);
}

export function CardDescription({ className, ...props }: ComponentPropsWithRef<'p'>) {
	return <p className={cn('text-fg text-sm', className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
	return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
	return <div className={cn('flex items-center gap-3 p-6 pt-0', className)} {...props} />;
}
