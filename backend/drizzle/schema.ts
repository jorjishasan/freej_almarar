import { mysqlTable, int, varchar, text, timestamp, boolean, json, mysqlEnum } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Content workflow status for all content types
 */
export type ContentStatus = "draft" | "review" | "published";

/**
 * Navigation menu items - fully editable by admins
 */
export const navigationItems = mysqlTable("navigation_items", {
  id: int("id").autoincrement().primaryKey(),
  labelEn: varchar("label_en", { length: 100 }).notNull(),
  labelAr: varchar("label_ar", { length: 100 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  parentId: int("parent_id"), // For dropdown menus
  order: int("order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  featuredImageUrl: varchar("featured_image_url", { length: 500 }), // Optional featured image for dropdowns
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type NavigationItem = typeof navigationItems.$inferSelect;
export type InsertNavigationItem = typeof navigationItems.$inferInsert;

/**
 * Archive items - DOCUMENTS ONLY (per locked vision)
 * Historical documents, artifacts, records
 */
export const archiveItems = mysqlTable("archive_items", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  imageUrls: json("image_urls").$type<string[]>(),
  fileUrls: json("file_urls").$type<string[]>(),
  
  // Document type - optional, CMS-editable, filterable, supports "Unknown"
  documentType: varchar("document_type", { length: 100 }),
  
  // Metadata for filtering and linking
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>(),
  year: int("year"),
  period: varchar("period", { length: 200 }), // e.g., "1940s", "Early 20th Century", "Unknown"
  
  // Place linking (optional)
  placeId: int("place_id"), // Links to ferjan (places) table
  placeEn: varchar("place_en", { length: 200 }), // Fallback if no place_id
  placeAr: varchar("place_ar", { length: 200 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  
  // People linking (optional, many-to-many via junction table)
  // See archiveItemFigures table below
  
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type ArchiveItem = typeof archiveItems.$inferSelect;
export type InsertArchiveItem = typeof archiveItems.$inferInsert;

/**
 * Photos - PHOTOGRAPHS ONLY (part of Archive per locked vision)
 * Visual heritage and photographic archive
 */
export const photos = mysqlTable("photos", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  
  // Photo category - optional, CMS-editable, filterable, supports "Unknown"
  photoCategory: mysqlEnum("photo_category", ["place", "person", "event", "tribe", "other", "unknown"]),
  
  photographer: varchar("photographer", { length: 200 }),
  year: int("year"),
  period: varchar("period", { length: 200 }), // e.g., "1950s", "Mid 20th Century", "Unknown"
  
  // Place linking (optional)
  placeId: int("place_id"), // Links to ferjan (places) table
  placeEn: varchar("place_en", { length: 200 }), // Fallback if no place_id
  placeAr: varchar("place_ar", { length: 200 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  
  // People linking (optional, many-to-many via junction table)
  // See photoFigures table below
  
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

/**
 * Poems - Tier 1 standalone section (NOT in Archive)
 * Literary heritage and poetic works
 */
export const poems = mysqlTable("poems", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  poetEn: varchar("poet_en", { length: 200 }),
  poetAr: varchar("poet_ar", { length: 200 }),
  
  // Figure linking (optional)
  figureId: int("figure_id"), // Links to figures table
  
  year: int("year"),
  period: varchar("period", { length: 200 }),
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>(),
  audioUrl: varchar("audio_url", { length: 500 }),
  
  // Place linking (optional)
  placeId: int("place_id"),
  
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Poem = typeof poems.$inferSelect;
export type InsertPoem = typeof poems.$inferInsert;

/**
 * Books - Tier 2 (planned, deferred implementation)
 * Published works, manuscripts, literature
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  authorEn: varchar("author_en", { length: 200 }),
  authorAr: varchar("author_ar", { length: 200 }),
  
  // Figure linking (optional)
  figureId: int("figure_id"),
  
  isbn: varchar("isbn", { length: 50 }),
  publisherEn: varchar("publisher_en", { length: 200 }),
  publisherAr: varchar("publisher_ar", { length: 200 }),
  publishYear: int("publish_year"),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Events - Tier 2
 * Community events, exhibitions, workshops
 * Supports upcoming and past events
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  locationEn: varchar("location_en", { length: 300 }),
  locationAr: varchar("location_ar", { length: 300 }),
  
  // Place linking (optional)
  placeId: int("place_id"),
  
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  imageUrls: json("image_urls").$type<string[]>(),
  registrationUrl: varchar("registration_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>(),
  
  // People linking (optional, many-to-many via junction table)
  // See eventFigures table below
  
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Reposts - Tier 2
 * Curated social archive entries (native storage, not embeds)
 * Manually curated only
 */
export const reposts = mysqlTable("reposts", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  captionEn: text("caption_en"), // For manual add mode
  captionAr: text("caption_ar"),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  
  // Source information
  sourceType: mysqlEnum("source_type", ["instagram", "twitter", "facebook", "manual", "other"]).notNull(),
  sourceUrl: varchar("source_url", { length: 500 }), // Original link (optional for manual)
  sourceNameEn: varchar("source_name_en", { length: 200 }),
  sourceNameAr: varchar("source_name_ar", { length: 200 }),
  
  // Media (for manual uploads or auto-fetched)
  mediaUrl: varchar("media_url", { length: 500 }), // Image or video
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  mediaType: mysqlEnum("media_type", ["image", "video", "carousel"]),
  
  // Linking to Ferjan and Figures
  placeId: int("place_id"), // Links to ferjan
  figureId: int("figure_id"), // Links to figures
  
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Repost = typeof reposts.$inferSelect;
export type InsertRepost = typeof reposts.$inferInsert;

/**
 * Ferjan (Places) - Tier 1
 * Places where the tribe lived
 * Geographical locations linked to content
 */
export const ferjan = mysqlTable("ferjan", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameAr: varchar("name_ar", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  overviewImageUrl: varchar("overview_image_url", { length: 500 }),
  
  // Timeline entries (stored as JSON array of {period, descriptionEn, descriptionAr})
  timelineEntries: json("timeline_entries").$type<Array<{
    period: string;
    descriptionEn: string;
    descriptionAr: string;
  }>>(),
  
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Ferjan = typeof ferjan.$inferSelect;
export type InsertFerjan = typeof ferjan.$inferInsert;

/**
 * Family Tree Sections - Tier 1 (Lineage)
 * Level 1: Containers for families (7 sections, editable number)
 * Sections are NOT genealogy claims, just organizational containers
 */
export const familyTreeSections = mysqlTable("family_tree_sections", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("title_en", { length: 200 }).notNull(),
  titleAr: varchar("title_ar", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  imageUrl: varchar("image_url", { length: 500 }), // Optional image
  order: int("order").default(0).notNull(), // For reordering
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type FamilyTreeSection = typeof familyTreeSections.$inferSelect;
export type InsertFamilyTreeSection = typeof familyTreeSections.$inferInsert;

/**
 * Families - Tier 1 (Lineage)
 * Level 2: Families within sections
 */
export const families = mysqlTable("families", {
  id: int("id").autoincrement().primaryKey(),
  sectionId: int("section_id").notNull(), // Links to familyTreeSections
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameAr: varchar("name_ar", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  noteEn: text("note_en"), // Optional short note
  noteAr: text("note_ar"),
  period: varchar("period", { length: 200 }), // Optional period
  overviewEn: text("overview_en"), // Optional family overview
  overviewAr: text("overview_ar"),
  
  // Family tree structure (can start as simple list, upgradeable to visual tree)
  treeStructure: json("tree_structure").$type<any>(), // Flexible JSON structure
  
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Family = typeof families.$inferSelect;
export type InsertFamily = typeof families.$inferInsert;

/**
 * Figures (People) - Tier 1 (Lineage)
 * Individual person pages
 * Replaces old "people" table with enhanced linking
 */
export const figures = mysqlTable("figures", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameAr: varchar("name_ar", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  bioEn: text("bio_en"),
  bioAr: text("bio_ar"),
  roleEn: varchar("role_en", { length: 200 }),
  roleAr: varchar("role_ar", { length: 200 }),
  photoUrl: varchar("photo_url", { length: 500 }),
  
  // Approximate period (optional)
  period: varchar("period", { length: 200 }), // e.g., "1920s-1980s", "Early 20th Century", "Unknown"
  birthYear: int("birth_year"),
  deathYear: int("death_year"),
  
  // Family linking (optional)
  familyId: int("family_id"), // Links to families table
  positionInTree: varchar("position_in_tree", { length: 200 }), // Optional position description
  
  // Place linking (optional)
  placeId: int("place_id"),
  placeEn: varchar("place_en", { length: 200 }),
  placeAr: varchar("place_ar", { length: 200 }),
  
  // Linked content (many-to-many via junction tables):
  // - History entries (via figureHistoryEntries)
  // - Poems (via figureId in poems table)
  // - Documents (via archiveItemFigures)
  // - Photographs (via photoFigures)
  // - Ferjan places (via placeId)
  
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Figure = typeof figures.$inferSelect;
export type InsertFigure = typeof figures.$inferInsert;

/**
 * History Entries - Tier 1
 * Serious, structured historical record of the tribe
 * Covers wars, major events, periods, movements
 */
export const historyEntries = mysqlTable("history_entries", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  year: int("year").notNull(),
  month: int("month"),
  day: int("day"),
  period: varchar("period", { length: 200 }), // e.g., "1940s", "World War II Era"
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  imageUrls: json("image_urls").$type<string[]>(),
  category: varchar("category", { length: 100 }), // e.g., "war", "migration", "treaty", "conflict"
  tags: json("tags").$type<string[]>(),
  
  // Place linking (optional)
  placeId: int("place_id"),
  
  // Linked content (many-to-many via junction tables):
  // - Documents (via historyArchiveItems)
  // - Photographs (via historyPhotos)
  // - Poems (via historyPoems)
  // - Figures (via figureHistoryEntries)
  
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type HistoryEntry = typeof historyEntries.$inferSelect;
export type InsertHistoryEntry = typeof historyEntries.$inferInsert;

/**
 * Collaborations - Tier 2
 * Partner organizations and collaborations
 * (Replaces old "partnerships" table)
 */
export const collaborations = mysqlTable("collaborations", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameAr: varchar("name_ar", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  logoUrl: varchar("logo_url", { length: 500 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  internalLink: varchar("internal_link", { length: 500 }), // Optional internal link
  category: varchar("category", { length: 100 }),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Collaboration = typeof collaborations.$inferSelect;
export type InsertCollaboration = typeof collaborations.$inferInsert;

/**
 * Submissions - Tier 3 (Contribute page)
 * Community contributions awaiting review
 */
export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  submitterName: varchar("submitter_name", { length: 200 }).notNull(),
  submitterContact: varchar("submitter_contact", { length: 300 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(), // document/photo/poem/book/heritage/event/repost
  titleEn: text("title_en"),
  titleAr: text("title_ar"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  fileUrls: json("file_urls").$type<string[]>(),
  datePeriod: varchar("date_period", { length: 200 }),
  placeEn: varchar("place_en", { length: 200 }),
  placeAr: varchar("place_ar", { length: 200 }),
  hasPermission: boolean("has_permission").default(false).notNull(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

/**
 * JUNCTION TABLES FOR MANY-TO-MANY RELATIONSHIPS
 */

// Archive Items <-> Figures
export const archiveItemFigures = mysqlTable("archive_item_figures", {
  id: int("id").autoincrement().primaryKey(),
  archiveItemId: int("archive_item_id").notNull(),
  figureId: int("figure_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Photos <-> Figures
export const photoFigures = mysqlTable("photo_figures", {
  id: int("id").autoincrement().primaryKey(),
  photoId: int("photo_id").notNull(),
  figureId: int("figure_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// History Entries <-> Archive Items
export const historyArchiveItems = mysqlTable("history_archive_items", {
  id: int("id").autoincrement().primaryKey(),
  historyEntryId: int("history_entry_id").notNull(),
  archiveItemId: int("archive_item_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// History Entries <-> Photos
export const historyPhotos = mysqlTable("history_photos", {
  id: int("id").autoincrement().primaryKey(),
  historyEntryId: int("history_entry_id").notNull(),
  photoId: int("photo_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// History Entries <-> Poems
export const historyPoems = mysqlTable("history_poems", {
  id: int("id").autoincrement().primaryKey(),
  historyEntryId: int("history_entry_id").notNull(),
  poemId: int("poem_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Figures <-> History Entries
export const figureHistoryEntries = mysqlTable("figure_history_entries", {
  id: int("id").autoincrement().primaryKey(),
  figureId: int("figure_id").notNull(),
  historyEntryId: int("history_entry_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events <-> Figures
export const eventFigures = mysqlTable("event_figures", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("event_id").notNull(),
  figureId: int("figure_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events <-> Reposts
export const eventReposts = mysqlTable("event_reposts", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("event_id").notNull(),
  repostId: int("repost_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * DEPRECATED TABLES (kept for migration compatibility, will be removed after data migration)
 */

// Old people table (replaced by figures)
export const people = mysqlTable("people", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameAr: varchar("name_ar", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  bioEn: text("bio_en"),
  bioAr: text("bio_ar"),
  roleEn: varchar("role_en", { length: 200 }),
  roleAr: varchar("role_ar", { length: 200 }),
  photoUrl: varchar("photo_url", { length: 500 }),
  birthYear: int("birth_year"),
  deathYear: int("death_year"),
  placeEn: varchar("place_en", { length: 200 }),
  placeAr: varchar("place_ar", { length: 200 }),
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Person = typeof people.$inferSelect;
export type InsertPerson = typeof people.$inferInsert;

// Old places table (replaced by ferjan)
export const places = mysqlTable("places", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameAr: varchar("name_ar", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  overviewImageUrl: varchar("overview_image_url", { length: 500 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Place = typeof places.$inferSelect;
export type InsertPlace = typeof places.$inferInsert;

// Old partnerships table (replaced by collaborations)
export const partnerships = mysqlTable("partnerships", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameAr: varchar("name_ar", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  logoUrl: varchar("logo_url", { length: 500 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type Partnership = typeof partnerships.$inferSelect;
export type InsertPartnership = typeof partnerships.$inferInsert;

// Old heritageEntries table (removed from locked vision)
export const heritageEntries = mysqlTable("heritage_entries", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  category: varchar("category", { length: 100 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  imageUrls: json("image_urls").$type<string[]>(),
  videoUrls: json("video_urls").$type<string[]>(),
  placeEn: varchar("place_en", { length: 200 }),
  placeAr: varchar("place_ar", { length: 200 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "review", "published"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type HeritageEntry = typeof heritageEntries.$inferSelect;
export type InsertHeritageEntry = typeof heritageEntries.$inferInsert;
