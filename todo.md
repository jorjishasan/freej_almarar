# Freej AlMarar - Complete Implementation TODO

## LOCKED VISION REQUIREMENTS (ChatGPT Feedback)

### Global Principles
- [x] Single top navigation bar
- [ ] Everything CMS-driven (easy create, edit, reorder, expand)
- [ ] Missing data never blocks publishing (use "Unknown / Approximate")
- [ ] All systems interconnect (people, places, poems, archive, etc.)
- [x] Visual quality mandatory (benchmark: NLA.ae but cleaner, more modern, better motion)

### Tier System Architecture
**Tier 1 - Core Pillars** (visual identity + homepage presence)
- [ ] History
- [ ] Archive (Documents + Photographs only)
- [ ] Ferjan (Places)
- [ ] Lineage (Family Tree + Figures)
- [ ] Poems

**Tier 2 - Supporting / Living Systems**
- [ ] Reposts
- [ ] Events
- [ ] Collaborations
- [ ] Books (planned, do NOT block launch)

**Tier 3 - Utility / Institutional**
- [ ] About
- [ ] Contribute
- [ ] Our Projects

## PHASE 1: Navigation & Architecture

### Navigation Restructure
- [x] Update top nav to: History, Archive, Ferjan, Lineage, Poems, Reposts, Events, Collaborations, Books, About, Contribute, Our Projects
- [x] Remove old nav items (Places → Ferjan, Family Tree → Lineage, Heritage → removed, Lab → removed, Partnerships → Collaborations, Suggestions → Contribute)
- [x] Ensure single horizontal top nav only

### Database Schema Updates
- [x] Add `family_tree_sections` table for Family Tree sections (7 editable sections)
- [x] Add `families` table for families within sections
- [x] Add `figures` table for individual people (replaces old people table)
- [x] Add `ferjan` table for places (rename/restructure places table)
- [x] Update `history_entries` table with proper linking fields
- [x] Add `collaborations` table
- [x] Add `source_type` enum for reposts (instagram, twitter, facebook, manual, other)
- [x] Update `archives` table to only handle Documents (added document_type field)
- [x] Ensure all tables support optional fields and "Unknown" values
- [x] Add junction tables for many-to-many relationships (archive_item_figures, photo_figures, history_archive_items, history_photos, history_poems, figure_history_entries, event_figures, event_reposts)

## PHASE 2: Tier 1 Sections (CRITICAL - Visual Priority)

### Visual Requirements for ALL Tier 1
- [ ] Each Tier 1 section MUST have dedicated image (placeholder for now)
- [ ] Image treatment: blurred and/or darkened, typography dominates
- [ ] Subtle premium motion: hover-based image movement/parallax, smooth transitions
- [ ] Tier 1 visuals appear on homepage AND section landing pages
- [ ] NO text-only sections for Tier 1

### 1. History Section
- [ ] Create History landing page with hero visual + motion
- [ ] Build history entry listing page (timeline or chronological)
- [ ] Build history entry detail page
- [ ] Support linking to: documents, photographs, poems, figures, places
- [ ] Serious, structured historical record (NOT Netflix/storytelling style)
- [ ] Support wars, major events, periods, movements
- [ ] Make expandable over time

### 2. Archive Section (STRICT SCOPE)
- [x] Archive Hub page (Documents + Photographs only)
- [x] Documents listing page
- [x] Documents detail page
- [ ] Photographs listing page
- [ ] Photographs detail page
- [ ] Implement REAL functional filters (not placeholders):
  * Filter by place
  * Filter by period/year
  * Filter by people
  * Filter by tags
  * Filter by document type (optional, CMS-editable, supports "Unknown")
  * Filter by photo category (place/person/event/tribe/other, optional, supports "Unknown")
- [ ] Items with unknown data must display normally
- [ ] Document type: optional, CMS-editable, filterable, supports "Unknown / Unspecified"
- [ ] Photo category: optional, CMS-editable, filterable, supports "Unknown / Unspecified"

### 3. Ferjan Section (Places)
- [ ] Create Ferjan landing page with hero visual + motion
- [ ] Build Ferjan grid page (~8 place cards initially, editable number)
- [ ] Each place card: image + short description
- [ ] Build place detail page with:
  * Place overview
  * Timeline (period + description entries)
  * Automatically pull related photographs from Archive by place
  * Archive is single source of truth (no duplicated uploads)

### 4. Lineage Section (COMPLEX - READ CAREFULLY)
- [ ] Create Lineage landing page with hero visual + motion
- [ ] Build Lineage entry page with TWO clear options:
  * Family Tree
  * Figures
  
**A) Family Tree (Primary Structure)**
- [ ] Level 1: Family Tree Sections page
  * Show 7 sections (number editable in CMS)
  * Sections are containers, NOT genealogy claims
  * Each section: title, short description (optional), optional image
  * Sections must be renameable, reorderable, addable, removable
- [ ] Level 2: Families listing within each section
  * Each family card: family name, optional short note, optional period
- [ ] Level 3: Family detail page
  * Family overview (optional text)
  * Family tree (start as structured list, upgradeable later to visual tree)
  * List of people (figures) in that family
  * Clicking person opens Figure page

**B) Figures (People System)**
- [ ] Build Figures listing page (accessible from Lineage entry)
- [ ] Build Figure detail page with:
  * Name
  * Approximate period (optional)
  * Family (optional, linked)
  * Position in family tree (optional)
  * Linked content (no forced divisions):
    - History entries
    - Poems
    - Documents
    - Photographs
    - Ferjan places
- [ ] Rules: No single "tribe grandfather", no forced genealogy, partial data acceptable, everything editable

### 5. Poems Section
- [ ] Create Poems landing page with hero visual + motion
- [ ] Build poems listing page
- [ ] Build poem detail page
- [ ] Support linking to: figures, history, places, documents, photos
- [ ] Large, serious section (NOT hidden inside Archive)
- [ ] Poems are cultural and historical records

## PHASE 3: Tier 2 & Tier 3 Sections

### Reposts (Tier 2)
- [ ] Build Reposts listing page (NO hero visual treatment)
- [ ] Build Repost detail page
- [ ] Implement Quick Add mode:
  * Paste Instagram URL (public posts)
  * Attempt auto-fetch metadata
  * Admin can edit everything
- [ ] Implement Manual Add mode:
  * Upload media
  * Write caption
  * Add original link (optional)
- [ ] Support linking to Ferjan and Figures
- [ ] Store as native entries (NOT embeds)
- [ ] Manually curated only

### Events (Tier 2)
- [ ] Build Events listing page (NO hero visual treatment)
- [ ] Build Event detail page
- [ ] Support upcoming and past events
- [ ] Support linking to: places, people, reposts

### Collaborations (Tier 2)
- [ ] Build Collaborations page with logo grid
- [ ] Each collaborator: logo, name, short description, internal or external link

### Books (Tier 2 - PLANNED)
- [ ] Create Books placeholder page
- [ ] Acknowledge in architecture
- [ ] Implementation deferred
- [ ] Must integrate later without refactor

### About (Tier 3)
- [ ] Build About page (simple informational page)

### Contribute (Tier 3)
- [ ] Build Contribute page (replaces old Suggestions)
- [ ] Form to submit contributions

### Our Projects (Tier 3)
- [ ] Build Our Projects page
- [ ] List of related projects

## PHASE 4: Functional Filters & Interconnections

### Archive Filters (CRITICAL - Must be REAL)
- [ ] Implement functional place filter
- [ ] Implement functional period/year filter
- [ ] Implement functional people filter
- [ ] Implement functional tags filter
- [ ] Implement functional document type filter (optional, supports "Unknown")
- [ ] Implement functional photo category filter (optional, supports "Unknown")
- [ ] Ensure items with unknown data display normally in filtered results

### System Interconnections
- [ ] Link History entries to: documents, photographs, poems, figures, places
- [ ] Link Figures to: history, poems, documents, photographs, ferjan
- [ ] Link Ferjan places to: photographs (auto-pull from Archive), history, figures
- [ ] Link Poems to: figures, history, places, documents, photos
- [ ] Link Reposts to: ferjan, figures
- [ ] Link Events to: places, people, reposts

### Search Functionality
- [ ] Implement global search across all content types
- [ ] Implement Archive-specific search
- [ ] Ensure search works with optional/unknown data

## PHASE 5: CMS & Admin

### Admin Panel Enhancements
- [ ] Easy creation for all content types (especially reposts)
- [ ] Support optional fields everywhere
- [ ] Draft → Review → Published workflow
- [ ] Reordering capabilities for sections, families, etc.
- [ ] Built for long-term scaling

### Content Management
- [ ] Everything editable from admin
- [ ] Support for "Unknown / Approximate" values
- [ ] No forced data requirements
- [ ] Easy linking between content types

## PHASE 6: Visual Polish & Motion

### Tier 1 Hero Visuals
- [ ] Add hero images for History (placeholder)
- [ ] Add hero images for Archive (placeholder)
- [ ] Add hero images for Ferjan (placeholder)
- [ ] Add hero images for Lineage (placeholder)
- [ ] Add hero images for Poems (placeholder)

### Motion & Interactions
- [ ] Implement hover-based image movement/parallax on Tier 1 heroes
- [ ] Smooth transitions throughout
- [ ] Restrained, elegant motion (NOT playful, NOT "game-like")

### Homepage Updates
- [ ] Feature Tier 1 sections prominently with hero visuals
- [ ] Ensure visual hierarchy matches tier system
- [ ] Remove old structure, implement new tier-based layout

## Design Quality Checklist
- [x] Heritage color palette (sand/beige + deep burgundy)
- [x] Clean editorial typography
- [x] Generous whitespace
- [x] Subtle borders
- [x] Museum-quality aesthetic
- [ ] Better than NLA.ae (cleaner, more modern, better motion, stronger visuals)

## Testing & Launch
- [ ] Test all Tier 1 sections
- [ ] Test all Tier 2 sections
- [ ] Test all Tier 3 sections
- [ ] Test all filters and search
- [ ] Test all interconnections
- [ ] Test admin panel workflows
- [ ] Test with optional/unknown data
- [ ] Final checkpoint before launch


## URGENT: Create All Missing Pages (NO 404s Allowed)

### Tier 1 Pages
- [x] Create /history page (history timeline listing)
- [x] Create /ferjan page (places listing)
- [x] Create /lineage page (family tree sections listing)
- [x] Create /lineage/figures page (figures listing)
- [x] Create /poems page (poems listing)
- [x] Create /archive/photographs page (photos listing)
- [ ] Create detail pages for all Tier 1 sections (using ArchiveDetail template for now)

### Tier 2 Pages
- [x] Create /books page (books listing)
- [x] Create /reposts page (reposts listing)
- [x] Create /events page (events listing)
- [x] Create /collaborations page (collaborations listing)
- [ ] Create detail pages for all Tier 2 sections (using ArchiveDetail template for now)

### Tier 3 Pages
- [x] Create /about page
- [x] Create /contribute page (submissions form)
- [x] Create /our-projects page

### Routing
- [x] Wire all pages in App.tsx
- [x] Ensure no navigation item leads to 404


## URGENT: Visual Build Phase (MANDATORY)

### Homepage Visual Build
- [x] Copy 5 aerial images to client/public/images/
- [x] Rebuild homepage hero with full-width carousel
- [x] Add dark overlay to hero images (bg-black/70 + backdrop-blur)
- [x] Implement strong typography (text-6xl/7xl font-light)
- [x] Add hover scale motion to hero (duration-[10s] hover:scale-105)
- [x] Ensure homepage feels cultural, serious, premium on first load

### Tier 1 Visual Identity
- [x] History page: Add visual hero with aerial-1.jpg, blur/dim, large title, hover scale motion
- [x] Archive page: Add visual hero with aerial-2.jpg, blur/dim, large title, hover scale motion
- [x] Ferjan page: Add visual hero with aerial-3.jpg, blur/dim, large title, hover scale motion
- [x] Lineage page: Add visual hero with aerial-4.jpg, blur/dim, large title, hover scale motion
- [x] Poems page: Add visual hero with aerial-5.jpg, blur/dim, large title, hover scale motion

### Tier 1 Sub-Collections Redesign
- [x] Archive → Documents/Photographs: Large image-based tiles with gradient overlays, hover scale-110
- [x] Lineage → Family Tree/Figures: Image-based cards with gradient overlays, hover effects
- [x] Ferjan → Places: Image-based place cards with gradient overlays, MapPin icons, hover scale-110
- [x] Remove all small grey cards and icon-only layouts
- [x] Make sub-collections feel curated, not like navigation menus

### Archive Visual Content
- [ ] Documents listing: Add visual previews for each document
- [ ] Photographs listing: Show images immediately (not empty state)
- [ ] Make filters visible and functional
- [ ] Ensure Archive never feels empty

### Ferjan Image-First Design
- [x] Add images to Ferjan landing cards (aerial-3/4/5.jpg with gradient overlays)
- [x] Add visual hero to Ferjan landing page
- [x] Make Ferjan feel geographic and temporal
- [x] No text-only Ferjan pages


## URGENT: Fix Nested Anchor Tags Error
- [x] Fix nested `<a>` tags in ArchiveHub.tsx (Link already creates <a>, don't nest another <a> inside)
- [x] Fix nested `<a>` tags in Ferjan.tsx
- [x] Fix nested `<a>` tags in Lineage.tsx
- [x] Verify no other pages have nested anchor tag errors


## URGENT: Homepage Complete Redesign (LIVING SHOWCASE)

### Hero Section Redesign
- [x] Remove static title-only hero
- [x] Build hero as interactive showcase with 5 featured Tier 1 tiles overlaid on background
- [x] Implement smooth, slow crossfade between 5 aerial images (3000ms transition, 8000ms interval)
- [x] Each showcase tile: image-backed, title only, hover sharpens image (opacity 40% → 60%) + prominent title
- [x] Tiles link directly to sections (History, Archive, Ferjan, Lineage, Poems)
- [x] Hero answers "What can I explore here?" immediately with grid of showcase tiles

### Tier 1 Collections Layout Redesign
- [x] Remove uniform grid cards (beginner-level template look)
- [x] Build asymmetrical/editorial layout with different-sized blocks (12-column grid)
- [x] History = 7 columns (500px height) - largest visual weight
- [x] Archive = 5 columns (500px height) - large visual weight
- [x] Ferjan = 5 columns (380px height) - secondary size
- [x] Lineage = 4 columns (380px height) - secondary size
- [x] Poems = 3 columns (380px height) - distinct, elegant treatment
- [x] Each block: image-based, gradient overlay (from-black/90), large title (text-4xl/5xl), descriptive subtitle
- [x] Smooth hover motion (scale-110 on image, translate-y on title, shadow-2xl on card)
- [x] NO icons, NO equal-sized boxes, clean "Explore →" with ChevronRight

### Visual Language Enforcement
- [x] Images lead, text supports (everywhere) - all sections image-backed
- [x] Fewer words, stronger visuals - minimal text, large images
- [x] No flat grey sections - gradient overlays, image backgrounds throughout
- [x] No generic UI blocks - asymmetrical layout, different-sized blocks
- [x] Must feel like cultural platform, NOT CMS demo - living showcase design
- [x] Must be more immersive than NLA.ae - interactive tiles, smooth transitions, editorial layout

### Quality Check Before Completion
- [x] Does homepage feel like a cultural platform, not a CMS? YES - living showcase with interactive tiles
- [x] Would a young user want to explore this visually? YES - immediate visual impact with hover effects
- [x] Does the homepage tell a story without reading? YES - showcase tiles + asymmetrical layout show content hierarchy


## URGENT: Homepage Exact Pixel-Perfect Rebuild (FINAL SPEC)

### Section 1: Hero (Atmosphere Only)
- [x] Full-width image (100vw, ~70vh height)
- [x] ONE image visible at a time
- [x] Smooth crossfade only (7 seconds, 2s transition duration, no sliding/snapping/zooming)
- [x] Dark gradient overlay (top → bottom, from-black/70 via-black/50 to-black/70)
- [x] Centered content: Title "Freej AlMarar" + one-line subtitle ONLY
- [x] NO buttons, NO tiles, NO cards in hero
- [x] Hero purpose: Set tone only, NOT navigation

### Section 2: Tier 1 Showcase (2x3 Grid)
- [x] Grid layout: 2 rows × 3 columns (desktop) - grid-cols-3 gap-6
- [x] Large horizontal rectangles, equal height (h-64), clean alignment
- [x] Show ONLY these 5: History, Archive, Ferjan, Lineage, Poems
- [x] Leave one grid space empty (5 items in 3-column grid)
- [x] Each card structure:
  * Full image background (bg-cover bg-center)
  * Dark overlay (50% → 40% on hover)
  * Bottom-left aligned text (p-8)
  * Large title (text-4xl) + short descriptor (text-sm)
- [x] Interaction: Entire card clickable, hover brightens image (brightness-110) + reduces overlay (bg-black/40) + translate-y-[-4px]
- [x] NO icons, NO buttons, NO "Explore →" text, NO vertical cards
- [x] Matches NLA.ae main content blocks style

### Section 3: Tier 2 (Secondary)
- [x] Show Tier 2 below Tier 1: Reposts, Events, Collaborations, Books
- [x] Simple grid (grid-cols-4), smaller cards (h-48), still image-based
- [x] Less visual weight than Tier 1 (smaller text, lighter section background)
- [x] Purpose: Supporting content, NOT competing with main pillars

### Visual Rules (Non-Negotiable)
- [x] Image-first everywhere - all sections use aerial images as backgrounds
- [x] Calm, national-archive tone - matches NLA.ae style exactly
- [x] No experimental layouts - clean 2x3 grid, simple 4-column grid
- [x] No artistic abstractions - straightforward image cards
- [x] No thin vertical cards - horizontal rectangles only
- [x] No playful UI - professional, institutional design
- [x] Passes quality check - looks like national archive, NOT design experiment/art portfolio/CMS demo


## URGENT: Fix Top Bar + Tier 1 Layout (Authority Level)

### Top Bar Rebuild (3 Functional Zones)
- [x] LEFT: Logo "Freej AlMarar" → click goes to Home
- [x] CENTER: Tier 1 links ONLY (History, Archive, Ferjan, Family Trees, Poems)
- [x] RIGHT: Global Search icon + Language toggle (العربية)
- [x] REMOVE from top bar: Reposts, Events, Collaborations, Books, About, Contribute, Our Projects
- [x] These Tier 2/3 items belong elsewhere, NOT in top navigation

### Tier 1 Pillar Layout (NO MORE SQUARE GRID)
- [x] Desktop layout structure:
  ```
  [ HISTORY ]   [ ARCHIVE ]   [ FERJAN ]
     (tall)        (tall)       (tall)
  
          [ LINEAGE ]    [ POEMS ]
             (wide, shorter)
  ```
- [x] Creates clear entry point, visual hierarchy, museum-level seriousness

### Card Design (MANDATORY STYLE)
- [x] Tall vertical rectangles (h-[500px]) for top 3
- [x] Wide shorter rectangles (h-[320px]) for bottom 2
- [x] Full image background with bg-cover bg-center
- [x] Heavy dark gradient bottom → top (from-black via-black/60 to-transparent)
- [x] Text locked to bottom: Title (text-4xl) + descriptor (text-sm)
- [x] Hover: Image sharpens (scale-105 brightness-110), gradient lifts (from-black/90), title moves upward (-translate-y-2)
- [x] NO icons, NO borders, NO white card backgrounds
- [x] Feels editorial, not UI

### Archive Card Special Rule
- [x] Archive card description changed to "Documents & Photographs"
- [x] Click → Archive landing (Documents + Photographs only)

### Below Tier 1 (Secondary Section)
- [ ] Horizontal section with Reposts, Events, Collaborations, Books
- [ ] Smaller cards, lighter tone, less dramatic
- [ ] Keep this section as-is from current design

### DO NOT DO
- [ ] No experimental stacked vertical strips
- [ ] No rotating carousels for Tier 1
- [ ] No white boxed cards for main content
- [ ] No icon-based navigation


## URGENT: Navigation System Overhaul + Back Controls + Empty State Fixes

### 1. Clean Top Bar + Master Menu System
- [ ] Rebuild top bar with ONLY 3 zones:
  * LEFT: Logo/Home link
  * CENTER: Menu button (☰ or "Menu")
  * RIGHT: Search icon + Dark mode toggle + Language toggle (العربية)
- [ ] Remove all navigation links from top bar (History, Archive, Ferjan, Family Trees, Poems)
- [ ] Build full-screen overlay menu (or right-side drawer) triggered by Menu button
- [ ] Menu overlay structure:
  * Tier 1 (Primary): History, Archive (dropdown: Documents, Photographs), Ferjan, Lineage/Family Trees, Poems
  * Tier 2: Reposts, Events, Collaborations, Books
  * Tier 3: About, Contribute/Suggestions
- [ ] Archive item must have dropdown showing Documents + Photographs sub-items
- [ ] Menu overlay must have close button (X) and backdrop click to close

### 2. Back Control + Breadcrumbs (Every Page)
- [ ] Add Back button to top-left of content area on ALL pages (History, Archive, Ferjan, Lineage, Poems, Documents, Photographs, etc.)
- [ ] Back button behavior:
  * If user came from within site: router.back()
  * If direct entry (no history): fallback to Home
- [ ] Add breadcrumbs under page title on ALL pages:
  * Home / Poems
  * Home / Archive / Documents
  * Home / Archive / Photographs
  * Home / Ferjan
  * Home / Lineage
  * Home / History

### 3. Fix Empty-State Page Layouts
- [ ] Fix Poems page empty state:
  * Add proper header block (title + one-line description)
  * Keep search + filters
  * Show clean empty-state card (not floating in white space)
  * "Add poem" button ONLY for admin (check user.role === 'admin')
  * Remove public "Contribute a poem" button
- [ ] Apply same empty-state fixes to ALL content pages:
  * Documents, Photographs, Ferjan, History, Events, Reposts, Collaborations, Books
  * Proper header + clean empty-state card + admin-only "Add" buttons


## URGENT: Navigation System Overhaul (CLEAN TOP BAR + MASTER MENU)

### Clean Top Bar (3 Zones)
- [x] LEFT: Logo "Freej AlMarar" → Home
- [x] CENTER: Menu button (☰)
- [x] RIGHT: Search icon + Dark mode toggle + Language toggle (العربية)
- [x] Remove all Tier 1/2/3 links from top bar

### Master Menu Overlay
- [x] Create MasterMenu component (right-side drawer with backdrop)
- [x] Tier 1 section: History, Archive (dropdown: Documents, Photographs), Ferjan, Family Trees, Poems
- [x] Tier 2 section: Reposts, Events, Collaborations, Books
- [x] Tier 3 section: About, Contribute, Our Projects
- [x] Archive dropdown shows Documents + Photographs sub-items
- [x] Clean, grouped navigation with section headers ("Primary", "More", "About")

### Back Button + Breadcrumbs
- [x] Create BackButton component (router.back() with fallback to Home)
- [x] Create Breadcrumbs component
- [x] Add Back button to top-left of content area on Poems page
- [ ] Add Back button + breadcrumbs to remaining pages (History, Archive, Ferjan, Lineage, Documents, Photographs, etc.)

### Fix Empty-State Layouts
- [x] Add proper header block (title + description) to Poems page
- [x] Wrap empty state in clean card (bg-card with border)
- [x] Admin-only "Add Poem" button (using useAuth to check role)
- [ ] Apply same pattern to all other empty pages (History, Ferjan, Lineage, Documents, Photographs, etc.)

### Apply to All Pages
- [x] Homepage: Clean top bar with Menu button
- [x] Poems page: Clean top bar + Back button + Breadcrumbs + fixed empty state
- [ ] History page: Clean top bar + Back button + Breadcrumbs
- [ ] Archive Hub: Clean top bar + Back button + Breadcrumbs
- [ ] Documents: Clean top bar + Back button + Breadcrumbs
- [ ] Photographs: Clean top bar + Back button + Breadcrumbs
- [ ] Ferjan: Clean top bar + Back button + Breadcrumbs
- [ ] Lineage: Clean top bar + Back button + Breadcrumbs
- [ ] Figures: Clean top bar + Back button + Breadcrumbs
- [ ] Reposts: Clean top bar + Back button + Breadcrumbs
- [ ] Events: Clean top bar + Back button + Breadcrumbs
- [ ] Collaborations: Clean top bar + Back button + Breadcrumbs
- [ ] Books: Clean top bar + Back button + Breadcrumbs
- [ ] About: Clean top bar + Back button + Breadcrumbs
- [ ] Contribute: Clean top bar + Back button + Breadcrumbs
- [ ] Our Projects: Clean top bar + Back button + Breadcrumbs


## URGENT: Complete Structural Overhaul (Living Historical Archive)

### 1. Global Layout Density Fix (MOST IMPORTANT)
- [x] Increase max content width globally (max-w-[1800px] on homepage)
- [x] Reduce horizontal padding (px-8 instead of excessive padding)
- [x] Make Hero section full-width edge-to-edge (no container constraint)
- [x] Make Tier 1 cards full-width within max-w-[1800px] container
- [x] Add full-width section dividers/separators (Tier 2 with border-y)
- [x] Remove excessive white/cream space on sides
- [x] Goal: Dense, grounded, archival feel (NOT airy modern-SaaS)

### 2. Tier 1 Section Structural Rework
- [x] Group Tier 1 into single strong visual block (masonry grid with gap-6)
- [x] Implement masonry-style grid with vertical pillars (5-4-3 columns top, 5-7 columns bottom)
- [x] Cards visually "lock together" with consistent gap-6, no random gaps
- [x] Add subtle motion: scale-105 on hover, brightness-110, translate-y-2 on text, shadow-2xl
- [x] Tier 1 feels like heart of archive with heavy gradients and depth

### 3. Tier 2 Section Complete Redesign
- [x] Wrap Tier 2 in distinct visual container (bg-accent/20 with border-y)
- [x] Align Tier 2 cards tighter (gap-4 instead of gap-6)
- [x] Reduce card height (h-[240px] vs Tier 1's h-[600px]/h-[380px])
- [x] Remove "another homepage section" feeling ("More from the Archive" subtitle in muted-foreground)
- [x] Tier 2 = supporting archive layers, NOT equal to Tier 1

### 4. Top Bar Visual & Interaction Fixes
- [x] Add visual density: bg-background/98 backdrop-blur-md, border-b, shadow-sm
- [x] Search icon → opens real search overlay with input field and ESC to close
- [x] Dark mode toggle → works globally with localStorage persistence (Sun/Moon icons)
- [ ] Language toggle (العربية) → function or disable (currently placeholder button)
- [x] Menu button: toggles open/close with ONE click, clicking outside closes it, ESC closes it

### 5. Sidebar Menu Critical UX Fix
- [x] Improve sidebar background (bg-card/95 backdrop-blur-md with shadow-2xl)
- [x] Increase spacing and hierarchy between sections (space-y-10, section headers with uppercase tracking-widest)
- [x] Stronger hover + active states (hover:translate-x-1, active page with bg-primary shadow-md)
- [x] Clear visual indicator of current page (bg-primary for Tier 1, bg-accent for Tier 2/3)
- [x] Smooth open/close animation (translate-x-full to translate-x-0 with duration-300 ease-out)

### 6. Global Page Pattern (Apply to ALL Pages)
- [ ] Clear hero header on all content pages
- [ ] Breadcrumbs on all content pages
- [ ] Back button on all inner content pages (same placement, same style)
- [ ] Search + filters where relevant
- [ ] Empty states that feel intentional (not placeholders)
- [ ] Back button always returns to previous logical layer

### 7. Inner Pages Atmosphere (Reposts, Poems, Events, Books, etc.)
- [ ] Reduce plain white backgrounds
- [ ] Add subtle texture/tone to all pages
- [ ] Improve empty states: icon + short text + strong CTA, no "dead center floating" look
- [ ] Make pages feel part of same world as homepage

### 8. Dark Mode Implementation (REQUIRED)
- [x] Implement real dark mode for backgrounds, cards, text (document.documentElement.classList.add/remove('dark'))
- [x] Preserve contrast and readability in dark mode (using semantic color tokens)
- [x] Toggle works globally and persists across sessions (localStorage)
- [ ] Test all pages in both light and dark modes (currently only homepage tested)

### 9. Overall Direction Validation
- [ ] Every decision must answer: "Does this feel like a living historical archive?"
- [ ] Site must feel: Cultural, Archival, Serious, Emotional
- [ ] Site must NOT feel: CMS demo, Startup landing page, Clean template showcase


## URGENT: Dense Layout Global Rollout (Homepage Pattern Applied to All Pages)

### Homepage Density Fix (COMPLETED)
- [x] Remove max-w-[1800px] constraint from Tier 1 section → changed to w-full
- [x] Reduce padding from px-8 to px-4 on Tier 1 section
- [x] Remove max-w-[1800px] constraint from Tier 2 section → changed to w-full
- [x] Reduce padding from px-8 to px-4 on Tier 2 section
- [x] Increase Tier 2 background darkness from bg-accent/20 to bg-accent/40
- [x] Result: Cards extend close to edges, dense archival feel, clear Tier 1/2 separation

### Apply Dense Layout to All Tier 1 Pages
- [x] History page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Archive Hub page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Ferjan page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Lineage page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Documents page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Photographs page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Poems page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel

### Apply Dense Layout to All Tier 2 Pages
- [x] Reposts page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Events page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Collaborations page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Books page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel

### Apply Dense Layout to All Tier 3 Pages
- [x] About page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Contribute page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel
- [x] Our Projects page: Remove max-w constraints, reduce padding, ensure edge-to-edge feel

### Pattern to Apply:
- Replace `max-w-[1800px] mx-auto px-8` with `w-full px-4` or `px-2`
- For hero sections: Keep full-width (no container at all)
- For content sections: Use `w-full` instead of max-w constraints
- Ensure cards/content extend close to edges (minimal white space)
- Maintain atmospheric design (gradients, overlays, depth)
- Keep proper structure (top bar, back button, breadcrumbs)


## URGENT: Full UI/UX Overhaul - Premium Museum-Grade Design System

### 0. Non-Negotiable Direction
- [ ] Theme: Heritage / archival / museum-grade, modern but warm
- [ ] Remove "unfinished demo" feeling (no random whitespace, no floating blocks, no inconsistent page styles)
- [ ] One unified design system across Home + all sections
- [ ] Use same components everywhere: Hero, Section Header, Collection Grid, Filters/Search Bar, Empty State, Footer

### 1. Global Layout Fix (MAIN PROBLEM)

#### A) Kill the "Dead Space"
- [x] Set site to full-width or max-width 1200-1400px with balanced margins (max-w-7xl)
- [x] Replace flat white background with textured/gradient background
- [x] Option 1: Dark mode default with textured/gradient background ✅ DONE
- [x] Option 2: Parchment/off-white texture with darker sections and strong contrast (light mode)
- [x] Every page must feel filled and composed (no empty beige ocean)

#### B) Header Must Become "Control Center"
- [x] Make top bar premium and functional
- [x] Left: Logo/name
- [x] Center: "Menu" (navigation trigger)
- [x] Right icons: Search, Theme toggle, Language toggle
- [x] Add subtle blur/transparent glass effect on scroll (sticky header)
- [x] Fix alignment, spacing, hover states, icon sizing, typography

#### BUGS TO FIX IN HEADER:
- [x] Search icon must open global search (works everywhere)
- [x] Theme toggle must actually switch themes and persist
- [x] "العربية" must actually switch language + RTL layout
- [x] Ensure header is consistent on every page (Header component created for reuse)

### 2. Menu / Sidebar Rebuild (CURRENT SIDEBAR IS BAD)
- [x] Sidebar should feel premium: dark panel, clear section labels, good spacing, hover states, active state
- [x] Add overlay backdrop; clicking backdrop closes
- [x] Add clear X close button and ESC closes
- [x] If "Menu" clicked again it should close (toggle) - Header component handles this
- [x] Add small descriptions or icons for primary items (section labels implemented)
- [ ] Ensure it supports RTL properly when Arabic is selected (TODO: test with Arabic)

### 3. Dark Mode Must Be "Main" Experience (NOT AFTERTHOUGHT)
- [x] Dark mode should look like museum archive: charcoal / deep brown / warm highlights
- [x] Text contrast must be perfect
- [x] Cards should have subtle depth (soft shadow or border)
- [x] Buttons should have consistent style (primary / secondary)
- [x] Light mode can exist, but dark mode must look elite
- [x] Set dark mode as default theme

### 4. Page Template Overhaul (GLOBAL for Poems/Books/Reposts/Events etc.)

#### A) Hero Section
- [ ] Each page needs real hero: title, short subtitle, background image/texture, readable overlay
- [ ] Reduce "blank area" below hero; flow directly into content

#### B) Navigation Aids (GLOBAL)
- [ ] Add breadcrumbs on every page (Home > Section > Item)
- [ ] Add Back button pattern that is global: "← Back" (history back) + breadcrumbs OR "Back to [Section]"
- [ ] This must exist on ALL internal pages, not only Poems

#### C) Filters/Search Layout Must Be Premium
- [ ] Put Search + Filters into single elegant bar component
- [ ] Filters should open side panel or modal with nice UI (not random button)
- [ ] On empty pages, don't leave giant blank grid

#### D) Empty States Must Be Designed (CURRENTLY EMBARRASSING)
- [ ] Add designed empty state card with: icon/illustration, short friendly message, primary CTA ("Contribute", "Add Item", "Upload"), secondary CTA ("Learn how it works")
- [ ] Keep layout visually rich even when empty

### 5. Homepage Composition (FIX "NOT AMAZING" FEELING)

#### Improve Tier-1 Card Section:
- [ ] Fix spacing so there is no huge blank area on sides (DONE - verify)
- [ ] Ensure all tier-1 cards align perfectly and fill row in balanced grid
- [ ] Add subtle hover motion/parallax and elegant blur overlay behind text (premium effect)

#### Tier-2 ("More from…") Section:
- [ ] Current row looks random and floating
- [ ] Create proper section block with background band, title, short description, then grid

#### "About" Block:
- [ ] Must visually connect to site (currently feels pasted in)
- [ ] Make it designed section with stronger typography and better spacing
- [ ] Buttons must match the system

### 6. Consistency Checks (MUST PASS)

Every page must use the same:
- [ ] Typography scale
- [ ] Spacing system
- [ ] Button styles
- [ ] Card styles
- [ ] Section headers
- [ ] Footer style
- [ ] No page should look like it belongs to different website (currently they do)

### 7. Deliverables / Acceptance Criteria

- [ ] Header: search/dark mode/arabic work + looks premium
- [ ] Menu/sidebar: toggles correctly, closes via X/backdrop/ESC, looks premium
- [ ] Global page template: hero + breadcrumbs/back + search/filters bar + designed empty states
- [ ] Homepage: no dead whitespace, tier sections are cohesive, looks like flagship museum site
- [ ] Consistency: every section (Poems/Books/Reposts/Events/etc.) matches same system
- [ ] Do not ship another "basic collection page" - must look like finished, high-end archive platform


## URGENT: Tier 1 Architectural Framing Fix ✅ COMPLETED

### Problem: Tier 1 pillars are floating in beige emptiness (NOT ACCEPTABLE)
- [x] Tier 1 is NOT a normal section - it's hero content
- [x] Current state: Pillars floating off-center in flat beige background → FIXED
- [x] Required: Contained hero block with dark gradient/textured background → DONE

### Fix Requirements:

#### 1. Create Contained Hero Block
- [x] Dark gradient or textured background (bg-gradient-to-b from-accent/70 via-accent/50 to-accent/70)
- [x] Subtle vignette to frame the content (radial gradient with rgba(0,0,0,0.5))
- [x] Visual container that "holds" the pillars in place (border-y border-border)

#### 2. Pillar Composition
- [x] Pillars must be visually centered (max-w-7xl mx-auto)
- [x] Equal spacing between pillars (grid with gap-4 md:gap-6)
- [x] Feel intentional and architectural (not random floating)
- [x] Optional: Slight perspective depth (vignette creates depth)
- [x] Optional: Subtle hover motion (hover:-translate-y-2 parallax effect)

#### 3. Background Correction
- [x] Make background darker so content pops (accent/70 to accent/50)
- [x] Introduce framed content container (section with borders)
- [x] Rule: Flat beige background with floating elements = NOT ACCEPTABLE → FIXED

#### 4. Typography & Hierarchy
- [x] "Explore Our Archive" must anchor the section, not float above emptiness
- [x] Increase contrast between heading, subtitle, and background
- [x] Tie heading visually to pillar grid (same container)
- [x] Heading should be INSIDE the hero block, not floating above

#### 5. Global Rule (applies everywhere)
- [x] No section is allowed to: sit off-center, float without container, leave massive unused space
- [x] Every major section must answer: "What is holding this content in place?"
- [x] If answer is "nothing", it's wrong

### Apply to Homepage Sections
- [x] Hero section: Full-width with dark gradient - GOOD
- [x] Tier 1: Dark architectural hero block with vignette - FIXED
- [x] Tier 2: Background band with borders - GOOD
- [x] About section: Added bg-muted/30 and borders - FIXED
- [x] Footer: Proper background and border-t - GOOD

### Apply to All Other Pages (TODO)
- [ ] Review every section on every page (History, Archive, Ferjan, Lineage, Documents, Photos, Reposts, Events, Collaborations, Books, About, Contribute, OurProjects)
- [ ] Ensure all content is visually contained
- [ ] No floating blocks allowed


## BUG: Nested Anchor Tags Error ✅ FIXED
- [x] Fix nested `<a>` tags in homepage (Link component already renders <a>, don't wrap another <a> inside)
- [x] Pattern: `<Link><a>...</a></Link>` should be `<Link>...</Link>`
- [x] Fixed About section buttons: moved className to Link component, removed nested <a> tags
- [x] Verified Tier 1 and Tier 2 cards are correct (wrapping <div>, not <a>)
- [x] Console is clean, no errors


## CRITICAL: Complete UI Overhaul (User Directive - Jan 18)

### 1. Tier-1 Cards Section (REBUILD FROM SCRATCH)
- [x] Container: max-width 1280px (max-w-6xl), padding-inline 16px
- [x] Grid: 3 columns desktop, 2 tablet, 1 mobile
- [x] Card sizing: ALL same height (h-80 = 320px)
- [x] Spacing: gap-6 (24px) desktop, gap-4 (16px) mobile
- [x] Card design: photo bg + dark gradient overlay from bottom
- [x] Title/subtitle placement: bottom-left, consistent
- [x] Hover: subtle lift (-translate-y-1) + scale-105 on image
- [x] Remove dead space: section feels dense/intentional

### 2. Homepage Structure
- [x] Hero: 65vh desktop, 50vh mobile, darker overlay for text
- [x] Tier-1 grid immediately under hero
- [x] Tier-2: 4 cards desktop (2 tablet, 1 mobile), height h-48 (192px)
- [x] About block: integrated into container with bg-muted/30 and borders

### 3. Global Top Bar (System-Level)
- [x] Single sticky header across ALL pages (Header component)
- [x] Left: site name/logo (فريج المرر)
- [x] Center: Menu button
- [x] Right: Search, Theme toggle, Language toggle
- [x] NO Tier-1 links duplicated in header
- [x] Height: h-16 (64px)
- [x] Background matches theme with glass effect on scroll

### 4. Menu/Sidebar Redesign
- [x] Menu button toggles open/close in ONE click
- [x] Click outside closes
- [x] ESC closes
- [x] Clear close icon (X)
- [x] Match theme colors (dark mode compatible)
- [x] Clean typography
- [x] Clear grouping: الأرشيف الرئيسي / المزيد من المحتوى / عنا
- [x] Obvious active state (bg-primary for Tier 1)
- [x] Premium spacing and dividers

### 5. Dark Mode + Arabic Toggle (MUST WORK)
- [x] Dark mode applies to: background, header, sidebar, cards, search modal, all pages
- [x] Language toggle switches to RTL in Arabic
- [x] Correct Arabic labels (full translations in MasterMenu)
- [x] Header + sidebar layout flips properly in RTL (menu on left in Arabic)

### 6. Back Navigation Pattern (ALL PAGES)
- [ ] Every inner page: breadcrumb (Home > Section > Detail)
- [ ] Back button returns to parent section
- [ ] Empty search results: back button to correct parent

### 7. Empty States (Consistent Component)
- [ ] Icon + short message + optional CTA
- [ ] Centered layout with correct spacing
- [ ] NOT floating randomly

### 8. Premium Archive Look
- [ ] Consistent 8px spacing scale
- [ ] Typography hierarchy (H1/H2/body)
- [ ] Consistent card style across site
- [ ] NO random huge blank beige areas
- [ ] Everything aligns to same grid/container


## BUG: Nested Anchor Tags on Contribute Page ✅ FIXED
- [x] Added Header component to Contribute page (was missing)
- [x] Fixed duplicate useState import in Poems.tsx
- [x] Console is clean, no nested anchor errors


## Promote Figures to Tier 1 Section
- [x] Add top-level /figures route to App.tsx (keep /lineage/figures for backward compatibility)
- [x] Add Figures to tier1Collections in Home.tsx (6 tiles = 2 rows of 3)
- [x] Add Figures to MasterMenu translations and navigation
- [x] Remove Figures card from Lineage.tsx quick access cards
- [x] Add Figures link to all Tier 1 page navigation bars (History, ArchiveHub, Ferjan, Lineage)
- [x] Fixed nested anchor tags in all Tier 1 pages (Link + className instead of Link > a)
- [x] Test /figures works → Shows Figures page with search, filters, empty state
- [x] Test /lineage/figures still works (backward compatibility via redirect)
- [x] Confirm homepage shows 6 Tier 1 tiles (2 rows of 3)
- [x] Confirm Lineage page no longer has Figures card (only Family Tree Coming Soon)


## Rename Lineage to Family Tree + Add BackButton
- [ ] Create BackButton component
- [ ] Update Header with BackButton (shows on all pages except homepage)
- [ ] Create FamilyTree.tsx (main page with 8 tribe sections)
- [ ] Create FamilyTreeSection.tsx (shows families in a section)
- [ ] Create FamilyTreeFamily.tsx (shows family details)
- [ ] Update App.tsx routes - remove Lineage, add FamilyTree routes, add redirects
- [ ] Update MasterMenu - rename familyTrees to familyTree, update links
- [ ] Update Home.tsx - rename Family Trees to Family Tree, update path
- [ ] Update Footer - rename Family Trees to Family Tree, update links
- [ ] Update Figures.tsx - change link paths from /lineage/figures to /figures
- [ ] Delete Lineage.tsx (no longer needed)
- [ ] Test /family-tree route
- [ ] Test /family-tree/:sectionId route
- [ ] Test /family-tree/:sectionId/:familyId route
- [ ] Test /lineage redirect to /family-tree
- [ ] Test BackButton appears on inner pages but not homepage


## Rename Lineage to Family Tree + Create Drill-Down Pages ✅ COMPLETED
- [x] Create BackButton component
- [x] Update Header with BackButton (shows on inner pages, not homepage)
- [x] Create FamilyTree.tsx main page with 8 placeholder sections
- [x] Create FamilyTreeSection.tsx page with 6 placeholder families
- [x] Create FamilyTreeFamily.tsx page with placeholder content
- [x] Update App.tsx routes: /family-tree, /family-tree/:sectionId, /family-tree/:sectionId/:familyId
- [x] Add redirects: /lineage → /family-tree, /lineage/figures → /figures
- [x] Update MasterMenu translations and links
- [x] Update Home.tsx tier1Collections (renamed to Family Tree, updated path)
- [x] Update Footer links (added Figures, renamed to Family Tree)
- [x] Update Figures.tsx links
- [x] Test all drill-down navigation → All 3 levels working


## Create SectionLayout Component
- [x] Create SectionLayout.tsx with Header, Footer, hero section, back button, and content area
- [x] Provides consistent layout wrapper for all section pages


## Search and Filtering System for SectionLayout ✅ COMPLETED
- [x] Create SearchFilters component with search bar and configurable filter controls
- [x] Create useFilters hook for filter state management
- [x] Integrate SearchFilters into SectionLayout with optional filters prop
- [x] Create example implementation showing filters in action (Poems page)
- [x] Support filter types: text search, select dropdowns, date range, tags
- [x] Arabic translations for all filter labels and options
- [x] Active filter badges with clear functionality
- [x] Results count display when filters active


## Fix Back Button Navigation ✅ COMPLETED
- [x] Back button should always be displayed (not just on inner pages)
- [x] Back button should use window.history.back() to go to previous page
- [x] Remove hardcoded backHref links from SectionLayout
- [x] Update Header component (removed location !== "/" condition)
- [x] Update SectionLayout component (removed backHref prop, use history.back())
- [x] Update Home.tsx header (added back button)
- [x] Tested: Back button visible on homepage and inner pages, navigates correctly


## Apply SectionLayout to Tier 1 Pages
- [ ] Refactor History page to use SectionLayout with search and filters
- [ ] Refactor Ferjan page to use SectionLayout with location filters
- [ ] Refactor Figures page to use SectionLayout with category filters
- [ ] Refactor ArchiveHub page to use SectionLayout with document type filters
- [ ] Test all pages for consistent design


## Apply SectionLayout to Tier 1 Pages ✅ COMPLETED
- [x] Refactor History page to use SectionLayout with period/era filters
- [x] Refactor Ferjan page to use SectionLayout with location filters  
- [x] Refactor Figures page to use SectionLayout with category filters
- [x] Refactor ArchiveHub page to use SectionLayout with document type filters
- [x] Test all pages for consistent design - All 4 pages working with RTL and dark mode


## NavHistoryContext Integration ✅ COMPLETED
- [x] Integrate NavHistoryContext for in-app navigation history
- [x] Wrap app with NavHistoryProvider in App.tsx
- [x] Update Header back button to use NavHistoryContext
- [x] Track route changes with NavHistoryContext (auto-tracks via useLocation)

## Family Tree Section Names Update
- [x] Update FamilyTree.tsx section names to Arabic tribe names (الرميثات، الملاهمة، المصانعه، المجادعه، المصاعبه، ال بو رايح، الثميرات، الرواشد)
