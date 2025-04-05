import React from 'react';

const Card = ({ children, status, className = '' }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const statusBadge = status && (
    <span 
      className={`
        px-3 py-1 
        text-xs font-semibold 
        rounded-full 
        border 
        ${statusColors[status] || statusColors.default}
      `}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  return (
    <div 
      className={`
        p-6 
        bg-white 
        rounded-2xl 
        transition-all 
        duration-300 
        border border-gray-100
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        hover:border-gray-200
        ${className}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        {statusBadge}
      </div>
      {children}
    </div>
  );
};

export default Card;