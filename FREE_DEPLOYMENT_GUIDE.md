# ALMAYA Services - Railway Free Deployment
# Complete free deployment using Railway for backend + database

## Prerequisites
- GitHub account
- Railway account (free)

## Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit - ALMAYA Services"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/almaya-services.git
git push -u origin main
```

## Step 2: Railway Backend + Database Setup

### 2.1 Create Railway Project
1. Go to https://railway.app
2. Click "Start a new project"
3. Choose "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your `almaya-services` repository

### 2.2 Add Database
1. In Railway dashboard, click "Add Plugin"
2. Choose "Database" → "MySQL"
3. Database will be created automatically

### 2.3 Configure Environment Variables
In Railway project settings → Variables:

```
# Database (Railway auto-generates these)
DB_HOST=${{ MYSQLHOST }}
DB_USER=${{ MYSQLUSER }}
DB_PASSWORD=${{ MYSQLPASSWORD }}
DB_NAME=${{ MYSQLDATABASE }}

# Security
JWT_SECRET=your_super_strong_random_jwt_secret_64_chars_minimum
NODE_ENV=production

# Email (get from Gmail app password)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
RECIPIENT_EMAIL=contact@yourdomain.com

# Frontend URL (update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app
```

### 2.4 Import Database Schema
1. In Railway, go to your database
2. Open "Query" tab
3. Copy and paste the contents of `Database/planetscale_setup.sql`
4. Click "Run"

### 2.5 Deploy Backend
Railway will automatically deploy when you push to GitHub.

## Step 3: Vercel Frontend Deployment

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 3.2 Deploy Frontend
1. Click "Import Project"
2. Connect your GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.3 Add Environment Variables
In Vercel project settings:

```
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
REACT_APP_WHATSAPP_NUMBER=212690002284
```

## Step 4: Update Backend with Frontend URL

After Vercel deployment, update the `FRONTEND_URL` in Railway:
```
FRONTEND_URL=https://your-app-name.vercel.app
```

## Step 5: Test Deployment

1. **Test Backend**: Visit `https://your-app.up.railway.app/api/categories`
2. **Test Frontend**: Visit your Vercel URL
3. **Test Registration**: Try creating an account
4. **Test Admin**: Login with admin@almaya.com / admin123

## Free Tier Limits

### Railway Free Tier:
- 512MB RAM
- 1GB disk space
- 100 hours/month
- MySQL database included

### Vercel Free Tier:
- 100GB bandwidth/month
- 100 deployments/month
- Custom domains free

### PlanetScale Alternative (if needed):
- 5GB storage free
- 100M row reads/month
- 1 billion row writes/month

## Troubleshooting

### Database Connection Issues:
- Check Railway environment variables
- Ensure database is provisioned
- Verify schema is imported

### Build Failures:
- Check Railway build logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### CORS Issues:
- Update FRONTEND_URL in Railway
- Check Vercel deployment URL

## Cost Estimation (if exceeding free limits):
- Railway: ~$5/month for basic plan
- Vercel: Free for personal projects
- PlanetScale: Free for small projects