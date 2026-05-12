# Samuraidoku

**Live project:** _paste deployed Vercel link here_  
**GitHub repository:** _paste GitHub repository link here_

Samuraidoku is a Japanese-inspired Sudoku platform that turns puzzle solving into a calm samurai-style mental training experience.

## What I Built

I built a working Sudoku product prototype, not just a static landing page. Users can start a real puzzle, choose a mode, enter numbers from buttons or keyboard, use notes, track remaining digits, complete Daily Challenges, learn solving techniques, search players and race in a 1v1 room by code from separate devices.

The product has a premium Japanese visual identity: parchment backgrounds, ink-like board lines, sakura accents, katana difficulty language, serif poster-style typography and Pro board skins.

## Who It Is For

Samuraidoku is for people who like logic games, daily brain training and focused interfaces. It is also designed for competitive players who want streaks, leaderboards and 1v1 races, and for beginners who want guided explanations instead of only seeing whether a move is wrong.

## Why It Is Valuable

Samuraidoku combines game design, education, retention and monetization in one startup-like product:

- Daily Challenge and streaks encourage repeat usage.
- Sensei AI Coach teaches logic instead of only giving answers.
- Technique practice turns learning into small playable drills.
- Supabase Auth, profiles and player search prepare it for real users.
- Code-based 1v1 rooms make the experience social across devices.
- Pro features create a clear monetization path with skins, advanced stats and unlimited Sensei explanations.

## Features

- Real Sudoku generator with Easy, Medium and Hard difficulties
- Classic, Killer MVP, Diagonal and Kids Sudoku modes
- Playable 9x9 board with highlighting, mistakes, notes and keyboard input
- Remaining count under each number from 1 to 9
- Daily Challenge with score, accuracy and saved result
- Victory animation and restart action
- Sensei AI Coach with local fallback and OpenAI API route for Pro users
- Learn page with generated interactive practice boards
- Technique cards for singles, pairs, triples, X-Wing, Y-Wing and Swordfish
- City leaderboard prepared for live Supabase data
- Player profile with Supabase Auth and public profile search
- 1v1 duel rooms by code for separate devices
- Pro page with premium skins, advanced statistics, Daily archive and progress path
- Stripe Checkout route prepared for Pro subscription
- Admin page with launch readiness checklist
- Light, dark and premium board themes
- Responsive layout for desktop and mobile

## Main Routes

- `/` - product homepage
- `/play` - main Sudoku game
- `/daily` - daily challenge
- `/learn` - technique learning and practice
- `/leaderboard` - live leaderboard surface
- `/duel` - 1v1 room-by-code race
- `/pro` - Pro subscription and premium features
- `/login` - auth, profile, stats and player search
- `/admin` - launch readiness panel

## Tech Stack

- Next.js 14
- TypeScript
- React
- Tailwind CSS
- Zustand
- Framer Motion
- Lucide React
- Supabase Auth and SSR helpers
- Supabase database schema for profiles, leaderboard and duel rooms
- OpenAI Responses API route for Sensei AI Coach
- Stripe Checkout API route for Pro subscription

## How To Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For mobile or another device on the same network:

```bash
npm run dev:host
```

Then open `http://YOUR_LOCAL_IP:3000`.

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=your_openai_model
NEXT_PUBLIC_SITE_URL=https://your-domain.com
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRO_PRICE_ID=your_stripe_price_id
```

The app can run locally without OpenAI or Stripe. Supabase is required for real cross-device auth, player search, leaderboard and 1v1 rooms.

## Supabase Setup

Open Supabase SQL Editor and run:

```sql
-- see supabase/schema.sql
```

The schema creates:

- `profiles` for public player profiles and search
- `leaderboard` for real public rankings
- `duel_rooms` for 1v1 code-based races
- RLS policies for public reads and controlled writes

## Deployment

Recommended path:

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Add all variables from `.env.example` in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` to the Vercel production URL.
5. Run `supabase/schema.sql` in Supabase.
6. Optional: add Stripe price id and OpenAI key for full Pro/Sensei behavior.

## Submission Checklist

- Add the deployed URL to the **Live project** line at the top.
- Add the GitHub repository URL to the **GitHub repository** line at the top.
- Run `npm run lint`.
- Run `npm run build`.
- Test `/play`, `/daily`, `/learn`, `/duel`, `/pro`, `/login`.
- Submit the links in the nFactorial form.

## Future Improvements

- Stripe webhook and subscription sync in Supabase
- Cloud-synced statistics table instead of local-only stats
- Realtime Supabase channels for faster 1v1 updates
- More Sudoku variants and uniqueness checks
- More AI-assisted lessons and guided technique drills
