import { cn } from '@/utils';
import React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const fillColors: Record<string, string> = {
  default: '#9CA3AF',
  success: '#059669',
  warning: '#D97706',
  danger:  '#DC2626',
  navy:    '#2E5B96',
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = 'navy',
      size = 'md',
      showLabel = false,
      ...props
    },
    ref
  ) => {
    const pct = Math.min(Math.max((value / max) * 100, 0), 100);
    const trackHeights: Record<string, string> = {
      sm: '4px',
      md: '8px',
      lg: '12px',
    };
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ backgroundColor: '#F3F4F6', height: trackHeights[size] }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%`, backgroundColor: fillColors[variant] ?? fillColors.navy }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
        {showLabel && (
          <span className="text-xs text-neutral-500 mt-1 block">{Math.round(pct)}%</span>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
