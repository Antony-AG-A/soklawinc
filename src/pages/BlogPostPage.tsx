import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogHandyLoaded, setBlogHandyLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle back navigation to home page and scroll to news section
  const handleBackToNews = () => {
    navigate('/');
    // Wait for navigation to complete, then scroll to news section
    setTimeout(() => {
      const newsSection = document.getElementById('news');
      if (newsSection) {
        newsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    const loadBlogHandyForPost = async () => {
      try {
        setLoading(true);
        
        // Check if this is a BlogHandy post
        if (postId?.startsWith('bloghandy-')) {
          // Load BlogHandy script if not already loaded
          const loadBlogHandy = () => {
            // Check if BlogHandy is already loaded
            if (window.bh_id || document.getElementById('bloghandy-script')) {
              setBlogHandyLoaded(true);
              displayBlogHandyPost();
              return;
            }

            // Set BlogHandy ID
            window.bh_id = "60HwYmcpS5PD0XNTgyMQ";

            // Create and load BlogHandy script
            const script = document.createElement('script');
            script.id = 'bloghandy-script';
            script.src = 'https://www.bloghandy.com/api/bh_blogengine.js';
            script.async = true;
            
            script.onload = () => {
              setBlogHandyLoaded(true);
              console.log('BlogHandy script loaded successfully');
              
              // Wait for BlogHandy to load content, then display the specific post
              setTimeout(() => {
                displayBlogHandyPost();
              }, 2000);
            };
            
            script.onerror = () => {
              console.error('Failed to load BlogHandy script');
              setError('Failed to load blog content');
              setLoading(false);
            };

            document.head.appendChild(script);
          };

          loadBlogHandy();
        } else {
          // Handle fallback posts (your original logic)
          displayFallbackPost();
        }
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error loading blog post:', err);
        setLoading(false);
      }
    };

    const displayBlogHandyPost = () => {
      // Get post index from postId
      const postIndex = parseInt(postId?.replace('bloghandy-', '') || '0');
      
      // Try to find the BlogHandy container
      const blogContainer = document.getElementById('bh-posts');
      
      if (!blogContainer) {
        // Create a temporary container to load BlogHandy content
        const tempContainer = document.createElement('div');
        tempContainer.id = 'bh-posts';
        tempContainer.style.display = 'none';
        document.body.appendChild(tempContainer);
        
        // Wait a bit more for BlogHandy to populate
        setTimeout(() => {
          displayBlogHandyPost();
        }, 1000);
        return;
      }

      // Find all posts
      const posts = blogContainer.querySelectorAll('.bh-post, .post, article, .blog-post, [class*="post"]');
      
      if (posts.length > postIndex) {
        const selectedPost = posts[postIndex] as HTMLElement;
        
        // Clone the post content
        const postContent = selectedPost.cloneNode(true) as HTMLElement;
        
        // Remove any click handlers from the cloned content
        postContent.style.cursor = 'default';
        postContent.onclick = null;
        
        // Find and remove click handlers from links
        const links = postContent.querySelectorAll('a');
        links.forEach(link => {
          link.onclick = null;
          // Restore original link functionality
          link.style.cursor = 'pointer';
        });
        
        // Display the post content
        if (contentRef.current) {
          contentRef.current.innerHTML = '';
          contentRef.current.appendChild(postContent);
        }
        
        setLoading(false);
      } else {
        // Post not found, show error or fallback
        setError('Blog post not found');
        setLoading(false);
      }
    };

    const displayFallbackPost = () => {
      // Your original fallback post logic here
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
        // Add your other fallback posts here...
      ];

      const selectedPost = fallbackPosts[postIndex] || fallbackPosts[0];
      
      if (contentRef.current) {
        contentRef.current.innerHTML = `
          <div class="mb-8">
            <img src="${selectedPost.image}" alt="${selectedPost.title}" class="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg" />
          </div>
          <div class="flex items-center text-sm text-gray-500 mb-6">
            <span>${selectedPost.date}</span>
            <span class="ml-6">${selectedPost.author}</span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-bold mb-8 text-gray-900">${selectedPost.title}</h1>
          ${selectedPost.content}
        `;
      }
      
      setLoading(false);
    };

    loadBlogHandyForPost();
  }, [postId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog post...</p>
          </div>
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
              Back to News
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-lg shadow-lg p-8 lg:p-12">
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
                <span>Back to All News</span>
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