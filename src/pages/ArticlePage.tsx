import React, { useEffect } from 'react';
import Menu from "@/components/Menu";
import NewsletterCTA from "@/components/NewsletterCTA";
import RelatedPost from "@/components/RelatedPost";
import Footer from "@/components/Footer";
import SingleBlog from "@/components/SingleBlog";

interface ArticlePageProps {
  onPageReady?: () => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ onPageReady }) => {
  // Remove useEffect that calls onPageReady immediately
  return (
    <div
      style={{
        background: "var(--background-gradient-light)",
        minHeight: "100vh",
      }}
    >
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
