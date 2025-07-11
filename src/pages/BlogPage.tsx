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
  // Remove useEffect that calls onPageReady immediately
  return (
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <Blog onReady={onPageReady} />
      <NewsletterCTA />
      <RelatedPost />
      <Footer />
    </div>
  );
};

export default BlogPage; 