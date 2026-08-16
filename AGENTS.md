# AGENTS.md — B-Side Festival Project Guide

## Keeping This File in Sync

Update this file whenever you discover something a future agent would miss without help: routes, actions, data flow changes, gotchas, dependency holds, env var changes, or style conventions.

---

## Code Style

- **Do not add obvious comments** — only explain _why_, not _what_.
- **Always use arrow functions** — `const Foo = () => ...`, never `function Foo()`. Everywhere.
- **Prefer lodash** (`xor`, `range`, `uniq`, `first`, `last`, `filter`, `map`, etc.) over hand-rolled equivalents.
- **Imports are sorted alphabetically** by `prettier-plugin-organize-imports`. Run `task prettier-fix` after every change.
- **`no-array-index-key` is enforced.** Never use array index as React key. Use lodash `range(n)` or map over meaningful IDs.
- All files use single quotes, 4-space indentation, 140-char print width.

---

## Available Tasks

All project Node/Prisma/npm **runtime** commands must run inside Docker via `task ...` from `Taskfile.yml`. Host `npm ci` / `prisma generate` are the exception — required so the IDE sees the same deps/types (see Common Gotchas).

| Task                                    | Purpose                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| `task dev`                              | Start dev server                                                                     |
| `task check`                            | Run ALL: tsc, lint, test, knip, audit, prettier                                      |
| `task tsc`                              | Type-check — run after every change                                                  |
| `task lint`                             | ESLint — run after every change                                                      |
| `task test`                             | Vitest (3 test files, no config found — uses defaults)                               |
| `task find-unused`                      | Knip — find unused files, deps, exports                                              |
| `task audit`                            | Security audit; fails on high/critical                                               |
| `task prettier-fix`                     | Auto-format everything — run at end of every task                                    |
| `task lint-fix`                         | ESLint with auto-fix                                                                 |
| `task prisma-migrations-dev`            | Create a new migration during development                                            |
| `task prisma-migrations-deploy`         | Apply pending migrations in production                                               |
| `task prisma-generate`                  | Regenerate Prisma client after schema changes                                        |
| `task send-confirmation-mails`          | Batch script: status/confirmation mails by participant IDs                           |
| `task send-acceptance-mails`            | Local only: Act-Zusagemails (`--list` / `--dry-run` / send). Live: see below         |
| `task send-exhibition-acceptance-mails` | Local only: Ausstellung-Zusagemails (`--list` / `--dry-run` / send). Live: see below |
| `npm run send-festival-mail`            | Local: free-form `festival@` mail + IMAP Sent                                        |
| `npm run imap-mail`                     | Local: IMAP CLI for the no-reply mailbox                                             |

**Live deploy host** (no Taskfile; Compose service `festival-node`). Env comes from Compose — scripts use `dotenv/config` only as optional fallback, not `tsx --env-file`:

```bash
docker compose run --rm --entrypoint npm festival-node run send-acceptance-mails -- --list
docker compose run --rm --entrypoint npm festival-node run send-acceptance-mails -- --dry-run 683
docker compose run --rm --entrypoint npm festival-node run send-acceptance-mails -- 683
docker compose run --rm --entrypoint npm festival-node run send-exhibition-acceptance-mails -- --list
docker compose run --rm --entrypoint npm festival-node run send-exhibition-acceptance-mails -- --dry-run 595,624
docker compose run --rm --entrypoint npm festival-node run send-exhibition-acceptance-mails -- 595,624,655,751,760,651
```

| `task npm -- run <script>` | Run any less common npm script inside Docker |

**Verification order:** `task check` (tsc → lint → test → knip → audit → prettier). Run `task prettier-fix` alone if only formatting fails.

---

## CI

Single workflow in `.github/workflows/docker-image.yml`:

- On push: `npm ci` (Actions npm cache) → `prisma:client:generate` (with dummy DATABASE_URL) → tsc → lint → test → knip → audit → prettier
- On main branch push (after check passes): Docker build+push with SHA + `latest` tags. Uses the local checkout as build context, GitHub Actions layer cache, and no QEMU (linux/amd64 only). Requires `DOCKER_REPOSITORY`, `DOCKER_REPO_NAME`, `GITLAB_USERNAME`, `GITLAB_PASSWORD` secrets

---

## Architecture

### Framework & Rendering

- **Next.js 16 App Router** with React 19 and TypeScript 5
- All pages are **async Server Components** — they query Prisma directly
- Mutations go through **Server Actions** in `lib/actions/` — never REST
- `revalidatePath()` called in every action to trigger server re-renders
- Client components use `'use client'` directive; they call server actions directly (no `fetch`)

### Database

- **Prisma 7** with **MariaDB** (MySQL dialect). Singleton at `lib/common/prismaClient.ts`
- Schema: `prisma/schema.prisma`; CLI datasource URL in root `prisma.config.ts`
- Never use raw SQL — always Prisma client
- `prisma:client:generate` must run after any schema change before TS sees new types
- Prisma 7 loads `prisma.config.ts` for `prisma generate`; build steps need a valid dummy `DATABASE_URL` string (value not used, but must be parseable) — see CI and Dockerfile

### Authentication

- **NextAuth v4** with Keycloak provider (`lib/next-auth/`)
- `getUserSession()`, `isLoggedIn()`, `isGroupMember()` — use in server components
- `app/api/auth/[...nextauth]/route.ts` must never be deleted
- `requireLoggedInUser()`, `requireDataPrivacyUser()` at `lib/actions/actionAuth.ts`

### File Storage

- **IONOS S3** (AWS SDK v3) via `lib/upload/uploadFileToIonos.ts`
- Image constraints in `allowedImageContentTypes`, `allowedImageMaxFileSize`
- PDF constraints in `allowedTechnicRiderContentType`, `allowedTechnicalRiderMaxFileSize`
- Server actions body size limit: 50 MB (`next.config.js`)

### Email

- **Nodemailer v9** (overridden in package.json via `overrides` for next-auth compatibility) via `lib/mail/`
- `sendApplicationConfirmationMail` — sent on new application
- `sendSlotAttendConfirmationMail` — sent when someone registers for a slot
- `scripts/sendAcceptanceMails.ts` — batch Zusagemails for slotted acts with Gage; sets status to `WaitingForConfirmation` + status comment
- `scripts/sendExhibitionAcceptanceMails.ts` — same for Ausstellungen (exhibition wording, Rückmeldefrist 10.08.2026); skip already-notified RICH (762)
- `scripts/sendFestivalMail.ts` — free-form mails from `festival@` (multipart HTML, IMAP Sent, no DB)
- `scripts/imapMail.ts` — IMAP CLI for the no-reply mailbox

### UI

- **Tailwind CSS v4** via `@tailwindcss/postcss` plugin
- **React Hook Form** with `FormProvider` pattern in all forms
- Case-insensitive substring search on name + contactName in `/intern` and `/programm`, with light fuzzy (1–2 edits) only when a name/contact token shares a strong prefix
- Font Awesome + React Icons for icons

---

## Directory Structure

```
app/
  api/auth/[...nextauth]/  ← Keep — externally called by Keycloak
  api/health/              ← Keep — external health probe
  bewerbungen/             ← Application forms (public) + redirects to /intern
  intern/                  ← Programmbeiträge list; `[id]` detail; kuration/; slotplan/
  programm/                ← Program overview (gated by `isProgramPublished`; logged-in preview + notice until then)
  mithelfen/               ← Volunteer forms (public)
  aenderungslog/           ← Change Log (data-privacy users only)
  awareness/               ← Awareness info pages (public)
  spenden/                 ← Donation page (public)

lib/
  actions/                 ← Server actions
    actionAuth.ts, applicationActions.ts, emailConfirmationActions.ts,
    slotActions.ts, venueActions.ts, volunteerActions.ts
  applications/            ← Curation scoring, cookies, filter query names
  changeLog/               ← Change Log formatting, detection, persistence
  errorLog/                ← Persist failed server-action errors (`ActionErrorLogEntry`)
  common/                  ← Prisma client, helper fns (cn, formatDate, etc.), hooks
  crypto/                  ← Hashing helpers
  keycloak/                ← Keycloak user lookup
  mail/                    ← Email sending (Nodemailer)
  next-auth/               ← Auth utilities and types
  participants/            ← Participant helpers, type/status/venue/slot services
  schemas/                 ← Zod schemas (applicationSchema.ts)
  upload/                  ← IONOS S3 upload
  volunteers/              ← Volunteer preference types
  utils.ts                 ← cn() helper (clsx + tailwind-merge)

components/
  applications/            ← Admin bewerbungen overview
  participants/            ← Public programm overview
  volunteers/              ← Volunteer form
  form/                    ← Reusable form inputs
  common/                  ← Layout, navigation, shared UI
  intern/                  ← Internal workspace components
  ui/                      ← Base UI primitives
  awareness/               ← Awareness page components

prisma/
  schema.prisma, migrations/
prisma.config.ts           ← Prisma CLI datasource + migration config
```

---

## Server Actions Pattern

All mutations in `lib/actions/`. Pattern:

```typescript
'use server';

export const doSomething = async (id: number, value: string): Promise<void> => {
    await prismaClient.model.update({ where: { id }, data: { value } });
    revalidatePath('/affected-route');
};
```

- Always `'use server'` at top
- Wrap mutations with `loggedAction` / `recordActionError` so failures land in `ActionErrorLogEntry` (+ `console.error`); no admin UI yet — query DB/`docker logs`
- Call `revalidatePath()` for every route showing mutated data
- Client components import and call actions directly — no `fetch`
- Wrap action calls in `try/catch` in client components
- Admin application edits use focused actions in `applicationActions.ts` + Zod schemas from `applicationSchema.ts`
- `/intern` is the unified internal workspace. `/bewerbungen/uebersicht` and `/bewerbungen/kuration` redirect there.
- `/intern` Programmbeiträge is a flat sortable table (Name, Typ, Status, Ort, Zeit, Gage, letzter Kommentar) — no status groups, read-only rows; edits on `/intern/[id]`. Default sort is earliest slot time (`sort`/`sortDir` in URL); multi-slot acts show the earliest only (+N). Without slot sorts last.
- `/intern/[id]` is the shareable Programmbeitrag detail (full edit: status, organizers, fee, schedule slots, comments). List filters stay in the URL and are carried to/from detail. From slotplan (`?from=slotplan&day=&area=` plus the planner visibility filters), back returns to `/intern/slotplan` with that view. Keycloak users load client-side after paint (cached ~5 min server-side).
- `/intern` routes hide the marketing footer and swap the public header nav for intern links (Programmbeiträge, Slotplan, Programmorte, Kuration, plus Mehr). Intern shell is a `h-dvh` `AppShell`; list/detail/kuration scroll inside it. The public footer only has one Intern entry (`/intern`); full intern nav is header-only.
- `/intern/slotplan` is a viewport-owned workspace: compact day/area toolbar, grid fills the remaining height, document does not scroll. `day` + `area` + `tab` (`planner` | `locations`) + `showEmpty` + `confirmedOnly` + `hideNotes` persist in the URL (nuqs); default area is `all`. The planner hides Program Locations with no visible Schedule Entry on the selected day; `showEmpty` (filter chip and the hint at the right of the grid) shows them again. `confirmedOnly` hides acts that are not Confirmed; `hideNotes` hides Schedule Notes. The two are independent. When area is `all`, columns are ordered by area `sortOrder` then location `sortOrder` (no visual group headers). Every Schedule Entry is timed (no Ganztägig row). Overlaps at the same Program Location are allowed and shown side by side. Each Overlap Group packs to the minimum Lanes (max simultaneous occupancy); width is 1/N of that group so separate piles at the same place can be 1/2 and 1/3. Assignment is start time, then longer first, then the leftmost free Lane. The location column grows by 48px per extra Lane in the largest group (190 + 48×(N−1)). Hover or click uses the full column width. Hover: Bearbeiten opens move (place/time only); arrow icon opens act details; notes have no detail link. Save no longer rejects overlaps; `isBlocking` / AllDay stay in the schema unused.
- `/intern/kuration` stores anonymous `juryVotes`, calculates jury/bonus/final score at read time via `lib/applications/curationScoring.ts`
- `/aenderungslog` records successful user save actions with previous/next values; visible only to data-privacy users
- Failed mutations are persisted to `ActionErrorLogEntry` (source, message, stack, optional actor/target/context); no Intern UI yet

---

## Context Providers

Two contexts using **props directly** (no `useState` for server data):

| Context                       | Used in                            | Contains                                                                                                                 |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `InternWorkspaceContext`      | `/intern`                          | Filter + table sort state in URL via `nuqs`; slim list participants (slot/gage/last comment); no Keycloak/links/zipcodes |
| `ParticipantsOverviewContext` | `/programm`, `/programm/timetable` | Filter state (text, types, locations, date range), pinned IDs                                                            |

**Do not add `useState` for server-provided data** — the server page passes fresh props after each action and revalidation.

---

## Data Types

- `SerializableParticipant`, `SerializableSlot` — JSON-safe (dates as strings), used across client/server boundary
- `SerializableListParticipant` — slim `/intern` table row (earliest slot, fee, last comment, organizers); not the full detail payload
- `AllAttendees` — `{ slotId: number, attendees: Array<...> }`
- Prisma types (`Participant`, `Slot`, `Venue`, `Location`, etc.) — server-only
- `Participant.hasParticipatedBefore`: `true`/`false` for explicit answers, `null` for legacy — keep visually distinct
- `Participant.feeEuros`: optional whole-euro Gage on the Beitrag; edited in `/intern/[id]` ContributionDetails aside; changelog’d
- `Participant.juryVotes`: anonymous whole-number votes 0–5 as JSON; scores calculated at read time, not persisted
- `Comment` entries are immutable; store `authorUserId`, `authorName`, `createdAt`, optional `statusTransition`. Booking comments: only what ChangeLog/UI don’t already show (mail context, team todos)
- `ChangeLogEntry`: one entry per user save action; snapshots actor + target name, `changes` with previous/next values

---

## Participant Types

12 types in `lib/participants/urlPathTypes.ts`:
`konzert`, `dj`, `workshop`, `lesung`, `performance`, `familienprogramm`, `ausstellung`, `essensstand`, `nachbarschaft`, `infostand`, `catering`, `sonstiges`

Map to Prisma `Type` enum. `/bewerbungen/[type]` uses `generateStaticParams` to pre-render all 12 at build time.

---

## Dependency Holds

| Package                 | Current | Reason                                                            |
| ----------------------- | ------- | ----------------------------------------------------------------- |
| `eslint` / `@eslint/js` | v9      | `typescript-eslint@8` only supports ESLint 9; ESLint 10 breaks it |
| `typescript`            | v5      | `typescript-eslint@8` only supports TypeScript 5                  |

---

## Environment Variables

| Variable                                                                                | Notes                                                              |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                                                                          | MariaDB connection string                                          |
| `SHADOW_DATABASE_URL`                                                                   | Optional Prisma Migrate shadow database; Docker dev task sets this |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET`                                                       | NextAuth required                                                  |
| `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`                                          |                                                                    |
| `KEYCLOAK_ISSUER_URL`                                                                   | Keycloak realm URL (primary); `KEYCLOAK_ISSUER` is legacy fallback |
| `CRYPTO_SECRET`                                                                         | Used for hashing                                                   |
| `NEXT_PUBLIC_IONOS_HOST_NAME`                                                           | S3 hostname for image URLs                                         |
| `IONOS_ACCESS_KEY_ID`, `IONOS_SECRET_ACCESS_KEY`, `IONOS_BUCKET_NAME`, `IONOS_ENDPOINT` | S3 credentials                                                     |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_INSECURE`    | SMTP                                                               |
| `APP_URL`                                                                               | Used in email templates                                            |

---

## Common Gotchas

- **Program publish gate** — `lib/participants/isProgramPublished.ts` is `false` until go-live. Guests hitting `/programm` redirect to `/`; logged-in users see a yellow internal-only notice. Flip the constant to `true` to open the public program. `/programm/timetable` stays login-only regardless.
- **Docker and host use different `node_modules`.** Local Compose mounts named volume `app_node_modules` over `/app/node_modules`, so `task`/container installs and `prisma generate` do not update host `./node_modules` (what Cursor/TS uses). After lockfile or Prisma schema changes, sync the host for the IDE: `npm ci` then `npm run prisma:client:generate` (dummy `DATABASE_URL` is fine). Do not remove the named volume — native deps like `sharp` need Linux builds in the container. Production is unaffected (Dockerfile generates the client in the image).
- **`.next/` cache can hold stale type references** after deleting routes. If `tsc` reports missing modules in `.next/types/validator.ts`, delete `.next/` and re-run.
- **`'use client'` is not required in every client component** — components imported into a `'use client'` file inherit client context. Only add at the boundary.
- **`revalidatePath` only refreshes the server component tree** — client components receive fresh props through re-render, but only if context providers use props directly, not `useState`.
- **Dummy DATABASE_URL needed for build** — Prisma 7's `prisma generate` and Next build need a parseable URL (won't connect). See CI and Dockerfile for pattern.
- **Server Actions have a 50 MB body limit** — relevant for image uploads.
- **`next.config.js` has `allowedDevOrigins: ['*']`** — allows external device testing but is permissive.
- **Node version**: Docker uses `node:20-bullseye`; `.nvmrc` says `v16.14.0` (stale — ignore in favor of Docker image).
- **No vitest config file** — works from defaults. Only 3 test files exist.
- **`SHADOW_DATABASE_URL` is local `migrate dev` only** — not needed on live; production uses `migrate deploy`.
