import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value || props.defaultValue;

  return (
    <div className="relative w-full">
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            peer w-full px-4 py-3 pt-6
            ${leftIcon ? 'pl-14' : ''}
            ${rightIcon ? 'pr-12' : ''}
            bg-white border-2 border-neutral-200
            rounded-xl text-neutral-900
            placeholder-transparent
            focus:border-primary-500 focus:outline-none
            transition-all duration-200
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        <label
          className={`
            absolute transition-all duration-200 pointer-events-none
            ${leftIcon ? 'left-14' : 'left-4'}
            ${isFocused || hasValue
              ? 'top-2 text-xs text-primary-600 font-medium'
              : 'top-1/2 -translate-y-1/2 text-base text-neutral-400'
            }
          `}
        >
          {label}
        </label>

        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};