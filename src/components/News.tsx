import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsLoader from './NewsLoader';

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://xelf.ghost.io/ghost/api/content/posts/slug/${slug}/?key=367cdb8a8abe78fe688f751c76&fields=title,slug,html,feature_image,published_at`
        );
        const data = await res.json();
        setPost(data.posts[0] || null);
      } catch (error) {
        console.error("Error fetching Ghost post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) return <NewsLoader message="Loading article..." />;

  if (!post) return <p className="text-center text-gray-600 py-10">Post not found.</p>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      {post.feature_image && (
        <img 
          src={post.feature_image} 
          alt={post.title} 
          className="w-full h-80 object-cover rounded-xl mb-6"
        />
      )}
      <h1 className="text-4xl font-bold text-blue-900 mb-4">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {new Date(post.published_at).toLocaleDateString()}
      </p>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
};

export default BlogPost;
