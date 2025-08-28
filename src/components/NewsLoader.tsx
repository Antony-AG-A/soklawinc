import React, { useEffect, useState } from 'react';
import { Loader2, Newspaper, ArrowLeft, Calendar, Clock } from 'lucide-react';

interface Post {
  slug: string;
  title: string;
  excerpt?: string;
  feature_image?: string;
  published_at: string;
  html?: string;
  reading_time?: number;
}

interface NewsLoaderProps {
  message?: string;
  showIcon?: boolean;
  variant?: 'default' | 'cards' | 'minimal' | 'article';
  selectedArticle?: string | null;
  onBack?: () => void;
}

const NewsLoader: React.FC<NewsLoaderProps> = ({ 
  message = "Loading latest news...", 
  showIcon = true,
  variant = 'default',
  selectedArticle = null,
  onBack
}) => {

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center py-6 md:py-8">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
          <span className="text-gray-600 text-sm md:text-base">{message}</span>
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-40 md:h-48 w-full"></div>
            <div className="p-4 md:p-6">
              <div className="bg-gray-200 h-6 rounded mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="bg-gray-200 h-4 rounded w-full"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
              <div className="bg-gray-200 h-4 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default loading variant with improved responsive design
  return (
    <div 
      className="flex flex-col items-center justify-center text-center p-4 md:p-6 space-y-4 animate-fade-in"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Spinner & Icon */}
      <div className="flex items-center gap-3">
        <Loader2 className="animate-spin h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
        {showIcon && <Newspaper className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />}
      </div>
      
      {/* Messages */}
      <div>
        <p className="text-gray-700 font-medium text-sm md:text-base">{message}</p>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Please wait while we fetch the content...</p>
      </div>
      
      {/* Skeleton loaders */}
      <div className="w-full max-w-sm md:max-w-md space-y-2 md:space-y-3 mt-4 md:mt-6">
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 rounded"></div>
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default NewsLoader;