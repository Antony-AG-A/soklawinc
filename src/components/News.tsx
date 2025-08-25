import React, { useEffect, useRef, useState } from 'react';

const News = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogHandyLoaded, setBlogHandyLoaded] = useState(false);
  const blogHandyInitialized = useRef(false);

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

  // Initialize BlogHandy with proper cleanup and error handling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    
    const loadBlogHandy = async () => {
      // Prevent multiple initializations
      if (blogHandyInitialized.current) {
        return;
      }
      
      blogHandyInitialized.current = true;
      setIsLoading(true);

      try {
        // Check if BlogHandy is already loaded
        if (window.bh_id && document.getElementById('bloghandy-script')) {
          setBlogHandyLoaded(true);
          setIsLoading(false);
          setupBlogHandyClickHandlers();
          return;
        }

        // Set BlogHandy ID only once
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
            // Wait for BlogHandy to populate content
            timeoutId = setTimeout(() => {
              setupBlogHandyClickHandlers();
              setIsLoading(false);
            }, 2000);
          };
          
          script.onerror = () => {
            console.error('Failed to load BlogHandy script');
            setIsLoading(false);
          };

          document.head.appendChild(script);
        } else {
          // Script already exists, just setup handlers
          setBlogHandyLoaded(true);
          timeoutId = setTimeout(() => {
            setupBlogHandyClickHandlers();
            setIsLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Error loading BlogHandy:', error);
        setIsLoading(false);
      }
    };

    loadBlogHandy();
    
    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Setup click handlers for BlogHandy posts with better error handling
  const setupBlogHandyClickHandlers = () => {
    const blogContainer = document.getElementById('bh-posts');
    if (!blogContainer) {
      return;
    }

    try {
      // Remove any existing event listeners to prevent duplicates
      const existingHandlers = blogContainer.querySelectorAll('[data-handler-added]');
      existingHandlers.forEach(element => {
        element.removeAttribute('data-handler-added');
      });

      // Find all clickable elements
      const clickableElements = blogContainer.querySelectorAll('a[href], .bh-post, .post, article, .blog-post, [class*="post"]');
      
      clickableElements.forEach((element) => {
        const clickableElement = element as HTMLElement;
        
        // Skip if handler already added
        if (clickableElement.getAttribute('data-handler-added')) {
          return;
        }
        
        // Mark as handled
        clickableElement.setAttribute('data-handler-added', 'true');
        clickableElement.style.cursor = 'pointer';
        
        // Remove any existing onclick attributes that might cause refresh
        clickableElement.removeAttribute('onclick');
        
        // Add our controlled click handler
        clickableElement.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Find the URL to open
          let urlToOpen = '';
          
          if (element.tagName === 'A') {
            urlToOpen = (element as HTMLAnchorElement).href;
          } else {
            // Look for a link inside the element
            const innerLink = element.querySelector('a[href]') as HTMLAnchorElement;
            if (innerLink) {
              urlToOpen = innerLink.href;
            }
          }
          
          if (urlToOpen && urlToOpen !== '#' && urlToOpen !== 'javascript:void(0)') {
            // Open in new tab to prevent page refresh
            window.open(urlToOpen, '_blank', 'noopener,noreferrer');
          }
        }, { passive: false });
      });
    } catch (error) {
      console.error('Error setting up BlogHandy click handlers:', error);
    }
  };

  // Re-setup handlers when content changes
  useEffect(() => {
    if (!blogHandyLoaded) return;

    const blogContainer = document.getElementById('bh-posts');
    if (!blogContainer) return;

    // Set up MutationObserver to watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      const hasNewContent = mutations.some(mutation => 
        mutation.type === 'childList' && mutation.addedNodes.length > 0
      );
      
      if (hasNewContent) {
        // Debounce the handler setup
        setTimeout(() => {
          setupBlogHandyClickHandlers();
        }, 500);
      }
    });

    observer.observe(blogContainer, {
      childList: true,
      subtree: true,
      attributes: false
    });

    return () => observer.disconnect();
  }, [blogHandyLoaded]);

  return (
    <section ref={sectionRef} id="news" className="py-20" style={{ backgroundColor: '#f5f5f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
            Latest News & Updates
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600">
            Stay updated with our latest legal insights, case victories, and important legal developments
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-400 mx-auto mt-6"></div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <span className="ml-4 text-gray-600">Loading latest news...</span>
          </div>
        )}

        {/* BlogHandy Container */}
        <div className="mt-8">
          <div 
            id="bh-posts" 
            className={`blog-posts-container ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}
          >
            {/* BlogHandy will populate this container */}
          </div>
        </div>
      </div>
    </section>
  );
};

// Declare global BlogHandy variables for TypeScript
declare global {
  interface Window {
    bh_id: string;
  }
}

export default News;