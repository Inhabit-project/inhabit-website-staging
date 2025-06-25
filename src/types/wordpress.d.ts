export interface BlogPost {
  id: string;
  date: string;
  title: string;
  content: string;
  image: string;
  categories: string[];
  readTime?: string;
}

export interface BlogProps {
  isMainPage?: boolean;
}

export interface WordPressPosts {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    "wp:term"?: WordPressTerm[][];
  };
}

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          thumbnail?: {
            source_url: string;
          };
          medium?: {
            source_url: string;
          };
          large?: {
            source_url: string;
          };
          full?: {
            source_url: string;
          };
        };
      };
    }>;
    "wp:term"?: WordPressTerm[][];
    author?: WordPressAuthor[];
  };
}

export interface WordPressTerm {
  id: number;
  name: string;
  taxonomy: string;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  description: string;
  link: string;
  avatar_urls?: {
    "24"?: string;
    "48"?: string;
    "96"?: string;
    [key: string]: string | undefined;
  };
}

export interface PostNavigation {
  current: ProcessedPost | null;
  next: Pick<BlogPost, "id" | "title" | "content" | "date" | "image"> | null;
  previous: Pick<
    BlogPost,
    "id" | "title" | "content" | "date" | "image"
  > | null;
}

export interface ProcessedPost {
  id: string;
  date: string;
  dateWithoutFormat: string;
  modified: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: {
    sourceUrl: string;
    altText: string;
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
  categories: string[];
  tags: string[];
  readTime: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    description?: string;
    url?: string;
  };
}

export interface PaginationParams {
  per_page?: number;
  page?: number;
  offset?: number;
  skipFeatured?: boolean;
}
