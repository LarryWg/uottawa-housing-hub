

# UOttawa Housing Hub - Implementation Plan

A modern student housing platform for University of Ottawa students with roommate matching, interactive housing map, and AI-powered lease analysis.

---

## Phase 1: Foundation & Landing Page

### Landing Page
- Hero section with headline "Find Your Perfect Roommate & Housing at UOttawa"
- Three feature cards with icons showcasing Roommate Matcher, Housing Map, and Lease Checker
- Modern blue (#2563eb) and white color scheme with smooth animations
- "Get Started" call-to-action button
- Responsive navigation bar with logo and links

### Backend Setup (Lovable Cloud)
- Enable Lovable Cloud for database, authentication, and storage
- Configure Google OAuth for user sign-in
- Set up file storage bucket for profile photos and lease PDFs

---

## Phase 2: Roommate Matcher (Tinder-Style)

### User Profiles
- Profile creation form with all specified fields:
  - Basic info: name, program, year, age, bio, photo upload
  - Lifestyle: sleep schedule, cleanliness (1-10 slider), party frequency
  - Preferences: smoking status, pets, guest policy
  - Budget range ($300-$1500 slider)

### Swipe Interface
- Full-screen profile cards showing photo, key details, and bio
- Swipe right (like) / left (pass) buttons with animations
- Match detection when both users swipe right
- Match notification with celebration animation

### Matches Dashboard
- Grid of all mutual matches
- Display match's name, photo, program, and contact email
- Real-time updates when new matches occur

### Database Tables
- `profiles` - user profile data and preferences
- `swipes` - record of user swipe actions
- `matches` - mutual matches between users

---

## Phase 3: Interactive Housing Map

### Map Interface
- Interactive map centered on UOttawa campus (45.4215°N, 75.6972°W)
- Custom markers for each listing showing price preview
- Click markers to see detailed popup with full listing info

### Listing Details
- Address, monthly rent, bedrooms/bathrooms
- Distance to campus (walking time)
- Nearby amenities

### AI-Powered Search
- Chat input for natural language queries
- Example: "Show me 2-bedroom apartments under $1000 within 15 min walk"
- Filter listings dynamically based on AI interpretation
- Powered by Lovable AI

### Database Tables
- `listings` - property data with coordinates, price, features

---

## Phase 4: Lease Checker

### Upload Interface
- Drag-and-drop PDF upload area
- Upload progress indicator
- Support for common lease document formats

### AI Analysis
- Extract key lease terms using Lovable AI
- Generate structured summary sections:
  - Rent amount & payment terms
  - Security deposit details
  - Utilities included/excluded
  - Maintenance responsibilities
  - Landlord entry rights
  - Termination clauses

### Red Flag Detection
- Highlight concerning terms in red:
  - Wire transfer payment requirements
  - Excessive fees or penalties
  - Unclear or missing terms
  - Unusual clauses

### Database Tables
- `lease_analyses` - stored analysis results linked to users

---

## Design System

- **Primary Color**: Blue (#2563eb)
- **Clean, modern UI** with card-based layouts
- **Mobile-first responsive design**
- **Smooth transitions** and micro-animations
- **Professional typography** with clear hierarchy
- **UOttawa branding** elements

---

## Technical Architecture

| Component | Technology |
|-----------|------------|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Lovable Cloud (Supabase) |
| Authentication | Google OAuth via Supabase Auth |
| Database | PostgreSQL via Supabase |
| File Storage | Supabase Storage |
| Maps | Mapbox GL JS |
| AI Features | Lovable AI Gateway |
| Real-time | Supabase Realtime for matches |

