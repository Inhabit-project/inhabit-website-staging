import indexedDBCache from "@/services/cache/indexedDB";

/**
 * Cache management utilities for the blog
 */
export class CacheManager {
  /**
   * Clear all blog cache
   */
  static async clearAllCache(): Promise<void> {
    try {
      await indexedDBCache.clearAllCache();
    } catch (error) {
      console.error('Failed to clear blog cache:', error);
      throw error;
    }
  }

  /**
   * Clear expired cache entries
   */
  static async clearExpiredCache(): Promise<void> {
    try {
      await indexedDBCache.clearExpiredCache();
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{ blogPosts: number; blogLists: number }> {
    try {
      return await indexedDBCache.getCacheStats();
    } catch (error) {
      console.error('Failed to get cache statistics:', error);
      return { blogPosts: 0, blogLists: 0 };
    }
  }

  /**
   * Remove a specific blog post from cache
   */
  static async removeBlogPost(postId: string, language: string): Promise<void> {
    try {
      const cacheKey = `blog_post_${postId}_${language}`;
      await indexedDBCache.removeBlogPost(cacheKey);
    } catch (error) {
      console.error('Failed to remove blog post from cache:', error);
      throw error;
    }
  }

  /**
   * Remove a specific blog list from cache
   */
  static async removeBlogList(params: {
    per_page: number;
    page: number;
    skipFeatured: boolean;
    language: string;
  }): Promise<void> {
    try {
      const { per_page, page, skipFeatured, language } = params;
      const cacheKey = `blog_list_${language}_${per_page}_${page}_${skipFeatured ? 'skip' : 'all'}`;
      await indexedDBCache.removeBlogList(cacheKey);
    } catch (error) {
      console.error('Failed to remove blog list from cache:', error);
      throw error;
    }
  }

  /**
   * Initialize the cache (called on app startup)
   */
  static async initializeCache(): Promise<void> {
    try {
      await indexedDBCache.init();
    } catch (error) {
      console.error('Failed to initialize blog cache:', error);
      throw error;
    }
  }
}

export default CacheManager; 