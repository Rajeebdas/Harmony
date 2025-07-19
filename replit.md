# MusicStream - Music Streaming Platform

## Overview

MusicStream is a full-stack music streaming web application built with a modern tech stack. It features user authentication via Replit Auth, a React frontend with shadcn/ui components, and an Express backend with PostgreSQL database using Drizzle ORM. The application allows users to discover music, browse artists, listen to songs and podcasts, and manage playlists.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with JSON responses

### Database Architecture
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema**: Includes tables for users, artists, songs, podcasts, playlists, featured content, and user favorites
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Authentication System
- **Provider**: Replit Auth (mandatory for Replit deployment)
- **Flow**: OpenID Connect with automatic user provisioning
- **Session Storage**: PostgreSQL-backed sessions with TTL
- **Security**: HTTP-only cookies, CSRF protection, secure session handling

### Data Models
- **Users**: Profile information linked to Replit accounts
- **Artists**: Musician profiles with bio and images
- **Songs**: Audio tracks with metadata and artist relationships
- **Podcasts**: Audio content with episodes and hosts
- **Playlists**: User-curated song collections
- **Featured Content**: Promotional content for discovery
- **User Favorites**: Bookmarked content for users

### UI Components
- **Design System**: Custom CSS variables for theming
- **Component Library**: Comprehensive set of reusable UI components
- **Responsive Design**: Mobile-first approach with breakpoint management
- **Accessibility**: ARIA labels and keyboard navigation support

### Music Player
- **Audio Controls**: Play, pause, skip, volume, shuffle, repeat
- **Progress Tracking**: Real-time playback position
- **Queue Management**: Next/previous track functionality
- **Visual Feedback**: Album art and track information display

## Data Flow

### Authentication Flow
1. User visits landing page
2. Clicks "Sign In" → redirects to `/api/login`
3. Replit Auth handles OAuth flow
4. User profile created/updated in database
5. Session established with PostgreSQL store
6. User redirected to authenticated home page

### Content Discovery Flow
1. Frontend components query API endpoints
2. React Query manages caching and background updates
3. Express routes handle API requests
4. Storage layer queries database via Drizzle ORM
5. Results formatted and returned to frontend
6. UI updates with loading states and error handling

### Music Playback Flow
1. User selects song from any section
2. Music player component receives track data
3. Audio element loads and begins playback
4. Progress updates managed via React state
5. Player controls modify playback state
6. Visual feedback updates in real-time

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **express**: Web application framework
- **react**: Frontend UI library
- **tailwindcss**: Utility-first CSS framework

### Authentication Dependencies
- **openid-client**: OpenID Connect implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### UI Dependencies
- **@radix-ui/***: Headless UI primitives
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **react-hook-form**: Form state management

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for fast development
- **Express Server**: API and static file serving
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: Database URL and session secrets

### Production Build
- **Frontend**: Vite builds optimized React bundle
- **Backend**: esbuild compiles TypeScript to ESM
- **Assets**: Static files served from Express
- **Database**: Drizzle migrations applied on deployment

### Replit Integration
- **Deployment**: Automatic deployment on Replit
- **Authentication**: Integrated with Replit user accounts
- **Development Tools**: Replit-specific debugging and monitoring
- **Environment**: Configured for Replit hosting environment

### Performance Optimizations
- **Bundle Splitting**: Vite automatically splits vendor chunks
- **Image Optimization**: Fallback handling for missing images
- **Caching**: React Query handles intelligent data caching
- **Database**: Connection pooling and optimized queries