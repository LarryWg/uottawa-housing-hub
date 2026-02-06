# uOttawa Housing Hub

A housing platform for University of Ottawa students. Connect with compatible roommates, explore nearby apartments on an interactive map, and get AI-powered lease analysis — all in one place.

## Features

- **Roommate Matcher** — Swipe through compatible profiles based on lifestyle, budget, and preferences
- **Interactive Housing Map** — Explore apartments near campus with natural language search (e.g., "2BR under $1000 within 15 min walk")
- **Lease Checker** — Upload your lease for AI analysis of red flags, hidden fees, and concerning terms

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (auth, database, storage)
- Mapbox GL
- Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd uottawa-housing-hub

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment Variables

Create a `.env` file in the project root. See `.env.example` (if present) for required variables. You'll typically need Supabase and Mapbox credentials.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── landing/    # Landing page sections
│   ├── layout/     # Navbar, Footer
│   └── ui/         # shadcn-ui components
├── pages/          # Route pages
├── integrations/   # Supabase client & types
├── lib/            # Utilities
└── hooks/          # Custom React hooks
```

## License

Private project.
