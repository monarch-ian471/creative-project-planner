# Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- Redis instance (optional but recommended)
- Valid SSL/TLS certificates
- Domain name configured
- Environment variables configured

## Environment Setup

### 1. Create Production Environment File

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

**Critical Security Settings:**

```env
# Generate secure JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Set production mode
NODE_ENV=production

# Configure MongoDB (use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/creative-project-planner?retryWrites=true&w=majority

# Configure Redis (use managed Redis service)
REDIS_URL=redis://YOUR_USERNAME:YOUR_PASSWORD@redis-host:6379
REDIS_ENABLED=true

# Set production port
PORT=3000

# Configure CORS (add your frontend domains)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install --production
```

### 2. Verify Installation

```bash
npm run start
```

## Production Checklist

### Security ✓

- [x] Helmet middleware enabled (HTTP security headers)
- [x] CORS configured with specific origins
- [x] Rate limiting implemented
- [x] Input validation and sanitization
- [x] XSS protection enabled
- [x] NoSQL injection protection
- [x] JWT authentication secured
- [x] Password hashing with bcrypt
- [x] Environment variables secured
- [x] File upload validation
- [x] MongoDB indexes optimized

### Performance ✓

- [x] Compression middleware enabled
- [x] Redis caching implemented
- [x] Database connection pooling
- [x] Efficient query optimization
- [x] File size limits enforced
- [x] Rate limiting configured

### Monitoring ✓

- [x] Structured logging implemented
- [x] Error tracking enabled
- [x] Request logging configured
- [x] Health check endpoint available

### Reliability ✓

- [x] Graceful shutdown handling
- [x] Database connection retry logic
- [x] Error handling middleware
- [x] Input validation
- [x] File cleanup on deletion

## Deployment Options

### Option 1: Traditional Server (VPS/Dedicated)

#### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name creative-planner-api

# Configure auto-restart
pm2 startup
pm2 save

# Monitor application
pm2 monit

# View logs
pm2 logs creative-planner-api
```

#### PM2 Ecosystem File (pm2.config.js)

```javascript
module.exports = {
  apps: [{
    name: 'creative-planner-api',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

Start with: `pm2 start pm2.config.js`

### Option 2: Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p uploads/profile-pictures uploads/projects uploads/products

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Build and Run

```bash
# Build image
docker build -t creative-planner-api .

# Run container
docker run -d \
  --name creative-planner-api \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  creative-planner-api
```

### Option 3: Cloud Platforms

#### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
heroku config:set REDIS_URL=your-redis-url

# Deploy
git push heroku main
```

#### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production-env

# Deploy
eb deploy
```

#### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure environment variables
3. Set build command: `npm install`
4. Set run command: `npm start`
5. Deploy

## Nginx Configuration

Use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files
    location /uploads/ {
        alias /path/to/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Configure network access (whitelist IPs)
4. Create database user
5. Get connection string
6. Update MONGODB_URI in .env

### Database Backup

```bash
# Backup
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="your-mongodb-uri" /backup/20231215
```

## Monitoring & Logs

### Application Logs

Logs are output in JSON format in production:

```bash
# View logs with PM2
pm2 logs creative-planner-api

# View logs with Docker
docker logs -f creative-planner-api

# Filter errors only
pm2 logs creative-planner-api --err
```

### Health Check

Monitor application health:

```bash
curl https://api.yourdomain.com/api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-12-15T10:30:00.000Z",
  "environment": "production"
}
```

### Monitoring Tools (Optional)

- **Application Performance**: New Relic, DataDog, AppDynamics
- **Error Tracking**: Sentry, Rollbar
- **Log Management**: Loggly, Papertrail, ELK Stack
- **Uptime Monitoring**: UptimeRobot, Pingdom

## Security Hardening

### 1. Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### 3. Environment Variables

- Never commit .env files
- Use secure secret management (AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly
- Use different secrets for different environments

### 4. SSL/TLS Configuration

- Use Let's Encrypt for free SSL certificates
- Enable HTTPS only
- Configure strong cipher suites
- Enable HSTS

## Scaling

### Horizontal Scaling

Run multiple instances behind a load balancer:

```bash
# PM2 cluster mode
pm2 start server.js -i max

# Docker with multiple containers
docker-compose scale api=4
```

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize MongoDB indexes
- Enable Redis caching
- Use CDN for static assets

## Backup Strategy

### Database Backups

```bash
# Daily automated backup
0 2 * * * mongodump --uri="$MONGODB_URI" --out=/backups/$(date +\%Y\%m\%d)

# Retention: Keep last 30 days
0 3 * * * find /backups -type d -mtime +30 -exec rm -rf {} +
```

### File Backups

```bash
# Backup uploaded files
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

## Troubleshooting

### Common Issues

**Connection refused:**
- Check if MongoDB is running
- Verify MONGODB_URI is correct
- Check network/firewall settings

**High memory usage:**
- Enable compression middleware ✓
- Implement pagination for large queries
- Monitor and fix memory leaks

**Slow API responses:**
- Enable Redis caching ✓
- Add database indexes ✓
- Optimize queries
- Use CDN for static assets

## Performance Optimization

### Database Optimization

- Indexes are already configured ✓
- Use projection to limit returned fields
- Implement pagination for all list endpoints
- Use aggregation pipelines for complex queries

### Caching Strategy

- Redis caching implemented ✓
- Cache frequently accessed data
- Set appropriate TTL values
- Invalidate cache on updates

### File Storage

Consider using cloud storage for production:
- AWS S3
- Google Cloud Storage
- Cloudflare R2
- DigitalOcean Spaces

## Support & Maintenance

### Regular Maintenance Tasks

- [ ] Weekly: Check application logs
- [ ] Weekly: Monitor error rates
- [ ] Monthly: Review and update dependencies
- [ ] Monthly: Audit security vulnerabilities
- [ ] Quarterly: Review and optimize database
- [ ] Quarterly: Load testing

### Emergency Contacts

Document your emergency contacts and procedures:
- On-call engineer
- Database administrator
- DevOps team
- Third-party service providers

## Rollback Procedure

In case of failed deployment:

```bash
# PM2
pm2 reload creative-planner-api --update-env

# Docker
docker stop creative-planner-api
docker rm creative-planner-api
docker run -d --name creative-planner-api previous-image:tag

# Git
git revert HEAD
git push
```

---

## Quick Start Commands

```bash
# Production install
npm install --production

# Start production server
npm run prod

# Start with PM2
pm2 start server.js --name creative-planner-api

# Check status
pm2 status

# View logs
pm2 logs

# Stop server
pm2 stop creative-planner-api

# Restart server
pm2 restart creative-planner-api
```

---

**Your Creative Project Planner backend is now production-ready! 🚀**
