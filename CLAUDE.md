# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server (Next.js app at http://localhost:3000, Sanity Studio at http://localhost:3000/studio)
- `pnpm build` - Build the Next.js application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking (no emit)

### Sanity
- `pnpm typegen` - Regenerate Sanity types (extracts schema and generates TypeScript types)
- `npx sanity dataset import sample-data.tar.gz production --replace` - Import sample data
- `npx sanity schema extract` - Extract Sanity schema to schema.json
- `npx sanity typegen generate` - Generate TypeScript types from schema

## Architecture Overview

This is a **Next.js 15 + Sanity CMS starter** using the **Schema UI** architecture pattern. The project follows a composable, block-based content management approach.

### Tech Stack
- **Next.js 15** with App Router
- **Sanity CMS** for content management with Visual Editing
- **TypeScript** throughout
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Radix UI** primitives
- **Resend** for newsletter functionality

### Key Architecture Patterns

#### 1. Block-Based Content System
- Pages are composed of reusable "blocks" (hero, grid, split, carousel, etc.)
- Each block has a Sanity schema definition and corresponding React component
- Blocks are organized hierarchically with parent-child relationships

#### 2. Component Structure
```
components/
├── blocks/           # Main content blocks
│   ├── hero/        # Hero sections (hero-1, hero-2)
│   ├── grid/        # Grid layouts with cards
│   ├── split/       # Split-column layouts
│   ├── carousel/    # Carousels
│   └── ...
├── ui/              # shadcn/ui components
└── header/          # Navigation components
```

#### 3. Sanity Schema Organization
```
sanity/schemas/
├── blocks/          # Content block schemas
│   ├── shared/     # Reusable schema components
│   ├── hero/       # Hero block types
│   ├── grid/       # Grid block types
│   └── ...
└── documents/      # Document types (page, post, etc.)
```

#### 4. Dynamic Component Mapping
Parent blocks use `componentMap` objects to dynamically render child components:

```tsx
const componentMap: {
  [K in ChildType["_type"]]: React.ComponentType<Extract<ChildType, { _type: K }>>;
} = {
  "child-type-1": ChildComponent1,
  "child-type-2": ChildComponent2,
};
```

#### 5. GROQ Query Composition
- Queries are modular and composed from reusable fragments
- Each block type has its own query fragment
- Main queries compose these fragments together
- Use SCREAMING_SNAKE_CASE for query variable names

### Important Conventions

#### Schema Development
- Use `defineType`, `defineField`, and `defineArrayMember` helpers
- Include appropriate Lucide React icons for all schema types
- Create custom preview configurations for better Studio UX
- Use groups for organizing fields in complex schemas
- Reusable schema types go in the `shared/` folder

#### Component Development  
- Extract TypeScript types from generated Sanity types (`sanity.types.ts`)
- Use `stegaClean` from `next-sanity` to clean Sanity values
- Implement proper error boundaries for missing component mappings
- Follow the parent-child component pattern for complex blocks

#### Environment Variables
Key environment variables (see README.md for full list):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset name
- `SANITY_API_READ_TOKEN` - Read token for data fetching
- `NEXT_PUBLIC_SITE_ENV` - Controls indexing behavior

### File Locations
- Main app pages: `app/(main)/` 
- Sanity Studio: `app/studio/`
- Components: `components/`
- Sanity configuration: `sanity.config.ts`
- Type generation: `sanity.types.ts` (auto-generated)
- Cursor rules: `.cursor/rules/sanity-schemaui.mdc`