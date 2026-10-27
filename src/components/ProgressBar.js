import React from 'react';

export default function ProgressBar({ value = 0, max = 100, color = '#3b82f6' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div 
      style={{
        width: '100%',
        backgroundColor: '#e5e7eb',
        borderRadius: '9999px',
        height: '1rem',
        overflow: 'hidden'
      }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: color,
          transition: 'width 0.3s ease-in-out',
          borderRadius: 'inherit'
        }}
      />
    </div>
  );
}
