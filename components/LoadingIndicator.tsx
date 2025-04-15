import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mt-6">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6zm-1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      </div>
      <div className="max-w-[70%] bg-secondary/30 px-4 py-3 rounded-lg text-textDark border border-subtle">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
