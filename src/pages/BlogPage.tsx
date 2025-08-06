import React from "react";
import Menu from "../components/Menu";
import Blog from "../components/blog/Blog";
import RelatedPost from "../components/blog/RelatedPost";
import Footer from "../components/Footer";
import NewsletterCTA from "../components/NewsletterCTA";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";

interface BlogPageProps {
  onPageReady?: () => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onPageReady }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen background-gradient-light">
      <SEOHead pageType="mainPage.blog" />
      <Menu />
      <Blog onReady={onPageReady} />
      <NewsletterCTA />
      <RelatedPost />
      <Footer />
    </div>
  );
};

export default BlogPage;
