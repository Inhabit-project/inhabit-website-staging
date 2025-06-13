import React from 'react';
import Menu from '../components/Menu';
import Blog from '../components/Blog';
import Footer from '../components/Footer';
import RelatedPost from '../components/RelatedPost';
import NewsletterCTA from '../components/NewsletterCTA';

const BlogPage: React.FC = () => (
  <div className="min-h-screen background-gradient-light">
    <Menu />
    <Blog />
    <NewsletterCTA />
    <RelatedPost />
    <Footer />
  </div>
);

export default BlogPage; 