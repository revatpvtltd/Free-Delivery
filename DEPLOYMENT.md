# Deployment Guide - FD Delivery

This guide will walk you through deploying FD Delivery to free hosting platforms.

## Prerequisites

- GitHub account
- Stripe account (for payments)
- Email account (optional, for notifications)

## Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

## Step 2: Set Up Database

### Option A: Supabase (Recommended - Free PostgreSQL)

1. Go to [supabase.com](https://supabase.com)
2. Sign up for free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string (looks like: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`)
6. Save this for later use

### Option B: Neon (Free Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Save this for later use

### Option C: Vercel Postgres

1. Create a Vercel account
2. Create a new Postgres database in Vercel dashboard
3. Copy the connection string
4. Save this for later use

## Step 3: Deploy to Vercel (Recommended)

### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 3.2 Import Project

1. Click "Add New Project"
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings

### 3.3 Configure Environment Variables

In the Vercel dashboard, go to Settings > Environment Variables and add:

```env
DATABASE_URL=your-database-connection-string
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at `https://your-project.vercel.app`

### 3.5 Set Up Database Schema

After deployment, you need to run Prisma migrations:

1. Go to your Vercel project dashboard
2. Go to the "Deployments" tab
3. Click on the latest deployment
4. Open the "Functions" tab
5. You can run migrations via Vercel CLI or create a one-time migration script

**Alternative: Use Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel env pull .env.local
npx prisma db push
```

## Step 4: Set Up Stripe

1. Go to [stripe.com](https://stripe.com)
2. Sign up for free account
3. Go to Developers > API keys
4. Copy your test keys:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)
5. Add these to your Vercel environment variables

## Step 5: Set Up Custom Domain (Optional)

### Free Subdomain

Vercel provides a free subdomain: `your-project.vercel.app`

### Custom Domain (Free Options)

1. **Freenom** - Free .tk, .ml, .ga domains
2. **GitHub Pages** - Use with custom domain
3. **Cloudflare** - Free domain registration and DNS

## Step 6: Verify Deployment

1. Visit your deployed URL
2. Test sign up/sign in
3. Test creating an order
4. Check admin dashboard (create an admin user first)

## Step 7: Create Admin User

You'll need to create an admin user manually in the database:

1. Sign up normally through the website
2. Go to your database (Supabase/Neon dashboard)
3. Find the users table
4. Update the user's role to `ADMIN`

Or use Prisma Studio:

```bash
npx prisma studio
```

## Alternative: Deploy to Render

### 1. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### 2. Create PostgreSQL Database

1. Click "New +" > "PostgreSQL"
2. Choose free plan
3. Copy the connection string

### 3. Create Web Service

1. Click "New +" > "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: fd-delivery
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 4. Add Environment Variables

Add all environment variables from Step 3.3

### 5. Deploy

1. Click "Create Web Service"
2. Wait for deployment
3. Your app will be live at `https://your-project.onrender.com`

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if your database allows connections from your hosting provider
- For Supabase, check the connection pooling settings

### Build Errors

- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in deployment dashboard

### Authentication Issues

- Verify `NEXTAUTH_URL` matches your deployed URL
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

### Payment Issues

- Verify Stripe keys are correct
- Check Stripe webhook configuration
- Use test mode for development

## Monitoring and Maintenance

### Vercel

- Check deployment logs in Vercel dashboard
- Monitor function execution
- Set up alerts for errors

### Database

- Monitor database usage (free tiers have limits)
- Set up backups (important for production)
- Monitor connection pools

## Scaling Considerations

When you're ready to scale:

1. Upgrade database plan
2. Enable Vercel Pro features
3. Set up CDN for static assets
4. Implement caching strategies
5. Set up monitoring (Sentry, LogRocket, etc.)

## Support

For issues or questions:
- Check the main README.md
- Create an issue on GitHub
- Contact support@fddelivery.com

## Next Steps

After deployment:

1. Add your logo to `public/logo.png`
2. Update `components/Logo.tsx` to use the logo
3. Configure email notifications
4. Set up analytics (Google Analytics, etc.)
5. Add social media links
6. Customize branding colors if needed
