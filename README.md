# Textual

**An AI-powered rich text editor that transforms how you write and edit content.**

Textual combines a professional-grade rich text editor with OpenAI's GPT-4o to provide intelligent writing assistance. Unlike traditional AI writing tools that generate entire documents, this application focuses on precise, contextual editing within your existing content.

🌐 **[Try it live at textual.chat](https://textual.chat)**

## ✨ What Makes It Special

### Intelligent Content Editing

- **Contextual AI Commands**: Ask the AI to edit specific paragraphs, add content at precise locations, or format selections
- **Real-time Collaboration**: Chat with AI while maintaining full control over your document
- **Tool-based Precision**: AI uses structured commands to make exact changes rather than rewriting everything

### Professional Writing Experience

- **Rich Text Editor**: Full-featured editor with markdown support, tables, lists, and formatting
- **Split-pane Interface**: Work with your document and AI assistant side-by-side
- **Dark/Light Themes**: Comfortable writing in any environment
- **Distraction-free**: Clean, modern interface that keeps you focused on content

### Developer-friendly Architecture

- **Modern Stack**: Built with Next.js 15, Lexical editor, and Vercel AI SDK
- **Tool Calling**: Sophisticated AI integration using structured commands
- **Type-safe**: Full TypeScript implementation with comprehensive linting
- **Performance-first**: Uses Turbopack for lightning-fast development

## 🚀 Why This Approach is Promising

### Beyond Simple AI Writing

Most AI writing tools either:

- Generate entire documents from scratch (losing your voice and style)
- Provide generic suggestions that don't understand context

Textual takes a different approach:

- **Precision Editing**: Make specific changes to exact locations in your text
- **Contextual Understanding**: AI sees your entire document for better suggestions
- **Incremental Improvement**: Enhance your existing content rather than replacing it
- **Collaborative Workflow**: You stay in control while AI provides targeted assistance

### Technical Innovation

- **Structured AI Commands**: Uses tool calling for precise, reliable text manipulation
- **Real-time Streaming**: See AI responses and changes as they happen
- **State Synchronization**: Editor and chat interface stay perfectly in sync
- **Extensible Architecture**: Easy to add new AI capabilities and editor features

## 🔮 What's Coming Next

### Enhanced AI Capabilities

- **Multi-model Support**: Integration with Claude, Gemini, and other leading AI models
- **Specialized Writing Modes**: Academic writing, technical documentation, creative writing assistants
- **Research Integration**: AI that can fact-check, add citations, and pull in relevant information
- **Style Consistency**: AI that learns and maintains your writing style across documents

### Advanced Editor Features

- **Collaborative Editing**: Real-time multi-user editing with AI assistance for teams
- **Version History**: Track changes with AI-powered change summaries
- **Template System**: Smart templates that adapt to your content and industry
- **Export Options**: Professional formatting for PDF, Word, and publishing platforms

### Workflow Integration

- **API Access**: Programmatic access for integrating AI editing into other tools
- **Plugin System**: Extensible architecture for custom AI commands and editor plugins
- **Cloud Sync**: Document synchronization across devices with AI context preservation
- **Automation**: Scheduled AI reviews, content optimization, and publication workflows

### Enterprise Features

- **Team Workspaces**: Shared AI assistants trained on company style guides
- **Projects**: Organize documents and AI interactions by project or client
- **Role-based Access**: Permissions and roles for collaborative teams
- **Content Compliance**: AI that ensures content meets industry standards and guidelines
- **Analytics**: Insights into writing productivity and AI assistance effectiveness
- **Custom Models**: Fine-tuned AI models for specific industries or use cases

## 🛠️ Quick Start

### Prerequisites

- Node.js 22.20.0 or higher
- npm 10.9.3 or higher
- OpenAI API key

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/domhhv/textual.git
   cd textual
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env.local
   # Add your OPENAI_API_KEY to .env.local
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Essential Commands

```bash
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run typecheck       # TypeScript checking
npm run eslint:check    # Code linting
npm run eslint:fix      # Auto-fix linting issues
npm run prettier:check  # Code formatting check
npm run prettier:write  # Auto-format code
```

**Important**: Always run `npm run typecheck`, `npm run eslint:check`, and `npm run prettier:check` after making changes. These are part of the prebuild process and must pass for production builds.

### Architecture Overview

- **Frontend**: Next.js 15 with App Router and React Server Components
- **Editor**: Lexical 0.35.0 (Facebook's rich text editor framework)
- **AI Integration**: Vercel AI SDK with OpenAI GPT-4o
- **Styling**: Tailwind CSS v4 with OKLCH color system
- **UI Components**: Radix UI primitives with shadcn/ui (New York style)

### Key Features

- **Tool Calling**: AI uses structured commands to manipulate text precisely
- **Real-time Streaming**: Live updates during AI processing
- **State Management**: Synchronized editor and chat state via React Context
- **Theme Support**: Complete dark/light mode implementation with next-themes

## 🤝 Contributing

We welcome contributions! This project demonstrates cutting-edge AI integration patterns and modern React architecture. Whether you're interested in AI, editor technology, or user experience, there are opportunities to contribute.

### Areas for Contribution

- **AI Commands**: New tool calling capabilities for text manipulation
- **Editor Plugins**: Enhanced rich text editing features
- **UI/UX**: Interface improvements and accessibility enhancements
- **Performance**: Optimization and caching improvements
- **Documentation**: Guides and examples for developers

### Development Guidelines

- **Code Quality**: All PRs must pass TypeScript checking, ESLint, and Prettier
- **Commit Messages**: Follow conventional commit format (enforced by commitlint)
- **Testing**: Ensure changes work in both light and dark themes
- **Documentation**: Update relevant documentation for new features

## 📝 License

MIT License - see [LICENSE](https://github.com/domhhv/textual/blob/main/LICENSE.md) file for details.

## 🐛 Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/domhhv/textual/issues).

---

**Textual represents the future of AI-powered writing tools: intelligent, precise, and designed to enhance rather than replace human creativity.**

Visit [textual.chat](https://textual.chat) to experience it yourself.
