# Deployment Guide — Kodemy LMS

This guide covers deploying the Kodemy LMS to production using **Vercel** (frontend) and **Render** (backend).

---

## Prerequisites

- GitHub account with the repo pushed
- Vercel account (free tier available)
- Render account (free tier available)
- Aiven MySQL account (or any MySQL provider)

---

## Step 1: Set Up Database (Aiven MySQL)

1. Go to [Aiven](https://aiven.io)
2. Create a free MySQL service
3. Copy the connection string (looks like: `mysql://user:pass@host:port/db?ssl-mode=REQUIRED`)
4. Save this — you'll need it for both Render and local testing

---

## Step 2: Deploy Backend on Render

### 2.1 Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `kodemy-backend`
   - **Root Directory**: `lms/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm start`
   - **Plan**: Free (or paid if you want better uptime)

### 2.2 Add Environment Variables

In Render dashboard, go to **Environment** and add:

```
DATABASE_URL=mysql://user:pass@host:port/db?ssl-mode=REQUIRED
JWT_ACCESS_SECRET=your-random-32-char-string-here
JWT_REFRESH_SECRET=your-different-random-32-char-string
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=4000
```

**Generate random secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.3 Deploy

Click **Create Web Service**. Render will automatically deploy from your GitHub repo.

**Wait for deployment to complete** — you'll see a green "Live" status and a URL like:
```
https://kodemy-backend.onrender.com
```

### 2.4 Seed Database

Once backend is live, seed the database:

```bash
# SSH into Render (or use curl)
curl -X POST https://kodemy-backend.onrender.com/api/health

# Then manually seed via your local machine:
DATABASE_URL="your-aiven-url" npx ts-node-dev --transpile-only lms/backend/prisma/seed.ts
```

Or add a seed endpoint to the backend (optional).

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `lms/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.2 Add Environment Variables

In Vercel project settings, go to **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://kodemy-backend.onrender.com/api
```

Replace `kodemy-backend.onrender.com` with your actual Render backend URL.

### 3.3 Deploy

Click **Deploy**. Vercel will build and deploy automatically.

**Your frontend URL will be:**
```
https://your-project.vercel.app
```

---

## Step 4: Update Backend FRONTEND_URL

Go back to Render dashboard and update the `FRONTEND_URL` environment variable:

```
FRONTEND_URL=https://your-project.vercel.app
```

This ensures CORS works correctly.

---

## Step 5: Test Deployment

1. Open `https://your-project.vercel.app`
2. Try to register a new account
3. Login with demo account:
   - Email: `demo@example.com`
   - Password: `password123`
4. Enroll in a course and watch a video

---

## Troubleshooting

### "CORS error" or "Failed to fetch"

**Solution**: Check that `FRONTEND_URL` in Render matches your Vercel URL exactly.

### "Database connection failed"

**Solution**: Verify `DATABASE_URL` is correct and includes `?ssl-mode=REQUIRED` for Aiven.

### "Prisma migration failed"

**Solution**: 
1. Check database is accessible
2. Manually run migrations locally first:
   ```bash
   DATABASE_URL="your-url" npx prisma migrate deploy
   ```

### "Videos not loading"

**Solution**: 
1. Seed the database:
   ```bash
   DATABASE_URL="your-url" npx ts-node-dev --transpile-only lms/backend/prisma/seed.ts
   ```
2. Check backend logs in Render dashboard

### "Auth not working"

**Solution**:
1. Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set in Render
2. Check that refresh cookie is being sent (browser DevTools → Network → Cookies)
3. Verify `sameSite: 'lax'` in auth controller

---

## Production Checklist

- [ ] Database created and accessible
- [ ] Backend deployed on Render with all env vars
- [ ] Frontend deployed on Vercel with `NEXT_PUBLIC_API_URL`
- [ ] Database seeded with courses
- [ ] CORS configured correctly
- [ ] JWT secrets are strong (32+ chars)
- [ ] Frontend URL updated in backend FRONTEND_URL
- [ ] Test register → login → enroll → watch video flow
- [ ] Check browser console for errors
- [ ] Check Render logs for backend errors

---

## Monitoring

### Render Backend Logs
- Go to Render dashboard → Your service → Logs
- Watch for errors in real-time

### Vercel Frontend Logs
- Go to Vercel dashboard → Your project → Deployments
- Click latest deployment → Logs

### Database
- Use Aiven dashboard to monitor connections and queries

---

## Scaling (Optional)

### Upgrade Render Plan
- Free tier: 0.5 CPU, 512MB RAM, auto-sleeps after 15 min inactivity
- Paid tier: Always on, better performance

### Upgrade Vercel Plan
- Free tier: Sufficient for most use cases
- Pro tier: Better analytics and support

### Upgrade Database
- Aiven free tier: 20GB storage
- Paid tier: More storage and better performance

---

## Rollback

If something breaks:

1. **Frontend**: Go to Vercel → Deployments → Click previous version → Redeploy
2. **Backend**: Go to Render → Deployments → Click previous version → Redeploy
3. **Database**: Keep backups of your Aiven database

---

## Support

For issues:
1. Check Render logs
2. Check Vercel logs
3. Check browser DevTools (Network, Console)
4. Check database connectivity
5. Open a GitHub issue

---

Happy deploying! 🚀
