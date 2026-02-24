# 🚀 Deploy AI Gallery Platform to Vercel

## Step-by-Step Deployment Guide

### **Prerequisites:**
- GitHub account
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Clerk project set up
- Grok API key with credits

---

## **Step 1: Setup MongoDB Atlas (Database)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the URI: `mongodb+srv://username:password@cluster.mongodb.net/doom`
4. Save this for later ✅

---

## **Step 2: Push to GitHub**

```bash
cd /c/Users/DELL/Downloads/ai-gallery-platform

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - AI Gallery Platform"

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/ai-gallery-platform.git
git branch -M main
git push -u origin main
```

---

## **Step 3: Deploy to Vercel**

### **Option A: Via Vercel Dashboard (Easiest)**

1. Go to https://vercel.com
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select your `ai-gallery-platform` repo
5. **Project Settings:**
   - Framework: **Vite**
   - Build Command: `cd cli && npm run build`
   - Output Directory: `cli/dist`
   - Install Command: `npm install`

6. **Click "Environment Variables"** and add:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/doom
   GROK_API_KEY=xai-YOUR_KEY_HERE
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

7. Click **"Deploy"** ✅

---

### **Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd /c/Users/DELL/Downloads/ai-gallery-platform
vercel

# Add environment variables when prompted
# - MONGO_URI
# - GROK_API_KEY
# - VITE_CLERK_PUBLISHABLE_KEY
```

---

## **Step 4: Update Environment Variables**

After deployment, you'll get a URL like: `https://ai-gallery-platform.vercel.app`

Update your local `.env` file:

```bash
# cli/.env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://ai-gallery-platform.vercel.app
```

---

## **Step 5: Test Your Deployment**

1. Go to your Vercel URL: `https://ai-gallery-platform.vercel.app`
2. Login with Clerk
3. Go to Gallery → Should load artworks
4. Save an artwork → Should appear in Preferences
5. Go to Preferences → 🔥 Your Roast → Should show roast from Grok

---

## **Troubleshooting**

### **API Endpoints Not Working**
- Check Vercel logs: https://vercel.com/YOUR_USERNAME/ai-gallery-platform/logs
- Ensure environment variables are set in Vercel dashboard

### **Database Connection Failed**
- Check MongoDB URI is correct
- Whitelist Vercel IP in MongoDB: Security → Network Access → Add 0.0.0.0/0

### **Grok API 404 Error**
- Add credits to your Grok team: https://console.x.ai
- Verify GROK_API_KEY is correct

### **Frontend Can't Find API**
- Check VITE_API_URL points to your Vercel URL
- Rebuild frontend: `cd cli && npm run build`

---

## **File Structure After Deployment**

```
ai-gallery-platform/
├── api/                              # Serverless functions
│   ├── data.js                       # GET /api/data
│   ├── add.js                        # POST /api/add
│   ├── search.js                     # GET /api/search
│   ├── roast.js                      # POST /api/roast
│   ├── models/
│   │   └── Profile.js
│   └── utils/
│       └── dbConnect.js
├── cli/                              # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/                           # Local backend (not deployed)
├── vercel.json                       # Vercel config
└── ...
```

---

## **Environment Variables on Vercel**

| Variable | Value | Example |
|----------|-------|---------|
| MONGO_URI | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/doom` |
| GROK_API_KEY | Your Grok API key | `xai-FD20gzx...` |
| VITE_CLERK_PUBLISHABLE_KEY | Clerk public key | `pk_test_...` |

---

## **Monitor Your App**

- **Vercel Dashboard**: https://vercel.com/dashboard
- **View Logs**: Project → Logs
- **Monitor Usage**: Project → Usage
- **Check API Health**: https://ai-gallery-platform.vercel.app/api/data

---

## **Redeploy After Changes**

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys! ✅
# Check status: https://vercel.com/YOUR_USERNAME/ai-gallery-platform
```

---

**🎉 Your app is now live on Vercel!**
