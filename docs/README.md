# SprintNotes

SprintNotes is a local server-rendered meeting capture app built with Next.js 16, Tailwind CSS, shadcn/ui, and Better-SQLite.

## Run

```bash
npm install
npm run dev
```

## Data

Sample sprint data is seeded on first load into `prisma/dev.db`.

## Notes

- Read every meeting from the seeded summary page.
- Predictable SQLite-backed app bootstrapped from the built-in Next.js app template.
