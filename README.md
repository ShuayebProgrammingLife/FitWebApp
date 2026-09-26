# 💪 FitLog — Workout Library

A dark, no-nonsense gym companion. Browse twelve lifts, open one for its specs and instructions, lock it into today's plan or save it for later, and watch your minutes and calories add up.

**Live-01:**   https://fit-web-app-one.vercel.app
**Live-02:**   https://fitlogshu.netlify.app
**RepoLink:**  https://github.com/ShuayebProgrammingLife/FitWebApp

## Technologies
- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- React 19 (`useSyncExternalStore` for persistent state)
- Oswald + Inter via `next/font`
- Deployed on Vercel

## Features
1. **Pixel-matched UI** built from the Figma/Penpot design and fully responsive (mobile, tablet, desktop).
2. **Workout library** with a 3×4 grid, live API data, loading animation and retry on error.
3. **Workout details** page: key specs, four-step instructions, tag pills.
4. **Today's Plan & Saved** with a five-lift cap, live navbar badges and toast notifications.
5. **My Plan dashboard**: live Exercises / Minutes / Calories, tabs, sort dropdown (Duration, Calories, Rating), Mark as Done, remove, empty state.
6. **Persistence**: plan, saved and done state survive reloads (`localStorage`) and sync across tabs.
7. **Search** by workout name or tag on the Library and My Plan pages.
8. **404 page** for unknown routes and invalid workout IDs.

## Getting started
```bash
npm install
npm run dev
```

## API
- `GET https://api.abcz.workers.dev/api/fitlog`
- `GET https://api.abcz.workers.dev/api/fitlog/:id`

## Structure
```
app/         routes: /, /workout/[id], /my-plan, not-found
components/  Navbar, Hero, Library, WorkoutCard, Toaster, ...
context/     PlanContext (plan / saved / done + toasts)
hooks/       useWorkouts
lib/         api, types, sort, search, planStore (localStorage)
```