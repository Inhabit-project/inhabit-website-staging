import React, { useEffect } from 'react';
import Menu from '../components/Menu';
import Blog from '../components/Blog';
import Footer from '../components/Footer';
import RelatedPost from '../components/RelatedPost';
import NewsletterCTA from '../components/NewsletterCTA';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface BlogPageProps {
  onPageReady?: () => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onPageReady }) => {
  const { t } = useTranslation();
  // Remove useEffect that calls onPageReady immediately
  return (
    <div className="min-h-screen background-gradient-light">
      <Helmet>
        <title>{t('mainPage.blog.seoTitle') || 'Blog | INHABIT'}</title>
        <meta name="description" content={t('mainPage.blog.seoDescription') || t('mainPage.blog.description')} />
        <meta property="og:title" content={t('mainPage.blog.seoTitle') || 'Blog | INHABIT'} />
        <meta property="og:description" content={t('mainPage.blog.seoDescription') || t('mainPage.blog.description')} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Menu />
      <Blog onReady={onPageReady} />
      <NewsletterCTA />
      <RelatedPost />
      <Footer />
    </div>
  );
};

export default BlogPage; 