# ALMAYA Tourism Platform

A full-stack tourism services and experiences marketplace built with React, Node.js, Express, and MySQL.

**Status**: ✅ Production Ready  
**Last Updated**: January 26, 2026

---

## 📋 Quick Start

### Deployment
- **See**: [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step production deployment guide
- **Time**: ~35 minutes to go live on the internet
- **Cost**: Free (Railway $5/month credit + Vercel free tier)

### Local Development
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

---

## 🎯 Features

### User Features
- ✅ User registration with email verification
- ✅ Secure authentication (JWT tokens)
- ✅ Browse tourism categories
- ✅ Browse tourism locations (destinations)
- ✅ Browse and filter offers/experiences
- ✅ Shopping cart functionality
- ✅ User profile management
- ✅ WhatsApp contact integration

### Admin Features
- ✅ Create/edit/delete categories
- ✅ Create/edit/delete locations
- ✅ Create/edit/delete offers
- ✅ Role-based access control
- ✅ Content management dashboard

### Security
- ✅ Password hashing (BCrypt)
- ✅ JWT authentication (1-hour expiration)
- ✅ Email verification required before login
- ✅ Rate limiting on authentication endpoints
- ✅ HTTPS/SSL encryption
- ✅ CORS protection
- ✅ HttpOnly cookies

---

## 🏗️ Technology Stack

### Frontend
- **React** 19.1.1
- **React Router** 7.9.1
- **Bootstrap** 5 (CSS Framework)
- **Bootstrap Icons** (UI Icons)
- **JWT Decode** 4.0.0

### Backend
- **Node.js** 16+
- **Express** 5.1.0
- **MySQL2** 3.15.0 (Database)
- **BCrypt** 6.0.0 (Password hashing)
- **JWT** 9.0.2 (Authentication)
- **Nodemailer** 7.0.6 (Email service)
- **CORS** 2.8.5 (Cross-origin requests)
- **Express Rate Limit** 7.1.5 (Rate limiting)

### Deployment
- **Railway** - Backend hosting + MySQL database
- **Vercel** - Frontend hosting
- **Gmail** - Email verification service

---

## 📁 Project Structure

```
Almaya/
├── backend/
│   ├── db.js                   # Database connection pool
│   ├── server.js               # Express API server (652 lines)
│   ├── package.json            # Dependencies
│   ├── railway.toml            # Railway deployment config
│   └── .env.production         # Production template
│
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main routing component
│   │   ├── Home.js             # Home page
│   │   ├── index.js            # React entry point
│   │   ├── index.css           # Global styles
│   │   ├── components/         # React components (15 files)
│   │   │   ├── admin/          # Admin forms (6 files)
│   │   │   ├── AuthForm.js
│   │   │   ├── Cart.js
│   │   │   ├── Categories.js
│   │   │   ├── Footer.js
│   │   │   ├── HeroSection.js
│   │   │   ├── MainLayout.js
│   │   │   ├── OffersPage.js
│   │   │   ├── Profile.js
│   │   │   └── ...
│   │   └── contexts/
│   │       └── AuthContext.js  # Global authentication state
│   ├── public/
│   │   └── index.html
│   ├── package.json            # Dependencies
│   ├── vercel.json             # Vercel deployment config
│   └── .env.production         # Production template
│
├── Database/
│   ├── almaya_complete.sql     # ✅ Main schema (use this)
│   ├── almaya.sql              # Alternative schema
│   └── railway_setup.sql       # Railway-specific schema
│
├── DEPLOYMENT.md               # ✅ Production deployment guide
├── CONFIGURATION.md            # Environment & credentials setup
├── README.md                   # This file
├── package.json                # Monorepo configuration
├── nixpacks.toml               # Docker configuration
└── .gitignore                  # Git ignore rules
```

---

## 🚀 Deployment

### Production Deployment (35 minutes)

**Follow**: [DEPLOYMENT.md](./DEPLOYMENT.md)

1. **Create Accounts** (5 min)
   - Railway.app
   - Vercel.com
   - Gmail 2-Factor Authentication

2. **Deploy Backend** (10 min)
   - Create MySQL database on Railway
   - Deploy backend service
   - Configure 8 environment variables

3. **Deploy Frontend** (10 min)
   - Deploy frontend on Vercel
   - Configure 2 environment variables

4. **Test & Go Live** (5-10 min)
   - Test user registration
   - Test email verification
   - Test login functionality
   - Share public URL with users

### Local Development

```bash
# Install dependencies
npm install                  # Root monorepo
cd backend && npm install    # Backend
cd ../frontend && npm install # Frontend

# Run development servers
# Terminal 1:
cd backend && npm start

# Terminal 2:
cd frontend && npm start

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

## 📊 API Endpoints

### Authentication
```
POST   /api/register              - Create account
POST   /api/login                 - User login
POST   /api/logout                - User logout
GET    /api/verify-email          - Verify email (from link)
POST   /api/resend-verification   - Resend verification
GET    /api/profile               - Get user profile
```

### Content Management
```
GET    /api/categories            - Get all categories
GET    /api/locations             - Get all locations
GET    /api/categories/:id/offers - Get offers by category
GET    /api/locations/:slug/offers - Get offers by location
POST   /api/admin/categories      - Create category (admin)
PUT    /api/admin/categories/:id  - Update category (admin)
DELETE /api/admin/categories/:id  - Delete category (admin)
POST   /api/admin/offers          - Create offer (admin)
PUT    /api/admin/offers/:id      - Update offer (admin)
DELETE /api/admin/offers/:id      - Delete offer (admin)
```

### Cart
```
GET    /api/cart                  - Get user cart
PUT    /api/cart                  - Update cart
```

---

## 🔐 Environment Variables

### Backend (Railway)

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | ✅ | `mysql://user:pass@host:port/almaya` |
| `JWT_SECRET` | ✅ | 64-character random string |
| `NODE_ENV` | ✅ | `production` |
| `EMAIL_SERVICE` | ✅ | `gmail` |
| `EMAIL_USER` | ✅ | `your-email@gmail.com` |
| `EMAIL_PASS` | ✅ | 16-char app password from Gmail |
| `RECIPIENT_EMAIL` | ✅ | `your-email@gmail.com` |
| `FRONTEND_URL` | ✅ | `https://your-vercel-domain.vercel.app` |

### Frontend (Vercel)

| Variable | Required | Example |
|----------|----------|---------|
| `REACT_APP_API_URL` | ✅ | `https://your-railway-backend.up.railway.app` |
| `REACT_APP_WHATSAPP_NUMBER` | ⚠️ | `212690002284` |

---

## 🛠️ Development Guide

### Adding a New Feature

1. Create component in `/frontend/src/components/`
2. Add route in `/frontend/src/App.js`
3. Create API endpoint in `/backend/server.js`
4. Add environment variables to deployment docs
5. Test locally before deploying
6. Commit and push to GitHub

### Database Modifications

1. Update SQL schema in `/Database/almaya_complete.sql`
2. Test locally
3. Document changes
4. Reimport schema in production

### Styling

- Uses Bootstrap 5 for responsive design
- Primary color: Orange (#FF6B35 - ALMAYA brand)
- Secondary color: Blue (#004E89 - Accent)
- See `/frontend/src/index.css` for custom styles

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Check `FRONTEND_URL` in Railway |
| Email not sending | Use Gmail app password, not regular password |
| Can't login | Verify email first |
| Database won't connect | Check `DATABASE_URL` format and credentials |
| Frontend won't load | Check `REACT_APP_API_URL` in Vercel |

**See**: [DEPLOYMENT.md#troubleshooting](./DEPLOYMENT.md#troubleshooting) for detailed solutions

---

## 📞 Support

- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Configuration Help**: [CONFIGURATION.md](./CONFIGURATION.md)
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs

---

## 📄 License

ALMAYA Tourism Platform © 2025

---

## ✅ Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database initialized with schema
- [ ] Email verification tested
- [ ] User can register → verify email → login
- [ ] Admin can create content
- [ ] No console errors (DevTools F12)
- [ ] HTTPS working
- [ ] Rate limiting enabled
- [ ] Logs being recorded

---

**Ready to deploy?** Start with [DEPLOYMENT.md](./DEPLOYMENT.md)
