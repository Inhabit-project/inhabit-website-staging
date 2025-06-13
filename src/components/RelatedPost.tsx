import React, { useState } from 'react';

const posts = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  category: 'Category',
  date: '11 JAN 2022',
  readTime: '5 MIN READ',
  title: 'Blog title heading will go here',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
}));

const POSTS_PER_PAGE = 6;
const PAGE_COUNT = Math.ceil(posts.length / POSTS_PER_PAGE);

const RelatedPost: React.FC = () => {
  const [page, setPage] = useState(1);
  const startIdx = (page - 1) * POSTS_PER_PAGE;
  const endIdx = startIdx + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIdx, endIdx);

  return (
    <section style={{ background: 'var(--color-background-light)', padding: 20 }}>
      <div className="relative z-10 w-full container py-24 background-gradient-light">
        <h2 className="heading-2 mb-2" style={{ color: 'var(--color-secondary)' }}>
          Related <span className="font-bold block">Articles</span>
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: '30px', marginTop: 44 }}
        >
          {paginatedPosts.map((post) => (
            <div
              key={post.id}
              className="relative"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                minHeight: 600,
                background: 'transparent',
                boxShadow: '0 8px 32px 0 rgba(16, 32, 16, 0.15)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <img
                src={post.image}
                alt="Leaf background"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0,
                  borderRadius: 'inherit',
                }}
              />
              <button
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  zIndex: 3,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(26.28px)',
                  WebkitBackdropFilter: 'blur(26.28px)',
                  padding: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11l3-3-3-3" stroke="#F6FFEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {/* Overlay at the bottom */}
              <div
                style={{
                  position: 'absolute',
                  zIndex: 2,
                  margin: 0,
                  marginBottom: 0,
                  borderRadius: '20px',
                  background: 'rgba(27, 54, 37, 0.7)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 24px 0 rgba(16, 32, 16, 0.10)',
                  padding: '32px 32px 24px 32px',
                  maxWidth: '95%',
                  left: '2.5%',
                  bottom: 24,
                  right: 0,
                }}
              >
                <div
                  className="eyebrow mb-2 flex items-center"
                  style={{ color: '#F6FFEA', gap: 16, fontSize: 16, letterSpacing: '7%' }}
                >
                  <span style={{ fontFamily: 'Abel, sans-serif', fontWeight: 400, textTransform: 'uppercase' }}>{post.category}</span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span style={{ fontFamily: 'Abel, sans-serif', fontWeight: 400, textTransform: 'uppercase' }}>{post.date}</span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span style={{ fontFamily: 'Abel, sans-serif', fontWeight: 400, textTransform: 'uppercase' }}>{post.readTime}</span>
                </div>
                <h3
                  className="heading-4 mb-2"
                  style={{ color: '#F6FFEA', fontFamily: 'Montserrat, sans-serif', fontWeight: 500, fontSize: 32, lineHeight: 1.22 }}
                >
                  {post.title}
                </h3>
                <p
                  className="body-S mb-4"
                  style={{ color: '#F6FFEA', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 400, fontSize: 18, lineHeight: 1.5 }}
                >
                  {post.description}
                </p>
                <a href="/article/example" style={{ textDecoration: 'none' }}>
                  <button
                    className="btn-primary button-text"
                    style={{
                      background: '#D57300',
                      color: '#F6FFEA',
                      borderRadius: '69.5px',
                      padding: '12px 28px',
                      fontFamily: 'Abel, sans-serif',
                      fontWeight: 400,
                      fontSize: 16,
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10.7,
                      minWidth: 0,
                      border: 'none',
                      boxShadow: 'none',
                      marginTop: 16,
                    }}
                  >
                    Read this article
                    <svg width="25.66" height="25.66" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 18L18 8" stroke="#F6FFEA" strokeWidth="1.07" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 8H18V18" stroke="#F6FFEA" strokeWidth="1.07" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-10 items-center" style={{ gap: 8 }}>
          {/* Previous */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '6px 22px',
              borderRadius: 24,
              background: 'var(--color-green-soft)',
              color: page === 1 ? 'rgba(28,54,37,0.3)' : 'var(--color-secondary)',
              border: 'none',
              fontWeight: 500,
              fontFamily: 'Abel, sans-serif',
              fontSize: 20,
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.7 : 1,
              letterSpacing: '0.04em',
              transition: 'background 0.2s',
              minWidth: 90,
            }}
          >
            « PREVIOUS
          </button>
          {/* Page numbers with ellipsis */}
          {(() => {
            const items = [];
            if (PAGE_COUNT <= 5) {
              for (let i = 1; i <= PAGE_COUNT; i++) {
                items.push(
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '50%',
                      background: page === i ? 'var(--color-green-soft)' : 'transparent',
                      color: page === i ? 'var(--color-secondary)' : 'var(--color-secondary)',
                      border: 'none',
                      fontWeight: 700,
                      fontFamily: 'Abel, sans-serif',
                      fontSize: 20,
                      margin: '0 2px',
                      cursor: 'pointer',
                      minWidth: 36,
                      minHeight: 36,
                    }}
                  >
                    {i}
                  </button>
                );
              }
            } else {
              // Always show first, last, current, and neighbors
              if (page > 2) {
                items.push(
                  <button
                    key={1}
                    onClick={() => setPage(1)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '50%',
                      background: page === 1 ? 'var(--color-green-soft)' : 'transparent',
                      color: page === 1 ? 'var(--color-secondary)' : 'var(--color-secondary)',
                      border: 'none',
                      fontWeight: 700,
                      fontFamily: 'Abel, sans-serif',
                      fontSize: 20,
                      margin: '0 2px',
                      cursor: 'pointer',
                      minWidth: 36,
                      minHeight: 36,
                    }}
                  >
                    1
                  </button>
                );
              }
              if (page > 3) {
                items.push(
                  <span key="start-ellipsis" style={{ color: 'var(--color-secondary)', opacity: 0.4, fontSize: 20, margin: '0 6px', fontFamily: 'Abel, sans-serif' }}>...</span>
                );
              }
              for (let i = Math.max(2, page - 1); i <= Math.min(PAGE_COUNT - 1, page + 1); i++) {
                items.push(
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '50%',
                      background: page === i ? 'var(--color-green-soft)' : 'transparent',
                      color: page === i ? 'var(--color-secondary)' : 'var(--color-secondary)',
                      border: 'none',
                      fontWeight: 700,
                      fontFamily: 'Abel, sans-serif',
                      fontSize: 20,
                      margin: '0 2px',
                      cursor: 'pointer',
                      minWidth: 36,
                      minHeight: 36,
                    }}
                  >
                    {i}
                  </button>
                );
              }
              if (page < PAGE_COUNT - 2) {
                items.push(
                  <span key="end-ellipsis" style={{ color: 'var(--color-secondary)', opacity: 0.4, fontSize: 20, margin: '0 6px', fontFamily: 'Abel, sans-serif' }}>...</span>
                );
              }
              if (page < PAGE_COUNT - 1) {
                items.push(
                  <button
                    key={PAGE_COUNT}
                    onClick={() => setPage(PAGE_COUNT)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '50%',
                      background: page === PAGE_COUNT ? 'var(--color-green-soft)' : 'transparent',
                      color: page === PAGE_COUNT ? 'var(--color-secondary)' : 'var(--color-secondary)',
                      border: 'none',
                      fontWeight: 700,
                      fontFamily: 'Abel, sans-serif',
                      fontSize: 20,
                      margin: '0 2px',
                      cursor: 'pointer',
                      minWidth: 36,
                      minHeight: 36,
                    }}
                  >
                    {PAGE_COUNT}
                  </button>
                );
              }
            }
            return items;
          })()}
          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(PAGE_COUNT, p + 1))}
            disabled={page === PAGE_COUNT}
            style={{
              padding: '6px 22px',
              borderRadius: 24,
              background: 'var(--color-green-soft)',
              color: page === PAGE_COUNT ? 'rgba(28,54,37,0.3)' : 'var(--color-secondary)',
              border: 'none',
              fontWeight: 500,
              fontFamily: 'Abel, sans-serif',
              fontSize: 20,
              cursor: page === PAGE_COUNT ? 'not-allowed' : 'pointer',
              opacity: page === PAGE_COUNT ? 0.7 : 1,
              letterSpacing: '0.04em',
              transition: 'background 0.2s',
              minWidth: 90,
            }}
          >
            NEXT »
          </button>
        </div>
      </div>
    </section>
  );
};

export default RelatedPost; 