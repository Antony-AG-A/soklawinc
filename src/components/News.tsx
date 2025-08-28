import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ExternalLink, AlertCircle } from 'lucide-react';
import NewsLoader from './NewsLoader';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  feature_image?: string;
  published_at: string;
  html?: string;
  reading_time?: number;
  authors?: Array<{
    name: string;
    profile_image?: string;
  }>;
  tags?: Array<{
    name: string;
    slug: string;
  }>;
}

const News = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Animate cards when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.news-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-fade-in-up');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Fetch posts from Ghost CMS with retry logic
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Ghost CMS API endpoint with proper parameters
        const ghostApiUrl = 'https://xelf.ghost.io/ghost/api/v3/content/posts/';
        const apiKey = '367cdb8a8abe78fe688f751c76';
        const params = new URLSearchParams({
          key: apiKey,
          limit: '6',
          include: 'tags,authors',
          fields: 'id,slug,title,excerpt,feature_image,published_at,reading_time',
          formats: 'html'
        });

        const response = await fetch(`${ghostApiUrl}?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          throw new Error('Invalid response format from Ghost API');
        }
        
      } catch (error) {
        console.error("Error fetching Ghost posts:", error);
        
        // Retry logic for network issues
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchPosts(), 2000 * (retryCount + 1));
          return;
        }
        
        setError("Unable to load news articles at the moment. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [retryCount]);

  // Handle article click navigation
  const handleArticleClick = (post: Post) => {
    // Navigate to individual blog post page
    navigate(`/blog/${post.slug}`);
  };

  // Handle view all articles click
  const handleViewAllClick = () => {
    // Navigate to the blog page that shows all articles
    navigate('/blog');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Retry function for error state
  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
  };

  return (
    <section ref={sectionRef} id="news" className="py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#f5f5f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-blue-900">
            Latest News & Updates
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Stay updated with our latest legal insights, case victories, and important legal developments
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-400 mx-auto mt-4 md:mt-6"></div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <NewsLoader 
            message="Loading latest news and updates..." 
            variant="cards"
          />
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 md:p-8 max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Articles</h3>
              <p className="text-red-600 mb-6 text-sm md:text-base">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No Posts State */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Articles Available</h3>
              <p className="text-gray-600">Check back later for new content.</p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="news-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl opacity-0 group"
                onClick={() => handleArticleClick(post)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleArticleClick(post);
                  }
                }}
                aria-label={`Read article: ${post.title}`}
              >
                {/* Featured Image */}
                {post.feature_image && (
                  <div className="aspect-video overflow-hidden bg-gray-200">
                    <img
                      src={post.feature_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.slug}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                      {post.reading_time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.reading_time} min read</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Read More Indicator */}
                    <div className="flex items-center space-x-1 text-yellow-600 group-hover:text-yellow-700 font-medium">
                      <span>Read More</span>
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Author */}
                  {post.authors && post.authors.length > 0 && (
                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {post.authors[0].name}
                      </span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Button */}
        {!isLoading && !error && posts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleViewAllClick}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-yellow-700 hover:to-yellow-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              type="button"
              aria-label="View all articles"
            >
              <span>View All Articles</span>
              <ExternalLink className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;