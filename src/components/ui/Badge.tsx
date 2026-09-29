import { cn } from '@/utils';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'navy' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
}

// Use explicit style maps to avoid Tailwind v4 dynamic class purging
const variantStyles: Record<string, React.CSSProperties> = {
  default: { backgroundColor: '#F3F4F6', color: '#374151' },
  navy:    { backgroundColor: '#EBF1F9', color: '#1E3A5F' },
  success: { backgroundColor: '#D1FAE5', color: '#065F46' },
  warning: { backgroundColor: '#FEF3C7', color: '#92400E' },
  danger:  { backgroundColor: '#FEE2E2', color: '#991B1B' },
  outline: { backgroundColor: 'transparent', color: '#4B5563', border: '1px solid #E5E7EB' },
  ghost:   { backgroundColor: 'transparent', color: '#6B7280' },
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', style, ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
    };
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium leading-none',
          sizeClasses[size],
          className
        )}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
