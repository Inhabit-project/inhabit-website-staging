import { BlogPost } from './blogApi';

// TODO: Replace with your actual Strapi API URL
const apiUrl = 'https://your-strapi-instance/api';

// Example mock fetch function
export async function fetchStrapiPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual Strapi fetch logic
  return [
    {
      id: '1',
      date: '2025-05-20',
      title: 'Biodiversity Hotspots',
      content: 'Every HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.',
      image: '/assets/blog/blog-main.jpg',
    },
    // ...more mock posts
  ];
} 