<div align="center">
  <h1>📖 Scripture Spot</h1>
  <p><em>A modern, full-stack Bible study platform built with Next.js</em></p>
  
  <p>
    <strong>Explore Scripture • Discover Insights • Deepen Your Faith</strong>
  </p>

  <p>
    <a href="https://scripture-spot-frontend.vercel.app">🌐 Live Site</a> •
    <a href="https://github.com/WebatlasDev/ScriptureSpotWebApp">📦 Repository</a> •
    <a href="https://scripture-spot-backend.vercel.app/api/docs">📚 API Docs</a>
  </p>
</div>

---

## 🌟 Welcome

Scripture Spot is a comprehensive Bible study application designed to help you engage with Scripture in meaningful ways. Whether you're reading daily verses, exploring commentaries from renowned theologians, or searching for specific passages, Scripture Spot provides a seamless and enriching experience.

This repository houses both the frontend and backend of the application, built with modern technologies and best practices.

---

## ✨ Key Features

- 🔍 **Advanced Search** - Find verses, commentaries, and authors with ease
- 📚 **Multiple Bible Versions** - Read from various translations
- 💡 **Rich Commentaries** - Access insights from historical and contemporary authors
- 🔖 **Bookmarks & Notes** - Save and organize your favorite passages
- 🎯 **Study Plans** - Structured reading plans to guide your journey
- 🔐 **Secure Authentication** - Safe and personalized user experience
- 📱 **Responsive Design** - Works beautifully on any device

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v15 or higher)

### Quick Start Guide

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/WebatlasDev/ScriptureSpotWebApp.git
cd ScriptureSpotWebApp-master
```

#### 2️⃣ Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the API server
npm run dev
```

The backend API will be running at `http://localhost:5002`

#### 3️⃣ Set Up the Frontend

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.development
# Edit .env.development with your configuration

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 🏗️ Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **Material-UI & Radix UI** | Component libraries for beautiful UI |
| **Redux Toolkit** | State management |
| **React Query** | Server state management |
| **Clerk** | Authentication & user management |
| **PostHog** | Product analytics |
| **Stripe** | Payment processing |
| **Emotion** | CSS-in-JS styling |

### Backend

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | API routes & server-side logic |
| **PostgreSQL** | Primary database |
| **Prisma ORM** | Type-safe database access |
| **Clerk** | Authentication |
| **Elasticsearch** | Full-text search capabilities |
| **Redis** | Caching layer |
| **Resend** | Transactional emails |
| **Clean Architecture** | CQRS pattern for maintainability |

---

## 📂 Project Structure

```
ScriptureSpotWebApp-master/
│
├── 📁 frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries
│   │   └── styles/             # Global styles
│   └── package.json
│
├── 📁 backend/                  # Next.js API backend
│   ├── src/
│   │   ├── app/api/           # API route handlers
│   │   ├── application/        # Business logic (CQRS)
│   │   ├── domain/             # Domain entities
│   │   ├── infrastructure/     # External services
│   │   └── lib/                # Utility libraries
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/         # Database migrations
│   └── package.json
│
└── README.md                    # You are here!
```

---

## 📊 API Implementation Status

We've successfully migrated our .NET backend to Node.js! Here's where we stand:

| Feature | Status | Progress |
|---------|--------|----------|
| Bible APIs | ✅ Complete | 10/10 |
| Exploration APIs | ✅ Complete | 4/4 |
| User APIs | ✅ Complete | 4/4 |
| Forms APIs | ✅ Complete | 4/4 |
| Search & SEO | 🟡 Nearly Complete | 3/4 |
| Authors/Commentary | 🟡 In Progress | 1/5 |
| Admin Tools | ⚪ Optional | 0/15 |

**Overall Progress: ~80% Complete** 🎉

---

## 🗄️ Database Setup

### Using Docker (Recommended)

The easiest way to set up your development environment is using Docker:

```bash
cd backend/docker
docker-compose up -d
```

This will start:
- PostgreSQL on port `5433`
- Redis on port `6379`
- Elasticsearch on port `9200`

### Manual Setup

If you prefer manual setup, install PostgreSQL locally and update your `.env.local` file with the connection string.

### Running Migrations

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

---

## 🔑 Environment Configuration

Both applications require environment variables. Copy the example files and configure with your credentials:

```bash
# Backend
cp backend/.env.example backend/.env.local

# Frontend  
cp frontend/.env.example frontend/.env.development
```

### Backend (`backend/.env.local`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/scripturespot"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Email Service (Resend)
RESEND_API_KEY="re_..."

# Optional: Redis & Elasticsearch
REDIS_URL="redis://localhost:6379"
ELASTICSEARCH_URL="http://localhost:9200"
```

### Frontend (`frontend/.env.development`)

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:5002"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
```

---

## 📚 Documentation & Resources

- 📖 [API Documentation (Swagger)](https://scripture-spot-backend.vercel.app/api/docs) - Interactive API explorer (Live)
- 📖 [Local API Docs](http://localhost:5002/api/docs) - When running backend locally
- 🎨 [Frontend Guide](frontend/README.md) - Component documentation
- ⚙️ [Backend Guide](backend/README.md) - API architecture details
- 🗃️ [Database Schema](backend/prisma/schema.prisma) - Complete data model

---

## 🚀 Deployment

### 🌐 Production

The application is live and deployed on Vercel:

- **Frontend**: [scripture-spot-frontend.vercel.app](https://scripture-spot-frontend.vercel.app)
- **Backend API**: [scripture-spot-backend.vercel.app](https://scripture-spot-backend.vercel.app)

### Deploying Your Own Instance

#### Frontend

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Select the `frontend` directory as the root
3. Configure environment variables from `.env.development`
4. Deploy!

#### Backend

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Select the `backend` directory as the root
3. Add your production PostgreSQL database URL
4. Configure all required environment variables
5. Deploy!

**Alternative Platforms**: Railway, Render, Azure, AWS

---

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug reports
- 💡 Feature suggestions
- 📝 Documentation improvements
- 🔧 Code contributions

Please open an issue or submit a pull request on [GitHub](https://github.com/WebatlasDev/ScriptureSpotWebApp).

---

## 💬 Support

Need help? Have questions?
- 📖 Check the [Frontend Documentation](frontend/README.md) or [Backend Documentation](backend/README.md)
- 🔍 Review the [API Documentation](https://scripture-spot-backend.vercel.app/api/docs)
- 🐛 [Open an issue on GitHub](https://github.com/WebatlasDev/ScriptureSpotWebApp/issues)
- 💬 Visit the live site: [scripture-spot-frontend.vercel.app](https://scripture-spot-frontend.vercel.app)

---

<div align="center">
  <p>Built with ❤️ for the Bible study community</p>
  <p><em>May this tool help you grow in knowledge and faith</em></p>
</div>

