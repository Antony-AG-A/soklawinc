import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ExternalLink, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsLoader from '../components/NewsLoader';
import { updatePageMeta, handleExternalLinks } from '../utils/navigationUtils';

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogHandyLoaded, setBlogHandyLoaded] = useState(false);
  const [postData, setPostData] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle back navigation using browser history
  const handleBackToNews = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadBlogHandyForPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const loadBlogHandy = () => {
          // Check if BlogHandy is already loaded
          if (window.bh_id && document.getElementById('bloghandy-script')) {
            setBlogHandyLoaded(true);
            setTimeout(() => displayBlogHandyPost(), 500);
            return;
          }

          // Set BlogHandy ID
          if (!window.bh_id) {
            window.bh_id = "60HwYmcpS5PD0XNTgyMQ";
          }

          // Load BlogHandy script
          let script = document.getElementById('bloghandy-script') as HTMLScriptElement;
          if (!script) {
            script = document.createElement('script');
            script.id = 'bloghandy-script';
            script.src = 'https://www.bloghandy.com/api/bh_blogengine.js';
            script.async = true;
            
            script.onload = () => {
              setBlogHandyLoaded(true);
              // Wait for BlogHandy to initialize and load content
              setTimeout(() => displayBlogHandyPost(), 2000);
            };
            
            script.onerror = () => {
              console.error('BlogHandy script failed to load');
              setError('Unable to load blog content');
              setLoading(false);
            };

            document.head.appendChild(script);
          } else {
            setBlogHandyLoaded(true);
            setTimeout(() => displayBlogHandyPost(), 1000);
          }
        };

        const displayBlogHandyPost = () => {
          try {
            const postIndex = parseInt(postId?.replace('bloghandy-', '') || '0');
            let blogContainer = document.getElementById('bh-posts');
            
            if (!blogContainer) {
              // Create BlogHandy container if it doesn't exist
              blogContainer = document.createElement('div');
              blogContainer.id = 'bh-posts';
              blogContainer.style.display = 'none';
              document.body.appendChild(blogContainer);
              
              // Retry after BlogHandy populates the container
              setTimeout(() => displayBlogHandyPost(), 1500);
              return;
            }

            // Look for BlogHandy posts with various selectors
            const posts = blogContainer.querySelectorAll('.bh-post, .post, article, .blog-post, [class*="post"], div[onclick]');
            
            if (posts.length > postIndex) {
              const selectedPost = posts[postIndex] as HTMLElement;
              
              // Extract post metadata
              const title = selectedPost.querySelector('h1, h2, h3, .title, .bh-post-title, .post-title')?.textContent?.trim() || 'Blog Post';
              const dateElement = selectedPost.querySelector('.date, .bh-post-date, .post-date, time');
              const date = dateElement?.textContent?.trim() || new Date().toLocaleDateString();
              
              // Clone and clean the post content
              const postContent = selectedPost.cloneNode(true) as HTMLElement;
              
              // Remove BlogHandy specific attributes that might interfere
              postContent.removeAttribute('onclick');
              postContent.style.cursor = 'default';
              postContent.style.display = 'block';
              postContent.style.visibility = 'visible';
              
              // Clean up links
              const links = postContent.querySelectorAll('a');
              links.forEach(link => {
                link.removeAttribute('onclick');
                if (link.href && !link.href.includes(window.location.origin)) {
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                }
              });
              
              // Set post data for header display
              setPostData({
                title,
                date,
                author: 'SOK Law Associates',
                content: postContent.innerHTML
              });
              
              // Insert the cleaned content
              if (contentRef.current) {
                contentRef.current.innerHTML = '';
                contentRef.current.appendChild(postContent);
              }
              
              setLoading(false);
            } else {
              // Retry a few times before giving up
              const retryCount = parseInt(sessionStorage.getItem('bloghandy-retry') || '0');
              if (retryCount < 3) {
                sessionStorage.setItem('bloghandy-retry', (retryCount + 1).toString());
                setTimeout(() => displayBlogHandyPost(), 2000);
              } else {
                sessionStorage.removeItem('bloghandy-retry');
                setError('Blog post not found');
                setLoading(false);
              }
            }
          } catch (err) {
            console.error('Error displaying BlogHandy post:', err);
            setError('Error loading blog post');
            setLoading(false);
          }
        };

        loadBlogHandy();
      } catch (err) {
        console.error('Error in loadBlogHandyForPost:', err);
        setError('Failed to initialize blog content');
        setLoading(false);
      }
    };

    // Clear retry count when component mounts
    sessionStorage.removeItem('bloghandy-retry');
    loadBlogHandyForPost();
    
    // Cleanup function
    return () => {
      sessionStorage.removeItem('bloghandy-retry');
    };
  }, [postId]);

  // Update document title when post data is available
  useEffect(() => {
    if (postData?.title) {
      updatePageMeta(
        `${postData.title} - SOK Law Associates`,
        `Read our latest article: ${postData.title}. Expert legal insights from SOK Law Associates.`
      );
    }
    
    return () => {
      updatePageMeta('SOK Law Associates Website');
    };
  }, [postData]);

  // Handle external links in post content
  useEffect(() => {
    if (contentRef.current && !loading && postData) {
      handleExternalLinks(contentRef.current);
    }
  }, [loading, postData]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <NewsLoader 
            message="Loading article content..." 
            showIcon={false}
          />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleBackToNews}
              className="btn-primary inline-flex items-center space-x-2"
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={handleBackToNews}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-4 transition-colors font-medium group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Previous Page
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
              <span className="text-gray-700">
                {postData?.title || 'Article'}
              </span>
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-lg shadow-lg p-8 lg:p-12">
            {/* Article Header - Only show if we have post data */}
            {postData && (
              <header className="mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                  {postData.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 gap-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{postData.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{postData.author}</span>
                  </div>
                </div>
              </header>
            )}
            
            {/* BlogHandy content will be inserted here */}
            <div 
              ref={contentRef}
              className="blog-post-content prose prose-lg max-w-none"
            >
              {/* BlogHandy content loaded dynamically */}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <button
                onClick={handleBackToNews}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Previous Page</span>
              </button>
            </div>
          </article>
        </div>

        {/* Hidden BlogHandy container */}
        <div id="bh-posts" style={{ display: 'none' }}></div>
      </div>
      
      {/* BlogHandy content styling */}
      <style jsx>{`
        .blog-post-content {
          animation: fadeIn 0.5s ease-out;
        }
        
        .blog-post-content img {
          border-radius: 0.5rem;
          max-width: 100%;
          height: auto;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .blog-post-content h1,
        .blog-post-content h2,
        .blog-post-content h3,
        .blog-post-content h4 {
          color: #1e3a8a;
          margin: 2rem 0 1rem 0;
          line-height: 1.2;
        }
        
        .blog-post-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
        }
        
        .blog-post-content h2 {
          font-size: 2rem;
          font-weight: 600;
        }
        
        .blog-post-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .blog-post-content p {
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        
        .blog-post-content a {
          color: #d97706;
          text-decoration: underline;
          transition: color 0.2s;
        }
        
        .blog-post-content a:hover {
          color: #b45309;
        }
        
        .blog-post-content ul,
        .blog-post-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .blog-post-content li {
          margin-bottom: 0.5rem;
          color: #4b5563;
          line-height: 1.6;
        }
        
        .blog-post-content blockquote {
          border-left: 4px solid #d97706;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        /* Ensure BlogHandy content displays properly */
        .blog-post-content .bh-post,
        .blog-post-content .post,
        .blog-post-content article {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
      
      <Footer />
    </>
  );
};

// Declare global BlogHandy variables for TypeScript
declare global {
  interface Window {
    bh_id: string;
  }
}

export default BlogPostPage;