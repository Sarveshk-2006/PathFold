import { cn } from '@/utils';
import React from 'react';

// ─── Input ───────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leftIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-navy-600 focus:ring-offset-0 focus:border-navy-600',
              'hover:border-neutral-300',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50',
              error && 'border-danger-600 focus:ring-danger-600',
              leftIcon && 'pl-9',
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-xs text-neutral-500">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-danger-600">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ─── Select ──────────────────────────────────────────────────────
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, options, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900',
            'transition-colors duration-150 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600',
            'hover:border-neutral-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger-600 focus:ring-danger-600',
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 10px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px',
            paddingRight: '36px',
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
        {error && <p className="text-xs text-danger-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ─── Textarea ────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 min-h-[80px] resize-y',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600',
            'hover:border-neutral-300',
            error && 'border-danger-600 focus:ring-danger-600',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
        {error && <p className="text-xs text-danger-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Input, Select, Textarea };
