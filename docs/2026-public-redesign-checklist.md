# 2026 public redesign — phased checklist

Agreed in grill session; glossary in `CONTEXT.md`; decisions in `docs/adr/0006`–`0009`.

Copy rule: colleague feedback overrides Figma text; layout stays Figma. Canonical name: **B-Side Festival**.

---

## Phase 0 — Prep

- [ ] Export/assets from Figma (logos, building, waves, photos, Förderer marks)
- [x] Add Framer Motion dependency (Docker + host `npm ci` per project rules)
- [x] AStA: labeled placeholder until real logo arrives
- [x] Fix known bad copy baselines (festival dates 18.–19.09.; Sputnikhalle spelling)

## Phase 1 — Public shell

- [x] Redesign header/footer for **all public pages**
- [x] Nav groups: **Festival 2026** | **Mitwirken** (+ utility: Socials, Spenden, Leichte Sprache entry)
- [x] Festival 2026 links: Wo & Wann, Über uns, Awareness; Programm only when `isProgramPublished`
- [x] Mitwirken links: Helfis → `/mithelfen` (Workshops omitted until a real target exists)
- [x] No soft „Programm folgt“ placeholders — skip Programm until publish

## Phase 2 — Startseite

- [x] Rebuild `/` from Figma sections with feedback copy
- [x] Hero / intro: „Wir feiern mit euch“, jubilee text, full address once, day times
- [x] **Wo & Wann**: Orte list (Raum 1–3); rough stats line editable later
- [x] Mitwirken teaser → `/mithelfen` (+ workshops note: Open Call closed; no dead Programm/Workshop links)
- [x] Awareness teaser → `/awareness`
- [x] Info / Über uns, Spenden section (no crisis banner), Eindrücke, Förderer stay in footer
- [x] Launch motion: Kultur Hafen Kante build-up, looping waves, building floors
- [x] `prefers-reduced-motion` static fallbacks
- [x] Intro/gallery picsum placeholders; Hansaviertel map still labeled „Karte folgt“
- [x] Closer Figma look + motto/waves/building polish pass

## Phase 3 — Awareness + Leichte Sprache

- [ ] Restyle `/awareness` to match new shell; keep DE full concept
- [ ] Keep `/awareness/english` and `/awareness/leichte-sprache`; restyle lightly
- [ ] Plain **Start** Leichte Sprache page (light draft from jubilee copy; not Figma LS mirror)
- [ ] Discreet LS entry from header/footer or Start

## Phase 4 — Helfi signup (Insta-ready)

- [ ] Mitwirken CTA + nav land on `/mithelfen`
- [ ] Page prose above form: (A) task examples (B) next steps
- [ ] Form: name, email, phone, optional free text; remove day prefs from UI
- [ ] Confirmation mail: confirm action **first**, then Judith onboarding; say Schichtsystem not Engelsystem
- [ ] Confirm route + persisted confirmed state (reuse Bewerbung token pattern where sensible)
- [ ] `/mithelfen/uebersicht`: show all; tiny unconfirmed mark; no filter
- [ ] No per-signup mail to festival@

## Phase 5 — Motion polish (post-launch OK)

- [ ] Arrows
- [ ] Color splashes
- [ ] Scroll / section reveals
- [ ] Refine building animation if needed

## Phase 6 — Later / out of redesign gate

- [ ] Drop in real AStA logo
- [ ] Finalize Ort count / Freihaus / stats line
- [ ] Workshop registration link target when ready
- [ ] Engelsystem setup (Kennet / orga); not named on the public site yet
- [ ] Bulk mail to confirmed Helfis when Schichtpläne exist
- [ ] Org review of feedback strings + LS draft
- [ ] Flip Programm into public nav when published

---

## Explicit non-goals for first public cut

- Designed Leichte-Sprache homepage mirror from Figma
- Crisis/urgency Spenden banner on Start
- Per-Helfi notification mails to organizers
- Captcha on Helfi form
- Day-availability checkboxes on Helfi signup
- Full illustration motion pack (arrows/splashes/scroll) as launch blocker
