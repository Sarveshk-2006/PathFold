import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 shadow-sm',
        secondary:
          'bg-white text-navy-800 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100 shadow-sm',
        ghost:
          'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200',
        danger:
          'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700 shadow-sm',
        outline:
          'border border-navy-200 text-navy-700 hover:bg-navy-50 hover:border-navy-300 active:bg-navy-100',
        link:
          'text-navy-700 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-sm',
        xl: 'h-11 px-6 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
