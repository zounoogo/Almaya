# ALMAYA Services - Deployment Guide

A full-stack tourism services platform built with React, Node.js, Express, and MySQL.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 16+
- npm or yarn
- Git
- MySQL database (production)

### Automated Setup
```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## 📋 Manual Deployment Steps

### 1. Database Setup
```sql
-- Import your database schema
mysql -u username -p database_name < Database/almaya.sql
```

### 2. Backend Deployment

#### Option A: Railway (Recommended)
1. Go to [Railway.app](https://railway.app) and create an account
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard:
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   JWT_SECRET=your_strong_jwt_secret
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   RECIPIENT_EMAIL=contact@yourdomain.com
   NODE_ENV=production
   ```
4. Deploy automatically

#### Option B: Render
1. Go to [Render.com](https://render.com) and create an account
2. Create a new Web Service
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (same as Railway)

### 3. Frontend Deployment

#### Option A: Vercel (Recommended)
1. Go to [Vercel.com](https://vercel.com) and create an account
2. Connect your GitHub repository
3. Deploy the `frontend` folder
4. Update `vercel.json` with your backend URL
5. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   REACT_APP_WHATSAPP_NUMBER=212690002284
   ```

#### Option B: Netlify
1. Go to [Netlify.com](https://netlify.com) and create an account
2. Drag and drop the `frontend/build` folder
3. Configure redirect rules for SPA routing

### 4. Domain Configuration
1. Update CORS settings in backend for your frontend domain
2. Update email verification links to use production URLs
3. Configure DNS if using custom domain

## 🔧 Environment Variables

### Backend (.env.production)
```env
# Database
DB_HOST=your_production_db_host
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# Security
JWT_SECRET=your_very_strong_random_secret_64_chars_minimum
NODE_ENV=production

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RECIPIENT_EMAIL=contact@yourdomain.com

# URLs
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_WHATSAPP_NUMBER=212690002284
```

## 🗄️ Database Hosting Options

### PlanetScale (Recommended for MySQL)
1. Create account at [PlanetScale.com](https://planetscale.com)
2. Create a new database
3. Import your schema
4. Get connection credentials

### AWS RDS
1. Create RDS MySQL instance
2. Configure security groups
3. Import schema

### DigitalOcean Managed Database
1. Create MySQL database cluster
2. Import schema
3. Get connection string

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in EMAIL_PASS

### Alternative Services
- SendGrid
- Mailgun
- AWS SES

## 🔒 Security Checklist

- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS enabled
- [ ] Database credentials secured
- [ ] Email credentials secured
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation implemented

## 🧪 Testing Deployment

1. Test user registration and email verification
2. Test login/logout functionality
3. Test cart operations
4. Test admin panel (if applicable)
5. Test WhatsApp order functionality
6. Verify all API endpoints work

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
- Ensure all dependencies are installed
- Check Node.js version compatibility
- Verify environment variables are set

**Database Connection:**
- Check database credentials
- Verify database server is accessible
- Check firewall settings

**CORS Issues:**
- Update allowed origins in backend
- Ensure frontend URL is correct

**Email Not Sending:**
- Verify email credentials
- Check Gmail app password
- Review spam folder

## 📞 Support

For deployment issues, check:
1. Railway/Render/Vercel documentation
2. Application logs
3. Database connection status
4. Environment variable configuration

## 🎯 Performance Optimization

- Enable gzip compression
- Set up CDN for static assets
- Configure database connection pooling
- Implement caching where appropriate
- Monitor application performance

---

**Happy Deploying! 🚀**