# Scripture Spot - Full Stack Application

This repository contains the complete Scripture Spot application with both frontend and backend.

## 📂 Project Structure

```
ScriptureSpotWebApp-master/
├── frontend/              # Next.js frontend application (port 3000)
├── backend/               # Next.js API backend (port 5002)
├── ScriptureSpotAPI-master/    # Original .NET API (reference)
├── next-scripture-spot/        # Original conversion work (reference)
└── CONVERSION_STATUS.md   # Detailed conversion analysis
```

## 🚀 Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

For more details, see the [frontend README](frontend/README.md).

### Backend API Development

```bash
cd backend
npm install
npm run dev
```

The API will be available at `http://localhost:5002`

For more details, see the [backend README](backend/README.md).

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI**: Material-UI + Radix UI + Emotion
- **State**: Redux Toolkit + React Query
- **Auth**: Clerk
- **Analytics**: PostHog
- **Payments**: Stripe

### Backend
- **Framework**: Next.js 14 API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Clerk
- **Search**: Elasticsearch
- **Caching**: Redis
- **Email**: Resend
- **Architecture**: Clean Architecture with CQRS

## 📊 Conversion Status

The .NET backend has been converted to Next.js with **~80% completion**:

- ✅ All Bible APIs (10/10)
- ✅ All Exploration APIs (4/4) 
- ✅ All User APIs (4/4)
- ✅ All Forms APIs (4/4)
- ✅ Search & SEO (3/4)
- ⚠️ Authors Commentary APIs (1/5) - **Needs completion**
- ❌ Admin/Import tools (0/15) - Optional

See [CONVERSION_STATUS.md](CONVERSION_STATUS.md) for detailed breakdown.

## 🔧 Development Workflow

1. **Start Backend API**:
   ```bash
   cd backend
   npm run dev  # Runs on port 5002
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev  # Runs on port 3000
   ```

3. **Frontend** connects to backend at `http://localhost:5002/api`

## 📚 Documentation

- [Backend API Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [API Conversion Status](CONVERSION_STATUS.md)
- [Swagger UI](http://localhost:5002/api/docs) (when backend running)

## 🗄️ Database Setup

The backend requires PostgreSQL. See [backend/README.md](backend/README.md) for setup instructions.

## 🔑 Environment Variables

Each app requires its own `.env` files:

- **Frontend**: `frontend/.env.development`
- **Backend**: `backend/.env.local`

Copy the `.env.example` files and fill in your values.

## 🚢 Deployment

### Frontend
- Deploy to Vercel/Azure Static Web Apps
- See GitHub Actions workflows in `.github/workflows/`

### Backend
- Deploy to Vercel/Railway/Render
- Ensure DATABASE_URL and other env vars are configured

## 📝 Deployment

The project uses Azure Static Web Apps for deployment. Deployment is automated through GitHub Actions.

