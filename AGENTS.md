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
| `task dev`                              | Start the Next.js dev server in Docker (detached; follows logs)                      |
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

**Live deploy host** (no Taskfile; Compose service `festival-node`). Env comes from Compose; all scripts use the standard `dotenv/config` import:

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

### 2026 public redesign

- Phased checklist: `docs/2026-public-redesign-checklist.md`
- Related ADRs: `docs/adr/0006`–`0009` (Leichte Sprache plain pages, feedback-over-Figma copy, Framer motion phases, Helfi double opt-in)
- Public vocabulary: `CONTEXT.md` (B-Side Festival, Wo & Wann, Ort, Helfi, Mitwirken, Leichte Sprache)

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

- **IONOS S3** (AWS SDK v3) via `lib/upload/uploadFileToIonos.ts` (PDFs) and `uploadImageToIonos.ts` (participant photos)
- Images are canvas-resized in the browser (`prepareSelectedImageFile`, max 2400px JPEG) then Sharp-normalized on the server (`rotate` + resize + jpeg, EXIF stripped). Do not send raw camera JPEGs through Server Actions — iPhone Portrait files can 500 the RSC payload (`Maximum array nesting exceeded`) and poison `next/image` (`LRUCache: calculateSize returned 0`)
- Image constraints in `allowedImageContentTypes`, `allowedImageMaxFileSize`
- PDF constraints in `allowedTechnicRiderContentType`, `allowedTechnicalRiderMaxFileSize`
- Server actions body size limit: 50 MB (`next.config.js`)

### Email

- **Nodemailer v9** (overridden in package.json via `overrides` for next-auth compatibility) via `lib/mail/`
- Shared branded HTML shell in `createMailHtml` (pink gradient header, blue bar, white card). Script mails reuse it via `festivalMailHtml`.
- `sendApplicationConfirmationMail` — sent on new application
- `sendSlotAttendConfirmationMail` — sent when someone registers for a slot
- `sendVolunteerConfirmationMail` — double opt-in link after Helfi signup (`/mithelfen/confirm/[token]`, 3 days)
- `sendVolunteerWelcomeMail` — onboarding after the Helfi email is confirmed (Schichtpläne later, Treffen, Telegram, festival@)
- `scripts/sendAcceptanceMails.ts` — batch Zusagemails for slotted acts with Gage; sets status to `WaitingForConfirmation` + status comment
- `scripts/sendExhibitionAcceptanceMails.ts` — same for Ausstellungen (exhibition wording, Rückmeldefrist 10.08.2026); skip already-notified RICH (762)
- `scripts/sendFestivalMail.ts` — free-form mails from `festival@` (multipart HTML, IMAP Sent, no DB). Uses dedicated `SMTP_*` values.
- `scripts/imapMail.ts` — IMAP CLI for the festival mailbox using `SMTP_*` values.

### UI

- **Tailwind CSS v4** via `@tailwindcss/postcss` plugin
- **React Hook Form** with `FormProvider` pattern in all forms
- `/programm` has a public, case-insensitive name search only; it never searches contact names. The search writes `?text=` with `router.replace` only when the URL actually changes (`scroll: false`). `/intern` keeps its name + contact-name search with light fuzzy matching (1–2 edits) only when a token shares a strong prefix.
- Public Program Entry details use `/programm/[id]`. `ProgramScrollRestoration` (same idea as intern) jumps the detail page to the top and restores the catalog offset when returning. `← Zum Programm` calls `router.back()` after a list visit in this tab; a shared detail URL still links to `/programm` at the top. List loading lives in `app/programm/(catalog)/` so it does not wrap the detail route.
- Font Awesome + React Icons for icons
- Public footer is sky-blue (`#40a8f5`) with Bricolage motto „Kultur. Hafen. Kante!“, harbor wave strip (same animated paths as `HomeHero`), and columns Festival 2026 / Mitwirken / Socials. Labels stay German (Orte not Locations). Footer Orte (`/#wo-und-wann`) is omitted while Die Orte is hidden. Workshops omitted until a real target exists. Förderer match the 2026 print poster: Stadt Münster Kulturamt, MKW NRW, Soziokultur NRW, Romero Initiative, KI Münster, stupa.ms, Hansa Floß. AStA is not on the poster. No „Gemeinnützig seit 2016“. Discreet Intern login/link sits in the legal row.
- Public header is sticky (`h-15`). `html` has `scroll-smooth scroll-pt-15` so in-page hashes land below the header, plus `data-scroll-behavior="smooth"` so Next.js keeps route changes instant (without that attribute, CSS smooth-scroll animates list↔detail). Festival 2026 hash links (`/#ueber-uns`; `/#wo-und-wann` when Die Orte is shown) use `lib/public/scrollToPageHash.ts`; sections add `scroll-mt-16` on top of the html padding. Homepage currently hides Die Orte, Werde Teil, and Galerie (`showDraftHomeSections` in `HomePage`); header Wo & Wann and footer Orte stay hidden with them.
- App chrome is a pink-to-white top gradient (`.gradient-background`); no wavy SVG page background. Form inputs use a white fill so they stay readable on that gradient.
- Hero date (`18.–19.` / `September`) and the 10-Jahre badge are painted on the dock SVG (`xMaxYMax` / `xMidYMax slice`) so they stay on the black harbor face. Motto and logo live in a centered `max-w-[1200px]` corridor; water and dock stay full-bleed. The stacked motto (Kultur / Hafen / Kante plus navy strokes and red line, no yellow arrow) is inline SVG (`HeroMottoMobile` / `HeroMottoDesktop`). Below `lg` the motto sits under the logo; from `lg` it sits to the left. Below `md` the harbor block sits lower (`top-[18%] -bottom-[32%]`) so the dock runs out the bottom. Source extracts live in `images/2026/home/hero-motto-*.svg`. The full-color mark sits inset in the upper-right of the corridor.

---

## Directory Structure

```
app/
  api/auth/[...nextauth]/  ← Keep — externally called by Keycloak
  api/health/              ← Keep — external health probe
  bewerbungen/             ← Application forms (public) + redirects to /intern
  intern/                  ← Programmbeiträge list; `[id]` detail; kuration/; slotplan/
  programm/                ← Public program: `(catalog)` list, `[id]` details, timetable/; list loading must not wrap details
  mithelfen/               ← Helfi signup (public); confirm/[token]; uebersicht (logged-in)
  aenderungslog/           ← Change Log (data-privacy users only)
  awareness/               ← Awareness (DE); leichte-sprache; english; easy-language
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
  schemas/                 ← Zod schemas (applicationSchema.ts, volunteerSchema.ts)
  upload/                  ← IONOS S3 upload
  utils.ts                 ← cn() helper (clsx + tailwind-merge)

components/
  applications/            ← Admin bewerbungen overview
  participants/            ← Public programm overview
  volunteers/              ← Helfi signup + overview
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
- `/intern` routes hide the marketing footer and swap the public header nav for intern links. From `lg` all intern links sit in the header; below `lg` only Programmbeiträge, Slotplan, Programmorte, Kuration stay inline plus Mehr; below `md` an Intern overlay. Intern shell is a `h-dvh` `AppShell`; list/detail/kuration scroll inside it. The public footer only has one Intern entry (`/intern`); full intern nav is header-only.
- `/intern/slotplan` is a viewport-owned workspace: compact day/area toolbar, grid fills the remaining height, document does not scroll. `day` + `area` + `tab` (`planner` | `locations`) + `showEmpty` + `confirmedOnly` + `hideNotes` persist in the URL (nuqs); default area is `all`. The planner hides Program Locations with no visible Schedule Entry on the selected day; `showEmpty` (filter chip and the hint at the right of the grid) shows them again. `confirmedOnly` hides acts that are not Confirmed; `hideNotes` hides Schedule Notes. The two are independent. When area is `all`, columns are ordered by area `sortOrder` then location `sortOrder` (no visual group headers). Every Schedule Entry is timed (no Ganztägig row). The planner time axis starts 1 hour before the first visible timed entry and ends 1 hour after the last; with no timed entries it keeps the festival day window. Overlaps at the same Program Location are allowed and shown side by side. Each Overlap Group packs to the minimum Lanes (max simultaneous occupancy); width is 1/N of that group so separate piles at the same place can be 1/2 and 1/3. Assignment is start time, then longer first, then the leftmost free Lane. The location column grows by 48px per extra Lane in the largest group (190 + 48×(N−1)). Hover or click uses the full column width. Hover: Bearbeiten opens move (place/time only); arrow icon opens act details; notes have no detail link. Save no longer rejects overlaps; `isBlocking` / AllDay stay in the schema unused.
- `/intern/kuration` stores anonymous `juryVotes`, calculates jury/bonus/final score at read time via `lib/applications/curationScoring.ts`
- `/aenderungslog` records successful user save actions with previous/next values; visible only to data-privacy users
- Failed mutations are persisted to `ActionErrorLogEntry` (source, message, stack, optional actor/target/context); no Intern UI yet
- `/mithelfen` is public Helfi signup: name, phone, email, optional note (availability or car; empty is fine), privacy checkbox. Copy stays low-pressure: anyone can help, no prior experience. No day prefs. `addVolunteer` stores `Volunteer.emailVerified` as null and sends a confirm mail. `/mithelfen/confirm/[token]` sets the timestamp and sends the welcome mail. Organizers see everyone on `/mithelfen/uebersicht` (login) with an unconfirmed mark when the email is not yet verified, plus the optional note. Data-privacy users get copy-all addresses (comma-separated) and a `mailto:?bcc=` Sammelmail. No per-signup mail to festival@.
- `/awareness` is the public awareness concept (DE). Alternates: `/awareness/leichte-sprache`, `/awareness/english`, `/awareness/easy-language`. Shared left page header (eyebrow, title, navy pills). These routes use a full-page `#D681B4` → `#FFFFFF` gradient in `AppShell`; other public pages keep the short `.gradient-background` fade.

---

## Context Providers

The internal workspace context uses **props directly** (no `useState` for server data):

| Context                  | Used in   | Contains                                                                                                                 |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `InternWorkspaceContext` | `/intern` | Filter + table sort state in URL via `nuqs`; slim list participants (slot/gage/last comment); no Keycloak/links/zipcodes |

**Do not add `useState` for server-provided data** — the server page passes fresh props after each action and revalidation.

---

## Data Types

- `SerializableParticipant`, `SerializableSlot` — JSON-safe (dates as strings), used across client/server boundary
- `SerializableListParticipant` — slim `/intern` table row (earliest slot, fee, last comment, organizers); not the full detail payload
- Prisma types (`Participant`, `Slot`, `Venue`, `Location`, etc.) — server-only
- `Participant.hasParticipatedBefore`: `true`/`false` for explicit answers, `null` for legacy — keep visually distinct
- `Participant.feeEuros`: optional whole-euro Gage on the Beitrag; edited in `/intern/[id]` ContributionDetails aside; changelog’d
- `Participant.juryVotes`: anonymous whole-number votes 0–5 as JSON; scores calculated at read time, not persisted
- `Comment` entries are immutable; store `authorUserId`, `authorName`, `createdAt`, optional `statusTransition`. Booking comments: only what ChangeLog/UI don’t already show (mail context, team todos)
- `ChangeLogEntry`: one entry per user save action; snapshots actor + target name, `changes` with previous/next values. Application link URL edits use `ApplicationLinkUpdated` (field `link`).

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

| Variable                                                                                  | Notes                                                              |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                                                                            | MariaDB connection string                                          |
| `SHADOW_DATABASE_URL`                                                                     | Optional Prisma Migrate shadow database; Docker dev task sets this |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET`                                                         | NextAuth required                                                  |
| `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`                                            |                                                                    |
| `KEYCLOAK_ISSUER_URL`                                                                     | Keycloak realm URL (primary); `KEYCLOAK_ISSUER` is legacy fallback |
| `CRYPTO_SECRET`                                                                           | Used for hashing                                                   |
| `NEXT_PUBLIC_IONOS_HOST_NAME`                                                             | S3 hostname for image URLs                                         |
| `IONOS_ACCESS_KEY_ID`, `IONOS_SECRET_ACCESS_KEY`, `IONOS_BUCKET_NAME`, `IONOS_ENDPOINT`   | S3 credentials                                                     |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_INSECURE`      | App SMTP. Local `.env` is Mailcatcher; live Compose is Mailcow     |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_INSECURE`, `SMTP_IMAP_PORT` | Festival SMTP/IMAP CLI; set in the standard `.env` or live Compose |
| `APP_URL`                                                                                 | Used in email templates                                            |

---

## Common Gotchas

- **Dev `app` container restarts on crash, not on boot.** `task dev` is `docker compose up -d app` plus log follow. Ctrl+C only stops the log stream, not the server (`task down` / `docker compose stop app` to stop it). Compose uses `restart: on-failure`, so Next/Turbopack dying comes back during a session, but OrbStack start after a Mac boot does not bring `app` up. Do not run attached `docker compose up app`: when that terminal dies, Compose SIGTERMs the container and it stays down. `docker compose run --rm app` one-offs (tsc/lint/check) do not replace the long-running `app` service.
- **Use `task build` for production builds.** It overrides the development Compose image's `NODE_ENV=development` with `NODE_ENV=production`; `task npm -- run build` does not and can make Next load incompatible React build variants while prerendering.
- **Separate app and festival-mail credentials.** `MAIL_*` is for the Next app and existing confirmation/acceptance scripts (local: Mailcatcher at `http://localhost:1081`). `SMTP_*` is only for `send-festival-mail` and `imap-mail`; both use the normal `dotenv/config` import. Recreate `app` after `.env` mail changes (`docker compose up -d app`). Confirmation-mail failures are logged (`ActionErrorLogEntry`) but the signup still succeeds.
- **Program publish gate** — `lib/participants/isProgramPublished.ts` is `true`; `/programm` and `/programm/[id]` are public. The catalogue groups confirmed and canceled entries in fixed, color-coded public Program Sections, keeps one name search, and exposes only non-confidential links. `/programm/timetable` stays login-only regardless.
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
