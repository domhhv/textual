# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run typecheck        # TypeScript checking
npm run eslint:check     # Linting (runs in prebuild)
npm run eslint:fix       # Auto-fix linting issues
npm run prettier:check   # Format checking (runs in prebuild)
npm run prettier:write   # Auto-format code
```

**Important**: Always run `npm run typecheck` and `npm run eslint:check` and `npm run prettier:fix` after making changes. These are part of the prebuild process and must pass for production builds.

## Architecture Overview

**Textual** is a Next.js 15 application that combines a Lexical rich-text editor with OpenAI's GPT-4o for AI-powered content editing. The app uses a split-pane interface with a chat sidebar for AI interactions.

### Key Technologies

- **Framework**: Next.js 15 with App Router and Turbopack
- **Editor**: Lexical 0.35.0 (Facebook's rich text editor)
- **AI**: Vercel AI SDK with OpenAI integration and tool calling
- **Styling**: Tailwind CSS v4 with OKLCH color system
- **UI**: Radix UI primitives + shadcn/ui (New York style)

### Core Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/chat/route.ts  # AI chat endpoint with tool calling
│   ├── page.tsx           # Main resizable panel layout
│   └── layout.tsx         # Root layout with theme provider
├── components/
│   ├── chat/              # Chat interface with streaming
│   ├── editor/            # Lexical editor + plugins
│   ├── providers/         # Context providers (chat, toolbar)
│   └── ui/                # shadcn/ui components
|   |__ custom/            # Custom UI components
└── lib/
    ├── models/editor-commands.ts  # AI tool definitions
    ├── constants/                 # Various constant variables: editor configs, UI texts, etc.
    ├── utils/                     # Utility functions (API calls, editor commands)
    └── hooks/                     # Custom React hooks
```

## AI Tool Integration

The application implements structured AI tool calling:

- **Tool Definitions**: `src/lib/models/editor-commands.ts` defines commands for text manipulation
- **Execution**: Tools can insert paragraphs, edit existing text, and format selections
- **Real-time Updates**: UI reflects changes during AI processing via streaming

Key files for AI functionality:

- `src/app/api/chat/route.ts` - Server-side AI endpoint
- `src/components/chat/chat.tsx` - Chat interface with tool execution
- `src/lib/utils/editor-commands.ts` - Editor command utilities

## State Management

- **Lexical State**: Editor state managed by Lexical framework
- **Chat State**: Vercel AI SDK handles conversation and tool calling
- **Theme State**: next-themes for dark/light mode switching
- **Custom Providers**: Chat status and toolbar state via React Context

## Configuration & Setup

### Environment Requirements

- **Node.js**: 24.8.0+ (strict engine requirement)
- **Environment Variable**: `OPENAI_API_KEY` required (see `.env.example`)

### Code Quality Setup

The project has comprehensive linting and formatting:

- **ESLint**: 15+ plugins including Lexical-specific rules
- **Prettier**: Tailwind integration, single quotes, 2-space indentation
- **Husky**: Pre-commit hooks run quality checks
- **Commitlint**: Enforces conventional commit messages

### Important Conventions

- **Imports**: Use `@/*` path aliases, alphabetical sorting required
- **Components**: Function declarations preferred over arrow functions
- **Colors**: Use OKLCH color system with CSS custom properties
- **Export Style**: Default exports preferred for components, utils, hooks, and constants
- **Component Location**: Keep shadcn primitives in `ui/`, custom components that build upon them in `ui/custom/`
- **File Naming**: Use lowercase with hyphens for files and directories
- **Types Inference**: Prefer inferred types over explicit annotations where possible
