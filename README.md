# Creative Project Planner 🎨📋

A comprehensive full-stack creative project management platform built with Vue.js, Node.js, Express, MongoDB, and Redis. Designed for creative professionals to manage projects, collaborate with teams, and access a community marketplace.

## ✨ Features

### Project & Task Management
- **Project Management**: Create, update, delete, and organize creative projects with rich metadata
- **Task Tracking**: Add tasks with due dates, assignments, priorities, and status tracking
- **Gantt Charts**: Visual project timeline planning with interactive Gantt views
- **Calendar Integration**: Full calendar view for project timelines and deadlines
- **Progress Tracking**: Real-time project and task completion monitoring

### User Features
- **Authentication**: Secure JWT-based and Auth0 authentication
- **User Profiles**: Customizable profiles with profile picture uploads
- **User & Admin Portals**: Separate interfaces for regular users and administrators
- **Dashboard Analytics**: Visual overview of project statistics, progress, and metrics
- **Personal Settings**: Configurable user preferences and account settings

### Community & Marketplace
- **Community Marketplace**: Product listing and browsing platform
- **Product Management**: Create, update, and manage product listings
- **Community Updates**: Share and view project updates with the community

### Admin Features
- **Admin Dashboard**: Comprehensive administrative controls and analytics
- **User Management**: View, manage, and monitor user accounts
- **Product Moderation**: Review and manage marketplace products
- **System Settings**: Configure application-wide settings and preferences
- **Statistics & Reports**: Detailed insights into platform usage and performance

### Technical Features
- **Responsive Design**: Modern, mobile-friendly UI with TailwindCSS
- **File Uploads**: Support for profile pictures, project media, and product images
- **Real-time Caching**: Redis integration for optimized performance
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive data validation and sanitization
- **Security Headers**: Helmet.js for enhanced security

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: RESTful API server
- **MongoDB & Mongoose**: Database and ODM with indexing
- **Redis**: Caching layer for improved performance
- **Auth0 & JWT**: Authentication and authorization
- **Bcrypt**: Secure password hashing
- **Multer**: File upload handling
- **Helmet.js**: Security headers
- **Express Rate Limit**: API rate limiting
- **Validator**: Input validation and sanitization
- **Compression**: Response compression

### Frontend
- **Vue 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Pinia**: Modern state management
- **Vue Router**: Client-side routing with guards
- **TailwindCSS**: Utility-first CSS framework
- **Headless UI**: Accessible UI components
- **Axios**: HTTP client with interceptors
- **FullCalendar**: Advanced calendar and scheduling
- **Vue Ganttastic**: Interactive Gantt chart visualization
- **Chart.js & Vue ChartJS**: Data visualization
- **Auth0 Vue SDK**: Authentication integration
- **VeeValidate & Yup**: Form validation
- **Vue Sonner**: Toast notifications
- **Lucide Vue**: Icon library

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis (v4 or higher) - Optional but recommended for caching
- Auth0 account (for authentication) - Optional

### Quick Start

Use the provided setup script to quickly configure the entire project:

```bash
# Clone the repository
git clone https://github.com/monarch-ian471/creative-project-planner.git
cd creative-project-planner

# Run the setup script (macOS/Linux)
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Install all backend and frontend dependencies
- Create necessary directories and configuration files
- Prompt for environment variable configuration
- Set up the database connection

### Manual Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
# or use the install script
./install.sh
```

3. Create a `.env` file in the backend directory:
```bash
touch .env
```

4. Configure your environment variables in `.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/creative-project-planner

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Auth0 (Optional)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier

# Redis (Optional but recommended)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_ENABLED=true

# CORS
FRONTEND_URL=http://localhost:5173
```

5. Create an admin user (optional):
```bash
node createAdmin.js
```

6. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```bash
touch .env
```

4. Configure your environment variables in `.env`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Auth0 Configuration (Optional)
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

6. Build for production:
```bash
npm run build
```

## 🐳 Docker Setup

For containerized deployment, use the provided Docker configuration:

```bash
cd backend
docker-compose up -d
```

This will start:
- MongoDB container
- Redis container
- Backend API container

## 🔐 Auth0 Setup

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new Application (Single Page Application)
3. Create a new API
4. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
5. Copy your Domain, Client ID, and API Identifier to your `.env` files

## 📁 Project Structure

```
creative-project-planner/
├── backend/                          # Backend API server
│   ├── config/
│   │   ├── db.js                    # MongoDB configuration
│   │   └── redis.js                 # Redis cache configuration
│   ├── middleware/
│   │   ├── cache.js                 # Redis caching middleware
│   │   ├── errorHandler.js         # Global error handling
│   │   ├── rateLimiter.js          # API rate limiting
│   │   └── validation.js           # Input validation
│   ├── models/
│   │   ├── user.js                  # User model & schema
│   │   ├── Project.js               # Project model & schema
│   │   ├── Product.js               # Product model & schema
│   │   └── Settings.js              # Settings model & schema
│   ├── routes/
│   │   ├── users.js                 # User endpoints
│   │   ├── projects.js              # Project endpoints
│   │   ├── admin.js                 # Admin endpoints
│   │   ├── community.js             # Community endpoints
│   │   ├── stats.js                 # Statistics endpoints
│   │   └── updates.js               # Updates endpoints
│   ├── utils/
│   │   ├── fileCleanup.js          # File management utilities
│   │   └── logger.js                # Logging utilities
│   ├── uploads/                     # File upload storage
│   │   ├── profile-pictures/
│   │   ├── projects/
│   │   └── products/
│   ├── server.js                    # Express server setup
│   ├── createAdmin.js               # Admin creation script
│   ├── package.json
│   ├── Dockerfile                   # Docker configuration
│   ├── docker-compose.yml           # Docker Compose setup
│   └── README.md                    # Backend documentation
│
└── frontend/                         # Frontend Vue.js application
    ├── src/
    │   ├── assets/
    │   │   └── tailwind.css         # Tailwind styles
    │   ├── components/
    │   │   ├── CreativeProjectCard.vue
    │   │   ├── layouts/
    │   │   │   ├── AuthLayout.vue   # Authentication layout
    │   │   │   └── MainLayout.vue   # Main app layout
    │   │   └── ui/                   # Reusable UI components
    │   │       ├── Alert.vue
    │   │       ├── Badge.vue
    │   │       ├── Button.vue
    │   │       ├── Card.vue
    │   │       ├── Checkbox.vue
    │   │       ├── Dropdown.vue
    │   │       ├── Input.vue
    │   │       ├── Loading.vue
    │   │       ├── Modal.vue
    │   │       ├── Notification.vue
    │   │       ├── Pagination.vue
    │   │       ├── Table.vue
    │   │       ├── Tabs.vue
    │   │       └── Textarea.vue
    │   ├── composables/
    │   │   ├── useAuth.ts           # Authentication composable
    │   │   ├── useLoading.ts        # Loading state management
    │   │   └── useToast.ts          # Toast notification composable
    │   ├── services/
    │   │   ├── projectService.ts    # Project API service
    │   │   └── userService.ts       # User API service
    │   ├── store/
    │   │   └── projectStore.ts      # Pinia project store
    │   ├── types/
    │   │   └── index.ts             # TypeScript type definitions
    │   ├── views/
    │   │   ├── admin/               # Admin portal views
    │   │   │   ├── Dashboard.vue
    │   │   │   ├── Users.vue
    │   │   │   ├── Products.vue
    │   │   │   ├── profile.vue
    │   │   │   └── settings.vue
    │   │   ├── auth/                # Authentication views
    │   │   │   ├── login.vue
    │   │   │   ├── AdminAuth.vue
    │   │   │   ├── UserAuth.vue
    │   │   │   └── userRegister.vue
    │   │   ├── portal/              # User portal views
    │   │   │   ├── EnhancedDashboard.vue
    │   │   │   └── Community.vue
    │   │   ├── projects/            # Project management views
    │   │   └── public/              # Public-facing views
    │   ├── App.vue                  # Root component
    │   ├── main.ts                  # Application entry point
    │   ├── router.ts                # Vue Router configuration
    │   └── interfaces.ts            # Global interfaces
    ├── package.json
    ├── vite.config.js               # Vite configuration
    ├── tailwind.config.js           # Tailwind configuration
    ├── tsconfig.json                # TypeScript configuration
    └── README.md                    # Frontend documentation
```

## 🚀 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/social-login` - Social authentication (Auth0)

### Users
- `GET /api/users/profile` - Get authenticated user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `POST /api/users/profile-picture` - Upload profile picture
- `DELETE /api/users/profile-picture` - Delete profile picture

### Projects
- `GET /api/projects` - Get all projects for authenticated user
- `GET /api/projects/:id` - Get specific project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/image` - Upload project image
- `POST /api/projects/:id/tasks` - Add task to project
- `PUT /api/projects/:projectId/tasks/:taskId` - Update task
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task
- `PATCH /api/projects/:projectId/tasks/:taskId/complete` - Toggle task completion

### Community & Products
- `GET /api/community/products` - Get all products in marketplace
- `GET /api/community/products/:id` - Get specific product
- `POST /api/community/products` - Create new product listing
- `PUT /api/community/products/:id` - Update product
- `DELETE /api/community/products/:id` - Delete product
- `GET /api/community/updates` - Get community updates

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:id` - Get specific user details
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/products` - Get all products (admin view)
- `PUT /api/admin/products/:id/status` - Update product status
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings

### Statistics
- `GET /api/stats/overview` - Get platform overview statistics
- `GET /api/stats/users` - Get user statistics
- `GET /api/stats/projects` - Get project statistics

## 🧪 Development

### Backend Development
```bash
cd backend

# Start with auto-reload
npm run dev

# Run in production mode
npm run prod

# Create admin user
node createAdmin.js

# Get admin details
node getAdminDetails.js

# Test API endpoints
node testAPI.js
```

### Frontend Development
```bash
cd frontend

# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and fix code
npm run lint
```

## 📚 Additional Documentation

For more detailed information, refer to:
- [Backend API Documentation](backend/API_DOCUMENTATION.md)
- [Backend README](backend/README.md)
- [Caching Guide](backend/CACHING_GUIDE.md)
- [MongoDB Guide](backend/MONGODB_GUIDE.md)
- [Production Guide](backend/PRODUCTION_GUIDE.md)
- [Production Checklist](backend/PRODUCTION_CHECKLIST.md)
- [Frontend README](frontend/README.md)
- [Components Documentation](frontend/COMPONENTS_IMPLEMENTED.md)

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 3000 |
| NODE_ENV | Environment (development/production) | No | development |
| MONGODB_URI | MongoDB connection string | Yes | - |
| JWT_SECRET | Secret key for JWT signing | Yes | - |
| AUTH0_DOMAIN | Auth0 tenant domain | No | - |
| AUTH0_AUDIENCE | Auth0 API identifier | No | - |
| REDIS_HOST | Redis server host | No | localhost |
| REDIS_PORT | Redis server port | No | 6379 |
| REDIS_PASSWORD | Redis password | No | - |
| REDIS_ENABLED | Enable Redis caching | No | false |
| FRONTEND_URL | Frontend application URL | No | http://localhost:5173 |

### Frontend (.env)
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| VITE_API_BASE_URL | Backend API base URL | Yes | - |
| VITE_AUTH0_DOMAIN | Auth0 tenant domain | No | - |
| VITE_AUTH0_CLIENT_ID | Auth0 client ID | No | - |
| VITE_AUTH0_AUDIENCE | Auth0 API identifier | No | - |

## 🔒 Security Features

- **Helmet.js**: Sets secure HTTP headers
- **Rate Limiting**: Prevents API abuse with express-rate-limit
- **Input Validation**: Comprehensive validation with validator.js
- **XSS Protection**: Prevents cross-site scripting attacks
- **NoSQL Injection Prevention**: MongoDB sanitization with express-mongo-sanitize
- **CORS**: Configured cross-origin resource sharing
- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **File Upload Validation**: Strict file type and size validation
- **Error Handling**: Centralized error handling without sensitive data exposure

## 🚀 Performance Optimization

- **Redis Caching**: Frequently accessed data caching
- **Response Compression**: Gzip compression for all responses
- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Code Splitting**: Frontend code splitting with Vite
- **Lazy Loading**: Route-based lazy loading in Vue Router
- **Asset Optimization**: Minification and optimization in production builds

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Follows the existing code style
- Includes appropriate comments
- Passes all linting checks
- Is properly typed (TypeScript)
- Includes relevant documentation updates

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Considerations

Before deploying to production:
1. Review the [Production Checklist](backend/PRODUCTION_CHECKLIST.md)
2. Follow the [Production Guide](backend/PRODUCTION_GUIDE.md)
3. Set `NODE_ENV=production`
4. Configure production environment variables
5. Enable Redis caching
6. Set up proper CORS origins
7. Configure rate limiting
8. Enable HTTPS
9. Set up monitoring and logging
10. Configure database backups

## 🔧 Troubleshooting

### Common Issues

**Backend won't start**
- Ensure MongoDB is running
- Check environment variables are set correctly
- Verify port 3000 is available

**Frontend can't connect to API**
- Check `VITE_API_BASE_URL` is correct
- Verify CORS is properly configured in backend
- Ensure backend is running

**Redis connection errors**
- Set `REDIS_ENABLED=false` if Redis is not available
- Check Redis is running on specified host/port
- Verify Redis password if authentication is enabled

**Authentication issues**
- Verify Auth0 credentials are correct
- Check callback URLs are configured in Auth0
- Ensure JWT_SECRET is set in backend

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

Please check the [Issues](https://github.com/monarch-ian471/creative-project-planner/issues) page for known bugs and feature requests.

## 📧 Support

For questions, issues, or support:
- Open an issue on [GitHub](https://github.com/monarch-ian471/creative-project-planner/issues)
- Check existing documentation in the `backend/` and `frontend/` directories
- Review the API documentation

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the needs of creative professionals
- Community-driven development

---

**Built with ❤️ for creative professionals**