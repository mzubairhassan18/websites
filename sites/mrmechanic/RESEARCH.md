# Research — Mr. Mechanic, Texas City, TX

> Working notes gathered **before** any design or code was written. Everything on the live page
> is traceable back to a source listed here. Where a fact could not be verified, it is not used.

**Business:** Mr. Mechanic, LLC — 1302 31st 1/2 St N, Texas City, TX 77590
**Goal of this document:** record the facts, the competitive landscape, and the design rationale
so the site can be defended in a sales conversation (and so future edits stay on-strategy).

---

## 1. Why this business

The brief was to build a site worth selling. Mr. Mechanic qualified for three reasons:

1. **No real website.** The shop's only web presence is its Google Maps / Facebook listings.
   A 4.5★ shop with 185 reviews and no site is a shop losing search traffic to weaker competitors.
2. **Strong, provable trust signal.** 4.5★ across 185 Google reviews is a genuinely good number
   for an independent shop — the site should *lead* with that rather than bury it.
3. **A real history worth telling.** Operating since December 2002 — 20+ years at one address.
   That is a story generic template sites cannot fake.

---

## 2. Verified business facts

Every item below appears on the page or in the structured data, and came from a source in §3.

| Fact | Value | Source |
|---|---|---|
| Legal name | Mr. Mechanic, LLC | BBB filing |
| Address | 1302 31st 1/2 St N, Texas City, TX 77590 | Google Maps / BBB |
| Phone | +1 409-965-8881 | Google Maps / BBB |
| Fax | +1 409-965-8879 | BBB |
| Email | yzf1000fzy@aol.com | BBB |
| Founded | 2002-12-20 | BBB |
| Hours | Mon–Fri 8:00 AM – 6:00 PM · Sat & Sun closed | Google Maps |
| Rating | 4.5 ★ / 5 (185 reviews) | Google Maps |
| Coordinates | 29.396585, -94.941788 | Google Maps |
| Owner | Doug Browning | BBB / shop records |
| Service Manager | Rob Bender | Shop records |
| Service Advisor | Summer | Shop records |
| Payment | Cash, Credit Card, Debit Card | BBB |
| Price range | $$ | Google Maps |

**Service area:** Texas City, La Marque, Dickinson, League City, Galveston.

**Landmark used for directions:** the shop sits just off Palmer Hwy behind the Raceway
station — this is the clearest wayfinding cue for a first-time visitor and is used verbatim
in "The Shop" section.

---

## 3. Sources consulted

- **Google Maps business listing** — hours, rating, review count, coordinates, photos,
  service area, price range. Primary source for everything customer-facing.
- **Better Business Bureau (BBB) listing & schema data** — legal name, founding date, fax,
  email, payment methods, officer names. The BBB record is what let the site name real people
  (Doug, Rob, Summer) instead of generic "our team" copy.
- **Legacy site `mrmechanictx.com`** (WordPress, now defunct) — recovered the original logo
  artwork and the service list. The service taxonomy on the page mirrors what the shop
  actually sells, not an invented menu.
- **Wayback Machine snapshots** of older shop sites in the area — used for copy patterns
  ("honest work / fair prices") that local customers already respond to.
- **Facebook page** — confirm tone, confirm no competing official site exists.
- **Direct photo downloads** — real aerial of the shop, street view, customer vehicle.
- **Unsplash** — supplementary texture photography only (bay, tools, diagnostics) where the
  shop's own photos did not cover a section.

### Colour sourcing

The accent red `#E2483F` was **sampled directly from the shop's own logo PNG**, not chosen
from a palette generator. The brand already owns a red — the site should extend it rather than
introduce a competing colour. This is the single most important decision that keeps the site
from looking like a template.

---

## 4. Service list

Taken from the legacy site's own wording, then grouped into scannable cards:

1. Engine Diagnostics
2. Brake Repair & Replacement
3. A/C Installation, Repair & Recharge
4. Transmission Repair & Replacement
5. Steering & Suspension
6. Wheel Alignment
7. Exhaust System Repair
8. Oil Change & Maintenance
9. Battery Replacement
10. Cooling System & Coolant Leak Repair

Also advertised: general maintenance, tires, electrical, foreign & domestic, car or truck.

**Free brake check** is the stated lead-magnet offer (from the shop's own marketing).

---

## 5. Competitive & design landscape

**What local competitors look like.** The independent-shop category online is dominated by:

- **Template / DIY-builder sites** — blue gradients, stock mechanic clip-art, a hero of a
  smiling man in overalls with folded arms, "ASE Certified" badges of unknown origin.
- **Directory-styled pages** — a wall of service links and nothing that says *this* shop.
- **Nothing at all** — most rivals in Texas City rely solely on the Google Maps panel.

**The gap.** Nobody in this category uses the visual language of the actual trade:
work orders, service tickets, stamped tags, mono type. That is an unclaimed, credible position
for a shop that has been doing this since 2002.

**Anti-goals** (things that would make it read as AI-generated):

- Inter / Roboto / system-ui as the only typeface.
- A blue-to-purple gradient hero with a centred headline and two pill buttons.
- Three identical rounded feature cards with emoji icons.
- Vague copy ("quality you can trust", "your satisfaction is our priority").
- Chosen brand colours that ignore the shop's real logo.

---

## 6. Design rationale

### Concept — "The Work Order"

The page is structured as a **service ticket**. The hero is a perforated job ticket showing the
live open/closed status; the body reads like sections of an inspection report; the typography is
part work-order, part editorial. It is a design language only an auto shop can legitimately use,
which is exactly what makes it hard to copy.

### Type

| Role | Face | Why |
|---|---|---|
| Display | **Bricolage Grotesque** | Contemporary, slightly idiosyncratic grotesque — reads confident without reading corporate. Not the default UI sans. |
| Body | **Instrument Sans** | Neutral, high x-height, excellent at paragraph sizes. |
| Labels / data | **IBM Plex Mono** | The work-order voice: part numbers, hours, status stamps, captions. |

The mono/sans split is the core of the identity — **mono = facts, sans = speech.**

### Colour

| Token | Hex | Use |
|---|---|---|
| Paper | `#F4EFE6` | Warm off-white page ground — printed-stock feel, not `#fff` |
| Ink | `#17140F` | Near-black with warmth, for text and dark sections |
| Shop red | `#E2483F` | Accent — **sampled from the real logo** |
| Green | `#2F8F5B` | "Open now" status only |
| Line | `#DED6C8` | Rules, perforations, dashed ticket edges |

### Trust architecture (order matters)

1. **Live status first** — *Open now / Closed* is the single most-asked question, so it is the
   very first thing on the page, computed client-side from the real hours.
2. **Phone above the fold** — sticky top bar + a permanent mobile call bar.
3. **Proof second** — 4.5★ / 185 reviews, then named reviews.
4. **Real photographs third** — the actual shop, not stock. Stock photos actively *cost*
   trust in this category.
5. **Named humans** — Doug, Rob and Summer. A shop with names is a shop that exists.
6. **Then the ask** — appointment form placed only after credibility is established.

### Motion

Reveal-on-scroll, a slow red marquee, hero parallax, and a nav-spy — all gated behind
`prefers-reduced-motion`. Motion is used to pace the read, never to decorate it.

---

## 7. Technical decisions

- **Static HTML/CSS/JS, no framework, no build step** — the site must be trivially maintainable
  and deployable by a non-developer.
- **GitHub Pages, deployed by Actions** (`.github/workflows/deploy.yml`). The repo root holds
  several sites; each lives in `sites/<name>/` and is published to
  `https://mzubairhassan18.github.io/websites/<name>/`.
- **All asset paths are relative** (`assets/img/…`, `styles.css`, `app.js`) — root-absolute
  paths break on Pages sub-paths. This is the single most common way a multi-site Pages repo
  fails.
- **No backend.** The appointment form validates client-side and hands off via `mailto:`.
  Honest about what it is; swapping in Formspree later is a one-line change.
- **`AutoRepair` JSON-LD** with address, geo, hours, `aggregateRating` (4.5 / 185), staff and a
  full `OfferCatalog` — this is what earns a rich result in local search.
- **Accessibility:** skip link, visible focus, semantic landmarks, `aria-expanded` on the menu,
  4.5:1+ contrast, reduced-motion support.

---

## 8. What is deliberately *not* claimed

To stay honest (and legally safe) the page does **not** claim:

- ASE certification as a shop-wide credential — only the real O'Reilly "Certified Auto Repair"
  sign the shop actually displays is shown.
- Warranty terms, financing, shuttle service, loaner cars, or guarantees — none were verifiable.
- Any review text that was not sourced from the shop's actual reviews.
- 24/7 or weekend hours — the shop is closed Sat & Sun.
