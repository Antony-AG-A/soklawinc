import React from 'react';
import { Loader2, Newspaper } from 'lucide-react';

interface NewsLoaderProps {
  message?: string;
  showIcon?: boolean;
}

const NewsLoader: React.FC<NewsLoaderProps> = ({ 
  message = "Loading latest news...", 
  showIcon = true 
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in"
      role="status"
      aria-busy="true"
    >
      {/* Spinner & Icon */}
      <div className="flex items-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-yellow-600" />
        {showIcon && <Newspaper className="h-8 w-8 text-gray-400" />}
      </div>

      {/* Messages */}
      <div>
        <p className="text-gray-700 font-medium">{message}</p>
        <p className="text-sm text-gray-500">Please wait while we fetch the content...</p>
      </div>

      {/* Skeleton loaders */}
      <div className="w-full max-w-md space-y-3 mt-6">
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 rounded"></div>
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default NewsLoader;
