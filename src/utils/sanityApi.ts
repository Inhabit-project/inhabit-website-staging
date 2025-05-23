import { BlogPost } from './blogApi';

// TODO: Replace with your actual Sanity project ID and dataset
const projectId = 'your_project_id';
const dataset = 'production';

// Example: Simulate a real fetch with dummy content
export async function fetchSanityPosts(): Promise<BlogPost[]> {
  // Simulate a network delay
  await new Promise(res => setTimeout(res, 500));
  return [
    {
      id: '1',
      date: '2025-05-20',
      title: 'Biodiversity Hotspots',
      content: 'Every HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. These "living seed hubs" can be used by animals and humans to transport and disperse seeds, spreading biodiversity throughout the Corridor.',
      image: '/assets/blog/blog-main.jpg',
    },
    {
      id: '2',
      date: '2025-05-18',
      title: 'Seed Dispersal Strategies',
      content: 'Discover how animals and humans play a crucial role in dispersing seeds and increasing biodiversity in our global corridor.',
      image: '/assets/blog/blog-1.jpg',
    },
    {
      id: '3',
      date: '2025-05-15',
      title: 'Regenerative Hubs',
      content: 'Learn about the innovative practices that turn degraded lands into thriving biocultural hubs for future generations.',
      image: '/assets/blog/blog-2.jpg',
    },
    {
      id: '4',
      date: '2025-05-10',
      title: 'Community Engagement',
      content: 'Local communities are at the heart of our stewardship model, ensuring sustainable management and protection of vital ecosystems.',
      image: '/assets/blog/blog-3.jpg',
    },
  ];
} 