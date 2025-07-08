import React, { useEffect } from 'react';
import Menu from '../components/Menu';
import Blog from '../components/Blog';
import Footer from '../components/Footer';
import RelatedPost from '../components/RelatedPost';
import NewsletterCTA from '../components/NewsletterCTA';

interface BlogPageProps {
  onPageReady?: () => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onPageReady }) => {
  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <Blog />
      <NewsletterCTA />
      <RelatedPost />
      <Footer />
    </div>
  );
};

export default BlogPage; 