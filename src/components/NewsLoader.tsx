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
    <div className="content-loading">
      <div className="flex items-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-yellow-600" />
        {showIcon && <Newspaper className="h-8 w-8 text-gray-400" />}
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-500">Please wait while we fetch the content...</p>
      
      {/* Skeleton loaders for better UX */}
      <div className="w-full max-w-md space-y-3 mt-6">
        <div className="skeleton-loader h-4 rounded"></div>
        <div className="skeleton-loader h-4 rounded w-3/4"></div>
        <div className="skeleton-loader h-4 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default NewsLoader;