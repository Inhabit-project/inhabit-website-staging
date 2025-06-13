import React from 'react';
import Menu from '../components/Menu';
import RelatedPost from '../components/RelatedPost';
import Footer from '../components/Footer';
import NewsletterCTA from '../components/NewsletterCTA';

const ArticlePage: React.FC = () => (
  <div style={{ background: 'var(--background-gradient-light)', minHeight: '100vh' }}>
    <Menu />
    <main className="container mx-auto py-24" style={{ maxWidth: 900 }}>
      {/* Breadcrumb and Category */}
      <div className="mb-4" style={{ color: 'var(--color-secondary)', fontFamily: 'Abel, sans-serif', fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Blog / Category
      </div>
      {/* Title */}
      <h1 className="heading-2 mb-2" style={{ color: 'var(--color-secondary)', fontWeight: 500, fontSize: 48, lineHeight: 1.1 }}>
        Nuiyanzhi Biocultural Hub: Meet the Guardian Family Restoring Biodiversity
      </h1>
      {/* Meta */}
      <div className="flex items-center mb-6" style={{ color: 'var(--color-secondary)', fontFamily: 'Abel, sans-serif', fontSize: 16, letterSpacing: '0.08em', opacity: 0.8 }}>
        <span>Feb. 2024</span>
        <span style={{ margin: '0 12px' }}>•</span>
        <span>11 JAN 2022</span>
        <span style={{ margin: '0 12px' }}>•</span>
        <span>5 MIN READ</span>
      </div>
      {/* Cover Image */}
      <div className="mb-10">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="cover"
          style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 340 }}
        />
      </div>
      {/* Introduction */}
      <h2 className="heading-4 mb-2" style={{ color: 'var(--color-secondary)' }}>Introduction</h2>
      <p className="body-S mb-6" style={{ color: 'var(--color-secondary)', fontSize: 18 }}>
        At Ñuiyanzhi Hub, the Maya Kogui are stewards, and visitors from worldwide are invited to model traditional methods together with experts. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim.
      </p>
      {/* Image Placeholder */}
      <div className="mb-6 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)', borderRadius: 16, height: 220 }}>
        <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="16" fill="#E5E5E5" />
          <path d="M16 48L32 32L48 48" stroke="#BDBDBD" strokeWidth="2" />
          <circle cx="24" cy="24" r="4" fill="#BDBDBD" />
        </svg>
      </div>
      <div className="body-S mb-6" style={{ color: 'var(--color-secondary)', fontSize: 18 }}>
        Dolor enim eu tortor urna sed dui nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis nisi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.
      </div>
      {/* Highlighted blockquote */}
      <blockquote style={{ borderLeft: '4px solid var(--color-accent)', background: 'rgba(213, 115, 0, 0.05)', padding: '16px 24px', borderRadius: 12, marginBottom: 24, color: 'var(--color-secondary)', fontStyle: 'italic', fontSize: 18 }}>
        "Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam amet, nec netus amet enim."
      </blockquote>
      {/* Main content */}
      <div className="body-S mb-6" style={{ color: 'var(--color-secondary)', fontSize: 18 }}>
        Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim.
      </div>
      {/* Conclusion */}
      <h2 className="heading-4 mb-2" style={{ color: 'var(--color-secondary)' }}>Conclusion</h2>
      <div className="body-S mb-6" style={{ color: 'var(--color-secondary)', fontSize: 18 }}>
        Mauris euismod, sapien eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim. Etiam quis enim, eu mattis, eu enim.
      </div>
      {/* Share section */}
      <div className="mb-8" style={{ borderTop: '1px solid #D9E6C3', paddingTop: 24 }}>
        <span style={{ color: 'var(--color-secondary)', fontFamily: 'Abel, sans-serif', fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Share this post.</span>
        <div className="flex gap-4 mt-2">
          <button style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: 20 }}>🌐</button>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: 20 }}>🐦</button>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: 20 }}>📘</button>
        </div>
      </div>
      {/* Author */}
      <div className="flex items-center gap-4 mt-8" style={{ borderTop: '1px solid #D9E6C3', paddingTop: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#D9E6C3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--color-secondary)' }}>A</div>
        <div>
          <div style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Full Name</div>
          <div style={{ color: 'var(--color-secondary)', opacity: 0.7, fontSize: 14 }}>Job title, Company name</div>
        </div>
      </div>
      {/* Previous/Next Article Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '64px 0 48px 0', gap: 24 }}>
        <a href="#" style={{ textDecoration: 'none', flex: 1 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--color-light)',
              color: 'var(--color-secondary)',
              border: 'none',
              borderRadius: 32,
              padding: '18px 32px',
              fontFamily: 'Abel, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(16, 32, 16, 0.10)',
              transition: 'background 0.2s',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontWeight: 700 }}>Previous Article</span>
            <span style={{ opacity: 0.7, marginLeft: 8 }}>How to Restore Biodiversity</span>
          </button>
        </a>
        <a href="#" style={{ textDecoration: 'none', flex: 1, textAlign: 'right' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--color-light)',
              color: 'var(--color-secondary)',
              border: 'none',
              borderRadius: 32,
              padding: '18px 32px',
              fontFamily: 'Abel, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(16, 32, 16, 0.10)',
              transition: 'background 0.2s',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <span style={{ fontWeight: 700, marginRight: 8 }}>Next Article</span>
            <span style={{ opacity: 0.7 }}>Meet the Stewards of Tierra Kilwa</span>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </a>
      </div> 
    </main>
    {/* Newsletter CTA */}
    <NewsletterCTA />
    <RelatedPost />
    <Footer />
  </div>
);

export default ArticlePage; 