import React from 'react';

export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  className = '',
  selectClassName = '',
  ...props
}) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg py-2 pl-3 pr-10 text-sm transition-all duration-200 outline-none focus:border-brand-accent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-accent/20 text-slate-900 dark:text-slate-100 ${selectClassName}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
