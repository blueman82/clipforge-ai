# ClipForge AI - Faceless Video Generation Platform

A complete SaaS platform for AI-powered faceless video generation with marketing site, authentication, billing, and video rendering pipeline.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### 1. Clone and Install
```bash
git clone <repo-url>
cd clipforge-ai
pnpm install
```

### 2. Start Infrastructure
```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Wait for services to be healthy
docker-compose ps
```

### 3. Set up Database
```bash
# Generate Prisma client
cd packages/database
pnpm db:generate

# Run migrations
pnpm db:migrate

# Optional: Seed database
pnpm db:seed
```

### 4. Start Development Server
```bash
# From root directory
pnpm dev

# Or start specific apps
pnpm --filter @clipforge/web dev
pnpm --filter @clipforge/worker dev
```

### 5. Access the Application
- **Web App**: http://localhost:3000
- **Database Studio**: `pnpm --filter @clipforge/database db:studio`
- **Redis Insight**: http://localhost:8001 (optional)

## 🏗️ Architecture

### Monorepo Structure
```
clipforge-ai/
├── apps/
│   ├── web/          # Next.js 14 web application
│   └── worker/       # BullMQ video processing workers
├── packages/
│   ├── database/     # Prisma schema & migrations  
│   └── ui/           # Shared UI components
└── docker-compose.yml # Development infrastructure
```

### Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Queue**: BullMQ + Redis
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Video**: FFmpeg processing pipeline
- **AI**: OpenAI (scripts), ElevenLabs/Azure (TTS)

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env.local` and configure:

**Required for basic functionality:**
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Authentication secret
- `REDIS_URL` - Redis connection

**Required for full features:**
- `STRIPE_*` - Payment processing
- `OPENAI_API_KEY` - Script generation
- `GOOGLE_CLIENT_*` / `GITHUB_CLIENT_*` - OAuth

### Database Schema
The platform includes complete models for:
- User management & authentication
- Project & video management  
- Billing & credit system
- Affiliate program
- Admin analytics

## 🎬 Video Generation Pipeline

1. **Script Generation** - AI-powered content creation
2. **Text-to-Speech** - Multiple TTS providers
3. **Asset Selection** - Automated video/image sourcing
4. **Video Composition** - FFmpeg-based rendering
5. **Export System** - Credit-based downloads

## 💳 Billing System

### Credit Packages
- 10 Credits - $9
- 50 Credits - $39 (20% savings)
- 100 Credits - $69 (30% savings)  
- 500 Credits - $299 (40% savings)

### Subscription Plans
- **Starter**: 100 credits/month - $29/mo
- **Pro**: 500 credits/month - $79/mo

## 📊 Features Implemented

### ✅ Core Platform
- [x] Complete marketing site with pricing
- [x] User authentication (Google, GitHub, Email)
- [x] Project dashboard and management
- [x] Video rendering pipeline
- [x] Stripe billing integration
- [x] Credit system with ledger tracking

### 🚧 In Development  
- [ ] Affiliate system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] API access
- [ ] Custom branding

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin feature/build-clipforge-saas

# Deploy via Vercel dashboard or CLI
vercel --prod
```

### Environment Setup
1. **Database**: Use Neon, PlanetScale, or Vercel Postgres
2. **Redis**: Use Upstash Redis
3. **Configure environment variables** in Vercel dashboard

## 🛠️ Development

### Commands
```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Database
pnpm --filter @clipforge/database db:migrate
pnpm --filter @clipforge/database db:studio

# Linting  
pnpm lint
pnpm typecheck
```

### Debugging
- **Database**: Access Prisma Studio at http://localhost:5555
- **Redis**: Use Redis Insight at http://localhost:8001
- **Logs**: Check Docker logs with `docker-compose logs -f`

## 📋 Project Status

**Current Status**: 95% MVP Complete
- ✅ Full-stack SaaS platform
- ✅ Video generation pipeline  
- ✅ Billing & authentication
- ✅ Production deployment ready

**Next Phase**: Complete affiliate system, admin dashboard, and advanced features.

---

Built with ❤️ using Next.js, Prisma, and modern web technologies.