# AGENTS.md — B-Side Festival Project Guide

Instructions and context for AI coding agents working on this repository.

---

## Keeping This File in Sync

**This file is a living document. Every agent that makes changes to the codebase is responsible for updating it.**

Update this file whenever you:

- Add, rename, or delete a route, server action, context, or major component
- Change the architecture or data flow (e.g. adding a new mutation pattern, new context)
- Add, remove, or intentionally hold back a dependency — document the reason
- Add or remove environment variables
- Discover a new gotcha, constraint, or non-obvious behaviour
- Change any code style rule or tooling convention

When in doubt: if a future agent reading this file would be surprised or misled by the current content, update it.

---

## Code Style

- **Do not add obvious comments** — comments must explain _why_, not _what_. Never add comments that restate what the code already clearly expresses (e.g. `// Nested Genre Creation` above a genres block, `// Stable handler` above a `useCallback`). Only comment when the reasoning is non-obvious or there's a gotcha that can't be inferred from reading the code.
- **Always use arrow functions** — never named function declarations. `const Foo = () => ...` not `function Foo() {}`. This applies to components, helpers, callbacks, server actions — everything.
- **Prefer lodash** when a utility function exists for the task (`xor`, `range`, `uniq`, `first`, `last`, `filter`, `map`, etc.) over hand-rolled equivalents.
- **Imports are sorted alphabetically** by prettier-plugin-tailwindcss config. Run `npm run prettier:fix` after every change.
- All files use single quotes, 4-space indentation, 140-char print width (see `.prettierrc.json`).

---

## Available Scripts

| Script                             | Purpose                                                   |
| ---------------------------------- | --------------------------------------------------------- |
| `npm run dev`                      | Start dev server                                          |
| `npm run check`                    | Run all checkers: tsc, lint, tests, Knip, audit, Prettier |
| `npm run audit`                    | Security audit; fails on high/critical vulnerabilities    |
| `npm run tsc`                      | Type-check — run after every non-trivial change           |
| `npm run lint`                     | ESLint — run after every change                           |
| `npm run prettier:fix`             | Auto-format everything — run at end of every task         |
| `npm run lint:fix`                 | ESLint with auto-fix                                      |
| `npm run find-unused`              | Find unused files, dependencies, and exports              |
| `npm run prisma:migrations:dev`    | Create a new migration during development                 |
| `npm run prisma:migrations:deploy` | Apply pending migrations in production                    |
| `npm run prisma:client:generate`   | Regenerate Prisma client after schema changes             |

**Verification after any change:** `npm run check`, then `npm run prettier:fix` if formatting fails or files need normalization.

---

## Architecture

### Framework & Rendering

- **Next.js 16 App Router** with React 19 and TypeScript 5
- All pages are **async Server Components** — they query the database directly via Prisma
- Mutations go through **Server Actions** in `lib/actions/` — never through REST API routes
- `revalidatePath()` is called in every action to trigger server re-renders with fresh data
- Client components use `'use client'` directive; they call server actions directly (no `fetch`)

### Database

- **Prisma 7** with **MariaDB** (MySQL dialect)
- Singleton client at `lib/common/prismaClient.ts`, constructed with `@prisma/adapter-mariadb`
- Schema at `prisma/schema.prisma`; CLI datasource URL lives in root `prisma.config.ts`
- Never use raw SQL — always use Prisma client

### Authentication

- **NextAuth v4** with Keycloak provider (`lib/next-auth/`)
- `getUserSession()`, `isLoggedIn()`, `isGroupMember()` — use these in server components
- The `app/api/auth/[...nextauth]/route.ts` route must never be deleted

### File Storage

- **IONOS S3** (AWS SDK v3) via `lib/upload/uploadFileToIonos.ts`
- Public URL helper: `lib/upload/createPublicObjectUrl.ts`
- Image constraints: `allowedImageContentTypes`, `allowedImageMaxFileSize`
- PDF constraints: `allowedTechnicRiderContentType`, `allowedTechnicalRiderMaxFileSize`
- Server actions body size limit is 50 MB (`next.config.js`)

### Email

- **Nodemailer v7** via `lib/mail/`
- `sendApplicationConfirmationMail` — sent on new application
- `sendSlotAttendConfirmationMail` — sent when someone registers for a slot

### UI

- **Tailwind CSS v4** for layout and styling
- **React Hook Form** with `FormProvider` pattern in all forms
- **Fuse.js** for fuzzy search in both overview contexts
- Font Awesome + React Icons for icons

---

## Directory Structure

```
app/
  api/
    auth/[...nextauth]/   ← Keep — externally called by Keycloak
    health/               ← Keep — external health probe
    applications/         ← Empty (all routes deleted, replaced by server actions)
    volunteers/           ← Empty (all routes deleted, replaced by server actions)
  bewerbungen/            ← Application forms (public), admin overview, and curation table
  mithelfen/              ← Volunteer forms (public)
  programm/               ← Program overview (public)
  error.tsx               ← Root error boundary
  layout.tsx              ← Root layout

lib/
  actions/                ← Server actions (mutations live here)
    applicationActions.ts
    slotActions.ts
    venueActions.ts
    volunteerActions.ts
  common/                 ← Shared helpers, Prisma client, hooks
  mail/                   ← Email sending
  next-auth/              ← Auth utilities
  participants/           ← Participant-specific helpers
  upload/                 ← IONOS S3 upload

components/
  applications/           ← Admin bewerbungen overview components
  participants/           ← Public programm overview components
  volunteers/             ← Volunteer form
  form/                   ← Reusable form inputs
  common/                 ← Layout, navigation, shared UI

prisma/
  schema.prisma
  migrations/
prisma.config.ts            ← Prisma CLI datasource and migration config
```

---

## Server Actions Pattern

All mutations are in `lib/actions/`. Pattern:

```typescript
'use server';

export const doSomething = async (id: number, value: string): Promise<void> => {
    await prismaClient.model.update({ where: { id }, data: { value } });
    revalidatePath('/affected-route');
};
```

- Always `'use server'` at top of file
- Call `revalidatePath()` for every route that shows the mutated data
- Client components import and call actions directly — no `fetch`
- Wrap action calls in `try/catch` in client components; throw = error state
- Admin application detail edits use focused server actions in `applicationActions.ts` plus Zod schemas from `applicationSchema.ts`
- `/bewerbungen/kuration` is the dedicated curation table. It stores only anonymous `juryVotes` and calculates jury score, bonus score, and final score at read time.

---

## Context Providers

Two main contexts, both using **props directly** (no `useState` for server data) so `revalidatePath` re-renders flow through automatically:

| Context                       | Used in                            | Contains                                                      |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `ApplicationsOverviewContext` | `/bewerbungen/uebersicht`          | Filter state (search text, type filter), expanded card IDs    |
| `ParticipantsOverviewContext` | `/programm`, `/programm/timetable` | Filter state (text, types, locations, date range), pinned IDs |

**Do not add `useState` for server-provided data** (participants, slots, venues, attendees, labels) — the server page passes fresh props after each action and revalidation.

---

## Data Types

- `SerializableParticipant` — JSON-serializable participant (dates as strings); used across client/server boundary
- `SerializableSlot` — same for slots
- `AllAttendees` — `{ slotId: number, attendees: Array<...> }`
- Prisma types (`Participant`, `Slot`, `Venue`, `Location`, etc.) — server-only
- `Participant.hasParticipatedBefore` is nullable: `true`/`false` for new or manually adjusted applications, `null` for legacy applications without an answer. Keep `null` visually distinct from explicit `false`.
- `Participant.juryVotes` stores anonymous whole-number votes from 0 to 5 as JSON. Derived curation scores are calculated via `lib/applications/curationScoring.ts`, not persisted.

---

## Participant Types

12 types defined in `lib/participants/urlPathTypes.ts`:
`konzert`, `dj`, `workshop`, `lesung`, `performance`, `familienprogramm`, `ausstellung`, `essensstand`, `nachbarschaft`, `infostand`, `catering`, `sonstiges`

These map to Prisma `Type` enum values. The `/bewerbungen/[type]` route uses `generateStaticParams` to pre-render all 12 at build time.

---

## Dependency Holds

These packages are intentionally NOT on the latest version:

| Package                 | Current | Cannot upgrade because                                            |
| ----------------------- | ------- | ----------------------------------------------------------------- |
| `eslint` / `@eslint/js` | v9      | `typescript-eslint@8` only supports ESLint 9; ESLint 10 breaks it |
| `nodemailer`            | v7      | `next-auth@4` peer dependency requires `^7.0.7`                   |
| `typescript`            | v5      | `typescript-eslint@8` only supports TypeScript 5                  |

---

## Environment Variables

Required in `.env` / Docker:

```
DATABASE_URL                  # MariaDB connection string
NEXTAUTH_URL                  # Full URL of the app
NEXTAUTH_SECRET               # Random secret
KEYCLOAK_CLIENT_ID
KEYCLOAK_CLIENT_SECRET
KEYCLOAK_ISSUER               # Keycloak realm URL
NEXT_PUBLIC_IONOS_HOST_NAME   # IONOS S3 hostname for image URLs
IONOS_ACCESS_KEY_ID
IONOS_SECRET_ACCESS_KEY
IONOS_BUCKET_NAME
IONOS_ENDPOINT
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASSWORD
MAIL_FROM
```

---

## Common Gotchas

- **`.next/` cache can hold stale type references** after deleting API routes. If `tsc` reports missing modules in `.next/types/validator.ts`, delete `.next/` and re-run.
- **`no-array-index-key` lint rule is enforced.** Never use array index as React key. Use lodash `range(n)` (values are unique keys) or map over meaningful IDs.
- **Server Actions have a 50 MB body limit** configured in `next.config.js` — relevant for image uploads.
- **`prisma:client:generate` must be run after any schema change** before TypeScript will see the new types.
- **`'use client'` is not required in every client component file** — components imported into a `'use client'` file inherit client context. Only add it at the boundary.
- **`revalidatePath` only refreshes the server component tree** — client components receive fresh props through re-render. This only works if context providers use props directly, not `useState`.

---

## Future Ideas

- Curation summaries: consider a later feature that generates a one-sentence internal summary from application text fields and type-specific details. Keep it out of the first curation view unless there is a clear persistence, refresh, privacy, and failure-handling plan.
