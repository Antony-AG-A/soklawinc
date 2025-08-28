import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsLoader from '../components/NewsLoader';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  feature_image?: string;
  published_at: string;
  html: string;
  reading_time?: number;
  authors?: Array<{
    name: string;
    profile_image?: string;
    bio?: string;
  }>;
  tags?: Array<{
    name: string;
    slug: string;
  }>;
}

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  // Handle back navigation
  const handleBackToNews = () => {
    navigate(-1);
  };

  // Fetch individual post from Ghost CMS
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError('No post ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const ghostApiUrl = 'https://xelf.ghost.io/ghost/api/v3/content/posts/slug';
        const apiKey = '367cdb8a8abe78fe688f751c76';
        const params = new URLSearchParams({
          key: apiKey,
          include: 'tags,authors',
          formats: 'html'
        });

        const response = await fetch(`${ghostApiUrl}/${postId}/?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
          
          // Update page title and meta description
          document.title = `${data.posts[0].title} - SOK Law Associates`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.posts[0].excerpt || 'Read our latest legal insights and updates.');
          }
        } else {
          throw new Error('Post not found');
        }
        
      } catch (error) {
        console.error("Error fetching Ghost post:", error);
        setError(error instanceof Error ? error.message : 'Unable to load the article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    
    // Cleanup function to reset page title
    return () => {
      document.title = 'SOK Law Associates';
    };
  }, [postId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <NewsLoader message="Loading article..." showIcon={false} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
            <button
              onClick={handleBackToNews}
              className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to News</span>
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            <button
              onClick={handleBackToNews}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-4 transition-colors font-medium group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to News
            </button>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <button 
                onClick={() => navigate('/')}
                className="hover:text-yellow-600 transition-colors"
              >
                Home
              </button>
              <span className="mx-2">/</span>
              <button 
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="hover:text-yellow-600 transition-colors"
              >
                News
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-700 truncate">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <article className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {post.feature_image && (
              <div className="aspect-video md:aspect-[21/9] overflow-hidden">
                <img
                  src={post.feature_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8 lg:p-12">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Article Header */}
              <header className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    {post.reading_time && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.reading_time} min read</span>
                      </div>
                    )}
                    {post.authors && post.authors.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{post.authors[0].name}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center space-x-2 text-gray-500 hover:text-yellow-600 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </header>
              
              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:border-yellow-500 prose-blockquote:text-gray-600 prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />

              {/* Author Bio */}
              {post.authors && post.authors.length > 0 && post.authors[0].bio && (
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                  <div className="flex items-start space-x-4">
                    {post.authors[0].profile_image && (
                      <img
                        src={post.authors[0].profile_image}
                        alt={post.authors[0].name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        About {post.authors[0].name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {post.authors[0].bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Back to News Button */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 text-center">
                <button
                  onClick={handleBackToNews}
                  className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to News</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default BlogPostPage;