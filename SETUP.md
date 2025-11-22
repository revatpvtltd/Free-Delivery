# Quick Setup Guide - FD Delivery

## Initial Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database - Get from Supabase, Neon, or your PostgreSQL provider
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth - Generate secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe - Get from stripe.com dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Add Your Logo

1. Place your logo file in `public/logo.png` or `public/logo.svg`
2. Update `components/Logo.tsx` to use your logo:

```tsx
<Image 
  src="/logo.png" 
  alt="FD Delivery Logo" 
  fill 
  className="object-contain p-2"
/>
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Create Admin User

After signing up, create an admin user:

**Option 1: Using Prisma Studio**
```bash
npm run db:studio
```
- Open the users table
- Find your user
- Change `role` to `ADMIN`

**Option 2: Using SQL**
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Database Setup Options

### Option 1: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string
6. Use it as `DATABASE_URL`

### Option 2: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Use it as `DATABASE_URL`

### Option 3: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb fd_delivery`
3. Use connection string: `postgresql://localhost:5432/fd_delivery`

## Stripe Setup

1. Go to [stripe.com](https://stripe.com)
2. Create a free account
3. Go to Developers > API keys
4. Copy your test keys:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)
5. Add them to your `.env` file

## Testing the Application

### 1. Create Test Accounts

- **Customer**: Sign up normally
- **Restaurant Owner**: Sign up and select "Restaurant Owner"
- **Admin**: Sign up, then update role in database to `ADMIN`
- **Delivery Partner**: Sign up and select "Delivery Partner"

### 2. Create Test Restaurant

1. Sign in as Restaurant Owner
2. Go to Admin Dashboard (if you have access)
3. Create a restaurant
4. Add menu items and categories

### 3. Test Order Flow

1. Browse restaurants
2. Add items to cart
3. Go to checkout
4. Place an order
5. Track the order

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if database is running
- Verify network access to database

### Build Errors

- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Run `npm install` and `npm run build`

### Authentication Issues

- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your app URL
- Clear browser cookies

### Payment Issues

- Verify Stripe keys are correct
- Check Stripe is in test mode
- Verify webhook URL is configured

## Next Steps

1. Customize branding (colors, logo, etc.)
2. Add real restaurant data
3. Configure email notifications
4. Set up analytics
5. Deploy to production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.
