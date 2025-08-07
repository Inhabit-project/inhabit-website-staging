import { useCallback } from 'react';
import CacheManager from '@/utils/cacheManager';

/**
 * Custom hook for blog cache operations
 */
export const useBlogCache = () => {
  /**
   * Clear all blog cache
   */
  const clearAllCache = useCallback(async () => {
    try {
      await CacheManager.clearAllCache();
      return { success: true };
    } catch (error) {
      console.error('Failed to clear blog cache:', error);
      return { success: false, error };
    }
  }, []);

  /**
   * Clear expired cache entries
   */
  const clearExpiredCache = useCallback(async () => {
    try {
      await CacheManager.clearExpiredCache();
      return { success: true };
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
      return { success: false, error };
    }
  }, []);

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(async () => {
    try {
      const stats = await CacheManager.getCacheStats();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Failed to get cache statistics:', error);
      return { success: false, error };
    }
  }, []);

  /**
   * Remove a specific blog post from cache
   */
  const removeBlogPost = useCallback(async (postId: string, language: string) => {
    try {
      await CacheManager.removeBlogPost(postId, language);
      return { success: true };
    } catch (error) {
      console.error('Failed to remove blog post from cache:', error);
      return { success: false, error };
    }
  }, []);

  /**
   * Remove a specific blog list from cache
   */
  const removeBlogList = useCallback(async (params: {
    per_page: number;
    page: number;
    skipFeatured: boolean;
    language: string;
  }) => {
    try {
      await CacheManager.removeBlogList(params);
      return { success: true };
    } catch (error) {
      console.error('Failed to remove blog list from cache:', error);
      return { success: false, error };
    }
  }, []);

  return {
    clearAllCache,
    clearExpiredCache,
    getCacheStats,
    removeBlogPost,
    removeBlogList,
  };
}; 