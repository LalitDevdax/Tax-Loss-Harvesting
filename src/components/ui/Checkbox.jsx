import React from 'react';

export default function Checkbox({ checked, onChange, label, id, className = '', ...props }) {
  return (
    <label htmlFor={id} className={`flex items-center space-x-3 cursor-pointer select-none checkbox-spring transition-premium ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div className="w-5 h-5 border border-slate-250 dark:border-slate-800 rounded-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-checked:border-brand-accent peer-checked:bg-brand-accent flex items-center justify-center peer-focus-visible:ring-1 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-brand-accent hover:border-slate-400 dark:hover:border-slate-600">
          {/* Check icon */}
          <svg
            className={`w-3.5 h-3.5 text-white stroke-2 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform scale-0 ${
              checked ? 'scale-100' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      {label && <span className="text-xs font-medium text-slate-650 dark:text-slate-350">{label}</span>}
    </label>
  );
}
