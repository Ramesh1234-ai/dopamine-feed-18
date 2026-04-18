# AI Gallery Platform - Complete Implementation Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Installation & Setup](#installation--setup)
3. [Configuration](#configuration)
4. [Frontend Development](#frontend-development)
5. [Backend Development](#backend-development)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)
---
## Architecture Overview
### System Design Diagram
```
┌─────────────────────────────────────────────────────────┐
│                   AI Gallery Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Frontend   │         │   Backend    │             │
│  │ (React 19)   │◄───────►│(Express.js)  │             │
│  │   Vite       │  HTTP   │   MongoDB    │             │
│  └──────────────┘         └──────────────┘             │
│       Clerk Auth              JWT Auth                  │
│       TailwindCSS          Cloudinary                   │
│       React Router         Rate Limiter                 │
│                                                         │
│  ┌──────────────────────────────────────────┐          │
│  │  External Services                       │          │
│  ├──────────────────────────────────────────┤          │
│  │ • Clerk (Authentication)                 │          │
│  │ • Cloudinary (Image Storage)             │          │
│  │ • MongoDB Atlas (Database)               │          │
│  │ • Grok API (AI Roaster)                  │          │
│  └──────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

### Folder Structure
```
ai-gallery-platform/
├── cli/                          # Frontend
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── gallery/         # Gallery display components
│   │   │   ├── common/          # Shared components
│   │   │   └── preferences/     # Settings components
│   │   ├── context/             # Context API state
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   └── App.jsx              # Main app component
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                       # Backend
│   ├── controllers/             # Route handlers
│   ├── middleware/              # Express middleware
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   ├── utils/                   # Helper functions
│   ├── server.js                # Entry point
│   └── package.json
│
└── api/                         # Vercel serverless functions (optional)
    ├── add.js
    ├── search.js
    ├── roast.js
    └── data.js
```
---
## Installation & Setup
### Prerequisites
- **Node.js** 16+ (check with `node --version`)
- **npm** 7+ (check with `npm --version`)
- **MongoDB** 4.4+ (local or Atlas cloud)
- **Git**
### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd ai-gallery-platform
```
### Step 2: Setup Backend
```bash
cd server
npm install
```
### Step 3: Setup Frontend
```bash
cd ../cli
npm install
```
### Step 4: Create Environment Files
See [Configuration](#configuration) section below.
---

## Configuration

### Backend Configuration (.env)

Create `server/.env`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/dopamine-feed-18
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dopamine-feed-18
# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Clerk (Authentication)
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# Grok API (AI Features)
GROK_API_KEY=your_grok_api_key

# Server Config
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRY=7d
```

### Frontend Configuration

Create `cli/.env.local`:
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# App Config
VITE_APP_NAME=AI Gallery Platform
VITE_APP_VERSION=1.0.0
```

### Environment File Acquisition

#### MongoDB Setup
1. **Local MongoDB** (Development)
   ```bash
   # Install MongoDB Community
   # Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   # macOS: brew install mongodb-community
   # Linux: sudo apt-get install mongodb
   
   # Start MongoDB
   mongod
   ```

2. **MongoDB Atlas** (Production)
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Use as `MONGODB_URI`

#### Cloudinary Setup
1. Sign up at https://cloudinary.com
2. Go to Dashboard → Settings → API Keys
3. Copy `Cloud Name`, `API Key`, `API Secret`

#### Clerk Setup
1. Go to https://clerk.com
2. Create new application
3. Get `Publishable Key` and `Secret Key`
4. Configure allowed URLs:
   - `http://localhost:5173` (dev)
   - `http://localhost:3000` (backend)

#### Grok API Setup
1. Get API key from https://console.x.ai
2. Add to `.env` as `GROK_API_KEY`

---

## Frontend Development

### Project Structure
```
cli/
├── src/
│   ├── App.jsx                    # Main routing
│   ├── main.jsx                   # Entry point
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login.jsx          # Login page
│   │   │   └── ProtectedRoute.jsx # Auth guard
│   │   ├── gallery/
│   │   │   ├── GalleryGrid.jsx    # 3-4 column grid
│   │   │   ├── GalleryCard.jsx    # Individual card
│   │   │   ├── SearchBar.jsx      # Search input
│   │   │   ├── SmartSearchBar.jsx # AI search
│   │   │   └── ImageModal.jsx     # Image detail modal
│   │   ├── common/
│   │   │   ├── header.jsx         # Top header
│   │   │   ├── navbar.jsx         # Navigation
│   │   │   ├── sidebar.jsx        # Sidebar menu
│   │   │   ├── footer.jsx         # Footer
│   │   │   ├── Loaders.jsx        # Loading states
│   │   │   ├── ThemeToggle.jsx    # Dark mode
│   │   │   └── ErrorBoundary.jsx  # Error handling
│   │   └── preferences/
│   │       ├── PreferencesTabs.jsx
│   │       └── SavedArtworks.jsx
│   ├── pages/
│   │   ├── GalleryPage.jsx        # Main gallery
│   │   ├── UploadPage.jsx         # Image upload
│   │   ├── PreferencesPage.jsx    # Settings
│   │   └── fav.jsx                # Favorites
│   ├── context/
│   │   ├── SavedArtworksContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/
│   │   └── useInteractions.js
│   ├── utils/
│   │   ├── designTokens.js
│   │   └── preferencesManager.js
│   └── styles/
│       └── index.css
├── vite.config.js                 # Vite config
├── tailwind.config.js             # Tailwind config
├── package.json
└── public/                         # Static assets
```

### Running Frontend
```bash
cd cli

# Development mode
npm run dev
# Runs on http://localhost:5173

# Build for production
npm run build
# Output: dist/

# Preview production build
npm run preview

# Linting
npm run lint
```

### Key Frontend Components

#### GalleryPage.jsx
- Fetches all profiles from backend
- Handles search, filter, sorting
- Pagination (12 items per page)
- Error states and retry logic

#### UploadPage.jsx
- File input handling
- Multer upload to backend
- Progress indication
- Success/error notifications

#### SavedArtworksContext
- Global state for saved items
- Persistence to localStorage
- Server sync capability

### Styling System
```
Tailwind CSS Utilities:
- Colors: indigo, slate, emerald (custom palette)
- Spacing: 4px base unit
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Animations: spin, pulse, bounce
```

---

## Backend Development

### Project Structure
```
server/
├── server.js                  # Main entry point
├── controllers/
│   └── uploadController.js    # Upload handlers
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── uploadMiddleware.js    # Multer config
│   └── rateLimiter.js         # Rate limiting
├── models/
│   ├── Image.js               # Image schema
│   ├── Profile.js             # User profile schema
│   ├── UserPreferences.js     # Preferences schema
│   └── Team.js                # Team schema
├── routes/
│   ├── uploadRoutes.js        # Image endpoints
│   ├── profileRoutes.js       # Profile endpoints
│   ├── preferencesRoutes.js   # Preferences endpoints
│   └── teamRoutes.js          # Team endpoints
├── services/
│   ├── cloudinaryService.js   # Cloudinary operations
│   ├── moderationService.js   # Content moderation
│   └── scoringEngine.js       # Recommendation engine
└── utils/
    └── validators.js          # Input validation
```

### Running Backend
```bash
cd server

# Development with auto-reload
npm run dev
# Runs on http://localhost:3000

# Production
npm start

# Check connection
curl http://localhost:3000/data
```

### Database Models

#### Image Model
- **Purpose**: Store image metadata
- **Fields**:
  - `userId`: Clerk user ID (indexed)
  - `title`: Image title (max 100 chars)
  - `description`: Description (max 500 chars)
  - `tags`: Array of tags (indexed)
  - `category`: Image category (enum)
  - `imageUrl`: Cloudinary URL
  - `isPublic`: Boolean (visibility)
  - `moderationStatus`: 'pending' | 'approved' | 'rejected'
  - `uploadedAt`: Timestamp

#### UserPreferences Model
- **Purpose**: Store user preferences and saved items
- **Fields**:
  - `userId`: Clerk ID (unique)
  - `savedArtworks`: Array of artwork IDs
  - `likedArtworks`: Array of artwork IDs
  - `preferences`: User preferences object
  - `lastUpdated`: Timestamp

#### Profile Model
- **Purpose**: User profile information
- **Fields**:
  - `clerkId`: Clerk user ID
  - `email`: User email
  - `username`: Display name
  - `bio`: User bio
  - `avatar`: Avatar URL
  - `preferences`: Preference tags

### API Routes

#### Upload Routes (`/api/images`)
```
POST   /upload              - Upload new image (authenticated)
GET    /my-uploads          - Get user's uploads (authenticated)
GET    /gallery/public      - Get public gallery
GET    /:id                 - Get image details
POST   /:id/like            - Toggle like (authenticated)
DELETE /:id                 - Delete image (authenticated)
```

#### Profile Routes (`/api/profiles`)
```
GET    /                    - List all profiles
GET    /:id                 - Get profile details
POST   /                    - Create profile (authenticated)
PUT    /:id                 - Update profile (authenticated)
DELETE /:id                 - Delete profile (authenticated)
```
#### Preferences Routes (`/api/preferences`)
```
GET    /:userId             - Get user preferences
POST   /                    - Save preferences (authenticated)
PUT    /:userId             - Update preferences (authenticated)
```
#### Team Routes (`/api/teams`)
```
GET    /                    - List teams
POST   /                    - Create team (authenticated)
PUT    /:id                 - Update team (authenticated)
DELETE /:id                 - Delete team (authenticated)
```
### Middleware Stack
1. **CORS**: Handle cross-origin requests
2. **Express JSON**: Parse JSON bodies
3. **Auth Middleware**: Verify JWT tokens
4. **Rate Limiter**: Prevent abuse (5 requests/minute on uploads)
5. **Upload Middleware**: Handle file uploads with Multer
6. **Error Handler**: Catch and format errors

### Cloud Services Integration

#### Cloudinary
- Image storage and optimization
- Automatic resizing
- CDN delivery
- API for image operations

```javascript
// Usage in services
const cloudinaryService = require('./services/cloudinaryService');

// Upload
const result = await upload(file);

// Optimize URL
const optimizedUrl = cloudinaryService.getOptimizedUrl(publicId, 'medium');

// Delete
await cloudinaryService.deleteImage(publicId);
```

#### Moderation Service
- Content filtering (not active)
- NSFW detection
- Policy violation checking
```javascript
// Usage
const moderationService = require('./services/moderationService');
const result = await moderationService.checkContent(imageUrl);
```
---

## API Documentation

### Authentication
All protected endpoints require Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Error Responses
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Endpoint Examples

#### Upload Image
```bash
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg" \
  -F "title=Gallery Image" \
  -F "category=digital-art" \
  -F "tags=art,gallery"
```
#### Get Gallery
```bash
curl http://localhost:3000/api/images/gallery/public
```

#### Like Image
```bash
curl -X POST http://localhost:3000/api/images/507f1f77bcf86cd799439011/like \
  -H "Authorization: Bearer <token>"
```

---

## Database Schema

### MongoDB Collections

#### images
```javascript
{
  _id: ObjectId,
  userId: "clerk_user_id",
  title: "String",
  description: "String",
  tags: ["tag1", "tag2"],
  category: "digital-art",
  imageUrl: "https://cloudinary.com/...",
  isPublic: Boolean,
  moderationStatus: "approved",
  likes: [{ userId: "...", likedAt: Date }],
  createdAt: Date,
  updatedAt: Date
}
```

#### userpreferences
```javascript
{
  _id: ObjectId,
  userId: "clerk_user_id",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  savedArtworks: [
    {
      artworkId: ObjectId,
      savedAt: Date
    }
  ],
  likedArtworks: [
    {
      artworkId: ObjectId,
      likedAt: Date
    }
  ],
  preferences: {
    favoriteCategories: ["digital-art"],
    favoriteArtists: [],
    notificationsEnabled: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Indexes
```javascript
// Images
db.images.createIndex({ userId: 1 });
db.images.createIndex({ tags: 1 });
db.images.createIndex({ category: 1 });
db.images.createIndex({ createdAt: -1 });

// Preferences
db.userpreferences.createIndex({ userId: 1 }, { unique: true });
```

---

## Deployment Guide

### Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
npm install -g vercel

cd cli
vercel
# Follow prompts

# Or connect GitHub repo to Vercel dashboard
```

#### Environment Variables (Vercel)
```
VITE_API_URL=https://api.yourdomain.com
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

### Backend Deployment (Heroku/Railway)

#### Heroku
```bash
npm install -g heroku

cd server
heroku create app-name
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set CLOUDINARY_CLOUD_NAME=...
# ... set all env vars

git push heroku main
```

#### Railway.app
1. Connect GitHub repo
2. Add MongoDB addon
3. Set environment variables
4. Deploy from UI

### Database Backup
```bash
# Export MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/db"

# Import MongoDB
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/db"
```

### Production Checklist
- [ ] SSL/HTTPS enabled
- [ ] Environment variables configured
- [ ] Database backups automated
- [ ] Error logging enabled
- [ ] Rate limiting tuned
- [ ] Input validation enabled
- [ ] CORS properly configured
- [ ] Security headers added
- [ ] Monitoring setup
- [ ] Disasters recovery plan

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**:
```bash
# Check if MongoDB is running
mongod

# Or verify connection string in .env
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

#### 2. Cloudinary Upload Fails
```
Error: Cloudinary credentials not set
```
**Solution**:
```bash
# Verify in .env
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY

# Test credentials at https://cloudinary.com/console
```

#### 3. Frontend API 404 Error
```
Error: Failed to fetch http://localhost:3000/data
```
**Solution**:
```bash
# Check backend is running
curl http://localhost:3000/data

# Check VITE_API_URL in .env.local
# Verify CORS is enabled in server.js
```

#### 4. Clerk Authentication Fails
```
Error: Missing Clerk keys or invalid domain
```
**Solution**:
```bash
# Verify REACT_APP_CLERK_PUBLISHABLE_KEY
# Add http://localhost:5173 to Clerk dashboard
# Check auth domain matches
```

#### 5. Image Upload Hangs
```bash
# Check file size limits in uploadMiddleware.js
# Verify Cloudinary account has upload capacity
# Check rate limiter settings
# Increase timeout in cli/.env.local
VITE_API_TIMEOUT=30000
```

### Debug Mode

#### Frontend
```javascript
// In App.jsx
localStorage.setItem('debug', 'ai-gallery:*');
```

#### Backend
```bash
# Enable detailed logging
DEBUG=* npm run dev
```

### Performance Optimization

#### Frontend
```javascript
// Use React Query for caching
npm install @tanstack/react-query

// Add code splitting
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'));

// Optimize images
<img loading="lazy" src={url} />
```

#### Backend
```javascript
// Add Redis caching
npm install redis

// Compress responses
npm install compression
```

---

## Quick Commands

```bash
# Start everything (in separate terminals)
cd server && npm run dev    # Terminal 1
cd cli && npm run dev       # Terminal 2

# Install dependencies
npm install -g node-gyp

# Database administration
mongo  # Connect to mongodb
db.images.find().limit(5)  # View images
db.userpreferences.countDocuments()  # Count preferences

# Code quality
npm run lint
npm run build

# Deployment
vercel                      # Frontend
git push heroku main        # Backend
```

---

**Last Updated**: March 22, 2026
**Version**: 1.0.0
**Status**: Production Ready (with recommendations applied)
