# Copilot Instructions for Gemini-gpt Clone

## Project Overview

This is a Next.js 14 (App Router) Gemini-gpt clone that uses Google Gemini AI instead of OpenAI. It features real-time streaming responses, conversation management, and Gemini-gpt-like UI.

## Critical Architecture Decisions

### AI Provider Setup

- **Using Google Gemini AI** (not OpenAI): The project uses `@google/generative-ai` SDK with `gemini-2.0-flash-lite` model
- Environment variable: `GEMINI_API_KEY` (not `OPENAI_API_KEY`)
- API route location: `app/api/chat/route.ts`
- System instruction in route.ts: Forces HTML-only responses (see line 40)

### State Management Pattern

All state lives in `app/page.tsx` (main orchestrator):

- `conversations[]` - Array of all conversation objects
- `currentConversation` - Active conversation being displayed
- State flows: `page.tsx` → `ChatInterface` → `InputArea`
- Updates flow back through callbacks: `onUpdate()`, `onNewChat()`, etc.

### Streaming Response Flow

1. User sends message → `InputArea` → `ChatInterface.handleSendMessage()`
2. POST to `/api/chat` with conversation history
3. Gemini returns Server-Sent Events (SSE) stream
4. `ChatInterface` reads stream chunks, updates `assistantMessage.content` incrementally
5. Real-time UI updates via React state during streaming

## Component Architecture

### Core Components (in `components/`)

- **`ChatInterface.tsx`**: Manages message state, API calls, streaming logic
- **`InputArea.tsx`**: Auto-expanding textarea, handles Enter key (submit) vs Shift+Enter (newline)
- **`MessageBubble.tsx`**: Renders messages with ReactMarkdown, custom styling for user vs assistant
- **`Sidebar.tsx`**: Conversation list, hover-to-delete pattern, "New chat" button

### Key Type Definitions (in `app/page.tsx`)

```typescript
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
```

## Development Workflow

### Running the App

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run start    # Run production build
```

### Required Environment Variable

Create `.env.local`:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Styling Conventions

### Gemini-gpt Color Palette (defined in components)

- Background: `#343541` (main) / `#202123` (sidebar) / `#444654` (assistant bubble)
- User avatar: `#5436da` (purple)
- Assistant avatar: `#19c37d` (green)
- Borders: `border-gray-700` / `border-gray-600` (hover)

### Tailwind Patterns

- Use `prose prose-invert` for markdown rendering
- Custom scrollbar styling in `globals.css`
- Fixed height layout: `h-screen`, `h-full`, `overflow-y-auto` for scrollable areas

## Common Patterns

### Conversation Title Generation

First user message (truncated to 50 chars) becomes the conversation title - see `page.tsx` line 36

### Message ID Generation

Uses `Date.now().toString()` for unique IDs (simple but works for single-user app)

### Gemini Format Conversion

OpenAI format → Gemini format in `route.ts`:

- `assistant` role → `model` role
- Messages structured as `{ role, parts: [{ text }] }`

## When Modifying

### Changing AI Provider

If switching from Gemini to OpenAI:

1. Update dependencies in `package.json`
2. Rewrite `app/api/chat/route.ts` using OpenAI SDK
3. Update environment variable name and references
4. Adjust streaming response parsing (OpenAI format differs slightly)

### Adding Features

- **Conversation persistence**: Currently in-memory only (lost on refresh) - add localStorage in `useEffect` hooks
- **Markdown code blocks**: Already styled in `MessageBubble.tsx` - customize `ReactMarkdown` components object
- **New UI sections**: Follow the dark theme color palette defined above

### API Route Debugging

Comments in `route.ts` are in Mongolian - they explain the Gemini streaming logic. Console logs with emoji prefixes (🔑, 📨, ✅, ❌) help trace request flow.

## Path Aliases

TypeScript configured with `@/*` pointing to project root - use `@/components/`, `@/app/`, etc.
