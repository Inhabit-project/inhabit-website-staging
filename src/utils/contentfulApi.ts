import { BlogPost } from "@/types/wordpress";

// TODO: Replace with your actual Contentful space ID and access token
const spaceId = "your_space_id";
const accessToken = "your_access_token";

// Example mock fetch function
export async function fetchContentfulPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual Contentful client fetch logic
  return [
    {
      id: "1",
      date: "2025-05-20",
      title: "Biodiversity Hotspots",
      content:
        "Every HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.",
      image: "/assets/blog/blog-main.jpg",
    },
    // ...more mock posts
  ];
}
