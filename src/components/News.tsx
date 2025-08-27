import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsLoader from './NewsLoader';

const News = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

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

  // Fetch posts from Ghost CMS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://xelf.ghost.io/367cdb8a8abe78fe688f751c76/content/posts/?key=367cdb8a8abe78fe688f751c76&limit=6&fields=title,slug,excerpt,feature_image,published_at`
        );
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching Ghost posts:", error);
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
          <NewsLoader message="Loading latest news and updates..." />
        )}

        {/* Posts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!isLoading && posts.map((post, index) => (
            <div
              key={post.slug}
              className="news-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition transform hover:-translate-y-1 hover:shadow-xl"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              {post.feature_image && (
                <img
                  src={post.feature_image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
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
      </div>
    </section>
  );
};

export default News;
