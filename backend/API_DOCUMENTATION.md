# Creative Project Planner - API Documentation

## Overview
Complete REST API with full CRUD operations for users, projects, products, and admin management.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## User Endpoints

### Authentication

#### Register
```http
POST /api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Profile Management

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "twitter": "@johndoe",
  "linkedin": "johndoe",
  "bio": "Creative professional"
}
```

#### Change Password
```http
PUT /api/users/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

#### Upload Profile Picture
```http
POST /api/users/profile-picture
Authorization: Bearer <token>
Content-Type: multipart/form-data

profilePicture: <file>
```

#### Update Notification Settings
```http
PUT /api/users/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailNotifications": true,
  "projectUpdates": true,
  "communityMessages": false,
  "marketingEmails": false
}
```

#### Delete Account
```http
DELETE /api/users/account
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "password123"
}
```

#### Get All Users (Paginated)
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

---

## Project Endpoints

### CRUD Operations

#### Get All Projects
```http
GET /api/projects?status=in-progress&category=web&search=keyword&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Project by ID
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Project",
  "description": "Project description",
  "category": "web-development",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "budget": 5000,
  "status": "planning",
  "priority": "high",
  "tags": ["web", "react"],
  "phases": [],
  "teamMembers": [],
  "milestones": [],
  "resources": []
}
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "in-progress",
  "progress": 50
}
```

#### Update Project Status
```http
PATCH /api/projects/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Update Project Progress
```http
PATCH /api/projects/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "progress": 75
}
```

#### Upload Project Media
```http
POST /api/projects/:id/media
Authorization: Bearer <token>
Content-Type: multipart/form-data

media: <file1>
media: <file2>
```

#### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

#### Get Project Statistics
```http
GET /api/projects/stats/summary
Authorization: Bearer <token>
```

---

## Community/Products Endpoints

### Public Routes

#### Get All Products (Public)
```http
GET /api/community/products?category=art&search=keyword&minPrice=10&maxPrice=100&featured=true&page=1&limit=12
```

#### Get Single Product (Public)
```http
GET /api/community/products/:id
```

#### Get Product Categories
```http
GET /api/community/categories
```

#### Get Featured Products
```http
GET /api/community/featured?limit=6
```

### Seller Routes (Authenticated)

#### Get Seller's Products
```http
GET /api/community/my-products?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Create Product
```http
POST /api/community/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Product",
  "description": "Product description",
  "price": 29.99,
  "category": "digital-art"
}
```

#### Update Product
```http
PUT /api/community/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 39.99
}
```

#### Upload Product Images
```http
POST /api/community/products/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

images: <file1>
images: <file2>
```

#### Delete Product
```http
DELETE /api/community/products/:id
Authorization: Bearer <token>
```

#### Record Product Sale
```http
POST /api/community/products/:id/sale
Authorization: Bearer <token>
```

#### Rate Product
```http
POST /api/community/products/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5
}
```

#### Get Seller Statistics
```http
GET /api/community/seller/stats
Authorization: Bearer <token>
```

---

## Admin Endpoints

### Authentication

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpass123"
}
```

### Dashboard

#### Get Platform Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

#### Get Recent Activity
```http
GET /api/admin/activity?limit=20
Authorization: Bearer <admin-token>
```

### User Management

#### Get All Users
```http
GET /api/admin/users?search=john&page=1&limit=20
Authorization: Bearer <admin-token>
```

#### Get User by ID
```http
GET /api/admin/users/:id
Authorization: Bearer <admin-token>
```

#### Update User
```http
PUT /api/admin/users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "firstName": "John",
  "isAdmin": true,
  "accountStatus": "active"
}
```

#### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <admin-token>
```

### Product Management

#### Get All Products
```http
GET /api/admin/products?status=pending&search=keyword&page=1&limit=20
Authorization: Bearer <admin-token>
```

#### Approve Product
```http
PATCH /api/admin/products/:id/approve
Authorization: Bearer <admin-token>
```

#### Reject Product
```http
PATCH /api/admin/products/:id/reject
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "reason": "Does not meet quality standards"
}
```

#### Toggle Featured Status
```http
PATCH /api/admin/products/:id/featured
Authorization: Bearer <admin-token>
```

#### Delete Product
```http
DELETE /api/admin/products/:id
Authorization: Bearer <admin-token>
```

### Settings Management

#### Get Settings
```http
GET /api/admin/settings
Authorization: Bearer <admin-token>
```

#### Update Settings
```http
PUT /api/admin/settings
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "siteName": "Creative Project Planner",
  "commissionRate": 15,
  "maintenanceMode": false,
  "allowNewRegistrations": true,
  "maxUploadSize": 10,
  "currency": "USD"
}
```

### Project Management

#### Get All Projects
```http
GET /api/admin/projects?status=completed&page=1&limit=20
Authorization: Bearer <admin-token>
```

#### Delete Project
```http
DELETE /api/admin/projects/:id
Authorization: Bearer <admin-token>
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Data Models

### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String (hashed),
  profilePicture: String,
  phone: String,
  twitter: String,
  linkedin: String,
  bio: String,
  isAdmin: Boolean,
  accountStatus: String, // 'active', 'suspended', 'banned'
  notificationSettings: {
    emailNotifications: Boolean,
    projectUpdates: Boolean,
    communityMessages: Boolean,
    marketingEmails: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  category: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  status: String, // 'planning', 'in-progress', 'on-hold', 'completed', 'cancelled'
  priority: String, // 'low', 'medium', 'high'
  progress: Number, // 0-100
  tags: [String],
  phases: [Object],
  teamMembers: [Object],
  milestones: [Object],
  resources: [Object],
  media: [String],
  completionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  sellerId: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  status: String, // 'pending', 'approved', 'rejected'
  featured: Boolean,
  sales: Number,
  views: Number,
  rating: {
    average: Number,
    count: Number
  },
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Settings
```javascript
{
  siteName: String,
  siteUrl: String,
  contactEmail: String,
  supportEmail: String,
  commissionRate: Number, // 0-100
  maintenanceMode: Boolean,
  allowNewRegistrations: Boolean,
  enableEmailNotifications: Boolean,
  enableProjectUpdates: Boolean,
  enableCommunityMessages: Boolean,
  maxUploadSize: Number, // MB
  allowedFileTypes: [String],
  currency: String,
  timezone: String,
  updatedAt: Date
}
```

## Notes

- All timestamps are in ISO 8601 format
- File uploads limited to 5MB for profile pictures, 10MB for projects
- Images must be JPEG, PNG, or GIF
- JWT tokens expire after 7 days (users) or 24 hours (admin)
- Pagination defaults: page=1, limit=10
- All prices in the configured currency (default: USD)
