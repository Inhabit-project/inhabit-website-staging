interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  language: string;
}

interface BlogPostCache {
  post: any;
  next: any;
  previous: any;
  timestamp: number;
}

class IndexedDBCache {
  private dbName = 'inhabit-blog-cache';
  private version = 1;
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize the IndexedDB database
   */
  async init(): Promise<void> {
    // If already initialized, return existing promise
    if (this.db) {
      return Promise.resolve();
    }
    
    // If initialization is in progress, return existing promise
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        this.initPromise = null;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initPromise = null;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('blogPosts')) {
          const blogStore = db.createObjectStore('blogPosts', { keyPath: 'key' });
          blogStore.createIndex('language', 'language', { unique: false });
          blogStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('blogLists')) {
          const listStore = db.createObjectStore('blogLists', { keyPath: 'key' });
          listStore.createIndex('language', 'language', { unique: false });
          listStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Store a blog post with navigation data
   */
  async setBlogPost(key: string, data: BlogPostCache, language: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['blogPosts'], 'readwrite');
      const store = transaction.objectStore('blogPosts');
      
      const entry: CacheEntry<BlogPostCache> = {
        key,
        data,
        timestamp: Date.now(),
        language
      };

      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Failed to store blog post in IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get a blog post from cache
   */
  async getBlogPost(key: string, language: string): Promise<BlogPostCache | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['blogPosts'], 'readonly');
      const store = transaction.objectStore('blogPosts');
      
      const request = store.get(key);

      request.onsuccess = () => {
        const entry = request.result as CacheEntry<BlogPostCache> | undefined;
        
        if (!entry || entry.language !== language) {
          resolve(null);
          return;
        }

        // Check if cache is still valid (10 minutes for individual posts)
        const cacheAge = Date.now() - entry.timestamp;
        if (cacheAge > 10 * 60 * 1000) {
          // Cache expired, remove it
          this.removeBlogPost(key);
          resolve(null);
          return;
        }

        resolve(entry.data);
      };

      request.onerror = () => {
        console.error('Failed to get blog post from IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Store a blog list (paginated posts)
   */
  async setBlogList(key: string, data: any, language: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['blogLists'], 'readwrite');
      const store = transaction.objectStore('blogLists');
      
      const entry: CacheEntry<any> = {
        key,
        data,
        timestamp: Date.now(),
        language
      };

      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Failed to store blog list in IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get a blog list from cache
   */
  async getBlogList(key: string, language: string): Promise<any | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['blogLists'], 'readonly');
      const store = transaction.objectStore('blogLists');
      
      const request = store.get(key);

      request.onsuccess = () => {
        const entry = request.result as CacheEntry<any> | undefined;
        
        if (!entry || entry.language !== language) {
          resolve(null);
          return;
        }

        // Check if cache is still valid (5 minutes for blog lists)
        const cacheAge = Date.now() - entry.timestamp;
        if (cacheAge > 5 * 60 * 1000) {
          // Cache expired, remove it
          this.removeBlogList(key);
          resolve(null);
          return;
        }

        resolve(entry.data);
      };

      request.onerror = () => {
        console.error('Failed to get blog list from IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Remove a blog post from cache
   */
  async removeBlogPost(key: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['blogPosts'], 'readwrite');
      const store = transaction.objectStore('blogPosts');
      
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Failed to remove blog post from IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Remove a blog list from cache
   */
  async removeBlogList(key: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['blogLists'], 'readwrite');
      const store = transaction.objectStore('blogLists');
      
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Failed to remove blog list from IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Clear all expired cache entries
   */
  async clearExpiredCache(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    // Clear expired blog posts
    await this.clearExpiredFromStore('blogPosts', now, maxAge);
    
    // Clear expired blog lists (5 minutes)
    await this.clearExpiredFromStore('blogLists', now, 5 * 60 * 1000);
  }

  /**
   * Clear expired entries from a specific store
   */
  private async clearExpiredFromStore(storeName: string, now: number, maxAge: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('timestamp');
      
      const request = index.openCursor();

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const entry = cursor.value as CacheEntry<any>;
          if (now - entry.timestamp > maxAge) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => {
        console.error(`Failed to clear expired cache from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Clear all cache data
   */
  async clearAllCache(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['blogPosts', 'blogLists'], 'readwrite');
      
      const blogStore = transaction.objectStore('blogPosts');
      const listStore = transaction.objectStore('blogLists');
      
      const blogRequest = blogStore.clear();
      const listRequest = listStore.clear();

      let completed = 0;
      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          resolve();
        }
      };

      blogRequest.onsuccess = checkComplete;
      listRequest.onsuccess = checkComplete;
      
      blogRequest.onerror = () => reject(blogRequest.error);
      listRequest.onerror = () => reject(listRequest.error);
    });
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{ blogPosts: number; blogLists: number }> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['blogPosts', 'blogLists'], 'readonly');
      
      const blogStore = transaction.objectStore('blogPosts');
      const listStore = transaction.objectStore('blogLists');
      
      const blogRequest = blogStore.count();
      const listRequest = listStore.count();

      let blogCount = 0;
      let listCount = 0;
      let completed = 0;

      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          resolve({ blogPosts: blogCount, blogLists: listCount });
        }
      };

      blogRequest.onsuccess = () => {
        blogCount = blogRequest.result;
        checkComplete();
      };

      listRequest.onsuccess = () => {
        listCount = listRequest.result;
        checkComplete();
      };

      blogRequest.onerror = () => reject(blogRequest.error);
      listRequest.onerror = () => reject(listRequest.error);
    });
  }
}

// Create a singleton instance
const indexedDBCache = new IndexedDBCache();

export default indexedDBCache; 