# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Workflow

```bash
npm run dev              # Start dev server with Turbopack
npm run build            # Production build (runs prebuild checks first)
npm run typecheck        # TypeScript type checking
npm run eslint:check     # Lint codebase
npm run eslint:fix       # Auto-fix linting issues
npm run prettier:check   # Check code formatting
npm run prettier:write   # Auto-format code
```

### Pre-build Requirements

The `prebuild` script runs automatically before `build` and executes:

1. `npm run typecheck`
2. `npm run eslint:check`
3. `npm run prettier:check`

**Critical**: Always run `npm run typecheck`, `npm run eslint:fix`, and `npm run prettier:write` after making changes. All three must pass for production builds.

### Git Workflow

- **Pre-commit hooks**: Husky runs lint-staged checks automatically
- **Commit messages**: Must follow conventional commits format (enforced by commitlint)
  - Format: `<type>(<scope>): <subject>`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - Example: `feat(editor): add table insertion command`
  - Scope and type must be lowercase; subject may use PascalCase/camelCase for proper nouns

## Architecture Overview

**Textual** is an AI-powered rich text editor built with Next.js 16 that combines Lexical editor with OpenAI's GPT models for intelligent, contextual content editing. The key innovation is using structured AI tool calling for precise text manipulation rather than full document regeneration.

### Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Editor**: Lexical 0.35.0 (Facebook's extensible rich text framework)
- **AI Integration**: Vercel AI SDK with OpenAI GPT tool calling
- **Styling**: Tailwind CSS v4 with OKLCH color system
- **UI Components**: Radix UI primitives + shadcn/ui (New York style)
- **Type Safety**: TypeScript with Zod schemas
- **Monitoring**: Sentry error tracking, PostHog analytics

### Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # AI endpoint with streaming + tool execution
│   ├── page.tsx               # Main resizable split-pane layout
│   └── layout.tsx             # Root layout with theme provider
├── components/
│   ├── chat/                  # Chat UI with streaming message rendering
│   ├── editor/                # Lexical editor + plugins
│   ├── providers/             # React Context providers (chat, toolbar, API key)
│   ├── ui/                    # shadcn/ui primitive components
│   ├── custom/                # Custom components built on shadcn primitives
│   ├── layout/                # Layout components (header, split pane)
│   └── icons/                 # SVG icon components
└── lib/
    ├── models/editor-commands.ts       # AI tool definitions (Zod schemas)
    ├── utils/editor-commands.ts        # Editor command utilities
    ├── utils/execute-editor-command.ts # Command execution in Lexical
    ├── constants/                      # Config constants, UI text, etc.
    ├── hooks/                          # Custom React hooks
    └── styles/                         # Global SCSS (for non-Tailwind styles)
```

## Core Architectural Patterns

### AI Tool Calling System

The application uses structured tool calling for precise editor manipulation:

1. **Tool Definitions** (`src/lib/models/editor-commands.ts`):
   - `insertParagraph`: Insert new paragraph at specific location
   - `editParagraph`: Replace text in existing paragraph
   - `formatText`: Apply formatting (bold, italic, etc.) to text selection
   - Each tool has Zod input/output schemas for type safety

2. **Server-side Execution** (`src/app/api/chat/route.ts`):
   - Streams responses using Vercel AI SDK
   - Injects editor context (markdown + node tree JSON) into system prompt
   - Tools return updated editor state for client synchronization
   - Uses `stopWhen: stepCountIs(5)` to limit AI steps

3. **Client-side Tool Execution** (`src/components/chat/chat.tsx`):
   - Executes tools in the Lexical editor
   - Updates editor state in real-time during streaming
   - Synchronizes chat and editor state via React Context

### Lexical Editor Architecture

- Editor state managed by Lexical framework
- Plugins registered in `src/components/editor/editor.tsx`
- Custom plugins in `src/components/editor/plugins/`
- Commands executed via Lexical's command system
- Node keys used for precise targeting in AI commands

### State Management

- **Editor State**: Lexical framework handles editor state
- **Chat State**: Vercel AI SDK `useChat` hook manages conversation
- **Theme State**: `next-themes` for dark/light mode
- **Custom Context Providers**:
  - Chat status provider: Tracks AI processing state
  - Toolbar provider: Editor toolbar state
  - API key provider: User-provided OpenAI key (optional)
  - Mobile layout provider: Responsive UI state

### Environment Configuration

- **Required**: `OPENAI_API_KEY` (can also be set in UI)
- **Optional**: User can provide their own API key via settings dialog
- Configuration file: `.env.local` (copy from `.env.example`)

## Code Conventions

### File & Directory Naming

- Use lowercase with hyphens: `editor-commands.ts`, `chat-interface.tsx`
- Component directories match component names

### Import Patterns

- Use `@/*` path aliases for all internal imports
- ESLint automatically sorts imports by category:
  1. Built-in Node modules
  2. External packages
  3. Internal modules (`@/*`)
  4. Parent directory imports
  5. Sibling/index imports

### Component Style

- **Function declarations** preferred over arrow functions
- **Default exports** for components, hooks, utils, constants
- **Type inference** preferred over explicit annotations

```typescript
// Preferred
export default function MyComponent() {
  const count = 5; // inferred type
  return <div>{count}</div>;
}

// Avoid
export const MyComponent = () => {
  const count: number = 5; // unnecessary annotation
  return <div>{count}</div>;
};
```

### Component Organization

- shadcn/ui primitives → `src/components/ui/`
- Custom components → `src/components/ui/custom/`
- Feature-specific components → `src/components/[feature]/`

### Styling

- Tailwind CSS v4 with OKLCH color system
- Use CSS custom properties for colors
- Global styles in `src/lib/styles/` (SCSS) only when Tailwind is insufficient
- Prettier with Tailwind plugin handles class sorting

## Adding Features

### New AI Command/Tool

1. Define Zod schema in `src/lib/models/editor-commands.ts`
2. Add tool to `tools` export
3. Implement execution logic in `src/lib/utils/execute-editor-command.ts`
4. Handle tool result in chat component if needed

### New Editor Plugin

1. Create plugin in `src/components/editor/plugins/`
2. Register in `src/components/editor/editor.tsx`
3. Add toolbar controls if applicable
4. Update AI tools if AI should interact with feature

### New UI Component

1. Use shadcn/ui as base when possible
2. Place custom components in `src/components/ui/custom/`
3. Ensure dark/light theme support
4. Follow naming conventions (lowercase with hyphens)

## Testing & Validation

### Manual Testing Checklist

- Test in both light and dark themes
- Test with various document sizes
- Verify AI command execution accuracy
- Check responsive behavior (mobile/desktop)
- Test with user-provided API key flow

### Code Quality

All changes must pass:

1. TypeScript type checking (`npm run typecheck`)
2. ESLint rules (`npm run eslint:check`)
3. Prettier formatting (`npm run prettier:check`)

Pre-commit hooks enforce these via Husky + lint-staged.

## Key Technical Details

### Node.js Requirements

- **Node.js**: 22.20.0 or higher
- **npm**: 10.9.3 or higher
- Enforced via `engines` field in `package.json`

### Turbopack Usage

- Development and builds use `--turbopack` flag
- Significantly faster than webpack
- Configuration in `next.config.ts`

### API Rate Limiting

- `maxDuration = 300` seconds for API route
- AI tool execution limited to 5 steps per request
- Consider this when implementing complex multi-step AI interactions
