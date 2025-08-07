import React, { useState, useEffect } from 'react';
import { useBlogCache } from '@/hooks/useBlogCache';

interface BlogCacheManagerProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const BlogCacheManager: React.FC<BlogCacheManagerProps> = ({ 
  isVisible = false, 
  onClose 
}) => {
  const [stats, setStats] = useState<{ blogPosts: number; blogLists: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const { 
    clearAllCache, 
    clearExpiredCache, 
    getCacheStats, 
    removeBlogPost, 
    removeBlogList 
  } = useBlogCache();

  useEffect(() => {
    if (isVisible) {
      loadStats();
    }
  }, [isVisible]);

  const loadStats = async () => {
    setLoading(true);
    const result = await getCacheStats();
    if (result.success && result.data) {
      setStats(result.data);
    } else {
      setMessage('Failed to load cache statistics');
    }
    setLoading(false);
  };

  const handleClearAllCache = async () => {
    setLoading(true);
    const result = await clearAllCache();
    if (result.success) {
      setMessage('All cache cleared successfully');
      await loadStats();
    } else {
      setMessage('Failed to clear cache');
    }
    setLoading(false);
  };

  const handleClearExpiredCache = async () => {
    setLoading(true);
    const result = await clearExpiredCache();
    if (result.success) {
      setMessage('Expired cache cleared successfully');
      await loadStats();
    } else {
      setMessage('Failed to clear expired cache');
    }
    setLoading(false);
  };

  const handleRefreshStats = async () => {
    await loadStats();
    setMessage('Statistics refreshed');
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      minWidth: '300px',
      maxWidth: '400px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          Blog Cache Manager
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        )}
      </div>

      {message && (
        <div style={{
          padding: '8px 12px',
          marginBottom: '15px',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '500' }}>
          Cache Statistics
        </h4>
        {loading ? (
          <div style={{ fontSize: '14px', color: '#666' }}>Loading...</div>
        ) : stats ? (
          <div style={{ fontSize: '14px' }}>
            <div>Blog Posts: {stats.blogPosts}</div>
            <div>Blog Lists: {stats.blogLists}</div>
          </div>
        ) : (
          <div style={{ fontSize: '14px', color: '#666' }}>No statistics available</div>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={handleRefreshStats}
          disabled={loading}
          style={{
            padding: '8px 12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.6 : 1
          }}
        >
          Refresh Stats
        </button>
        
        <button
          onClick={handleClearExpiredCache}
          disabled={loading}
          style={{
            padding: '8px 12px',
            background: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.6 : 1
          }}
        >
          Clear Expired Cache
        </button>
        
        <button
          onClick={handleClearAllCache}
          disabled={loading}
          style={{
            padding: '8px 12px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.6 : 1
          }}
        >
          Clear All Cache
        </button>
      </div>
    </div>
  );
};

export default BlogCacheManager; 