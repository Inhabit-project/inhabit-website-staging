import { BlogPost } from '@/types/wordpress';

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const provider = import.meta.env.VITE_CMS_PROVIDER;

  if (provider === 'sanity') {
    const { fetchSanityPosts } = await import('./sanityApi');
    return fetchSanityPosts();
  }
  if (provider === 'contentful') {
    const { fetchContentfulPosts } = await import('./contentfulApi');
    return fetchContentfulPosts();
  }
  if (provider === 'strapi') {
    const { fetchStrapiPosts } = await import('./strapiApi');
    return fetchStrapiPosts();
  }
  if (provider === 'payload') {
    const { fetchPayloadPosts } = await import('./payloadApi');
    return fetchPayloadPosts();
  }
  // fallback: static/dummy data
  return [];
} 