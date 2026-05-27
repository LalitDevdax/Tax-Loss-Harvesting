import React from 'react';

export default function Card({ children, className = '', hoverable = false, ...props }) {
  return (
    <div
      className={`glass-card p-4 sm:p-6 transition-premium ${
        hoverable ? 'hover-card-lift cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
