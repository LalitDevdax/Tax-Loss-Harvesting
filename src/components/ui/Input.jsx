import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  prefix,
  suffix,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 flex items-center justify-center pointer-events-none text-slate-400 dark:text-slate-500">
            {prefix}
          </div>
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-sm transition-all duration-200 outline-none focus:border-brand-accent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-accent/20 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${
            prefix ? 'pl-9' : ''
          } ${suffix ? 'pr-9' : ''} ${
            disabled ? 'opacity-50 cursor-not-allowed bg-slate-200/50 dark:bg-slate-950/50' : ''
          } ${inputClassName}`}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 flex items-center justify-center pointer-events-none text-slate-400 dark:text-slate-500 text-xs font-semibold">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}
