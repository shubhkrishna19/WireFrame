import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  hint,
}) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-bold uppercase tracking-wider"
        style={{ color: theme.colors.textPrimary }}
      >
        {label}
        {required && (
          <span style={{ color: '#EF4444' }} className="ml-1">*</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p
          className="text-xs"
          style={{ color: theme.colors.textTertiary }}
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          className="text-xs font-semibold"
          style={{ color: '#EF4444' }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

