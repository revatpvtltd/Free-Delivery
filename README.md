# FD Delivery - Food Delivery Platform

A modern, production-ready food delivery platform similar to Zomato or Uber Eats, built with Next.js, TypeScript, PostgreSQL, and Tailwind CSS.

## Features

### Customer Features
- 🍕 Browse restaurants and view live menus
- 📱 View food preparation times
- 🛒 Add items to cart and place orders
- 📍 Real-time order tracking
- 💳 Secure payment processing
- 🌍 Multi-language and multi-currency support
- 📱 Responsive design for all devices

### Admin Features
- 🏪 Manage restaurant partners
- 📦 Manage orders and order status
- 🚚 Manage delivery partners
- 📊 Analytics and reporting
- 👥 User management
- 💰 Payment management
- 🎨 Menu management

### Restaurant Owner Features
- 📝 Manage restaurant menu
- 📊 View order analytics
- 🔔 Order notifications
- ⏰ Update restaurant hours and status

### Delivery Partner Features
- 📍 Real-time location tracking
- 📦 View assigned orders
- 🗺️ Navigation to delivery locations
- ✅ Mark orders as delivered

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Real-time**: Socket.io (for order tracking)
- **Payments**: Stripe
- **Internationalization**: i18next

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Stripe account (for payments)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd fd-delivery
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fd_delivery?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_MAP_API_KEY="your-google-maps-api-key"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-password"
```

### 4. Set Up the Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### 5. Add Your Logo

1. Place your logo file in the `public` folder (e.g., `public/logo.png`)
2. Update `components/Logo.tsx` to use the actual logo image
3. Update `components/Header.tsx` to use the Logo component if desired

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Free Hosting Options

#### Option 1: Vercel (Recommended for Next.js)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Set up PostgreSQL Database**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (free tier available)
   - Or use [Supabase](https://supabase.com) (free PostgreSQL)
   - Or use [Neon](https://neon.tech) (free serverless PostgreSQL)

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Click "Deploy"

4. **Configure Environment Variables in Vercel**
   - Go to Project Settings > Environment Variables
   - Add all variables from your `.env` file
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel domain

5. **Get Free Domain**
   - Vercel provides a free subdomain: `your-project.vercel.app`
   - You can also use a custom domain (free with some providers)

#### Option 2: Render

1. **Set up PostgreSQL on Render**
   - Create a new PostgreSQL database
   - Copy the connection string

2. **Deploy Web Service**
   - Create a new Web Service
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Start command: `npm start`
   - Add environment variables

3. **Get Free Domain**
   - Render provides a free subdomain: `your-project.onrender.com`

#### Option 3: Netlify + External PostgreSQL

1. **Set up PostgreSQL** (use Supabase, Neon, or ElephantSQL)
2. **Deploy to Netlify**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables

### Database Setup for Production

#### Using Supabase (Free PostgreSQL)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update `DATABASE_URL` in your environment variables

#### Using Neon (Free Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in your environment variables

### Environment Variables for Production

Make sure to set these in your hosting platform:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-key"
STRIPE_SECRET_KEY="your-stripe-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## Project Structure

```
fd-delivery/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── auth/              # Authentication pages
│   ├── orders/            # Order pages
│   ├── restaurants/       # Restaurant pages
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Prisma schema and migrations
├── public/                # Static files
└── types/                 # TypeScript types
```

## Key Features Implementation

### Authentication
- Sign up/Sign in with email and password
- Role-based access control (Customer, Restaurant Owner, Admin, Delivery Partner)
- Session management with NextAuth.js

### Order Management
- Create orders with items
- Real-time order tracking
- Order status updates
- Order history

### Restaurant Management
- Browse restaurants
- View menus with categories
- Filter by cuisine, city, etc.
- Restaurant details and reviews

### Admin Dashboard
- View statistics and analytics
- Manage restaurants
- Manage orders
- Manage users
- Manage delivery partners

## Database Schema

The database includes models for:
- Users (customers, restaurant owners, admins, delivery partners)
- Restaurants
- Menu items and categories
- Orders and order items
- Deliveries and tracking
- Payments
- Reviews
- Notifications

See `prisma/schema.prisma` for the complete schema.

## Development

### Run Database Studio

```bash
npm run db:studio
```

### Create a Migration

```bash
npm run db:migrate
```

### Generate Prisma Client

```bash
npm run db:generate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push
5. Create a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@fddelivery.com or create an issue in the repository.

## Acknowledgments

- Built with Next.js and TypeScript
- Styled with Tailwind CSS
- Icons from Lucide React
- Database management with Prisma
