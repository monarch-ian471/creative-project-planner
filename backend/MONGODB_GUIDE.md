# MongoDB Setup & Database Structure Guide

## Table of Contents
1. [MongoDB User Creation](#mongodb-user-creation)
2. [Database Overview](#database-overview)
3. [Collections & Schemas](#collections--schemas)
4. [Connection Setup](#connection-setup)
5. [Indexes & Performance](#indexes--performance)
6. [Common Operations](#common-operations)

---

## MongoDB User Creation with Compass

### 1. Download and Install MongoDB Compass

- Download from: [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
- Install the application for your operating system (macOS, Windows, or Linux)

### 2. Connect to MongoDB

**For Local MongoDB (no authentication):**
1. Open MongoDB Compass
2. In the connection string field, enter: `mongodb://localhost:27017`
3. Click **Connect**

**For Local MongoDB (with authentication):**
1. Connection string: `mongodb://YOUR_USERNAME:YOUR_PASSWORD@localhost:27017`
2. Or use the Advanced Connection Options:
   - **Hostname**: `localhost`
   - **Port**: `27017`
   - **Authentication**: Username/Password
   - **Username**: Your admin username
   - **Password**: Your password
   - **Authentication Database**: `admin`

**For MongoDB Atlas (Cloud):**
1. Get your connection string from Atlas dashboard
2. Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`
3. Paste into Compass connection field
4. Click **Connect**

### 3. Create Database Admin User

1. Connect to MongoDB as an admin user
2. In the left sidebar, click on the **`admin`** database
3. Click on **Collections** → **Users** (or navigate to users management)
4. **Alternative Method - Using MongoSH in Compass:**
   - At the bottom of Compass, click **>_MongoSH** tab
   - Enter the following:
   ```javascript
   use admin
   db.createUser({
     user: "creative_admin",
     pwd: "SecurePassword123!",
     roles: [
       { role: "userAdminAnyDatabase", db: "admin" },
       { role: "readWriteAnyDatabase", db: "admin" },
       { role: "dbAdminAnyDatabase", db: "admin" }
     ]
   })
   ```

### 4. Create Application-Specific User

**Using MongoSH in Compass:**
1. Click the **>_MongoSH** tab at the bottom of Compass
2. Enter the following commands:
```javascript
use creative-project-planner
db.createUser({
  user: "creative_app",
  pwd: "YourStrongPassword123!",
  roles: [
    { role: "readWrite", db: "creative-project-planner" },
    { role: "dbAdmin", db: "creative-project-planner" }
  ]
})
```

**Alternative - MongoDB Atlas Users (via Cloud UI):**
1. Go to MongoDB Atlas Dashboard
2. Navigate to **Database Access** → **Add New Database User**
3. Set username: `creative_app`
4. Set password: `YourStrongPassword123!`
5. Set privileges: **Read and write to any database** or specific database
6. Click **Add User**

### 5. Connection String Examples

**Save these as Favorites in Compass:**

**For Local MongoDB with Authentication:**
```
mongodb://creative_app:YourStrongPassword123!@localhost:27017/creative-project-planner
```

**For MongoDB Atlas (Cloud):**
```
mongodb+srv://creative_app:YourStrongPassword123!@cluster0.xxxxx.mongodb.net/creative-project-planner?retryWrites=true&w=majority
```

**To Save as Favorite:**
1. Enter connection string
2. Click **Save & Connect**
3. Give it a name (e.g., "Creative Planner - Local")
4. Click **Save**

### 6. Verify User Creation

**Method 1 - Using MongoSH in Compass:**
```javascript
// List all users
use creative-project-planner
db.getUsers()

// Show specific user privileges
db.runCommand({ usersInfo: "creative_app" })
```

**Method 2 - Reconnect with New User:**
1. Disconnect from current connection
2. Create new connection with new user credentials
3. If connection succeeds, user was created correctly

---

## Database Overview

### Database Name
**`creative-project-planner`**

### Architecture
- **Type**: Document-based NoSQL database
- **ODM**: Mongoose (Object Data Modeling library)
- **Connection Pool**: Min 2, Max 10 connections
- **Timeout**: 45s socket timeout, 10s server selection timeout

### Connection Flow
```
server.js → connectDB() → mongoose.connect()
                ↓
         MongoDB Atlas/Local
                ↓
         Initialize Indexes
                ↓
         Setup Event Listeners
```

---

## Collections & Schemas

### 1. **Users Collection** (`users`)

**Purpose**: Store user accounts, authentication, and profile information

**Schema Structure**:
```javascript
{
  _id: ObjectId,                    // Auto-generated
  email: String,                     // Unique, lowercase
  firstName: String,
  lastName: String,
  password: String,                  // Bcrypt hashed
  profilePicture: String,            // File path or URL
  phone: String,
  twitter: String,
  linkedin: String,
  bio: String,
  isAdmin: Boolean,                  // Admin flag
  accountStatus: String,             // 'active', 'suspended', 'banned'
  
  // Notification preferences
  notificationSettings: {
    emailNotifications: Boolean,
    projectUpdates: Boolean,
    communityMessages: Boolean,
    marketingEmails: Boolean
  },
  
  // Social login integration
  socialLogins: [{
    provider: String,               // 'google', 'facebook', 'apple', 'microsoft'
    providerId: String              // Unique per provider
  }],
  
  // Email verification
  isVerified: Boolean,
  
  // Password reset
  passwordResetToken: String,       // Hashed token
  passwordResetExpires: Date,       // Token expiration
  
  // Role-based access control
  role: String,                     // 'user', 'admin', 'moderator'
  
  // User preferences
  preferences: {
    notifications: {
      email: Boolean,
      sms: Boolean
    },
    theme: String                   // 'light' or 'dark'
  },
  
  lastLogin: Date,
  createdAt: Date,                  // Auto-managed by timestamps
  updatedAt: Date                   // Auto-managed by timestamps
}
```

**Indexes**:
- `email`: Unique index for fast lookups
- `role`: For role-based queries
- `socialLogins.providerId`: Unique index to prevent duplicate social logins
- `firstName`: Non-unique index for search
- `isAdmin`: For admin queries

**Instance Methods**:
- `generateAuthToken()`: Creates JWT token
- `generatePasswordResetToken()`: Creates password reset token
- `isValidPassword(password)`: Verifies password against hash

**Pre-save Middleware**:
- Automatically hashes password before saving

---

### 2. **Projects Collection** (`projects`)

**Purpose**: Store creative projects with tasks and metadata

**Schema Structure**:
```javascript
{
  _id: ObjectId,
  title: String,                    // Required
  description: String,              // Required
  dueDate: Date,                    // Required
  
  // Embedded tasks (subdocuments)
  tasks: [{
    _id: ObjectId,                  // Auto-generated for each task
    name: String,
    completed: Boolean,
    assignedTo: ObjectId,           // Reference to User
    dueDate: Date,
    createdAt: Date
  }],
  
  userId: ObjectId,                 // Reference to User (owner)
  status: String,                   // 'in-progress', 'completed', 'on-hold', 'cancelled'
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId + status`: Compound index for filtering user projects by status
- `dueDate`: For deadline queries
- `createdAt`: For recent projects (descending)
- `userId + createdAt`: Compound index for user's recent projects

**Instance Methods**:
- `addTask(task)`: Adds new task to project
- `completeTask(taskId)`: Marks task as completed

**Static Methods**:
- `findByUserId(userId)`: Get all projects for a user
- `findOverdueProjects()`: Get all overdue in-progress projects

**Pre-save Middleware**:
- Updates `updatedAt` timestamp on every save

---

### 3. **Products Collection** (`products`)

**Purpose**: Store marketplace products for community trading

**Schema Structure**:
```javascript
{
  _id: ObjectId,
  name: String,                     // Required
  description: String,              // Required
  price: Number,                    // Required, min: 0
  category: String,                 // Required
  images: [String],                 // Array of image URLs/paths
  
  sellerId: ObjectId,               // Reference to User
  
  status: String,                   // 'pending', 'approved', 'rejected'
  featured: Boolean,                // Featured product flag
  
  // Metrics
  sales: Number,                    // Total sales count
  views: Number,                    // View count
  rating: Number,                   // 0-5 rating
  
  rejectionReason: String,          // Admin notes if rejected
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `sellerId`: For seller's products
- `status`: For filtering by approval status
- `featured`: For featured products query
- `category`: For category filtering
- `createdAt`: For recent products (descending)

---

### 4. **Settings Collection** (`settings`)

**Purpose**: Store global application settings

**Schema Structure**:
```javascript
{
  _id: ObjectId,
  
  // Site information
  siteName: String,                 // Default: 'Creative Project Planner'
  siteUrl: String,
  contactEmail: String,
  supportEmail: String,
  
  // Business rules
  commissionRate: Number,           // 0-100%
  
  // Feature flags
  maintenanceMode: Boolean,
  allowNewRegistrations: Boolean,
  requireEmailVerification: Boolean,
  enableNotifications: Boolean,
  enableCommunityReviews: Boolean,
  
  // Limits
  maxUploadSize: Number,            // In MB
  featuredProductsLimit: Number,
  
  // Localization
  currency: String,                 // Default: 'USD'
  timezone: String,                 // Default: 'America/New_York'
  
  createdAt: Date,
  updatedAt: Date
}
```

**Note**: Typically only one document exists in this collection (singleton pattern)

---

## Connection Setup

### Configuration File: `config/db.js`

**Key Features**:
1. **Connection Options**:
   - Maximum pool size: 10 connections
   - Minimum pool size: 2 connections
   - Socket timeout: 45 seconds
   - Server selection timeout: 10 seconds

2. **Index Management**:
   - Automatically creates indexes on connection
   - Handles index migration (e.g., dropping old unique constraints)

3. **Event Handling**:
   - Logs successful connections
   - Monitors disconnections
   - Tracks connection errors

4. **Graceful Failure**:
   - Exits process if connection fails
   - Provides detailed error logging

### Environment Variables

Create a `.env` file in the backend root:

```env
# Local Development
MONGODB_URI=mongodb://localhost:27017/creative-project-planner

# Or with authentication
MONGODB_URI=mongodb://localhost:27017/creative-project-planner

# Or MongoDB Atlas
MONGODB_URI=mongodb+srv://<cluster>.mongodb.net/creative-project-planner?retryWrites=true&w=majority

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_secure_random_string_here

# Other settings
PORT=3000
NODE_ENV=development
```

---

## Indexes & Performance

### Current Index Strategy

**Users Collection**:
- `email` (unique) - O(1) lookup for authentication
- `firstName` - Text search capability
- `isAdmin` - Fast admin user queries
- `socialLogins.providerId` (unique) - Prevent duplicate social accounts

**Projects Collection**:
- `userId + status` (compound) - Efficient user project filtering
- `dueDate` - Deadline-based queries
- `createdAt` (descending) - Recent projects first
- `userId + createdAt` (compound) - User's recent projects

**Products Collection**:
- `sellerId` - Seller's product listings
- `status` - Pending/approved/rejected filtering
- `featured` - Featured products query
- `category` - Category browsing
- `createdAt` (descending) - New products first

### Index Creation

Indexes are automatically created when the application connects to MongoDB (see [config/db.js](backend/config/db.js#L28-L47)).

**To manually verify indexes in Compass:**

1. In the left sidebar, click on **`creative-project-planner`** database
2. Click on a collection (e.g., **`users`**, **`projects`**, **`products`**)
3. Navigate to the **Indexes** tab
4. You'll see a list of all indexes with their keys and properties

**To create a new index in Compass:**

1. Go to the collection's **Indexes** tab
2. Click **Create Index** button
3. Enter field name and select sort order:
   - Example: `{ "email": 1 }` (ascending)
   - For compound: `{ "userId": 1, "status": 1 }`
4. Configure options (unique, sparse, TTL, etc.)
5. Click **Create Index**

**Using MongoSH in C in Compass

### 1. Create a New User

**Using Compass UI:**
1. Navigate to **`creative-project-planner`** database → **`users`** collection
2. Click **Add Data** → **Insert Document**
3. Switch to **JSON** view and paste:
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "$2a$10$...",
  "isAdmin": false,
  "accountStatus": "active",
  "role": "user",
  "isVerified": true,
  "createdAt": {"$date": "2025-12-17T00:00:00.000Z"},
  "updatedAt": {"$date": "2025-12-17T00:00:00.000Z"}
}
```
4. Click **Insert**

**Using MongoSH in Compass:**
```javascript
use creative-project-planner
db.users.insertOne({
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "$2a$10$...",
  isAdmin: false,
  accountStatus: "active",
  role: "user",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 2. Find Projects by User

**Using Compass UI:**
1. Navigate to **`projects`** collection
2. In the **Filter** bar, enter:
```json
{ "userId": {"$oid": "user_id_here"} }
```
3. Click **Find**

**For in-progress projects:**
```json
{ 
  "userId": {"$oid": "user_id_here"},
  "status": "in-progress" 
}
```

**Using MongoSH:**
```javascript
db.projects.find({ userId: ObjectId("user_id_here") })
```

### 3. Update Product Status

**Using Compass UI:**
1. Navigate to **`products`** collection
2. Find the product document (use filter: `{"_id": {"$oid": "product_id_here"}}`)
3. Click on the document to expand it
4. Click the **Edit** (pencil) icon
5. Modify the fields:
   - `status`: Change to "approved"
   - `featured`: Change to `true`
   - `updatedAt`: Update to current date
6. Click **Update**

**Using MongoSH:**
```javascript
db.products.updateOne(
  { _id: ObjectId("product_id_here") },
  { 
    $set: { 
      status: "approved",
      featured: true,
      updatedAt: new Date()
    }
  }
)
```

### 4. Query Overdue Projects

**Using Compass UI:**
1. Navigate to **`projects`** collection
2. In the **Filter** bar:
```json
{
  "dueDate": {"$lt": {"$date": "2025-12-17T00:00:00.000Z"}},
  "status": "in-progress"
}
```
3. Or use relative date:
```json
{
  "dueDate": {"$lt": "$$NOW"},
  "status": "in-progress"
}
```

**Using MongoSH:**
```javascript
db.projects.find({
  dueDate: { $lt: new Date() },
  status: "in-progress"
})
```

### 5. Aggregate User Statistics

**Using Compass UI:**
1. Navigate to **`projects`** collection
2. Click the **Aggregations** tab
3. Click **New Pipeline**
4. Add stages:
   - Stage 1: Click **Add Stage** → Select **$group**
   -Export Database (Compass)

**Export Entire Collection:**
1. In Compass, navigate to the collection you want to export
2. Click **Export Collection** button (top right, near the filter bar)
3. Choose format:
   - **JSON** - Full document structure, best for backup
   - **CSV** - Tabular format, good for analysis
4. Select export location
5. Click **Export**
6. Repeat for each collection (`users`, `projects`, `products`, `settings`)

**Export Query Results:**
1. Run a query/filter on a collection
2. Click **Export** with your filter applied
3. Only matching documents will be exported

### Import Data (Compass)

**Import Collection:**
1. Navigate to the target database
2. If collection doesn't exist, create it: **Create Collection**
3. Open the collection
4. Click **Add Data** → **Import File**
5. Select your JSON or CSV file
6. Review field mappings
7. Configure options:
   - Stop on errors: Yes/No
   - Ignore empty strings: Yes/No
8. Click **Import**

### Command-Line Backup (mongodump)

For full database backups, use command-line tools:

```bash
# Backup entire database
mongodump --db=creative-project-planner --out=/path/to/backup/

# Backup with authentication
mongodump --uri="mongodb://YOUR_USERNAME:YOUR_PASSWORD@localhost:27017/creative-project-planner" --out=/path/to/backup/

# Backup specific collection
mongodump --db=creative-project-planner --collection=users --out=/path/to/backup/

# For MongoDB Atlas
mongodump --uri="mongodb+srv://<cluster>.mongodb.net/creative-project-planner" --out=/path/to/backup/
**In Compass:**
1. Click **Connect** with your connection string
2. If connection fails, check:
   - **Network Access**: Ensure MongoDB is running
   - **Authentication**: Verify username/password
   - **Firewall**: Check if port 27017 is accessible
   - **IP Whitelist**: (Atlas only) Add your IP in Atlas dashboard

**Check MongoDB is Running (Command Line):**
```bash
# macOS/Linux
sudo systemctl status mongod

# macOS (Homebrew)
brew services list

# Check logs
tail -f /var/log/mongodb/mongod.log
```

**Test Connection:**
- In Compass, look at the connection status (bottom left)
- Green dot = Connected
- Red dot = Disconnected
- Yellow dot = Connecting

### Index Issues

**View Indexes in Compass:**
1. Navigate to collection → **Indexes** tab
2. Review existing indexes
3. Check for:
   - Duplicate indexes
   - Unused indexes (low usage count)
   - Missing indexes causing slow queries

**Drop Index:**
1. In **Indexes** tab, find the index
2. Click the **trash can** icon next to the index
3. Confirm deletion
4. Note: Cannot drop `_id` index

**Rebuild Indexes (MongoSH):**
```javascript
// Drop all indexes (except _id)
db.users.dropIndexes()

// Rebuild indexes
db.users.reIndex()
```

### Performance Issues

**Analyze Query Performance in Compass:**
1. Navigate to collection → **Explain Plan** tab
2. Enter your query in the filter bar
3. Click **Explain**
4. Review:
   - **Execution Time**: How long the query took
   - **Documents Examined**: Number of docs scanned
   - **Index Used**: Which index (if any) was used
   - **Stage**: IXSCAN (good, using index) vs COLLSCAN (bad, full scan)

**Optimize Queries:**
- Green: Query is optimized (using indexes)
- Yellow: Query could be improved
- Red: Query needs optimization (full collection scan)

**Using MongoSH for Performance:**
```javascript
// Check slow queries
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)

// Explain query performance
db.projects.find({ userId: ObjectId("...") }).explain("executionStats")
```

**View Performance Metrics:**
1. Click on **Performance** tab (left sidebar in Compass)
2. View real-time metrics:
   - Operations per second
   - Active connections
   - Memory usage
   - Network I/O

### Schema Validation Issues

**View Schema in Compass:**
1. Navigate to collection → **Schema** tab
2. Click **Analyze Schema**
3. View field types, distributions, and patterns
4. Identify inconsistent data types or missing fields

**Validation Tab:**
1. Navigate to collection → **Validation** tab
2. View or add validation rules
3. Set validation level (strict, moderate)
4. Test validation against existing documents
**Create Text Index in Compass:**
1. Navigate to **`projects`** collection → **Indexes** tab
2. Click **Create Index**
3. Enter:
```json
{
  "title": "text",
  "description": "text"
}
```
4. Click **Create Index**

**Search using Filter:**
```json
{
  "$text": {"$search": "design website"}
}
```

### 7. Export/Import Data

**Export Collection:**
1. Navigate to a collection
2. Click **Export Collection** (top right)
3. Choose format: JSON or CSV
4. Click **Export**

**Import Data:**
1. Navigate to a collection
2. Click **Add Data** → **Import File**
3. Select your JSON/CSV file
4. Configure field mappings
5. Click **Import**   }
    }
  }
])
```

### 6. Full-Text Search (if needed)

```javascript
// First, create a text index
db.projects.createIndex({ title: "text", description: "text" })

// Then search
db.projects.find({ $text: { $search: "design website" } })
```

---

## Database Relationships

### Relationship Diagram

```
┌─────────────┐
│    Users    │
│  (1 to N)   │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│  Projects   │   │  Products   │
│             │   │             │
│  - userId   │   │  - sellerId │
│  - tasks[]  │   │             │
└─────────────┘   └─────────────┘

┌──────────────┐
│   Settings   │
│  (Singleton) │
└──────────────┘
```

**Key Relationships**:
- **User → Projects**: One-to-Many (via `userId`)
- **User → Products**: One-to-Many (via `sellerId`)
- **User → Tasks**: One-to-Many (via `tasks[].assignedTo`)
- **Settings**: Standalone singleton collection

---

## Backup & Restore

### Backup Database

```bash
# Backup entire database
mongodump --db=creative-project-planner --out=/path/to/backup/

# Backup with authentication
mongodump --uri="mongodb://YOUR_USERNAME:YOUR_PASSWORD@localhost:27017/creative-project-planner" --out=/path/to/backup/

# Backup specific collection
mongodump --db=creative-project-planner --collection=users --out=/path/to/backup/
```

### Restore Database

```bash
# Restore entire database
mongorestore --db=creative-project-planner /path/to/backup/creative-project-planner/

# Restore with authentication
mongorestore --uri="mongodb://YOUR_USERNAME:YOUR_PASSWORD@localhost:27017/creative-project-planner" /path/to/backup/creative-project-planner/

# Restore specific collection
mongorestore --db=creative-project-planner --collection=users /path/to/backup/creative-project-planner/users.bson
```

---

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong passwords** - Minimum 12 characters with mixed case, numbers, symbols
3. **Rotate JWT secrets** - Change periodically in production
4. **Enable authentication** - Always use MongoDB authentication in production
5. **Use SSL/TLS** - Enable encryption in transit (MongoDB Atlas does this by default)
6. **Limit user privileges** - Application user should only have readWrite access
7. **Regular backups** - Automate daily backups
8. **Monitor logs** - Use Winston logger to track database operations
9. **Input sanitization** - Express-mongo-sanitize prevents NoSQL injection
10. **Connection string security** - Never expose in client-side code

---

## Troubleshooting

### Connection Issues

```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/creative-project-planner"

# Check if MongoDB is running
# macOS/Linux
sudo systemctl status mongod

# Check logs
tail -f /var/log/mongodb/mongod.log
```

### Index Issues

```javascript
// Drop all indexes (except _id)
db.users.dropIndexes()

// Rebuild indexes
db.users.reIndex()
```

### Performance Issues

```javascript
// Check slow queries
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)

// Explain query performance
db.projects.find({ userId: ObjectId("...") }).explain("executionStats")
```

---

## Next Steps

1. **Set up MongoDB locally or on MongoDB Atlas**
2. **Create application user with proper permissions**
3. **Update `.env` file with connection string**
4. **Run the application** - `npm run dev`
5. **Verify indexes are created** - Check logs or MongoDB shell
6. **Test CRUD operations** - Use Postman or your frontend

For API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)
