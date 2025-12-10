# Creative Project Planner 🎨📋

A full-stack creative project management application built with Vue.js, Node.js, Express, and MongoDB. Perfect for managing creative projects, tasks, timelines, and team collaboration.

## ✨ Features

- **Project Management**: Create, update, delete, and organize creative projects
- **Task Tracking**: Add tasks to projects with due dates and assignments
- **User Authentication**: Secure authentication with Auth0
- **User Profiles**: Customizable user profiles with profile pictures
- **Dashboard**: Visual overview of project statistics and progress
- **Responsive Design**: Modern UI with TailwindCSS
- **Calendar Integration**: Full calendar view for project timelines
- **Gantt Charts**: Visual project timeline planning

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: RESTful API server
- **MongoDB & Mongoose**: Database and ODM
- **Auth0**: Authentication and authorization
- **JWT**: Token-based authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling

### Frontend
- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **FullCalendar**: Calendar and scheduling
- **Vue Ganttastic**: Gantt chart visualization
- **Auth0 Vue SDK**: Authentication integration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Auth0 account (for authentication)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/creative-project-planner
JWT_SECRET=your_super_secret_jwt_key
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier
PORT=3000
```

5. Start the backend server:
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
cd frontend/creative-project-planner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
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
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── models/
│   │   ├── user.js               # User model
│   │   └── Project.js            # Project model
│   ├── routes/
│   │   ├── users.js              # User routes
│   │   └── projects.js           # Project routes
│   ├── server.js                 # Express server
│   ├── package.json
│   └── .env.example
│
└── frontend/
    └── creative-project-planner/
        ├── src/
        │   ├── assets/           # Static assets
        │   ├── components/       # Vue components
        │   ├── composables/      # Composition API utilities
        │   ├── services/         # API services
        │   ├── store/            # Pinia stores
        │   ├── types/            # TypeScript types
        │   ├── views/            # Page components
        │   ├── App.vue           # Root component
        │   ├── main.ts           # Application entry
        │   └── router.ts         # Vue Router config
        ├── package.json
        └── .env.example
```

## 🚀 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/social-login` - Social authentication

### Projects
- `GET /api/projects` - Get all projects for authenticated user
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/tasks` - Add task to project
- `PATCH /api/projects/:projectId/tasks/:taskId/complete` - Mark task complete

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/stats` - Get user statistics
- `POST /api/users/profile-picture` - Upload profile picture

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend/creative-project-planner
npm run dev  # Starts Vite dev server with HMR
```

### Linting
```bash
cd frontend/creative-project-planner
npm run lint  # Run ESLint
```

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT signing | Yes |
| AUTH0_DOMAIN | Auth0 tenant domain | Yes |
| AUTH0_AUDIENCE | Auth0 API identifier | Yes |
| PORT | Server port (default: 3000) | No |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_BASE_URL | Backend API URL | Yes |
| VITE_AUTH0_DOMAIN | Auth0 tenant domain | Yes |
| VITE_AUTH0_CLIENT_ID | Auth0 client ID | Yes |
| VITE_AUTH0_AUDIENCE | Auth0 API identifier | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🐛 Known Issues

Please check the [Issues](https://github.com/monarch-ian471/creative-project-planner/issues) page for known bugs and feature requests.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for creative professionals**