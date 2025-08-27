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
  const [article, setArticle] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch article when selectedArticle changes
  useEffect(() => {
    if (selectedArticle && variant === 'article') {
      const fetchArticle = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const res = await fetch(
            `https://xelf.ghost.io/ghost/api/v3/content/posts/slug/${selectedArticle}/?key=367cdb8a8abe78fe688f751c76&fields=title,slug,excerpt,feature_image,published_at,html,reading_time`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              mode: 'cors',
            }
          );

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          setArticle(data.posts[0]);

        } catch (error) {
          console.error("Error fetching article:", error);
          setError("Unable to load the article. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchArticle();
    }
  }, [selectedArticle, variant]);

  // Article viewer mode
  if (variant === 'article' && selectedArticle) {
    if (isLoading) {
      return (
        <section className="py-20" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition bg-white px-4 py-2 rounded-lg shadow-sm"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to News
              </button>
            )}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Loading article...</p>
                  <p className="text-sm text-gray-500">Please wait while we fetch the content...</p>
                </div>
                <div className="w-full max-w-2xl space-y-4 mt-6">
                  <div className="bg-gray-200 animate-pulse h-8 rounded"></div>
                  <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 animate-pulse h-64 rounded"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-4 rounded w-5/6"></div>
                    <div className="bg-gray-200 animate-pulse h-4 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (error || !article) {
      return (
        <section className="py-20" style={{ backgroundColor: '#f5f5f0' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition bg-white px-4 py-2 rounded-lg shadow-sm"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to News
              </button>
            )}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-red-600 mb-4">{error || "Article not found"}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      );
    }

    // Render full article
    return (
      <section className="py-20" style={{ backgroundColor: '#f5f5f0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition bg-white px-4 py-2 rounded-lg shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to News
            </button>
          )}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {article.feature_image && (
              <img
                src={article.feature_image}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}

            <div className="p-8">
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                  {article.title}
                </h1>
                
                {article.excerpt && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {article.reading_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {article.reading_time} min read
                    </div>
                  )}
                </div>
              </header>

              <div 
                className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-links:text-blue-600 prose-strong:text-blue-900 prose-p:text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.html || '' }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Original loading variants
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
          <span className="text-gray-600">{message}</span>
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-48 w-full"></div>
            <div className="p-6">
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

  // Default variant
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