import React from "react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div 
        className={`animate-spin rounded-full border-b-2 border-zomato-red ${sizeMap[size]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;

