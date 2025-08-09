import React from 'react';

interface IErrorMessageProps {
  message?: string;
  className?: string;
}

// Single Responsibility Principle - Only handles error message display
const ErrorMessage: React.FC<IErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`px-4 py-3 rounded-lg text-right ${className}`} style={{ backgroundColor: 'var(--state-error-bg)', border: '1px solid var(--state-error-border)', color: 'var(--state-error-text)' }}>
      <div className="flex items-center gap-2 justify-end">
        <span>{message}</span>
        <svg className="w-5 h-5" style={{ color: 'var(--state-error-text)' }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default ErrorMessage;