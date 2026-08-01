import type { ReactNode } from 'react';

interface Props {
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple';
  children: ReactNode;
  className?: string;
}

const colors = {
  blue: 'bg-primary/10 text-primary border-primary/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  gray: 'bg-surface-lighter text-text-muted border-border',
  purple: 'bg-accent/10 text-accent border-accent/20',
};

export default function Badge({ variant = 'blue', children, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
}
