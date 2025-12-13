const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    // Check if Redis is enabled in environment
    if (process.env.REDIS_ENABLED !== 'true') {
      console.log('ℹ️  Redis caching disabled');
      return null;
    }

    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('❌ Redis connection failed after 10 retries');
            return new Error('Redis connection failed');
          }
          return retries * 100;
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection error:', error.message);
    console.log('ℹ️  Continuing without Redis caching');
    return null;
  }
};

const getRedisClient = () => redisClient;

const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('✅ Redis connection closed');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  closeRedis
};
