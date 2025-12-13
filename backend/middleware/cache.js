const { getRedisClient } = require('../config/redis');

// Cache TTL values (in seconds)
const CACHE_TTL = {
  SHORT: 300,        // 5 minutes
  MEDIUM: 1800,      // 30 minutes
  LONG: 3600,        // 1 hour
  VERY_LONG: 86400   // 24 hours
};

// In-memory cache fallback
const memoryCache = new Map();

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<any>} - Cached data or null
 */
const getCache = async (key) => {
  try {
    const redisClient = getRedisClient();
    
    if (redisClient && redisClient.isOpen) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
    
    // Fallback to memory cache
    const cached = memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    } else if (cached) {
      memoryCache.delete(key);
    }
    
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<boolean>} - Success status
 */
const setCache = async (key, data, ttl = CACHE_TTL.MEDIUM) => {
  try {
    const redisClient = getRedisClient();
    
    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(key, ttl, JSON.stringify(data));
      return true;
    }
    
    // Fallback to memory cache
    memoryCache.set(key, {
      data,
      expiry: Date.now() + (ttl * 1000)
    });
    
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

/**
 * Delete data from cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - Success status
 */
const deleteCache = async (key) => {
  try {
    const redisClient = getRedisClient();
    
    if (redisClient && redisClient.isOpen) {
      await redisClient.del(key);
    }
    
    memoryCache.delete(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

/**
 * Delete multiple keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., 'user:*')
 * @returns {Promise<boolean>} - Success status
 */
const deletePattern = async (pattern) => {
  try {
    const redisClient = getRedisClient();
    
    if (redisClient && redisClient.isOpen) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }
    
    // Clear memory cache keys matching pattern
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Cache pattern delete error:', error);
    return false;
  }
};

/**
 * Clear all cache
 * @returns {Promise<boolean>} - Success status
 */
const clearCache = async () => {
  try {
    const redisClient = getRedisClient();
    
    if (redisClient && redisClient.isOpen) {
      await redisClient.flushAll();
    }
    
    memoryCache.clear();
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

/**
 * Middleware to cache GET requests
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} - Express middleware
 */
const cacheMiddleware = (ttl = CACHE_TTL.MEDIUM) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Create cache key from URL and query params
    const cacheKey = `route:${req.originalUrl}`;
    
    try {
      const cachedData = await getCache(cacheKey);
      
      if (cachedData) {
        return res.json(cachedData);
      }
      
      // Store original json method
      const originalJson = res.json.bind(res);
      
      // Override json method to cache response
      res.json = (data) => {
        setCache(cacheKey, data, ttl).catch(err => {
          console.error('Failed to cache response:', err);
        });
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Cache key generators
 */
const cacheKeys = {
  user: (userId) => `user:${userId}`,
  userProjects: (userId) => `user:${userId}:projects`,
  userProducts: (userId) => `user:${userId}:products`,
  project: (projectId) => `project:${projectId}`,
  product: (productId) => `product:${productId}`,
  products: (filters) => `products:${JSON.stringify(filters)}`,
  stats: () => 'stats:platform',
  settings: () => 'settings:platform',
  featured: () => 'products:featured',
  categories: () => 'products:categories'
};

/**
 * Invalidate related caches
 */
const invalidateUserCache = async (userId) => {
  await deletePattern(`user:${userId}*`);
};

const invalidateProjectCache = async (projectId, userId) => {
  await deleteCache(cacheKeys.project(projectId));
  await deleteCache(cacheKeys.userProjects(userId));
  await deleteCache(cacheKeys.stats());
};

const invalidateProductCache = async (productId, userId) => {
  await deleteCache(cacheKeys.product(productId));
  await deleteCache(cacheKeys.userProducts(userId));
  await deletePattern('products:*');
  await deleteCache(cacheKeys.featured());
  await deleteCache(cacheKeys.categories());
  await deleteCache(cacheKeys.stats());
};

module.exports = {
  CACHE_TTL,
  getCache,
  setCache,
  deleteCache,
  deletePattern,
  clearCache,
  cacheMiddleware,
  cacheKeys,
  invalidateUserCache,
  invalidateProjectCache,
  invalidateProductCache
};
