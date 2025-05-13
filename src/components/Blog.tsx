import React from 'react';

interface BlogPost {
  date: string;
  title: string;
  content: string;
  image: string;
}

const Blog: React.FC = () => {
  const mainPost: BlogPost = {
    date: "20.05.2025",
    title: "Biodiversity Hotspots",
    content: "Every HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. These \"living seed hubs\" can be used by animals and humans to transport and disperse seeds, spreading biodiversity throughout the Corridor.",
    image: "/assets/blog/blog-main.jpg"
  };

  const smallPosts: BlogPost[] = [
    {
      date: "20.05.2025",
      title: "Biodiversity Hotspots",
      content: "Every HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.",
      image: "/assets/blog/blog-1.jpg"
    },
    {
      date: "20.05.2025",
      title: "Biodiversity Hotspots",
      content: "Every HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.",
      image: "/assets/blog/blog-2.jpg"
    },
    {
      date: "20.05.2025",
      title: "Biodiversity Hotspots",
      content: "Every HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.",
      image: "/assets/blog/blog-3.jpg"
    }
  ];

  return (
    <section className="w-full">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
              Keep up<br /><strong>informed</strong>
            </h2>
            <p className="body-M text-secondary max-w-[36rem]">
              Stay updated with our latest news and insights about biodiversity and ecological preservation.
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
                    className="absolute inset-0 w-full h-full object-cover" style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="eyebrow text-[#276732]">
                    {mainPost.date}
                  </span>
                  <h3 className="heading-3 text-[#0B1E12]">
                    {mainPost.title}
                  </h3>
                  <p className="body-S text-secondary">
                    {mainPost.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Small Blog Posts */}
            <div className="lg:w-1/2">
              <div className="flex flex-col gap-[1.125rem]">
                {smallPosts.map((post, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="relative aspect-[4/3] w-1/3">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover" style={{ borderRadius: 'var(--radius-md)' }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <span className="eyebrow text-[#276732]">
                        {post.date}
                      </span>
                      <h3 className="heading-4 text-[#0B1E12]">
                        {post.title}
                      </h3>
                      <p className="body-S text-secondary">
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