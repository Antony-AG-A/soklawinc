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
    navigate(-1); // Use browser history for proper back navigation
  };

  useEffect(() => {
    const loadBlogHandyForPost = async () => {
      try {
        setLoading(true);
        
        // Always try to load BlogHandy first, then fallback
        const loadBlogHandy = () => {
          // Check if BlogHandy is already loaded
          if (window.bh_id && document.getElementById('bloghandy-script')) {
            setBlogHandyLoaded(true);
            displayBlogHandyPost();
            return;
          }

          // Set BlogHandy ID only if not set
          if (!window.bh_id) {
            window.bh_id = "60HwYmcpS5PD0XNTgyMQ";
          }

          // Create and load BlogHandy script only if not exists
          let script = document.getElementById('bloghandy-script') as HTMLScriptElement;
          if (!script) {
            script = document.createElement('script');
            script.id = 'bloghandy-script';
            script.src = 'https://www.bloghandy.com/api/bh_blogengine.js';
            script.async = true;
            
            script.onload = () => {
              setBlogHandyLoaded(true);
              // Wait for BlogHandy to load content
              setTimeout(() => {
                displayBlogHandyPost();
              }, 2000);
            };
            
            script.onerror = () => {
              console.error('Failed to load BlogHandy script, using fallback');
              displayFallbackPost();
            };

            document.head.appendChild(script);
          } else {
            // Script exists, try to display post
            setBlogHandyLoaded(true);
            setTimeout(() => {
              displayBlogHandyPost();
            }, 1000);
          }
        };

        loadBlogHandy();
      } catch (err) {
        console.error('Error in loadBlogHandyForPost:', err);
        displayFallbackPost();
      }
    };

    const displayBlogHandyPost = () => {
      try {
        // Get post index from postId
        const postIndex = parseInt(postId?.replace('bloghandy-', '') || '0');
        
        // Try to find the BlogHandy container
        let blogContainer = document.getElementById('bh-posts');
        
        if (!blogContainer) {
          // Create a temporary container to load BlogHandy content
          blogContainer = document.createElement('div');
          blogContainer.id = 'bh-posts';
          blogContainer.style.display = 'none';
          document.body.appendChild(blogContainer);
          
          // Wait for BlogHandy to populate
          setTimeout(() => {
            displayBlogHandyPost();
          }, 1500);
          return;
        }

        // Find all posts
        const posts = blogContainer.querySelectorAll('.bh-post, .post, article, .blog-post, [class*="post"]');
        
        if (posts.length > postIndex) {
          const selectedPost = posts[postIndex] as HTMLElement;
          
          // Extract post data for better display
          const title = selectedPost.querySelector('h1, h2, h3, .title, .bh-post-title')?.textContent || 'Blog Post';
          const content = selectedPost.innerHTML;
          const date = selectedPost.querySelector('.date, .bh-post-date')?.textContent || new Date().toLocaleDateString();
          
          setPostData({
            title,
            content,
            date,
            author: 'SOK Law Associates'
          });
          
          // Clone the post content
          const postContent = selectedPost.cloneNode(true) as HTMLElement;
          
          // Clean up the cloned content
          postContent.style.cursor = 'default';
          postContent.removeAttribute('onclick');
          
          // Handle links within the post content
          const links = postContent.querySelectorAll('a');
          links.forEach(link => {
            link.removeAttribute('onclick');
            // Only external links should open in new tab
            if (link.href && !link.href.includes(window.location.origin)) {
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
            }
          });
          
          // Display the post content
          if (contentRef.current) {
            contentRef.current.innerHTML = '';
            contentRef.current.appendChild(postContent);
          }
          
          setLoading(false);
        } else {
          // Post not found, try fallback after a delay
          setTimeout(() => {
            if (posts.length === 0) {
              // Still no posts, use fallback
              displayFallbackPost();
            } else {
              // Posts loaded but index out of range
              setError('Blog post not found');
              setLoading(false);
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Error displaying BlogHandy post:', err);
        displayFallbackPost();
      }
    };

    const displayFallbackPost = () => {
      try {
      const postIndex = parseInt(postId || '0');
      const fallbackPosts = [
        {
          title: 'Understanding Corporate Law in Kenya',
          content: `
            <div class="prose prose-lg max-w-none">
              <p>Corporate law in Kenya has evolved significantly over the years, providing a robust framework for business operations and governance. Our legal team at SOK Law Associates has been at the forefront of these developments, helping businesses navigate the complex regulatory landscape.</p>
              
              <h2>Key Areas of Corporate Law</h2>
              <p>Our corporate law practice covers various aspects including:</p>
              <ul>
                <li>Company formation and registration</li>
                <li>Mergers and acquisitions</li>
                <li>Corporate governance and compliance</li>
                <li>Securities and capital markets</li>
                <li>Joint ventures and partnerships</li>
                <li>Corporate restructuring</li>
              </ul>
              
              <h2>Recent Developments</h2>
              <p>Recent amendments to the Companies Act have introduced new requirements for corporate transparency and accountability. These changes affect how companies report their activities and maintain their corporate records.</p>
              
              <h2>Why Choose SOK Law Associates</h2>
              <p>With over 15 years of experience in corporate law, our team has successfully handled over 200 corporate transactions. We provide strategic legal advice that goes beyond mere compliance, helping businesses achieve their commercial objectives while managing legal risks.</p>
              
              <p>For expert guidance on corporate law matters, contact our experienced team at SOK Law Associates. We're here to help your business thrive in Kenya's dynamic legal environment.</p>
            </div>
          `,
          author: 'SOK Law Associates',
          date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop'
        },
        {
          title: 'Employment Law Updates in Kenya',
          content: `
            <div class="prose prose-lg max-w-none">
              <p>Recent changes in Kenya's employment law landscape have significant implications for both employers and employees. Our employment law specialists at SOK Law Associates provide comprehensive guidance on these developments.</p>
              
              <h2>Key Employment Law Changes</h2>
              <p>The latest amendments include:</p>
              <ul>
                <li>Enhanced worker protection measures</li>
                <li>Updated minimum wage requirements</li>
                <li>Revised termination procedures</li>
                <li>New workplace safety standards</li>
                <li>Digital workplace regulations</li>
              </ul>
              
              <h2>Impact on Businesses</h2>
              <p>These changes require businesses to review and update their employment policies, contracts, and procedures to ensure compliance with the new regulations.</p>
              
              <p>Contact our employment law team for expert guidance on navigating these changes and ensuring your business remains compliant.</p>
            </div>
          `,
          author: 'SOK Law Associates',
          date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop'
        }
      ];

      const selectedPost = fallbackPosts[postIndex] || fallbackPosts[0];
      
      setPostData(selectedPost);
      
      if (contentRef.current) {
        contentRef.current.innerHTML = `
          <div class="mb-8">
            <img src="${selectedPost.image}" alt="${selectedPost.title}" class="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg" />
          </div>
          <div class="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-2" />
            <span>${selectedPost.date}</span>
            <User className="h-4 w-4 ml-6 mr-2" />
            <span class="ml-6">${selectedPost.author}</span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-bold mb-8 text-gray-900">${selectedPost.title}</h1>
          ${selectedPost.content}
        `;
      }
      
      setLoading(false);
      } catch (err) {
        console.error('Error displaying fallback post:', err);
        setError('Failed to load blog post');
        setLoading(false);
      }
    };

    loadBlogHandyForPost();
  }, [postId]);

  // Update document title when post data is available
  useEffect(() => {
    if (postData) {
      updatePageMeta(
        `${postData.title} - SOK Law Associates`,
        `Read our latest article: ${postData.title}. Expert legal insights from SOK Law Associates.`
      );
    }
    
    // Cleanup: Reset title when component unmounts
    return () => {
      updatePageMeta('SOK Law Associates Website');
    };
  }, [postData]);
  if (loading) {
  // Handle external links in post content
  useEffect(() => {
    if (contentRef.current && !loading) {
      handleExternalLinks(contentRef.current);
    }
  }, [loading, postData]);
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
            {/* Article Header */}
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
              className="blog-post-content"
            >
              {/* Content loaded dynamically */}
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

        {/* Hidden BlogHandy container for loading content */}
        <div id="bh-posts" style={{ display: 'none' }}></div>
      </div>
      
      {/* Add custom CSS for BlogHandy content */}
      <style jsx>{`
        .blog-post-content img {
          border-radius: 0.375rem;
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
        
        .blog-post-content h1,
        .blog-post-content h2,
        .blog-post-content h3 {
          color: #1e3a8a;
          margin: 2rem 0 1rem 0;
          line-height: 1.2;
        }
        
        .blog-post-content h1 {
          font-size: 2.5rem;
          font-weight: bold;
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
        
        /* Loading animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .blog-post-content {
          animation: fadeIn 0.5s ease-out;
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