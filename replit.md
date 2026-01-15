# Resume Create - AI-Powered Resume Builder

## Overview

Resume Create is a full-stack web application that generates professional, ATS-optimized resumes and cover letters using AI. Users input their professional information through a multi-step wizard interface, and the application uses OpenAI to generate tailored resume content, provide ATS compatibility scores, and offer improvement suggestions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Hook Form for form state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth step transitions
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

The frontend follows a page-based structure with three main views:
- Home (dashboard with resume history)
- Builder (multi-step form wizard)
- Result (generated resume display with ATS analysis)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: REST endpoints defined in shared/routes.ts with Zod schema validation
- **AI Integration**: OpenAI via Replit AI Integrations for resume generation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

The server handles resume creation by:
1. Validating input against Zod schemas
2. Saving initial user data to the database
3. Calling OpenAI to generate resume content, cover letter, ATS score, and suggestions
4. Updating the database with generated content

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: shared/schema.ts
- **Main Table**: `resumes` storing user input and AI-generated content
- **Supporting Tables**: `conversations` and `messages` for chat functionality (in shared/models/chat.ts)

The resume schema includes:
- Personal information fields (name, email, phone, location)
- Professional content (experience, skills, education, projects)
- Target job details (title, description, instructions)
- Design preferences (template, color theme)
- Generated outputs (resume markdown, cover letter, ATS score, suggestions)

### Build System
- **Development**: tsx for TypeScript execution with Vite dev server
- **Production**: Custom build script (script/build.ts) using esbuild for server bundling and Vite for client
- **Database Migrations**: drizzle-kit push for schema synchronization

## External Dependencies

### AI Services
- **OpenAI API**: Accessed via Replit AI Integrations (environment variables: AI_INTEGRATIONS_OPENAI_API_KEY, AI_INTEGRATIONS_OPENAI_BASE_URL)
- Used for generating resume content, cover letters, ATS analysis, and improvement suggestions

### Database
- **PostgreSQL**: Connection via DATABASE_URL environment variable
- **Connection Pool**: pg (node-postgres) with Drizzle ORM wrapper

### Key NPM Packages
- **UI Components**: Full shadcn/ui component library with Radix UI primitives
- **Charts**: Recharts for ATS score visualization (RadialBarChart)
- **Markdown**: react-markdown for rendering generated resume content
- **Forms**: react-hook-form with @hookform/resolvers for Zod integration
- **Date Handling**: date-fns for timestamp formatting

### Replit Integrations
The project includes pre-built integration modules in `server/replit_integrations/`:
- `batch/`: Rate-limited batch processing utilities for LLM calls
- `chat/`: Chat conversation storage and routes
- `image/`: Image generation endpoints using gpt-image-1

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key from Replit
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: OpenAI base URL from Replit