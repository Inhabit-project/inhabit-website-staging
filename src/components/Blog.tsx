import React from 'react';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  date: string;
  title: string;
  content: string;
  image: string;
}

const Blog: React.FC = () => {
  const { t } = useTranslation();

  // Get main post and small posts from translations
  const mainPost = t('mainPage.blogPosts.main', { returnObjects: true }) as BlogPost;
  let smallPosts = t('mainPage.blogPosts.small', { returnObjects: true }) as unknown;

  // Ensure smallPosts is always an array
  if (!Array.isArray(smallPosts)) {
    // If it's an object with numeric keys, convert to array
    if (smallPosts && typeof smallPosts === 'object') {
      smallPosts = Object.values(smallPosts);
    } else {
      smallPosts = [];
    }
  }

  return (
    <section className="background-gradient-light w-full">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 background-gradient-light">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full mb-[2.5rem]">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]" style={{ color: 'var(--color-secondary)' }}>
              <span dangerouslySetInnerHTML={{ __html: t('mainPage.blog.title') }} />
            </h2>
            <p className="body-M text-secondary max-w-[35rem]" style={{ color: 'var(--color-secondary)' }}>
              {t('mainPage.blog.description')}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Blog Post */}
            <div className="lg:w-1/2">
              <div className="flex flex-col gap-5">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img 
                    src={mainPost.image} 
                    alt={mainPost.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="eyebrow" style={{ color: 'var(--color-secondary)' }}>
                    {mainPost.date}
                  </span>
                  <h3 className="heading-3" style={{ color: 'var(--color-secondary)' }}>
                    {mainPost.title}
                  </h3>
                  <p className="body-S" style={{ color: 'var(--color-secondary)' }}>
                    {mainPost.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Small Blog Posts */}
            <div className="lg:w-1/2">
              <div className="flex flex-col gap-[1.125rem]">
                {(smallPosts as BlogPost[]).map((post, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="relative aspect-[4/3] w-1/3">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <span className="eyebrow" style={{ color: 'var(--color-secondary)' }}>
                        {post.date}
                      </span>
                      <h3 className="heading-4" style={{ color: 'var(--color-secondary)' }}>
                        {post.title}
                      </h3>
                      <p className="body-S" style={{ color: 'var(--color-secondary)' }}>
                        {post.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;