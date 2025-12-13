# Caching Implementation Guide

## Overview
This project implements a multi-layer caching strategy using **Redis** for distributed caching with **in-memory** fallback for high availability.

## Features

✅ **Redis Integration** - Primary cache store with automatic fallback  
✅ **In-Memory Fallback** - Continues operation when Redis is unavailable  
✅ **Automatic Invalidation** - Smart cache invalidation on data changes  
✅ **Configurable TTL** - Different cache durations for different data types  
✅ **Pattern-Based Deletion** - Invalidate multiple related cache keys  
✅ **Graceful Degradation** - Application works without cache  

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Request   │─────▶│   Redis     │─────▶│   Database   │
│             │      │   Cache     │      │              │
└─────────────┘      └─────────────┘      └──────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   Memory    │
                     │   Fallback  │
                     └─────────────┘
```

## Setup

### 1. Install Redis (Optional but Recommended)

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**Windows:**
Download from https://redis.io/download

**Docker:**
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

### 2. Install Dependencies

```bash
cd backend
npm install redis
```

### 3. Configure Environment Variables

Add to `.env`:
```env
# Enable/disable Redis caching
REDIS_ENABLED=true

# Redis connection URL (default: redis://localhost:6379)
REDIS_URL=redis://localhost:6379

# Or for remote Redis:
# REDIS_URL=redis://username:password@host:port
```

### 4. Start Application

```bash
npm start
```

If Redis is unavailable, the app will automatically use in-memory caching and display:
```
ℹ️  Continuing without Redis caching
```

## Cache TTL Values

```javascript
CACHE_TTL = {
  SHORT: 300,        // 5 minutes  - Frequently changing data
  MEDIUM: 1800,      // 30 minutes - Moderately changing data
  LONG: 3600,        // 1 hour     - Rarely changing data
  VERY_LONG: 86400   // 24 hours   - Static data
}
```

## Cached Endpoints

### Products (Community)

| Endpoint | TTL | Cache Key |
|----------|-----|-----------|
| `GET /api/community/products` | 5 min | `products:{filters}` |
| `GET /api/community/products/:id` | 5 min | `product:{id}` |
| `GET /api/community/featured` | 30 min | `products:featured` |
| `GET /api/community/categories` | 1 hour | `products:categories` |

### Admin

| Endpoint | TTL | Cache Key |
|----------|-----|-----------|
| `GET /api/admin/stats` | 5 min | `stats:platform` |

### Cache Invalidation Triggers

**Products:**
- `POST /api/community/products` - Invalidates all product caches
- `PUT /api/community/products/:id` - Invalidates specific product
- `DELETE /api/community/products/:id` - Invalidates specific product
- `PATCH /api/admin/products/:id/approve` - Invalidates all products
- `PATCH /api/admin/products/:id/reject` - Invalidates all products
- `PATCH /api/admin/products/:id/featured` - Invalidates featured cache

**Stats:**
- Any product creation/deletion/approval
- User registration/deletion

## Usage Examples

### Basic Caching in Routes

```javascript
const { getCache, setCache, CACHE_TTL, cacheKeys } = require('../middleware/cache');

router.get('/data', async (req, res) => {
  const cacheKey = 'my-data';
  
  // Try cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // Fetch from database
  const data = await Model.find();
  
  // Cache the result
  await setCache(cacheKey, data, CACHE_TTL.MEDIUM);
  
  res.json(data);
});
```

### Using Cache Middleware

```javascript
const { cacheMiddleware } = require('../middleware/cache');

// Cache all GET requests to this route for 10 minutes
router.get('/products', cacheMiddleware(600), async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
```

### Cache Invalidation

```javascript
const { invalidateProductCache } = require('../middleware/cache');

router.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  
  // Invalidate related caches
  await invalidateProductCache(product._id, product.sellerId);
  
  res.json(product);
});
```

### Pattern-Based Deletion

```javascript
const { deletePattern } = require('../middleware/cache');

// Delete all user-related caches
await deletePattern('user:123:*');

// Delete all product caches
await deletePattern('products:*');
```

## Cache Keys Reference

```javascript
// User caches
user:{userId}                    // Single user data
user:{userId}:projects           // User's projects
user:{userId}:products           // User's products

// Product caches
product:{productId}              // Single product
products:{filters}               // Product listings (with filters)
products:featured                // Featured products
products:categories              // Product categories

// Project caches
project:{projectId}              // Single project

// Platform caches
stats:platform                   // Platform statistics
settings:platform                // Platform settings
```

## Performance Benefits

### Before Caching
```
GET /api/community/products
→ Database query: ~200ms
→ Response time: ~250ms
```

### After Caching (Cache Hit)
```
GET /api/community/products
→ Redis lookup: ~5ms
→ Response time: ~10ms

Performance improvement: 25x faster
```

### Memory Fallback (Cache Hit)
```
GET /api/community/products
→ Memory lookup: ~1ms
→ Response time: ~5ms

Performance improvement: 50x faster
```

## Monitoring

### Check Redis Status

```bash
# Connect to Redis CLI
redis-cli

# Check if Redis is running
redis-cli ping
# Expected: PONG

# Monitor cache operations
redis-cli monitor

# View all keys
redis-cli keys '*'

# Get cache statistics
redis-cli info stats
```

### Application Logs

Cache operations are logged:
```
✅ Redis connected successfully
ℹ️  Redis caching disabled
❌ Redis connection error: ...
```

## Best Practices

1. **Cache Frequently Accessed Data**
   - Product listings
   - Statistics
   - Categories/filters

2. **Don't Cache**
   - User-specific sensitive data
   - Real-time data
   - Write operations

3. **Set Appropriate TTL**
   - Short (5 min): Dynamic content
   - Medium (30 min): Semi-static content
   - Long (1 hour+): Static content

4. **Invalidate Intelligently**
   - Clear related caches on updates
   - Use pattern matching for bulk invalidation
   - Don't over-invalidate

5. **Handle Failures Gracefully**
   - Always have fallback logic
   - Don't fail requests due to cache errors
   - Log cache errors for monitoring

## Testing Cache

### 1. Test Cache Hit
```bash
# First request (cache miss)
curl http://localhost:3000/api/community/products
# Response time: ~200ms

# Second request (cache hit)
curl http://localhost:3000/api/community/products
# Response time: ~10ms
```

### 2. Test Cache Invalidation
```bash
# Get products (cached)
curl http://localhost:3000/api/community/products

# Create new product (invalidates cache)
curl -X POST http://localhost:3000/api/community/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test","price":10,"category":"test"}'

# Get products again (cache miss, fresh data)
curl http://localhost:3000/api/community/products
```

### 3. Test Fallback
```bash
# Stop Redis
brew services stop redis

# Application should continue working with memory cache
curl http://localhost:3000/api/community/products
```

## Troubleshooting

### Redis Connection Fails
```
❌ Redis connection error: connect ECONNREFUSED
```
**Solution:** Check if Redis is running: `redis-cli ping`

### Cache Not Working
1. Check `REDIS_ENABLED=true` in `.env`
2. Verify Redis connection URL
3. Check application logs for errors

### Memory Leak with In-Memory Cache
The memory cache has automatic expiration. Keys are removed when:
- TTL expires
- Pattern deletion is called
- Application restarts

### Performance Not Improving
1. Verify cache is being used (check logs)
2. Ensure TTL is appropriate
3. Check if cache is being invalidated too frequently

## Advanced Configuration

### Redis Cluster
```javascript
// config/redis.js
const redis = require('redis');

const redisClient = redis.createCluster({
  rootNodes: [
    { url: 'redis://localhost:7000' },
    { url: 'redis://localhost:7001' },
    { url: 'redis://localhost:7002' }
  ]
});
```

### Redis Sentinel
```javascript
const redisClient = redis.createClient({
  sentinels: [
    { host: 'localhost', port: 26379 },
    { host: 'localhost', port: 26380 }
  ],
  name: 'mymaster'
});
```

### Custom Cache Key Strategy
```javascript
// middleware/cache.js
const cacheKeys = {
  custom: (param1, param2) => `custom:${param1}:${param2}`,
  dynamic: (req) => `route:${req.path}:${JSON.stringify(req.query)}`
};
```

## Production Recommendations

1. **Use Redis in Production**
   - More reliable than memory cache
   - Shared across multiple instances
   - Persistent storage option

2. **Monitor Cache Performance**
   - Track hit/miss ratio
   - Monitor memory usage
   - Set up alerts for connection failures

3. **Implement Cache Warming**
   - Pre-populate frequently accessed data
   - Schedule cache refresh

4. **Use Redis Persistence**
   - Enable AOF or RDB snapshots
   - Backup cache data

5. **Scale Redis**
   - Use Redis Cluster for horizontal scaling
   - Use Redis Sentinel for high availability

## Maintenance

### Clear All Cache
```javascript
// In code
const { clearCache } = require('../middleware/cache');
await clearCache();

// Via Redis CLI
redis-cli FLUSHALL
```

### View Cache Contents
```bash
# List all keys
redis-cli keys '*'

# Get specific value
redis-cli get "products:featured"

# Get key TTL
redis-cli ttl "products:featured"
```

---

**Implementation Date:** December 2024  
**Status:** ✅ Production Ready
