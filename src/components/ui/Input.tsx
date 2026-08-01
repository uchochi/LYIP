import { forwardRef, type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-muted">{label}</label>}
      <input
        ref={ref}
        className={`w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-main outline-none transition-colors placeholder:text-text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
