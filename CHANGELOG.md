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
- Video rendering pipeline with BullMQ workers:
  - Script generation service with OpenAI integration
  - Text-to-speech service with multiple TTS provider support
  - Worker orchestration with progress tracking
  - Job queues for asynchronous video processing
  - Database integration for project status updates

### In Development
- Asset selection and video composition services
- Stripe billing integration
- Affiliate system UI
- Admin dashboard

### Planned Features
- FFmpeg video composition integration
- Asset management and selection
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