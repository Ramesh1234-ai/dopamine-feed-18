# 🔥 AI Gallery Platform - 18+ Adult Content Gallery

> A modern MERN stack application for discovering, uploading, and managing premium adult content galleries with AI-powered recommendations and moderation.

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-4.4+-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/react-19+-blue.svg)](https://react.dev/)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**AI Gallery Platform** is a comprehensive solution for adult content creators (pornstars, influencers) to build and manage their exclusive image galleries. Features include:

- 🖼️ Responsive image gallery with advanced filtering
- 🔐 Secure authentication with Clerk
- ☁️ Cloud storage with Cloudinary
- 🤖 AI-powered recommendations & roasting
- 💾 Saved artworks & preferences
- 📊 User engagement tracking
- 🎨 Customizable themes

### Current Status: **72% Complete**
- Frontend: 7.5/10 ✅
- Backend: 7.8/10 ✅
- Database: 8/10 ✅
- Overall Code Quality: 6.5/10 ⚠️
---

## ✨ Features
### Core Features (Implemented ✅)
- [x] User authentication with Clerk
- [x] Image gallery with responsive grid
- [x] Advanced search & filtering
- [x] Save/like functionality
- [x] Category management
- [x] Tag-based organization
- [x] Pagination (12 items/page)
- [x] Image upload with Cloudinary
- [x] Rate limiting & security
- [x] Error boundaries & fallbacks

### In Progress (⚠️ 50-80%)
- [ ] Upload progress indicators
- [ ] User preferences panel
- [ ] AI recommendations
- [ ] Content moderation UI
- [ ] Analytics dashboard
- [ ] Admin panel
### Planned (❌ Not Started)
- [ ] Social sharing
- [ ] Comments & ratings
- [ ] Live streaming integration
- [ ] Subscription tiers
- [ ] API marketplace
- [ ] Mobile apps (iOS/Android)
---

## 🛠️ Tech Stack
### Frontend (CLI)
```
✅ React 19.2.0              - UI library
✅ Vite 7.3.1                - Build tool  
✅ React Router 7.13.1       - Routing
✅ TailwindCSS 4.2.1         - Styling
✅ Clerk 5.61.1              - Authentication
✅ Styled Components 6.3.11  - CSS-in-JS
```

### Backend (Server)
```
✅ Node.js 16+               - Runtime
✅ Express 4.18.2            - Framework
✅ MongoDB 8.0               - Database (Mongoose ODM)
✅ Cloudinary 1.40.0         - Image CDN
✅ JWT 9.0.2                 - Token auth
✅ Multer 1.4.5              - File uploads
✅ Axios 1.6.5               - HTTP client
✅ Nodemon 3.0.2             - Dev auto-reload
```
### Infrastructure
```
✅ MongoDB Atlas              - Cloud database
✅ Cloudinary                 - Image storage & CDN
✅ Clerk                      - Authentication service
✅ Grok API                   - AI features
❌ Redis                      - Caching (planned)
❌ Bull                       - Job queue (planned)
```

---

## 🚀 Quick Start

### Prerequisites
```bash
✓ Node.js 16+ installed
✓ npm 7+
✓ MongoDB (local or Atlas)
✓ Git
```

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ai-gallery-platform.git
cd ai-gallery-platform
```

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
# Edit .env with your credentials

# Start server
npm run dev
# Server runs on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../cli

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
EOF

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Verify Installation
```bash
# Check backend
curl http://localhost:3000/data

# Open frontend
# Visit http://localhost:5173 in browser
```

---

## 📁 Project Structure

```
ai-gallery-platform/
│
├── cli/                          # 🎨 Frontend (React + Vite)
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── auth/            # Auth components
│   │   │   ├── gallery/         # Gallery UI
│   │   │   ├── common/          # Shared components
│   │   │   └── preferences/     # Settings UI
│   │   ├── context/             # Context API state
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Utilities
│   │   ├── App.jsx              # Root component
│   │   └── main.jsx             # Entry point
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                       # ⚙️ Backend (Express + Node)
│   ├── controllers/             # API handlers
│   ├── middleware/              # Express middleware
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   ├── utils/                   # Helpers
│   ├── server.js                # Entry point
│   └── package.json
│
├── api/                         # 🔌 Vercel Functions (optional)
│   ├── add.js
│   ├── search.js
│   ├── roast.js
│   └── data.js
│
├── IMPLEMENTATION_GUIDE.md       # Detailed guide
├── PROJECT_PROGRESS_ASSESSMENT.md # Progress report
├── README.md                     # This file
└── vercel.json                   # Vercel config
```

---

## 🔗 API Documentation

### Base URL
```
Development: http://localhost:3000
Production: https://api.yourdomain.com
```

### Authentication
All protected endpoints require Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Gallery
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/data` | Get all profiles | ❌ |
| GET | `/search?query=` | Search profiles | ❌ |
| POST | `/add` | Add new profile | ❌ |

#### Images (New API)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/images/upload` | Upload image | ✅ |
| GET | `/api/images/my-uploads` | User's uploads | ✅ |
| GET | `/api/images/gallery/public` | Public gallery | ❌ |
| GET | `/api/images/:id` | Image details | ❌ |
| POST | `/api/images/:id/like` | Like image | ✅ |
| DELETE | `/api/images/:id` | Delete image | ✅ |

#### Profiles
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profiles` | List profiles | ❌ |
| GET | `/api/profiles/:id` | Profile details | ❌ |
| POST | `/api/profiles` | Create profile | ✅ |
| PUT | `/api/profiles/:id` | Update profile | ✅ |

#### Preferences
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/preferences/:userId` | Get preferences | ✅ |
| POST | `/api/preferences` | Save preferences | ✅ |
| PUT | `/api/preferences/:userId` | Update preferences | ✅ |

### Example Requests

#### Upload Image
```bash
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg" \
  -F "title=My Gallery" \
  -F "category=digital-art" \
  -F "tags=gallery,art"
```

#### Get Public Gallery
```bash
curl http://localhost:3000/api/images/gallery/public?limit=12&page=1
```

#### Like Image
```bash
curl -X POST http://localhost:3000/api/images/507f1f77bcf86cd799439011/like \
  -H "Authorization: Bearer <token>"
```

### Response Format
```json
{
  "success": true,
  "data": { },
  "message": "Operation successful"
}
```

### Error Handling
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "status": 400,
  "details": []
}
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend (`server/.env`)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/dopamine-feed-18

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Clerk Auth
CLERK_SECRET_KEY=your_secret_key
CLERK_PUBLISHABLE_KEY=your_publishable_key

# Grok API
GROK_API_KEY=your_grok_api_key

# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRY=7d
```

#### Frontend (`cli/.env.local`)
```env
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_key
VITE_APP_VERSION=1.0.0
```

### Service Credentials

**Clerk** (Authentication)
- Sign up: https://clerk.com
- Create app and copy keys
- Add http://localhost:5173 to allowed URLs

**Cloudinary** (Image Storage)
- Sign up: https://cloudinary.com
- Get credentials from Dashboard → Settings

**MongoDB** (Database)
- Local: `mongodb://localhost:27017/dopamine-feed-18`
- Cloud: MongoDB Atlas connection string

**Grok API** (AI Features)
- Get key from: https://console.x.ai
- Used for AI roasting feature

---

## 💻 Development

### Running in Development

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
# http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd cli
npm install
npm run dev
# http://localhost:5173
```

### Building for Production

**Frontend Build:**
```bash
cd cli
npm run build
# Output: dist/
npm run preview  # Test build locally
```

**Backend (no build needed):**
```bash
cd server
npm install
npm start
```

### Code Structure Best Practices

#### Frontend
```javascript
// ✅ Good: Proper structure
src/
├── components/        # Reusable UI
├── context/          # State management
├── pages/            # Full page components
├── hooks/            # Custom logic
└── utils/            # Helpers

// ❌ Avoid: Monolithic structure
src/
└── index.js          # Everything in one file
```

#### Backend
```javascript
// ✅ Good: Layered architecture
server/
├── routes/           # API routes
├── controllers/      # Business logic
├── middleware/       # Cross-cutting concerns
├── models/           # Data schemas
└── services/         # Reusable services

// ❌ Avoid: Everything in one file
server/server.js      # All code mixed
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/gallery-improvements

# Make changes and commit
git add .
git commit -m "feat: add gallery filters"

# Push and create PR
git push origin feature/gallery-improvements
```

### Testing Endpoints

**Using Postman/Insomnia:**
1. Import provided Postman collection (if available)
2. Set `{{base_url}}` to http://localhost:3000
3. Set bearer token for protected routes
4. Test each endpoint

**Using cURL:**
```bash
# Health check
curl http://localhost:3000/data
# With auth
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/images/my-uploads
```

---

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
npm i -g vercel
cd cli
vercel
```

**Netlify:**
- Connect GitHub repo to Netlify
- Build command: `npm run build`
- Publish directory: `dist`
### Backend Deployment
**Heroku:**
```bash
heroku create app-name
heroku config:set MONGODB_URI=<your-atlas-uri>
heroku config:set CLOUDINARY_CLOUD_NAME=<key>
# ... set all env vars
git push heroku main
```

**Railway:**
1. Connect GitHub repo
2. Add MongoDB add-on
3. Set environment variables
4. Auto-deploys on push

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB backups enabled
- [ ] HTTPS enforced
- [ ] CORS configured for production domain
- [ ] Rate limiting tuned
- [ ] Security headers added (helmet.js)
- [ ] Error logging enabled
- [ ] CDN configured for images
- [ ] Database indexed for performance
- [ ] Monitoring setup (Sentry/DataDog)

---

## 🐛 Troubleshooting

### "MongoDB Connection Error"
```bash
# Check MongoDB is running
mongod

# Or verify Atlas connection string in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### "Cloudinary Authentication Failed"
```bash
# Verify credentials
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY

# Test at https://cloudinary.com/console
```

### "Frontend API 404"
```bash
# Check backend is running on port 3000
curl http://localhost:3000/data

# Verify VITE_API_URL in .env.local
# Check CORS enabled in server.js
```

### "Image Upload Fails"
```bash
# Increase timeout in frontend .env
VITE_API_TIMEOUT=30000

# Check file size limit in backend
# Verify Cloudinary account quota
```

### "Clerk Authentication Error"
```bash
# Add http://localhost:5173 to Clerk Dashboard
# Verify PUBLISHABLE_KEY matches
# Check auth domain configuration
```

See [TROUBLESHOOTING_SAVED_ARTWORKS.md](TROUBLESHOOTING_SAVED_ARTWORKS.md) for detailed solutions.

---

## 📊 Progress Metrics

### Frontend Completion
- Authentication: 95% ✅
- Gallery Display: 90% ✅
- Image Upload: 70% ⚠️
- Search/Filter: 85% ✅
- Preferences: 50% ⚠️
- **Overall: 75%**

### Backend Completion
- API Routes: 90% ✅
- Database Models: 85% ✅
- Upload Service: 80% ✅
- Moderation: 40% ⚠️
- Recommendations: 50% ⚠️
- **Overall: 78%**

### Quality Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Type Safety | 4/10 | 8/10 |
| Test Coverage | 0% | 80% |
| Documentation | 40% | 95% |
| Performance | 7/10 | 9/10 |
| Security | 6/10 | 9/10 |

---

## 📝 Documentation

- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Detailed setup & architecture
- [Progress Assessment](PROJECT_PROGRESS_ASSESSMENT.md) - Current state analysis
- [Database Guide](DATABASE_SETUP_GUIDE.md) - Database configuration
- [Troubleshooting](TROUBLESHOOTING_SAVED_ARTWORKS.md) - Known issues & solutions
- [Deployment Guide](VERCEL_DEPLOYMENT.md) - Production deployment

---

## 🤝 Contributing

### Development Setup
```bash
git clone <repo>
cd ai-gallery-platform
npm install
cd cli && npm install
cd ../server && npm install
```

### Making Changes
1. Create feature branch: `git checkout -b feature/name`
2. Make changes following code style
3. Test thoroughly
4. Commit with clear messages
5. Push and create Pull Request

### Code Style
- **Frontend**: Use React hooks, component composition
- **Backend**: Follow Express conventions, MVC pattern
- **Comments**: JSDoc for complex functions
- **Naming**: camelCase for variables, PascalCase for components

---

## 📈 Roadmap

### Q1 2026 (Current)
- [x] Core gallery functionality
- [x] User authentication
- [ ] Image upload completion
- [ ] Basic preferences
### Q2 2026
- [ ] AI recommendations
- [ ] Content moderation UI
- [ ] Social features
- [ ] Analytics dashboard
### Q3 2026
- [ ] Subscription tiers
- [ ] API marketplace
- [ ] Mobile optimization
- [ ] Admin panel
### Q4 2026
- [ ] iOS/Android apps
- [ ] Live streaming
- [ ] Advanced analytics
- [ ] Community features
---
## 🔒 Security

### Current Security Measures ✅
- JWT authentication
- Rate limiting on uploads
- File type validation
- Input sanitization
- CORS protection

### Security Enhancements ⚠️
- Add helmet.js for security headers
- Implement request validation (Joi/Zod)
- Add API key rotation
- Enable API request signing
- Add DDoS protection

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👨‍💼 Support & Contact

- **Issues**: GitHub Issues
- **Email**: support@aigallery.com
- **Discord**: Join our community
- **Documentation**: Full docs available

---

## 🎉 Acknowledgments

- React team for excellent documentation
- Clerk for authentication service
- Cloudinary for image hosting
- MongoDB for database

---

**Last Updated**: March 22, 2026
**Version**: 1.0.0
**Maintainer**: Your Team

---

## 💡 Quick Tips

```bash
# View all available commands
npm run  # Shows all npm scripts

# Check Node version compatibility
node --version  # Should be 16+

# Clean install (if issues)
rm -rf node_modules package-lock.json
npm install

# Format code
npm run lint

# Build frontend
npm run build

# Test locally
npm run preview
```

---

**Ready to get started? Follow the [Quick Start](#quick-start) section above! 🚀**
