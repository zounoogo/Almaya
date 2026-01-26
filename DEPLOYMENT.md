# ALMAYA Tourism Platform - Production Deployment Guide

**Version**: 1.0  
**Last Updated**: January 26, 2026  
**Status**: ✅ Production Ready

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Account Setup](#phase-1-account-setup)
4. [Phase 2: Backend Deployment](#phase-2-backend-deployment)
5. [Phase 3: Frontend Deployment](#phase-3-frontend-deployment)
6. [Phase 4: Configuration & Testing](#phase-4-configuration--testing)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

- [ ] All code changes committed to Git
- [ ] `.env` files are NOT in repository
- [ ] Database schema prepared
- [ ] HTTPS certificates ready (automatic with Railway/Vercel)
- [ ] Email service configured (Gmail 2FA enabled)
- [ ] JWT secret generated (64+ characters)
- [ ] Read this entire guide

---

## Prerequisites

### Required Knowledge
- Basic command line usage
- GitHub account with repository access
- Understanding of environment variables

### Required Software (Your Local Machine)
- Node.js 16+ and npm
- Git
- MySQL client (optional, for database management)

### Required Accounts (Free)
1. **Railway.app** - Backend hosting and database
2. **Vercel.com** - Frontend hosting
3. **Gmail** - Email verification service (existing account)

---

## Phase 1: Account Setup

### Step 1.1: Create Railway Account

1. Visit https://railway.app
2. Click "Get Started" → Sign up with GitHub
3. Authorize Railway to access your GitHub repositories
4. Complete onboarding

**Free Tier Benefits**: $5/month credit (enough for production deployment)

### Step 1.2: Create Vercel Account

1. Visit https://vercel.com
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub repositories
4. Complete setup

**Free Tier**: Unlimited deployments, no credit card required

### Step 1.3: Generate Credentials

**Gmail App Password** (for email verification):
1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Visit https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. **Copy and save this password** (you'll need it later)

**JWT Secret** (for authentication):

Open PowerShell and run:
```powershell
$jwt = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes(([Guid]::NewGuid().ToString() + [Guid]::NewGuid().ToString() + [Guid]::NewGuid().ToString() + [Guid]::NewGuid().ToString())))
Write-Host $jwt
```

Copy the output (this is your JWT_SECRET)

### Step 1.4: Prepare Code for Deployment

```bash
# Navigate to project root
cd C:\Users\HP\Desktop\INPT\Travail\Almaya

# Ensure all changes are committed
git add .
git commit -m "Production ready: code cleanup and security hardening"
git push origin main
```

---

## Phase 2: Backend Deployment

### Step 2.1: Create Database on Railway

1. Go to https://railway.app/dashboard
2. Click **"+ New Project"** → **"Provision MySQL"**
3. Wait 1-2 minutes for database to initialize
4. Click on the MySQL service that appears
5. Go to **"Connect"** tab
6. **Copy the DATABASE_URL** (format: `mysql://user:pass@host:port/database`)
7. **Save this URL** - you'll need it immediately

### Step 2.2: Deploy Backend Service

1. In Railway dashboard, click **"+ New Service"** → **"GitHub Repo"**
2. Search for and select your **Almaya repository**
3. Railway will detect the project and start building
4. Wait for build to complete (usually 2-3 minutes)
5. Once complete, you'll see a **green checkmark**

### Step 2.3: Configure Backend Environment Variables

1. In Railway dashboard, click on your **backend service**
2. Go to **Variables** tab
3. Add the following variables:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@host:port/almaya

# Security
JWT_SECRET=your-generated-jwt-secret-here
NODE_ENV=production

# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Application
RECIPIENT_EMAIL=your-email@gmail.com
PORT=3001
```

4. Click "Deploy" to apply changes

### Step 2.4: Get Backend URL

1. Go to **Deployments** tab
2. Find your latest deployment (should have ✅ status)
3. Copy the URL shown (format: `https://almaya-backend.up.railway.app`)
4. **Save this URL** - you'll need it for frontend configuration

### Step 2.5: Initialize Database Schema

1. Download and open a MySQL client
2. Connect using the DATABASE_URL from Step 2.1
3. Execute the schema file:

```bash
# Option 1: Using MySQL command line
mysql -h [host] -u [user] -p[password] -D almaya < Database/almaya_complete.sql

# Option 2: Import via MySQL Workbench or Navicat GUI
# 1. Open the GUI tool
# 2. Connect to your Railway database
# 3. Run Database/almaya_complete.sql script
```

### Step 2.6: Verify Backend Deployment

1. Open your browser
2. Visit: `https://your-railway-url/api/categories`
3. Should return JSON array: `[{"id":"...", "name":"..."}, ...]`
4. If successful: ✅ Backend is live

---

## Phase 3: Frontend Deployment

### Step 3.1: Prepare Frontend Configuration

No changes needed - your code already uses environment variables!

### Step 3.2: Deploy Frontend on Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Search for your **Almaya repository** and select it
4. Configure project settings:
   - **Framework**: React
   - **Root Directory**: `./frontend` ← **Important!**
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Click **"Deploy"**
6. Wait for deployment to complete (usually 3-5 minutes)

### Step 3.3: Configure Frontend Environment Variables

1. After deployment completes, go to **Settings** → **Environment Variables**
2. Add:
   ```env
   REACT_APP_API_URL=https://your-railway-backend-url
   REACT_APP_WHATSAPP_NUMBER=212690002284
   ```
3. Click **"Save"**
4. This will trigger a new deployment with the new variables

### Step 3.4: Get Frontend URL

1. Go to **Deployments** tab
2. Find your latest deployment
3. Copy the URL (format: `https://almaya-prod.vercel.app`)
4. **This is your public website URL**

---

## Phase 4: Configuration & Testing

### Step 4.1: Update Backend with Frontend URL

1. Go back to **Railway** dashboard
2. Click on your **backend service**
3. Go to **Variables** tab
4. Update `FRONTEND_URL`:
   ```env
   FRONTEND_URL=https://your-vercel-project.vercel.app
   ```
5. Click **"Deploy"**
6. Wait 1-2 minutes for redeploy to complete

### Step 4.2: Test User Registration

1. Open your Vercel frontend URL in a browser
2. Click **"Register"**
3. Enter:
   - **Username**: `testuser`
   - **Email**: Your real email address
   - **Password**: Any password
4. Click **"Sign Up"**
5. Expected: Success message + email verification

### Step 4.3: Verify Email Reception

1. Check your email inbox (including Spam folder)
2. Look for email from: `your-email@gmail.com` (the EMAIL_USER)
3. Subject should contain: "ALMAYA SERVICES" or "verification"
4. Click the verification link in the email
5. Should redirect to verification success page

### Step 4.4: Test Login

1. Go back to frontend URL
2. Click **"Login"**
3. Enter:
   - **Email**: The email you just registered
   - **Password**: The password from Step 4.2
4. Click **"Sign In"**
5. Should show: Homepage with categories and offers loaded

### Step 4.5: Test Core Features

- [ ] Browse categories
- [ ] Click on offers
- [ ] View offer details
- [ ] Add to cart (if implemented)
- [ ] View cart (if implemented)
- [ ] Admin can login (if admin features exist)
- [ ] Admin can create/edit items (if admin)

### Step 4.6: Verify API Connectivity

Open browser DevTools (F12) and run in console:

```javascript
fetch('https://your-backend-url/api/categories')
  .then(r => r.json())
  .then(d => console.log('✅ Connected!', d))
  .catch(e => console.error('❌ Error:', e))
```

Should see: `✅ Connected!` with category data

---

## Troubleshooting

### Issue: "CORS Error" in browser console

**Symptoms**:
```
Access to XMLHttpRequest at '...' from origin '...' blocked by CORS policy
```

**Solution**:
1. Verify `FRONTEND_URL` is set in Railway backend variables
2. Verify it matches your Vercel domain exactly (with https://)
3. Check there are no trailing slashes
4. Wait 2 minutes for Railway to redeploy
5. Hard refresh browser (Ctrl+F5)

### Issue: "Failed to fetch" on button clicks

**Symptoms**:
- Buttons show error
- Network tab shows failed requests to backend

**Solution**:
1. Verify `REACT_APP_API_URL` is set in Vercel
2. Test the URL directly: `https://your-backend/api/categories`
3. Should return JSON, not error page
4. If error: check Railway backend logs
5. Redeploy frontend after fixing

### Issue: Email verification not working

**Symptoms**:
- Email doesn't arrive
- Or email has broken link

**Solution**:
1. Verify `EMAIL_USER` and `EMAIL_PASS` are correct in Railway
2. Use **Gmail app password**, NOT regular password
3. Check Gmail spam folder
4. Verify 2FA is enabled on Gmail
5. Check Railway logs for email errors:
   - Railway Dashboard → Backend Service → Logs tab

### Issue: "Database connection failed"

**Symptoms**:
- Backend won't start
- 503 Service Unavailable error

**Solution**:
1. Verify `DATABASE_URL` in Railway variables
2. Check credentials are URL-encoded (special chars like @ → %40)
3. Test connection manually:
   ```bash
   mysql -h [host] -u [user] -p[pass] -D [database]
   ```
4. Recreate MySQL database if necessary
5. Check Railway logs for connection errors

### Issue: Frontend shows "loading forever"

**Symptoms**:
- Page stuck on loading screen
- Never displays content

**Solution**:
1. Open DevTools (F12) → Console tab
2. Look for JavaScript errors
3. Check Network tab → see if API requests are pending
4. Verify `REACT_APP_API_URL` is correct
5. Check backend is responding: visit backend URL in browser
6. Redeploy frontend

### Issue: Admin features not working

**Symptoms**:
- Admin can't access admin panel
- Forms show "Unauthorized"

**Solution**:
1. Verify user is actually admin in database:
   ```sql
   SELECT id, email, role FROM users WHERE email='admin@email.com';
   ```
2. Role should be `'admin'`, not `'customer'`
3. Update if needed:
   ```sql
   UPDATE users SET role='admin' WHERE email='admin@email.com';
   ```

---

## Production Best Practices

### Security Checklist
- [ ] No `.env` files committed to Git
- [ ] All secrets set via platform dashboards only
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS restricted to your domain only
- [ ] Database backups enabled (Railway: automatic)
- [ ] Admin password changed from default
- [ ] JWT secret is strong (64+ characters)
- [ ] Email credentials use app-specific passwords

### Monitoring Checklist
- [ ] Check Railway logs weekly for errors
- [ ] Monitor Vercel deployments for failures
- [ ] Test email verification monthly
- [ ] Review user registrations for spam
- [ ] Monitor database size growth

### Maintenance Checklist
- [ ] Update Node.js dependencies monthly
- [ ] Update React dependencies quarterly
- [ ] Backup database monthly
- [ ] Test disaster recovery plan
- [ ] Document any customizations

---

## Environment Variables Reference

| Variable | Required | Where | Example |
|----------|----------|-------|---------|
| `DATABASE_URL` | ✅ Backend | Railway | `mysql://user:pass@host/db` |
| `JWT_SECRET` | ✅ Backend | Railway | 64-char random string |
| `NODE_ENV` | ✅ Backend | Railway | `production` |
| `EMAIL_USER` | ✅ Backend | Railway | `your-email@gmail.com` |
| `EMAIL_PASS` | ✅ Backend | Railway | 16-char app password |
| `RECIPIENT_EMAIL` | ✅ Backend | Railway | `your-email@gmail.com` |
| `FRONTEND_URL` | ✅ Backend | Railway | `https://your-frontend.vercel.app` |
| `REACT_APP_API_URL` | ✅ Frontend | Vercel | `https://your-backend.railway.app` |
| `REACT_APP_WHATSAPP_NUMBER` | ⚠️ Frontend | Vercel | `212690002284` |

---

## Support & Resources

**Documentation**:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- React Docs: https://react.dev
- Node.js Docs: https://nodejs.org/docs
- MySQL Docs: https://dev.mysql.com/doc

**Common Commands**:

```bash
# Check logs locally
npm run dev          # Frontend
npm start            # Backend

# View deployment logs
# Railway: Dashboard → Service → Logs tab
# Vercel: Dashboard → Project → Deployments → Recent → Logs

# Test API from terminal
curl https://your-backend.railway.app/api/categories

# Test database connection
mysql -h [host] -u [user] -p[password]
```

---

## Deployment Complete! ✅

Your ALMAYA Tourism Platform is now live on the internet:

- **Public URL**: `https://your-vercel-project.vercel.app`
- **Users can**: Register, verify email, login, browse offers
- **Admin can**: Create, edit, delete content
- **Email works**: Automatic verification emails sent
- **Database**: Secure with SSL encryption
- **Backup**: Automatic via Railway

**Next Steps**:
1. Share your website URL with users
2. Monitor logs for first 24 hours
3. Test with real users
4. Gather feedback and iterate

---

**Questions?** Check the logs first (Railway/Vercel dashboards), then reread the relevant troubleshooting section.

**Ready to deploy?** Start with [Phase 1: Account Setup](#phase-1-account-setup)
