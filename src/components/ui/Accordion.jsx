import React, { useState } from 'react';

export default function Accordion({ title, children, defaultOpen = true, className = '', titleClassName = '' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#151c2c]/40 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 text-left font-medium select-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20 ${titleClassName}`}
      >
        <span className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
            isOpen ? 'transform rotate-185' : 'transform rotate-0'
          }`}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] border-t border-slate-100 dark:border-slate-800/80 p-4 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
