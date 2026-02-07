# uOttawa Housing Hub

A housing platform for University of Ottawa students. Connect with compatible roommates, explore nearby apartments on an interactive map, and get AI-powered lease analysis — all in one place.

## Features

- **Roommate Matcher** — Swipe through compatible profiles based on lifestyle, budget, and preferences
- **Interactive Housing Map** — Explore apartments near campus with Mapbox
- **Lease Checker** — Upload your lease for AI analysis of red flags, hidden fees, and concerning terms

---

## Frontend

React/Vite application with TypeScript, Tailwind CSS, and shadcn-ui.

### Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (auth, database)
- Mapbox GL
- Framer Motion

### Setup

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment Variables

Create a `.env` file in the project root. See `.env.example` for required variables:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `VITE_MAPBOX_ACCESS_TOKEN` | Mapbox public token (for housing map) |
| `VITE_ADMIN_EMAIL` | (Optional) Bootstrap admin email |
| `VITE_LEASE_API_URL` | (Optional) Backend API URL for lease checker |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |

### Project Structure

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

---

## Backend

Flask API for the AI Lease Checker. Handles PDF uploads, text extraction, and AI-powered lease analysis via Anthropic Claude.

### Tech Stack

- Flask
- Anthropic Claude (AI)
- PyPDF / pdfplumber (PDF extraction)
- python-docx (Word documents)

### Setup

```sh
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set API key
export ANTHROPIC_API_KEY=your-anthropic-api-key

# Run the server
cd backend
python api.py
```

The API runs at `http://localhost:5000`.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze-lease` | POST | Upload PDF/DOC/DOCX lease for AI analysis |
| `/api/generate-report` | POST | Generate HTML report from analysis |
| `/api/health` | GET | Health check |
| `/api/ontario-laws` | GET | Ontario housing law reference |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude (required for lease analysis) |

---

##Screenshots

Signin/Create Account Screen
<img width="1863" height="1066" alt="image" src="https://github.com/user-attachments/assets/e214b70d-73a4-4e8b-9900-7c25b9539e56" />

Create Customizable Profiles Upon Creating An Account
<img width="1863" height="1065" alt="image" src="https://github.com/user-attachments/assets/eb082fd9-51f4-4b7a-aeff-ad2b57c95c02" />

Fully Functioning Two Step Verification
<img width="1496" height="715" alt="image" src="https://github.com/user-attachments/assets/baf370b7-3bcb-40cf-86fd-f387b8c68d11" />

Home Screen
<img width="1869" height="1062" alt="image" src="https://github.com/user-attachments/assets/ee2e7998-868a-4b90-a581-965ba64ddc4d" />

Feature One: Swiping Style Room Mate Compatibility Feature
<img width="1870" height="1064" alt="image" src="https://github.com/user-attachments/assets/320903af-8e29-45d6-8cea-4e0c7ed4a565" />

Feature Two: Interactive Housing Map
<img width="1866" height="1064" alt="image" src="https://github.com/user-attachments/assets/146bc88d-fe0d-42ce-a8a6-49ce15ab3fff" />

Feature Three: AI Powered Lease Checker
<img width="1865" height="1066" alt="image" src="https://github.com/user-attachments/assets/de164cb1-9099-4ec6-8cf9-f4a9b5f8dd7e" />

#Feature Four: Housing Preference Filters
<img width="1858" height="1065" alt="image" src="https://github.com/user-attachments/assets/394e6247-caca-4da7-b4c8-ad6c9421668b" />

#Additional Informative Resource Pages
<img width="1866" height="1065" alt="image" src="https://github.com/user-attachments/assets/3cbe9b4a-e2d2-4748-a8b1-dcb111345131" />
<img width="1864" height="1069" alt="image" src="https://github.com/user-attachments/assets/8fdeadae-5f2d-4c76-867c-94220b871424" />
<img width="1860" height="1065" alt="image" src="https://github.com/user-attachments/assets/5456fa6c-b893-4a49-902b-730fcb1a5c2d" />




## License

Private project.
