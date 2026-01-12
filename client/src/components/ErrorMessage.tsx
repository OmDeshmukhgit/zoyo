import React from "react";

interface Props {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<Props> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-red-600 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;



