# Creative Project Planner - Backend API

A comprehensive RESTful API for managing creative projects, user accounts, and a community marketplace built with Node.js, Express, MongoDB, and Redis.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based secure authentication
- **Project Management** - Complete CRUD operations for creative projects
- **Community Marketplace** - Product listing and management
- **Admin Dashboard** - Comprehensive administrative controls
- **File Uploads** - Profile pictures, project media, product images
- **Real-time Caching** - Redis integration for improved performance

### Security Features
- ✅ Helmet.js security headers
- ✅ Rate limiting to prevent abuse
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ NoSQL injection prevention
- ✅ CORS configuration
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ File upload validation

### Performance Features
- ✅ Response compression
- ✅ Redis caching layer
- ✅ Database indexing
- ✅ Efficient query optimization
- ✅ Connection pooling

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher
- Redis 4.x or higher (optional but recommended)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/monarch-ian471/creative-project-planner.git
cd creative-project-planner/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/creative-project-planner
JWT_SECRET=your_secure_random_secret_key
PORT=3000
NODE_ENV=development
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379
```

**⚠️ Important:** Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Start MongoDB

```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux systemd
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Start Redis (Optional)

```bash
# macOS with Homebrew
brew services start redis

# Linux systemd
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

### 6. Start the server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## 📚 API Documentation

Full API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Reference

#### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/admin/login` - Admin login

#### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile-picture` - Upload profile picture
- `DELETE /api/users/account` - Delete account

#### Project Endpoints
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Community/Marketplace Endpoints
- `GET /api/community/products` - List products
- `POST /api/community/products` - Create product
- `GET /api/community/products/:id` - Get product details
- `PUT /api/community/products/:id` - Update product
- `DELETE /api/community/products/:id` - Delete product

#### Admin Endpoints
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/products` - Manage products

#### Health Check
- `GET /api/health` - Server health status

## 🗂️ Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB configuration
│   └── redis.js           # Redis configuration
├── middleware/
│   ├── cache.js           # Caching middleware
│   ├── errorHandler.js    # Error handling
│   ├── rateLimiter.js     # Rate limiting
│   └── validation.js      # Input validation
├── models/
│   ├── user.js            # User model
│   ├── Project.js         # Project model
│   ├── Product.js         # Product model
│   └── Settings.js        # Settings model
├── routes/
│   ├── users.js           # User routes
│   ├── projects.js        # Project routes
│   ├── community.js       # Community/marketplace routes
│   └── admin.js           # Admin routes
├── uploads/
│   ├── profile-pictures/  # User avatars
│   ├── projects/          # Project media
│   └── products/          # Product images
├── utils/
│   ├── fileCleanup.js     # File deletion utilities
│   └── logger.js          # Logging utilities
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── server.js              # Application entry point
├── API_DOCUMENTATION.md   # Full API docs
└── PRODUCTION_GUIDE.md    # Deployment guide
```

## 🔒 Security

This API implements multiple security layers:

- **Authentication**: JWT tokens with configurable expiration
- **Authorization**: Role-based access control (User/Admin)
- **Rate Limiting**: Prevents brute force and DDoS attacks
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Prevention**: MongoDB sanitization
- **XSS Prevention**: Input escaping and sanitization
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **File Upload Security**: Type and size validation

## 🧪 Testing

### Manual API Testing

Use tools like Postman, Insomnia, or cURL:

```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-12-15T10:30:00.000Z",
  "environment": "development"
}
```

### Logs

- Development: Human-readable console logs with emojis
- Production: Structured JSON logs for log aggregation

## 🚀 Deployment

See [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) for comprehensive deployment instructions including:

- Environment setup
- Production checklist
- Deployment options (PM2, Docker, Cloud platforms)
- Nginx configuration
- Database setup
- Monitoring and logging
- Security hardening
- Scaling strategies
- Backup procedures

### Quick Production Start

```bash
# Install production dependencies
npm install --production

# Start with PM2
pm2 start server.js --name creative-planner-api

# Monitor
pm2 monit
```

## 🐳 Docker Support

### Build and Run

```bash
# Build image
docker build -t creative-planner-api .

# Run container
docker run -d \
  --name creative-planner-api \
  -p 3000:3000 \
  --env-file .env \
  creative-planner-api
```

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment mode |
| `REDIS_ENABLED` | No | true | Enable Redis caching |
| `REDIS_URL` | No | redis://localhost:6379 | Redis connection string |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- Redis team
- All contributors

## 📞 Support

For support, email support@yourdomain.com or open an issue in the GitHub repository.

## 🔄 Version History

- **1.0.0** (2025-12-15)
  - Initial production release
  - Complete CRUD operations
  - Authentication & authorization
  - File upload support
  - Redis caching
  - Production-ready security
  - Comprehensive error handling
  - Rate limiting
  - Input validation

---

**Made with ❤️ for Creative Professionals**
