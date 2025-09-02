# Changelog

All notable changes to ClipForge AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-02

### Added
- Complete pnpm monorepo structure with apps/web, apps/worker, packages/*
- Next.js 14 application with App Router and TypeScript
- TailwindCSS + shadcn/ui design system with theme support
- Development tooling (ESLint, Prettier, TypeScript strict mode)
- Turborepo configuration for build orchestration
- Marketing site components:
  - Hero section with animated CTAs
  - Video carousel with sample content
  - Social proof with user avatars and ratings
  - Feature grid showcasing AI capabilities
  - How it works step-by-step process
  - Pricing tiers with monthly/yearly toggle
  - Call-to-action section with gradient background
- Reusable UI components:
  - Button with variants and animations
  - Card, Badge, Avatar, Switch components
  - Toast notification system
  - Navigation menu with dropdowns
- Layout components (Header with navigation, Footer with links)
- Theme provider with light/dark mode support
- Framer Motion integration for micro-animations
- Project documentation (TODO.md, CHANGELOG.md)
- NextAuth authentication system with Google, GitHub, and Email providers
- Complete Prisma database schema with user management, projects, billing, and affiliate models
- Database package with migration and seed scripts
- Complete dashboard application with:
  - Protected dashboard layout with navigation
  - Overview page with stats and recent projects
  - Projects listing with status tracking and actions
  - Project creation wizard with template selection
  - Dropdown menus and advanced UI components
- Full production dependency stack including:
  - NextAuth for authentication
  - Prisma for database management
  - Stripe for billing integration
  - BullMQ for job queues
  - React Hook Form with Zod validation
  - Upstash Redis for rate limiting
  - Resend for email notifications
- Complete video rendering pipeline with BullMQ workers:
  - Script generation service with OpenAI integration
  - Text-to-speech service with multiple TTS provider support
  - Asset selection service with Pexels/Unsplash API integration
  - Video composition service with FFmpeg integration
  - Worker orchestration with progress tracking
  - Job queues for asynchronous video processing
  - Database integration for project status updates
- Environment configuration template (.env.example) with all required variables:
  - Database, Redis, and API service configurations
  - OAuth provider settings (Google, GitHub)
  - Payment processing (Stripe) configuration
  - AI service integrations (OpenAI, ElevenLabs, Azure Speech)
  - Asset API configurations (Pexels, Unsplash)
- Complete Stripe billing integration:
  - Stripe client configuration with error handling
  - Credit packages pricing structure (10, 50, 100, 500 credits)
  - Subscription plans (Starter, Pro with monthly/yearly options)
  - TypeScript types for packages and plans
  - Checkout API route with customer creation and session handling
  - Webhook handler for payment processing and credit allocation
  - Support for one-time purchases and recurring subscriptions
  - Automatic credit ledger tracking for all transactions
- Database schema enhancements:
  - Added subscription status and pricing fields to User model
  - Formatted and validated Prisma schema structure
  - Enhanced billing integration compatibility
- Docker infrastructure setup:
  - PostgreSQL database container with health checks
  - Redis container for BullMQ job queues with persistence
  - Redis Insight for monitoring and debugging
  - Complete development environment orchestration
- Vercel deployment configuration:
  - Production build and deployment settings
  - Environment variable mapping for secure secrets
  - API route configuration with extended timeouts for webhooks
  - Next.js framework optimization settings

### In Development
- Affiliate system UI
- Admin dashboard

### Planned Features
- Export functionality with credit system
- Multi-tier subscription model
- Referral tracking system
- Real-time rendering progress
- Cloud storage integration
- Email notifications

## [0.0.1] - 2025-09-01

### Added
- Initial repository creation
- Project planning documentation