import React, { useEffect } from 'react';
import Menu from "@/components/Menu";
import NewsletterCTA from "@/components/NewsletterCTA";
import RelatedPost from "@/components/blog/RelatedPost";
import Footer from "@/components/Footer";
import SingleBlog from "@/components/blog/SingleBlog";
import SEOHead from "@/components/SEOHead";

interface ArticlePageProps {
  onPageReady?: () => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ onPageReady }) => {
  return (
    <div
      style={{
        background: "var(--background-gradient-light)",
        minHeight: "100vh",
      }}
    >
      <SEOHead 
        pageType="article"
        customData={{
          title: "Article | INHABIT",
          description: "Read this article on INHABIT."
        }}
      />
      <Menu />
      <SingleBlog onPageReady={onPageReady} />
      {/* Newsletter CTA */}
      <NewsletterCTA />
      <RelatedPost />
      <Footer />
    </div>
  );
};

export default ArticlePage;
