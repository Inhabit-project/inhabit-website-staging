# Blog IndexedDB Cache System

This document describes the IndexedDB-based caching system implemented for the blog functionality in the INHABIT website.

## Overview

The blog caching system has been migrated from localStorage to IndexedDB to provide:
- Better performance for larger datasets
- More storage capacity
- Structured data storage
- Automatic cache expiration
- Language-specific caching

## Architecture

### Core Components

1. **IndexedDB Service** (`src/services/cache/indexedDB.ts`)
   - Handles all IndexedDB operations
   - Manages database initialization and schema
   - Provides CRUD operations for cache entries
   - Implements automatic cache expiration

2. **Cache Manager** (`src/utils/cacheManager.ts`)
   - High-level cache management utilities
   - Provides easy-to-use methods for cache operations
   - Handles error handling and logging

3. **Blog Cache Hook** (`src/hooks/useBlogCache.ts`)
   - React hook for cache operations
   - Provides cache management functions to components
   - Handles async operations with proper error handling

4. **Cache Manager Component** (`src/components/BlogCacheManager.tsx`)
   - UI component for cache management
   - Displays cache statistics
   - Provides cache clearing functionality
   - Useful for debugging and admin purposes

## Database Schema

The IndexedDB database (`inhabit-blog-cache`) contains two object stores:

### blogPosts
- **Key**: `key` (string) - Unique identifier for each post
- **Data**: Blog post with navigation data
- **Indexes**:
  - `language` - For language-specific queries
  - `timestamp` - For expiration checks

### blogLists
- **Key**: `key` (string) - Unique identifier for each list
- **Data**: Paginated blog posts list
- **Indexes**:
  - `language` - For language-specific queries
  - `timestamp` - For expiration checks

## Cache Keys

### Blog Posts
```
blog_post_{postId}_{language}
```
Example: `blog_post_123_en`

### Blog Lists
```
blog_list_{language}_{per_page}_{page}_{skipFeatured ? 'skip' : 'all'}
```
Example: `blog_list_en_3_1_all`

## Cache Expiration

- **Blog Posts**: 10 minutes
- **Blog Lists**: 5 minutes
- **Automatic Cleanup**: Expired entries are automatically removed when accessed

## Usage

### In Blog Services

The caching is automatically handled in the blog services:

```typescript
// In fetchPosts function
const cached = await indexedDBCache.getBlogList(cacheKey, currentLanguage);
if (cached) {
  return cached;
}

// After fetching from API
await indexedDBCache.setBlogList(cacheKey, result, currentLanguage);
```

### In Components

Use the `useBlogCache` hook for cache operations:

```typescript
import { useBlogCache } from '@/hooks/useBlogCache';

const MyComponent = () => {
  const { clearAllCache, getCacheStats } = useBlogCache();
  
  const handleClearCache = async () => {
    const result = await clearAllCache();
    if (result.success) {
      console.log('Cache cleared successfully');
    }
  };
};
```

### Cache Management UI

For debugging or admin purposes, use the `BlogCacheManager` component:

```typescript
import BlogCacheManager from '@/components/BlogCacheManager';

const AdminPage = () => {
  const [showCacheManager, setShowCacheManager] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowCacheManager(true)}>
        Manage Cache
      </button>
      <BlogCacheManager 
        isVisible={showCacheManager}
        onClose={() => setShowCacheManager(false)}
      />
    </div>
  );
};
```

## API Reference

### IndexedDBCache Class

#### Methods

- `init()`: Initialize the database
- `setBlogPost(key, data, language)`: Store a blog post
- `getBlogPost(key, language)`: Retrieve a blog post
- `setBlogList(key, data, language)`: Store a blog list
- `getBlogList(key, language)`: Retrieve a blog list
- `removeBlogPost(key)`: Remove a blog post
- `removeBlogList(key)`: Remove a blog list
- `clearExpiredCache()`: Remove expired entries
- `clearAllCache()`: Clear all cache data
- `getCacheStats()`: Get cache statistics

### CacheManager Class

#### Static Methods

- `initializeCache()`: Initialize the cache system
- `clearAllCache()`: Clear all blog cache
- `clearExpiredCache()`: Clear expired cache entries
- `getCacheStats()`: Get cache statistics
- `removeBlogPost(postId, language)`: Remove specific blog post
- `removeBlogList(params)`: Remove specific blog list

### useBlogCache Hook

#### Returned Functions

- `clearAllCache()`: Clear all cache
- `clearExpiredCache()`: Clear expired cache
- `getCacheStats()`: Get cache statistics
- `removeBlogPost(postId, language)`: Remove specific blog post
- `removeBlogList(params)`: Remove specific blog list

## Migration from localStorage

The system has been migrated from localStorage to IndexedDB. The old localStorage-based caching has been removed from:

- `src/components/blog/SingleBlog.tsx`
- `src/services/wordpress/blog/index.ts`

## Benefits

1. **Performance**: IndexedDB is faster for larger datasets
2. **Storage**: Much larger storage capacity (typically 50MB+ vs 5-10MB)
3. **Structure**: Better data organization with indexes
4. **Reliability**: More robust error handling
5. **Scalability**: Can handle more complex caching scenarios

## Browser Support

IndexedDB is supported in all modern browsers:
- Chrome 23+
- Firefox 16+
- Safari 10+
- Edge 12+

## Error Handling

The system includes comprehensive error handling:
- Database initialization failures
- Network request failures
- Cache operation failures
- Graceful fallbacks to API calls

## Monitoring

Cache statistics can be monitored through:
- Browser DevTools > Application > IndexedDB
- `getCacheStats()` method
- `BlogCacheManager` component

## Future Enhancements

Potential improvements:
- Cache warming strategies
- Background cache updates
- Cache compression
- Offline support
- Cache analytics 