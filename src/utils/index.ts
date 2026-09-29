import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10_00_000) {
      return `₹${(amount / 10_00_000).toFixed(1)}L`;
    }
    if (amount >= 1_00_000) {
      return `₹${(amount / 1_00_000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatSalary(amount: number): string {
  if (amount >= 10_00_000) {
    return `₹${(amount / 10_00_000).toFixed(1)}L/yr`;
  }
  if (amount >= 1_00_000) {
    return `₹${(amount / 1_00_000).toFixed(1)}L/yr`;
  }
  return `₹${amount.toLocaleString('en-IN')}/yr`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-success-600';
  if (score >= 70) return 'text-warning-600';
  return 'text-danger-600';
}

export function getGrowthColor(growth: 'high' | 'medium' | 'low'): string {
  if (growth === 'high') return 'text-success-600';
  if (growth === 'medium') return 'text-warning-600';
  return 'text-neutral-500';
}

export * from './evaluationEngine';
