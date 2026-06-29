# Website Architecture — LOCKED (source of truth, 2026-06-29)

Supersedes all earlier architecture drafts. Review/spec only — implement when owner says "build".

## Positioning
B2B custom packaging **sourcing & coordination** (NOT a manufacturer). Use: source / coordinate /
manage production / vendor partners. Never "we manufacture / our factory / in-house".

## 3 taxonomies
- **Box Styles** (13) → `/styles/<slug>/` — structure/format pages, visible in nav.
- **Packaging Materials** (8) → `/materials/<slug>/` — material pages, visible in nav.
- **Products** (real product/use-case) → `/products/<slug>/` — SEO landing + quote, **hidden from main nav** but reachable (homepage section, internal links, footer, search).

**Style list (13):** mylar-bags, tuck-box, mailer-box, magnetic-box, labels-stickers, hang-tags,
sleeve-tray, paper-tube, drawer-box, display-box, two-piece-box, three-piece-box, gable-box.
**Material list (8):** rigid, cardstock, kraft, corrugated, metallized, textured-stock, ccnb, chipboard.

## Navigation (premium naming)
`Home · About · Services · Box Styles · Packaging Materials · Guides · Contact · [Get Quote]`
No big product catalog in nav. (Use existing `/guides/`, not a new Blog.)

## Homepage sections
Hero (premium product images + quote CTA) → **Explore Packaging Styles** → **Popular Packaging by
Product** (6–10 cards + "View More" CTA) → **Packaging Materials** → Finishes/Customization →
Process → Why Choose Us → Quote CTA.

## Product page formula (LOCKED)
```
Product Title
↓
Product Images (gallery, from local folder) + Quote Form   ← ABOVE THE FOLD, side-by-side desktop
↓
MOQ (updates with selected Style)
↓
Recommended Styles (VISUAL CARDS)
↓
Recommended Materials (visual cards)
↓
Available Finishes
↓
Buyer Guidance (retail / ecommerce / luxury / budget / protection)
↓
FAQs
↓
Final Quote CTA
```
Mobile: Title → Images → Form → sticky quote CTA. Quote form is the #1 conversion element — never bottom-only.

## Quote form fields
Name · Email · Phone/WhatsApp · Company · Product (prefilled) · Style · Material · Finish · Quantity
(≥MOQ) · Size/Dimensions · Artwork status · Delivery country/city · Message · Upload artwork (optional)
→ submits to existing CRM webhook.

## SEO model (LOCKED)
- **One canonical page per real product/intent. NO per-keyword pages** (no /luxury-lipstick-boxes/,
  /kraft-lipstick-boxes/ etc). Variations (luxury/kraft/printed/custom/wholesale) covered IN-page via
  headings, copy, FAQs, recommended styles/materials/finishes, metadata.
- Self-canonical, breadcrumb JSON-LD, strong internal links (Style ↔ Material ↔ Product bidirectional).
- `?style=`/`?material=` selector params → canonical to base + noindex.

## Pricing (LOCKED)
**No public fixed prices.** Remove all "from $X" copy → "custom quote based on your specifications".
Quote is manual: lead → partner prices → owner sends quote. Min margin floor 50% (internal).

## MOQ
Most styles 100 · Mylar 250 · Paper Tube 500. Shown near quote form; updates with selected style.

## Migration (APPROVED by owner 2026-06-29 — execute with build)
Reclassify structural items currently under `/products/` → `/styles/` or `/materials/` with **301**:
- magnetic-rigid-boxes → /styles/magnetic-box/
- mylar-bags → /styles/mylar-bags/
- tuck-end-boxes → /styles/tuck-box/
- mailer-boxes → /styles/mailer-box/
- premium-shipping-boxes → /styles/mailer-box/  (mailer/shipping family)
- cosmetic-display-boxes → /styles/display-box/
- cosmetic-labels → /styles/labels-stickers/
- rigid-boxes → /materials/rigid/
- corrugated-boxes → /materials/corrugated/
- cosmetic-hexagon-boxes → **DROP** (not in 13 styles); 301 to /products/ (closest hub).
- gift-box-packaging → **stays Product** as `/products/gift-boxes/` (rename slug; 301 old→new).
Real product pages (lipstick, serum, skincare, pr-kit, gift-boxes, etc) **stay /products/, no redirect**.

## Images
Map from local per-product folders (`Downloads/Finals/<Product>/`). Optimize to WebP (existing
pipeline). 1 img = single, 3 = grid, 5 = carousel. Missing = style/material placeholder — never fake
a product image. Recommended-style cards use the style/material photos we actually have, labelled
clearly (don't fabricate "product-in-style" combos we lack photos for).

## Pending (not launch-blocking)
- Style×Material compatibility matrix (partner) → until then "subject to confirmation"; remove only
  obvious-invalid (Mylar+Rigid).
- Finish×Material/Style compatibility (partner) → disclaimer line.
- Real unit cost (partner) → internal quoting only; site does NOT need it (prices removed).

## Deferred (Phase 2)
CBD scope · /lp/ PPC pages · live-priced configurator · full compatibility logic.

## Build order (Codex, when approved)
1. Remove public prices → custom-quote copy (all product pages).
2. Product page restructure (Title → Images + Quote Form above fold → MOQ).
3. Connect quote form → CRM.
4. Taxonomy cleanup + reclassify; create 13 Style + 8 Material pages.
5. 301 migration (after owner go).
6. Homepage "Popular Packaging by Product" + Styles + Materials sections.
7. Recommended-style visual cards on product pages.
8. Breadcrumb JSON-LD + internal links + param canonical/noindex.
9. FAQs + buyer guidance.
10. Compatibility logic (later, after partner data).
```
