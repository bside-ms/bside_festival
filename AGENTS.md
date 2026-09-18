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

| Task                            | Purpose                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `task dev`                      | Start the Next.js dev server in Docker (detached; follows logs) |
| `task check`                    | Run ALL: tsc, lint, knip, audit, prettier                       |
| `task tsc`                      | Type-check — run after every change                             |
| `task lint`                     | ESLint — run after every change                                 |
| `task find-unused`              | Knip — find unused files, deps, exports                         |
| `task audit`                    | Security audit; fails on high/critical                          |
| `task prettier-fix`             | Auto-format everything — run at end of every task               |
| `task lint-fix`                 | ESLint with auto-fix                                            |
| `task prisma-migrations-dev`    | Create a new migration during development                       |
| `task prisma-migrations-deploy` | Apply pending migrations in production                          |
| `task prisma-generate`          | Regenerate Prisma client after schema changes                   |
| `task npm -- run <script>`      | Run any less common npm script inside Docker                    |

Organizer-initiated `festival@` mail is Intern **Mails schreiben** (`/intern/mails`), not a CLI. Automatic mails (Bewerbung, Workshop opt-in, Helfi) stay in `lib/mail/` and never take attachments.

**Verification order:** `task check` (tsc → lint → knip → audit → prettier). Run `task prettier-fix` alone if only formatting fails.

---

## CI

Single workflow in `.github/workflows/docker-image.yml`:

- On push: `npm ci` (Actions npm cache) → `prisma:client:generate` (with dummy DATABASE_URL) → tsc → lint → knip → audit → prettier
- On main branch push (after check passes): Docker build+push with SHA + `latest` tags. Uses the local checkout as build context, GitHub Actions layer cache, and no QEMU (linux/amd64 only). Requires `DOCKER_REPOSITORY`, `DOCKER_REPO_NAME`, `GITLAB_USERNAME`, `GITLAB_PASSWORD` secrets

---

## Architecture

### 2026 public redesign

- Phased checklist: `docs/2026-public-redesign-checklist.md`
- Related ADRs: `docs/adr/0006`–`0009` (Leichte Sprache plain pages, feedback-over-Figma copy, Framer motion phases, Helfi double opt-in)
- Public vocabulary: `CONTEXT.md` (B-Side Festival, Wo & Wann, Ort, Helfi, Engelsystem, Mitwirken, Leichte Sprache)

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
- Shared branded HTML shell in `createMailHtml` (pink gradient header, blue bar, white card) for automatic app mails
- `sendApplicationConfirmationMail` — sent on new application
- Workshop registrations are per timed Workshop `ScheduleEntry` with `maxAttendees`. `Attendee` reservations use 24-hour email double opt-in; pending reservations count towards capacity and old attendees are migrated as confirmed. The mail link invokes a route handler, which confirms and revalidates outside React rendering before redirecting to its result page via `APP_URL` (not `request.url`); used verification tokens keep `confirmedAt` so revisits show success. Confirmation creates an until-start cancellation link. A successful cancellation deletes the attendance but retains a `canceledAt` token marker so a route refresh can render the success state. `sendWorkshopAttendanceVerificationMail`, `sendWorkshopAttendanceConfirmationMail`, and `sendWorkshopAttendanceCancellationMail` cover the three mails.
- `sendVolunteerConfirmationMail` — double opt-in link after Helfi signup (`/mithelfen/confirm/[token]`, 3 days)
- `sendVolunteerWelcomeMail` — onboarding after the Helfi email is confirmed (Schichtpläne later, Treffen, Telegram, festival@)
- Mails schreiben (`/intern/mails`, code: mail merge) — the only organizer-initiated `festival@` send path. Data-privacy organizers send personalized mails via `sendFestivalSmtpMail` (`lib/mail/festivalSmtpMail.ts`) + IMAP Sent; Comment on each Programmbeitrag. Optional shared attachments (PDF, JPEG, PNG; max 3 files / 10 MB) are chosen for that compose session only, sent with every recipient, and stored in IMAP Sent; they are not kept as a Vorlage. The Aktivität Comment stays `Mail: »Betreff«`. Minimal HTML wrapper, not the pink `createMailHtml` shell. Leaving the send page cancels remaining mails. Status does not change. There are no CLI mail scripts. See `docs/adr/0018-mail-merge-is-not-a-mail-center.md` and `docs/adr/0019-mail-merge-session-attachments.md`.

### UI

- **Tailwind CSS v4** via `@tailwindcss/postcss` plugin
- **React Hook Form** with `FormProvider` pattern in all forms
- `/programm` has a public, case-insensitive name search only; it never searches contact names. The search writes `?text=` with `router.replace` only when the URL actually changes (`scroll: false`). `/intern` keeps its name + contact-name search with light fuzzy matching (1–2 edits) only when a token shares a strong prefix.
- Public Program Entry details use `/programm/[id]`. `ProgramScrollRestoration` (same idea as intern) jumps the detail page to the top and restores the catalog offset when returning. `← Zum Programm` calls `router.back()` after a list visit in this tab; a shared detail URL still links to `/programm` at the top. List loading lives in `app/programm/(catalog)/` so it does not wrap the detail route. The Links card renders only when there is at least one public, parseable link; otherwise nothing is shown (no empty box).
- Sharepics live at `/programm/[id]/sharepic` (unlisted; the public program does not link to them). The page is a small studio (Feed 4:5 / Story 9:16, photo on/off, German/English times) whose preview is the server PNG from `/programm/[id]/sharepic/image`. Visual language follows the 2026 homepage (pink gradient, logo, photo in a rounded-sm card; without a photo the name sits in the navy card). Confirmed and Canceled Program Entries only. Organizers can open the public program page and the Sharepic from `/intern/[id]`. Mail distribution is not built yet.
- Timed Participant `ScheduleEntry` rows can carry an optional public `visitorNote` (Treffpunkt, Mitbring-Tipps). Organizers edit it next to max attendees on `/intern/[id]` and in the Slotplan editor; `/programm/[id]` shows it under Wann & Wo when it is set.
- Public Workshop details expose capacity and registration only for confirmed Workshop schedule entries with `maxAttendees`; there is no waitlist. Logged-in users see active names (pending reservations included, with a small E-Mail-Adresse unbestätigt hint), while e-mail addresses and BCC/copy actions require the data-privacy group. `/intern/[id]` shows active pending/confirmed registrations and messages; `/intern/[id]/teilnehmende/[scheduleEntryId]` is the print view with names, e-mail addresses, and that hint on pending rows.
- Font Awesome + React Icons for icons
- Public footer is sky-blue (`#40a8f5`) with Bricolage motto „Kultur. Hafen. Kante!“, harbor wave strip (same animated paths as `HomeHero`), and columns Festival 2026 / Mitwirken / Socials. Labels stay German (Orte not Locations). Footer Orte (`/#wo-und-wann`) is omitted while Die Orte is hidden. Workshops omitted until a real target exists. Förderer match the 2026 print poster: Stadt Münster Kulturamt, MKW NRW, Soziokultur NRW, Romero Initiative, KI Münster, stupa.ms, Hansa Floß. AStA is not on the poster. No „Gemeinnützig seit 2016“. Discreet Intern login/link sits in the legal row.
- Public header is sticky (`h-15`). `html` has `scroll-smooth scroll-pt-15` so in-page hashes land below the header, plus `data-scroll-behavior="smooth"` so Next.js keeps route changes instant (without that attribute, CSS smooth-scroll animates list↔detail). Helfis includes Anmelden → `/mithelfen` and Engelsystem → `https://festival26.support.b-side.ms` (new tab). Logged-in users also get a gold dashed lock+Intern chip in the public header next to Programm (not under Helfis). Festival 2026 hash links (`/#ueber-uns`; `/#wo-und-wann` when Die Orte is shown) use `lib/public/scrollToPageHash.ts`; sections add `scroll-mt-16` on top of the html padding. `HomeLocations` sits directly below the Werde-Helfer\*in block and uses `HomeBuilding`, `images/2026/home/locations-legend.svg`, `images/2026/home/locations-drip.svg`, and `homeStatsLine`; its drip overflows upward at the red-to-blue transition below all blue content. `HomeHansaviertel` follows it with the full-width `images/2026/home/hansaviertel.jpg`. Header Wo & Wann and footer Orte remain hidden until their navigation links are explicitly released.
- App chrome is a pink-to-white top gradient (`.gradient-background`); no wavy SVG page background. Form inputs use a white fill so they stay readable on that gradient.
- Hero date (`18.–19.` / `September`) and the 10-Jahre badge are painted on the dock SVG (`xMaxYMax` / `xMidYMax slice`) so they stay on the black harbor face. Motto and logo live in a centered `max-w-[1200px]` corridor; water and dock stay full-bleed. The stacked motto (Kultur / Hafen / Kante plus navy strokes and red line, no yellow arrow) is inline SVG (`HeroMottoMobile` / `HeroMottoDesktop`). Below `lg` the motto sits under the logo; from `lg` it sits to the left. Below `md` the harbor block sits lower (`top-[18%] -bottom-[32%]`) so the dock runs out the bottom. Source extracts live in `images/2026/home/hero-motto-*.svg`. The full-color mark sits inset in the upper-right of the corridor. A **Was läuft gerade?** card (`HomeNowPlaying`) can sit at the bottom of that corridor: Confirmed Timed Schedule Entries overlapping now, grouped by Program Section, linking to `/programm/[id]`. **Als Nächstes** is a toggle with the next 5 upcoming (hard cap, any time distance), already open when nothing is running. Fresh on load, with a pulse on that heading only while something is running. The card is omitted when nothing is running and nothing is upcoming.

---

## Directory Structure

```
app/
  api/auth/[...nextauth]/  ← Keep — externally called by Keycloak
  api/health/              ← Keep — external health probe
  bewerbungen/             ← Application forms (public) + redirects to /intern
  intern/                  ← Programmbeiträge list; `[id]` detail; `mails`; `export`; kuration/; slotplan/
  programm/                ← Public program: `(catalog)` list, `[id]` details, `[id]/sharepic`, timetable/; list loading must not wrap details
  mithelfen/               ← Helfi signup (public); confirm/[token]; uebersicht (logged-in)
  aenderungslog/           ← Change Log (data-privacy users only)
  awareness/               ← Awareness (DE); leichte-sprache; english; easy-language
  spenden/                 ← Donation page (public)

lib/
  actions/                 ← Server actions
    actionAuth.ts, applicationActions.ts, emailConfirmationActions.ts,
    mailMergeActions.ts, datenExportActions.ts, slotActions.ts, venueActions.ts, volunteerActions.ts
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
  mailMerge/               ← Mails schreiben / mail merge (variables, slot lines, attachments, simple HTML)
  datenExport/             ← Datenexport (columns, CSV, Slot fan-out, session draft)
  sharepic/                ← Sharepic PNG render (homepage tokens, Feed/Story, photo on/off)
  upload/                  ← IONOS S3 upload
  utils.ts                 ← cn() helper (clsx + tailwind-merge)

components/
  applications/            ← Admin bewerbungen overview
  participants/            ← Public programm overview
  volunteers/              ← Helfi signup + overview
  form/                    ← Reusable form inputs
  common/                  ← Layout, navigation, shared UI
  intern/                  ← Internal workspace components (incl. mail merge and Datenexport)
  sharepic/                ← Public Sharepic studio (preview, format/photo, download)
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
- `/intern` Programmbeiträge is a flat sortable table (Name, Typ, Status, Ort, Zeit, Gage, letzter Kommentar) — no status groups, read-only rows; edits on `/intern/[id]`. Default sort is earliest slot time (`sort`/`sortDir` in URL); multi-slot acts show the earliest only (+N). Without slot sorts last. List filters include Type, Status, and Program Location Area (`areas` plus `unassigned` for Ohne Bereich). An act matches an area chip if at least one of its Schedule Entries is in that area; several area chips are OR. Data-privacy users can switch the list into **Mails schreiben** mode (`mailMerge` in the URL): filters still apply, select-all targets the filtered rows, then `/intern/mails` composes one text with `{{name}}` `{{ansprechperson}}` `{{typ}}` `{{termin}}` `{{gage}}` (clicking a token inserts it at the caret in the last focused Betreff/Text field), previews per recipient, and sends one `festival@` mail each (SMTP + IMAP Sent). Optional shared attachments (PDF, JPEG, PNG; max 3 files / 10 MB) stay in the browser for that compose session and go out with every mail; IMAP Sent includes them; a refresh drops the files. Used variables must be filled; missing `contactMail` always blocks. Send is one-by-one in the browser (progress, warn on leave). A Comment `Mail: »Betreff«` is posted as the sender. Status does not change. Organizer-initiated festival@ mail is Intern-only; there are no CLI mail scripts. No send archive — see `docs/adr/0018-mail-merge-is-not-a-mail-center.md` and `docs/adr/0019-mail-merge-session-attachments.md`. Data-privacy users can also switch into **Datenexport** mode (`datenExport` in the URL): same filters and selection, then `/intern/export` to pick columns, preview every row, and download a semicolon CSV (UTF-8 BOM, German headers, intern table sort). Default columns are Name, Typ, Status, Gage. Slot is opt-in and fans out to one row per Schedule Entry; every selected Beitrag must have a slot or the export errors. Optional columns include Genre, contact fields, and Personenzahl. Contact columns are available, not required. No archive, no Aktivität Comment, no Change Log — see `docs/adr/0020-datenexport-is-a-oneshot-csv.md`.
- `/intern/[id]` is the shareable Programmbeitrag detail (full edit: status, organizers, fee, schedule slots, comments). List filters stay in the URL and are carried to/from detail. From slotplan (`?from=slotplan&day=&area=` plus the planner visibility filters), back returns to `/intern/slotplan` with that view. Keycloak users load client-side after paint (cached ~5 min server-side).
- `/intern` routes hide the marketing footer and swap the public header nav for intern links. From `lg` all intern links sit in the header; below `lg` only Programmbeiträge, Slotplan, Programmorte, Kuration stay inline plus Mehr; below `md` an Intern overlay. Intern shell is a `h-dvh` `AppShell`; list/detail/kuration scroll inside it. The public footer only has one Intern entry (`/intern`); full intern nav is header-only. Logged-in users also get a gold dashed Intern chip (`/intern`) in the public header next to Programm.
- `/intern/slotplan` is a viewport-owned workspace: compact day/area toolbar, grid fills the remaining height, document does not scroll. `day` + `area` + `tab` (`planner` | `locations`) + `showEmpty` + `confirmedOnly` + `hideNotes` persist in the URL (nuqs); default area is `all`. The planner hides Program Locations with no visible Schedule Entry on the selected day; `showEmpty` (filter chip and the hint at the right of the grid) shows them again. `confirmedOnly` hides acts that are not Confirmed; `hideNotes` hides Schedule Notes. The two are independent. When area is `all`, columns are ordered by area `sortOrder` then location `sortOrder` (no visual group headers). Every Schedule Entry is timed (no Ganztägig row). The planner time axis starts 1 hour before the first visible timed entry and ends 1 hour after the last; with no timed entries it keeps the festival day window. Overlaps at the same Program Location are allowed and shown side by side. Each Overlap Group packs to the minimum Lanes (max simultaneous occupancy); width is 1/N of that group so separate piles at the same place can be 1/2 and 1/3. Assignment is start time, then longer first, then the leftmost free Lane. The location column grows by 48px per extra Lane in the largest group (190 + 48×(N−1)). Hover or click uses the full column width. Hover: Bearbeiten opens move (place/time only); arrow icon opens act details; notes have no detail link. Save no longer rejects overlaps; `isBlocking` / AllDay stay in the schema unused.
- `/intern/kuration` stores anonymous `juryVotes`, calculates jury/bonus/final score at read time via `lib/applications/curationScoring.ts`
- `/aenderungslog` records successful user save actions with previous/next values; visible only to data-privacy users
- Failed mutations are persisted to `ActionErrorLogEntry` (source, message, stack, optional actor/target/context); no Intern UI yet
- `/mithelfen` is public Helfi signup: name, phone, email, optional note (availability or car; empty is fine), privacy checkbox. Copy stays low-pressure: anyone can help, no prior experience. No day prefs. Website signup stays open until 18 September 2026, 09:00 local time. `addVolunteer` stores `Volunteer.emailVerified` as null and sends a confirm mail. `/mithelfen/confirm/[token]` sets the timestamp and sends the welcome mail. Organizers see everyone on `/mithelfen/uebersicht` (login) with an unconfirmed mark when the email is not yet verified, plus the optional note. Data-privacy users get copy-all addresses (comma-separated) and a `mailto:?bcc=` Sammelmail. No per-signup mail to festival@.
- `/awareness` is the public awareness concept (DE). Alternates: `/awareness/leichte-sprache`, `/awareness/english`, `/awareness/easy-language`. Shared left page header (eyebrow, title, navy pills). These routes use a full-page `#D681B4` → `#FFFFFF` gradient in `AppShell`; other public pages keep the short `.gradient-background` fade.

---

## Context Providers

The internal workspace context uses **props directly** (no `useState` for server data):

| Context                  | Used in   | Contains                                                                                                                              |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `InternWorkspaceContext` | `/intern` | Filter + table sort + mail-merge / Datenexport mode in URL via `nuqs`; client selection IDs in sessionStorage; slim list participants |

**Do not add `useState` for server-provided data** — the server page passes fresh props after each action and revalidation.

---

## Data Types

- `SerializableParticipant`, `SerializableSlot` — JSON-safe (dates as strings), used across client/server boundary
- `SerializableListParticipant` — slim `/intern` table row (earliest slot, Program Location Area ids, fee, last comment, organizers); not the full detail payload
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

| Variable                                                                                  | Notes                                                                                             |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                                            | MariaDB connection string                                                                         |
| `SHADOW_DATABASE_URL`                                                                     | Optional Prisma Migrate shadow database; Docker dev task sets this                                |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET`                                                         | NextAuth required                                                                                 |
| `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`                                            |                                                                                                   |
| `KEYCLOAK_ISSUER_URL`                                                                     | Keycloak realm URL (primary); `KEYCLOAK_ISSUER` is legacy fallback                                |
| `CRYPTO_SECRET`                                                                           | Used for hashing                                                                                  |
| `NEXT_PUBLIC_IONOS_HOST_NAME`                                                             | S3 hostname for image URLs                                                                        |
| `IONOS_ACCESS_KEY_ID`, `IONOS_SECRET_ACCESS_KEY`, `IONOS_BUCKET_NAME`, `IONOS_ENDPOINT`   | S3 credentials                                                                                    |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_INSECURE`      | App SMTP. Local `.env` is Mailcatcher; live Compose is Mailcow                                    |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_INSECURE`, `SMTP_IMAP_PORT` | Festival SMTP/IMAP for Intern Mails schreiben (send + copy to Sent). Set in `.env` / live Compose |
| `APP_URL`                                                                                 | Public site origin. Mail links and post-confirm redirects (never `request.url`)                   |

---

## Common Gotchas

- **Dev `app` container restarts on crash, not on boot.** `task dev` is `docker compose up -d app` plus log follow. Ctrl+C only stops the log stream, not the server (`task down` / `docker compose stop app` to stop it). Compose uses `restart: on-failure`, so Next/Turbopack dying comes back during a session, but OrbStack start after a Mac boot does not bring `app` up. Do not run attached `docker compose up app`: when that terminal dies, Compose SIGTERMs the container and it stays down. `docker compose run --rm app` one-offs (tsc/lint/check) do not replace the long-running `app` service.
- **Turbopack HMR in Docker:** `CHOKIDAR_*` is ignored. `WATCHPACK_POLLING` covers the route-file watcher. Do **not** set `watchOptions.pollIntervalMs` on Next 16.3 — it switches Turbopack to PollWatcher and ordinary edits (labels, copy) do not appear until `app` restarts. New files that 404 with `Module not found` still need `docker compose restart app`.
- **Use `task build` for production builds.** It overrides the development Compose image's `NODE_ENV=development` with `NODE_ENV=production`; `task npm -- run build` does not and can make Next load incompatible React build variants while prerendering.
- **Separate app and festival-mail credentials.** `MAIL_*` is for the Next app’s automatic mails (local: Mailcatcher at `http://localhost:1081`). `SMTP_*` is for Intern Mails schreiben (`festival@` + IMAP Sent). Recreate `app` after `.env` mail changes (`docker compose up -d app`). Confirmation-mail failures are logged (`ActionErrorLogEntry`) but the signup still succeeds.
- **Program publish gate** — `lib/participants/isProgramPublished.ts` is `true`; `/programm` and `/programm/[id]` are public. The catalogue groups confirmed and canceled entries in fixed, color-coded public Program Sections, keeps one name search, and exposes only non-confidential links. `/programm/timetable` stays login-only regardless.
- **Docker and host use different `node_modules`.** Local Compose mounts named volume `app_node_modules` over `/app/node_modules`, so `task`/container installs and `prisma generate` do not update host `./node_modules` (what Cursor/TS uses). After lockfile or Prisma schema changes, sync the host for the IDE: `npm ci` then `npm run prisma:client:generate` (dummy `DATABASE_URL` is fine). Do not remove the named volume — native deps like `sharp` need Linux builds in the container. Production is unaffected (Dockerfile generates the client in the image).
- **`.next/` cache can hold stale type references** after deleting routes. If `tsc` reports missing modules in `.next/types/validator.ts`, delete `.next/` and re-run.
- **`'use client'` is not required in every client component** — components imported into a `'use client'` file inherit client context. Only add at the boundary.
- **`revalidatePath` only refreshes the server component tree** — client components receive fresh props through re-render, but only if context providers use props directly, not `useState`.
- **Dummy DATABASE_URL needed for build** — Prisma 7's `prisma generate` and Next build need a parseable URL (won't connect). See CI and Dockerfile for pattern.
- **Server Actions have a 50 MB body limit** — relevant for image uploads.
- **`next.config.js` has `allowedDevOrigins: ['*']`** — allows external device testing but is permissive.
- **Node version**: Docker uses `node:20-bullseye`; `.nvmrc` says `v16.14.0` (stale — ignore in favor of Docker image).
- **`SHADOW_DATABASE_URL` is local `migrate dev` only** — not needed on live; production uses `migrate deploy`.
- **Public redirects must use `APP_URL`, not `request.url`.** Live Next sits behind a reverse proxy on port 3000. Route Handlers then see `https://localhost:3000`, so `NextResponse.redirect(new URL(path, request.url))` sends mail-link clicks off the public host. Workshop confirm (`/programm/anmeldung/bestaetigen/[token]/ausfuehren`) is the example.
