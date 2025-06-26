import React from "react";
import Menu from "@/components/Menu";
import NewsletterCTA from "@/components/NewsletterCTA";
import RelatedPost from "@/components/RelatedPost";
import Footer from "@/components/Footer";
import SingleBlog from "@/components/SingleBlog";

const ArticlePage: React.FC = () => (
  <div
    style={{
      background: "var(--background-gradient-light)",
      minHeight: "100vh",
    }}
  >
    <Menu />
    <SingleBlog />
    {/* Newsletter CTA */}
    <NewsletterCTA />
    <RelatedPost />
    <Footer />
  </div>
);
export default ArticlePage;
