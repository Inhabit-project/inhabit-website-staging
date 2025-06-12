export interface BlogPost {
  id: string;
  date: string;
  title: string;
  content: string;
  image: string;
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
  };
}

export interface WordPressPost {
  id: number;
  date: string;
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
  };
}

export interface WordPressTerm {
  id: number;
  name: string;
  taxonomy: string;
}

export interface PostNavigation {
  current: ProcessedPost | null;
  next: BlogPost | null;
  previous: BlogPost | null;
}

export interface ProcessedPost {
  id: string;
  date: string;
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
  dateWithoutFormat: string;
}

export interface PaginationParams {
  per_page?: number;
  page?: number;
  offset?: number;
}