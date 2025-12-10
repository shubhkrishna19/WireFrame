# Deployment Guide

## Frontend Deployment

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Build your app:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Or connect GitHub:**
   - Go to https://vercel.com
   - Import your repository
   - Vercel auto-detects Vite and deploys

**Environment Variables:**
- `VITE_API_URL` - Your backend API URL

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify Dashboard:**
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install -D gh-pages
   ```

2. **Add to package.json:**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/mulary-app"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## Backend Deployment

### Option 1: Railway (Recommended - Easiest)

1. **Go to https://railway.app**
2. **New Project → Deploy from GitHub**
3. **Select your backend repository**
4. **Add environment variables:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`
5. **Railway auto-detects Node.js and deploys**

**Database:**
- Railway provides PostgreSQL addon
- Or use Supabase/Neon

### Option 2: Render

1. **Go to https://render.com**
2. **New → Web Service**
3. **Connect GitHub repository**
4. **Settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. **Add environment variables**

### Option 3: DigitalOcean App Platform

1. **Go to https://cloud.digitalocean.com**
2. **Create App → GitHub**
3. **Configure:**
   - Build command: `npm run build`
   - Run command: `npm start`
4. **Add environment variables**

### Option 4: AWS (Advanced)

**Using EC2:**
1. Launch EC2 instance
2. Install Node.js and PM2
3. Clone repository
4. Set up Nginx reverse proxy
5. Configure SSL with Let's Encrypt

**Using ECS/Fargate:**
1. Create Dockerfile
2. Push to ECR
3. Create ECS service
4. Configure load balancer

## Database Deployment

### Option 1: Supabase (Recommended)

1. **Go to https://supabase.com**
2. **Create project**
3. **Copy connection string**
4. **Run migrations in SQL editor**

### Option 2: Neon

1. **Go to https://neon.tech**
2. **Create project**
3. **Copy connection string**
4. **Use pgAdmin or CLI to run migrations**

### Option 3: Railway PostgreSQL

1. **Add PostgreSQL service in Railway**
2. **Copy connection string**
3. **Run migrations**

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://your-api.railway.app
```

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-app.vercel.app

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## SSL/HTTPS

- **Vercel/Netlify**: Automatic SSL
- **Railway/Render**: Automatic SSL
- **Custom domain**: Use Let's Encrypt

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## Monitoring

### Error Tracking
- **Sentry**: https://sentry.io
- Add to both frontend and backend

### Analytics
- **Google Analytics**: For user behavior
- **Plausible**: Privacy-friendly alternative

### Uptime Monitoring
- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring

## Performance Optimization

### Frontend
- Enable compression (gzip/brotli)
- Use CDN for static assets
- Implement lazy loading
- Optimize images (WebP format)
- Code splitting

### Backend
- Enable compression middleware
- Use Redis for caching
- Database connection pooling
- Rate limiting
- Load balancing (if needed)

## Security Checklist

- [ ] HTTPS enabled everywhere
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Secure password hashing (bcrypt)
- [ ] JWT tokens with expiration
- [ ] Error messages don't leak sensitive info
- [ ] Regular dependency updates
- [ ] Security headers configured

## Cost Estimation

### Free Tier Options:
- **Frontend**: Vercel/Netlify (free)
- **Backend**: Railway/Render (free tier)
- **Database**: Supabase/Neon (free tier)
- **Total**: $0/month for small projects

### Paid Options (as you scale):
- **Backend**: $5-20/month
- **Database**: $5-25/month
- **Storage**: $5-10/month
- **Total**: ~$15-55/month

## Troubleshooting

### Common Issues:

1. **CORS errors**
   - Check `FRONTEND_URL` in backend
   - Verify CORS middleware configuration

2. **Database connection errors**
   - Check `DATABASE_URL` format
   - Verify database is accessible
   - Check firewall rules

3. **Build failures**
   - Check Node.js version
   - Verify all dependencies installed
   - Check for TypeScript errors

4. **Environment variables not working**
   - Verify variable names match
   - Check if variables are set in deployment platform
   - Restart services after adding variables

## Need Help?

I can help you:
- Set up deployment for your specific platform
- Configure CI/CD pipelines
- Troubleshoot deployment issues
- Optimize performance

Just ask! 🚀

