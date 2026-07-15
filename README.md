# SprintNotes

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2d3748" alt="Prisma" />
  <img src="https://img.shields.io/badge/Better--SQLite3-local-lightgrey" alt="Better SQLite3" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-components-000" alt="shadcn/ui" />
</p>

| Field | Value |
|-------|-------|
| **Title** | SprintNotes |
| **Description** | Minimal server-rendered sprint/meeting notes dashboard with Next.js, Tailwind, shadcn/ui, and Better-SQLite3. |
| **Language** | TypeScript / Next.js App Router |
| **Tags** | `nextjs` · `typescript` · `tailwindcss` · `prisma` · `better-sqlite3` · `shadcn-ui` · `meeting-notes` |
| **Author** | Henry Samuel — [@Henry-Samuel](https://github.com/Henry-Samuel) |

A minimal, server-rendered sprint/meeting notes dashboard built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Better-SQLite3**. It demonstrates Server Actions, server-side data fetching, and a clean local-first storage layer without a hosted database.

## Screenshot

> The home page renders a single meeting summary with categories, participants, decisions, and action items.

![sprintnotes](https://github.com/user-attachments/assets/placeholder.png)

## What this project shows

- **App Router server components** for predictable data flow
- **shadcn/ui** for consistent accessible components
- **Better-SQLite3** for local, embedded persistence
- **Prisma schema + migrations** included as reference, with runtime queries implemented over raw SQLite in this build

## Getting started

```bash
git clone https://github.com/Henry-Samuel/sprintnotes.git
cd sprintnotes
npm install
npm run dev
```

Open `http://localhost:3000` to view the seeded meeting dashboard.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Run a production build |
| `npm run lint` | Lint the codebase |

## Repository notes

- Default branch: `main`
- Issues and PRs welcome
- Built as a learning/demo project for weekend builds

## Author

**Henry Samuel**  
GitHub: [@Henry-Samuel](https://github.com/Henry-Samuel)
