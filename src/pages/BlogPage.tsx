import React from 'react';
import Menu from '../components/Menu';
import Blog from '../components/Blog';
import Footer from '../components/Footer';

const BlogPage: React.FC = () => (
  <div className="min-h-screen background-gradient-light">
    <Menu />
    <Blog />
    <Footer />
  </div>
);

export default BlogPage; 