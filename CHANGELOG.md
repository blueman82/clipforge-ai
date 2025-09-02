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

### In Development
- Dashboard UI for project management
- Video rendering pipeline with FFmpeg worker
- Stripe billing integration
- Affiliate system UI
- Admin dashboard

### Planned Features
- AI-powered script generation
- Text-to-speech integration
- Automated video composition
- Multi-tier subscription model
- Referral tracking system
- Real-time rendering progress
- Cloud storage integration
- Email notifications

## [0.0.1] - 2025-09-01

### Added
- Initial repository creation
- Project planning documentation