import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Loader2 } from 'lucide-react';
import NewsLoader from './NewsLoader';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  feature_image?: string;
  published_at: string;
  html?: string;
  reading_time?: number;
}

// Article viewer component within News
const NewsArticleViewer: React.FC<{ slug: string; onBack: () => void }> = ({ slug, onBack }) => {
  const [article, setArticle] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `https://xelf.ghost.io/ghost/api/v3/content/posts/slug/${slug}/?key=367cdb8a8abe78fe688f751c76&fields=title,slug,excerpt,feature_image,published_at,html,reading_time`,
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
  }, [slug]);

  if (isLoading) {
    return (
      <section className="py-20" style={{ backgroundColor: '#f5f5f0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to News
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <NewsLoader message="Loading article..." variant="minimal" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="py-20" style={{ backgroundColor: '#f5f5f0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to News
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-red-600 mb-4">{error || "Article not found"}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" style={{ backgroundColor: '#f5f5f0' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to News
        </button>

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
};

const News = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

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
    // If an article is selected, show the article viewer
  if (selectedArticle) {
    return (
      <NewsArticleViewer 
        slug={selectedArticle} 
        onBack={() => setSelectedArticle(null)} 
      />
    );
  }

  return () => observer.disconnect();
  }, []);

  // Fetch posts from Ghost CMS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Correct Ghost API URL format
        const res = await fetch(
          `https://xelf.ghost.io/ghost/api/v3/content/posts/?key=367cdb8a8abe78fe688f751c76&limit=6&fields=title,slug,excerpt,feature_image,published_at`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            // Add no-cors mode if CORS is the issue
            mode: 'cors',
          }
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setPosts(data.posts || []);
        
      } catch (error) {
        console.error("Error fetching Ghost posts:", error);
        setError("Unable to load news articles at the moment. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
          <NewsLoader 
            message="Loading latest news and updates..." 
            variant="cards"
          />
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No Posts State */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No news articles available at the moment.</p>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && !error && posts.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <div
                key={post.slug}
                className="news-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition transform hover:-translate-y-1 hover:shadow-xl"
                onClick={() => setSelectedArticle(post.slug)}
              >
                {post.feature_image && (
                  <img
                    src={post.feature_image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(post.published_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default News;