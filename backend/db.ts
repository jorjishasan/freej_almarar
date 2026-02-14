import { eq, desc, and, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  navigationItems,
  archiveItems,
  photos,
  poets,
  poems,
  books,
  heritageEntries,
  events,
  people,
  reposts,
  places,
  historyEntries,
  submissions,
  partnerships,
  NavigationItem,
  InsertNavigationItem,
  ArchiveItem,
  InsertArchiveItem,
  Photo,
  InsertPhoto,
  Poet,
  InsertPoet,
  Poem,
  InsertPoem,
  Book,
  InsertBook,
  HeritageEntry,
  InsertHeritageEntry,
  Event,
  InsertEvent,
  Person,
  InsertPerson,
  Repost,
  InsertRepost,
  Place,
  InsertPlace,
  HistoryEntry,
  InsertHistoryEntry,
  Submission,
  InsertSubmission,
  Partnership,
  InsertPartnership,
  ContentStatus
} from "./drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER MANAGEMENT ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ NAVIGATION MANAGEMENT ============

export async function getAllNavigationItems() {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db.select().from(navigationItems).orderBy(navigationItems.order);
  return items;
}

export async function getActiveNavigationItems() {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db.select().from(navigationItems)
    .where(eq(navigationItems.isActive, true))
    .orderBy(navigationItems.order);
  return items;
}

export async function createNavigationItem(item: InsertNavigationItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(navigationItems).values(item);
  return result;
}

export async function updateNavigationItem(id: number, updates: Partial<InsertNavigationItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(navigationItems).set(updates).where(eq(navigationItems.id, id));
}

export async function deleteNavigationItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(navigationItems).where(eq(navigationItems.id, id));
}

// ============ ARCHIVE ITEMS ============

export async function getPublishedArchiveItems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(archiveItems)
    .where(eq(archiveItems.status, "published"))
    .orderBy(desc(archiveItems.publishedAt));
}

export async function getFeaturedArchiveItems(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(archiveItems)
    .where(and(eq(archiveItems.status, "published"), eq(archiveItems.isFeatured, true)))
    .orderBy(desc(archiveItems.publishedAt))
    .limit(limit);
}

export async function getArchiveItemBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(archiveItems).where(eq(archiveItems.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getAllArchiveItems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(archiveItems).orderBy(desc(archiveItems.createdAt));
}

export async function createArchiveItem(item: InsertArchiveItem): Promise<ArchiveItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(archiveItems).values(item);
  const insertId = Number(result[0].insertId);
  
  const created = await db.select().from(archiveItems).where(eq(archiveItems.id, insertId)).limit(1);
  if (!created[0]) throw new Error("Failed to retrieve created item");
  
  return created[0];
}

export async function updateArchiveItem(id: number, updates: Partial<InsertArchiveItem>): Promise<ArchiveItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(archiveItems).set(updates).where(eq(archiveItems.id, id));
  
  const updated = await db.select().from(archiveItems).where(eq(archiveItems.id, id)).limit(1);
  if (!updated[0]) throw new Error("Item not found");
  
  return updated[0];
}

export async function deleteArchiveItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(archiveItems).where(eq(archiveItems.id, id));
}

// ============ PHOTOS ============

export async function getPublishedPhotos() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(photos)
    .where(eq(photos.status, "published"))
    .orderBy(desc(photos.publishedAt));
}

export async function getFeaturedPhotos(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(photos)
    .where(and(eq(photos.status, "published"), eq(photos.isFeatured, true)))
    .orderBy(desc(photos.publishedAt))
    .limit(limit);
}

export async function getPhotoBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(photos).where(eq(photos.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getAllPhotos() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(photos).orderBy(desc(photos.createdAt));
}

export async function createPhoto(item: InsertPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(photos).values(item);
  return result;
}

export async function updatePhoto(id: number, updates: Partial<InsertPhoto>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(photos).set(updates).where(eq(photos.id, id));
}

export async function deletePhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(photos).where(eq(photos.id, id));
}

// ============ POETS ============

export async function getPublishedPoets() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(poets)
    .where(eq(poets.status, "published"))
    .orderBy(poets.nameEn);
}

export async function getPublishedPoetsWithPoemCount() {
  const db = await getDb();
  if (!db) return [];
  
  const rows = await db
    .select({
      id: poets.id,
      nameEn: poets.nameEn,
      nameAr: poets.nameAr,
      slug: poets.slug,
      originEn: poets.originEn,
      originAr: poets.originAr,
      profileImageUrl: poets.profileImageUrl,
      poemCount: sql<number>`(SELECT COUNT(*) FROM poems WHERE poems.poet_id = poets.id)`.as("poem_count"),
    })
    .from(poets)
    .where(eq(poets.status, "published"))
    .orderBy(poets.nameEn);
  
  return rows.map((r) => ({
    ...r,
    poemCount: Number(r.poemCount ?? 0),
  }));
}

export async function getFeaturedPoets(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(poets)
    .where(and(eq(poets.status, "published"), eq(poets.isFeatured, true)))
    .orderBy(poets.nameEn)
    .limit(limit);
}

export async function getPoetBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(poets).where(eq(poets.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getAllPoets() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(poets).orderBy(desc(poets.createdAt));
}

export async function createPoet(item: InsertPoet): Promise<Poet> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(poets).values(item);
  const insertId = Number(result[0].insertId);
  
  const created = await db.select().from(poets).where(eq(poets.id, insertId)).limit(1);
  if (!created[0]) throw new Error("Failed to retrieve created poet");
  
  return created[0];
}

export async function updatePoet(id: number, updates: Partial<InsertPoet>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(poets).set(updates).where(eq(poets.id, id));
}

export async function deletePoet(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(poets).where(eq(poets.id, id));
}

// ============ POEMS ============

export async function getPublishedPoems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(poems)
    .where(eq(poems.status, "published"))
    .orderBy(desc(poems.publishedAt));
}

export async function getFeaturedPoems(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(poems)
    .where(and(eq(poems.status, "published"), eq(poems.isFeatured, true)))
    .orderBy(desc(poems.publishedAt))
    .limit(limit);
}

export async function getPoemBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(poems).where(eq(poems.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getPublishedPoemsByPoetSlug(poetSlug: string) {
  const db = await getDb();
  if (!db) return [];
  
  const poet = await getPoetBySlug(poetSlug);
  if (!poet) return [];
  
  return await db.select().from(poems)
    .where(and(eq(poems.poetId, poet.id), eq(poems.status, "published")))
    .orderBy(desc(poems.publishedAt));
}

export async function getAllPoems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(poems).orderBy(desc(poems.createdAt));
}

export async function createPoem(item: InsertPoem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(poems).values(item);
  return result;
}

export async function updatePoem(id: number, updates: Partial<InsertPoem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(poems).set(updates).where(eq(poems.id, id));
}

export async function deletePoem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(poems).where(eq(poems.id, id));
}

// ============ BOOKS ============

export async function getPublishedBooks() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(books)
    .where(eq(books.status, "published"))
    .orderBy(desc(books.publishedAt));
}

export async function getFeaturedBooks(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(books)
    .where(and(eq(books.status, "published"), eq(books.isFeatured, true)))
    .orderBy(desc(books.publishedAt))
    .limit(limit);
}

export async function getBookBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(books).where(eq(books.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getAllBooks() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(books).orderBy(desc(books.createdAt));
}

export async function createBook(item: InsertBook) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(books).values(item);
  return result;
}

export async function updateBook(id: number, updates: Partial<InsertBook>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(books).set(updates).where(eq(books.id, id));
}

export async function deleteBook(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(books).where(eq(books.id, id));
}

// ============ HERITAGE ENTRIES ============

export async function getPublishedHeritageEntries() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(heritageEntries)
    .where(eq(heritageEntries.status, "published"))
    .orderBy(desc(heritageEntries.publishedAt));
}

export async function getFeaturedHeritageEntries(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(heritageEntries)
    .where(and(eq(heritageEntries.status, "published"), eq(heritageEntries.isFeatured, true)))
    .orderBy(desc(heritageEntries.publishedAt))
    .limit(limit);
}

export async function getHeritageEntryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(heritageEntries).where(eq(heritageEntries.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getAllHeritageEntries() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(heritageEntries).orderBy(desc(heritageEntries.createdAt));
}

export async function createHeritageEntry(item: InsertHeritageEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(heritageEntries).values(item);
  return result;
}

export async function updateHeritageEntry(id: number, updates: Partial<InsertHeritageEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(heritageEntries).set(updates).where(eq(heritageEntries.id, id));
}

export async function deleteHeritageEntry(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(heritageEntries).where(eq(heritageEntries.id, id));
}

// ============ EVENTS ============

export async function getPublishedEvents() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(events)
    .where(eq(events.status, "published"))
    .orderBy(desc(events.startDate));
}

export async function getUpcomingEvents() {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  return await db.select().from(events)
    .where(and(
      eq(events.status, "published"),
      sql`${events.startDate} >= ${now}`
    ))
    .orderBy(events.startDate);
}

export async function getFeaturedEvents(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(events)
    .where(and(eq(events.status, "published"), eq(events.isFeatured, true)))
    .orderBy(desc(events.startDate))
    .limit(limit);
}

export async function getEventBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getAllEvents() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(events).orderBy(desc(events.createdAt));
}

export async function createEvent(item: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(events).values(item);
  return result;
}

export async function updateEvent(id: number, updates: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(events).set(updates).where(eq(events.id, id));
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(events).where(eq(events.id, id));
}

// ============ PEOPLE ============

export async function getPublishedPeople() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(people)
    .where(eq(people.status, "published"))
    .orderBy(people.nameEn);
}

export async function getFeaturedPeople(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(people)
    .where(and(eq(people.status, "published"), eq(people.isFeatured, true)))
    .orderBy(people.nameEn)
    .limit(limit);
}

export async function getPersonBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(people).where(eq(people.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getAllPeople() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(people).orderBy(desc(people.createdAt));
}

export async function createPerson(item: InsertPerson) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(people).values(item);
  return result;
}

export async function updatePerson(id: number, updates: Partial<InsertPerson>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(people).set(updates).where(eq(people.id, id));
}

export async function deletePerson(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(people).where(eq(people.id, id));
}

// ============ REPOSTS ============

export async function getPublishedReposts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(reposts)
    .where(eq(reposts.status, "published"))
    .orderBy(desc(reposts.publishedAt));
}

export async function getFeaturedReposts(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(reposts)
    .where(and(eq(reposts.status, "published"), eq(reposts.isFeatured, true)))
    .orderBy(desc(reposts.publishedAt))
    .limit(limit);
}

export async function getRepostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(reposts).where(eq(reposts.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getAllReposts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(reposts).orderBy(desc(reposts.createdAt));
}

export async function createRepost(item: InsertRepost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reposts).values(item);
  return result;
}

export async function updateRepost(id: number, updates: Partial<InsertRepost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(reposts).set(updates).where(eq(reposts.id, id));
}

export async function deleteRepost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(reposts).where(eq(reposts.id, id));
}

// ============ LATEST CONTENT (HOMEPAGE) ============

export async function getLatestContent(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  // Get latest published items from all content types
  const latestArchives = await db.select({
    id: archiveItems.id,
    titleEn: archiveItems.titleEn,
    titleAr: archiveItems.titleAr,
    slug: archiveItems.slug,
    thumbnailUrl: archiveItems.thumbnailUrl,
    publishedAt: archiveItems.publishedAt,
    type: sql<string>`'archive'`,
  }).from(archiveItems)
    .where(eq(archiveItems.status, "published"))
    .orderBy(desc(archiveItems.publishedAt))
    .limit(limit);
  
  const latestPhotos = await db.select({
    id: photos.id,
    titleEn: photos.titleEn,
    titleAr: photos.titleAr,
    slug: photos.slug,
    thumbnailUrl: photos.thumbnailUrl,
    publishedAt: photos.publishedAt,
    type: sql<string>`'photo'`,
  }).from(photos)
    .where(eq(photos.status, "published"))
    .orderBy(desc(photos.publishedAt))
    .limit(limit);
  
  const latestPoems = await db.select({
    id: poems.id,
    titleEn: poems.titleEn,
    titleAr: poems.titleAr,
    slug: poems.slug,
    thumbnailUrl: sql<string | null>`NULL`,
    publishedAt: poems.publishedAt,
    type: sql<string>`'poem'`,
  }).from(poems)
    .where(eq(poems.status, "published"))
    .orderBy(desc(poems.publishedAt))
    .limit(limit);
  
  // Combine and sort by publishedAt
  const combined = [...latestArchives, ...latestPhotos, ...latestPoems]
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
  
  return combined;
}

// ==================== PLACES ====================

export async function getPublishedPlaces() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(places).where(eq(places.status, "published")).orderBy(desc(places.createdAt));
}

export async function getPlaceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(places).where(eq(places.slug, slug)).limit(1);
  return result[0];
}

export async function createPlace(data: InsertPlace) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(places).values(data);
  const id = Number(result[0].insertId);
  return getPlaceById(id);
}

export async function getPlaceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(places).where(eq(places.id, id)).limit(1);
  return result[0];
}

export async function updatePlace(id: number, data: Partial<InsertPlace>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(places).set(data).where(eq(places.id, id));
  return getPlaceById(id);
}

export async function deletePlace(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(places).where(eq(places.id, id));
}

// ==================== HISTORY ENTRIES ====================

export async function getPublishedHistoryEntries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(historyEntries).where(eq(historyEntries.status, "published")).orderBy(historyEntries.year, historyEntries.month, historyEntries.day);
}

export async function getHistoryEntryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(historyEntries).where(eq(historyEntries.slug, slug)).limit(1);
  return result[0];
}

export async function createHistoryEntry(data: InsertHistoryEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(historyEntries).values(data);
  const id = Number(result[0].insertId);
  return getHistoryEntryById(id);
}

export async function getHistoryEntryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(historyEntries).where(eq(historyEntries.id, id)).limit(1);
  return result[0];
}

export async function updateHistoryEntry(id: number, data: Partial<InsertHistoryEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(historyEntries).set(data).where(eq(historyEntries.id, id));
  return getHistoryEntryById(id);
}

export async function deleteHistoryEntry(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(historyEntries).where(eq(historyEntries.id, id));
}

// ==================== SUBMISSIONS ====================

export async function getAllSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(submissions).orderBy(desc(submissions.createdAt));
}

export async function getSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  return result[0];
}

export async function createSubmission(data: InsertSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(submissions).values(data);
  const id = Number(result[0].insertId);
  return getSubmissionById(id);
}

export async function updateSubmission(id: number, data: Partial<InsertSubmission>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(submissions).set(data).where(eq(submissions.id, id));
  return getSubmissionById(id);
}

export async function deleteSubmission(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(submissions).where(eq(submissions.id, id));
}

// ==================== PARTNERSHIPS ====================

export async function getPublishedPartnerships() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partnerships).where(eq(partnerships.status, "published")).orderBy(desc(partnerships.createdAt));
}

export async function getPartnershipBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(partnerships).where(eq(partnerships.slug, slug)).limit(1);
  return result[0];
}

export async function createPartnership(data: InsertPartnership) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(partnerships).values(data);
  const id = Number(result[0].insertId);
  return getPartnershipById(id);
}

export async function getPartnershipById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(partnerships).where(eq(partnerships.id, id)).limit(1);
  return result[0];
}

export async function updatePartnership(id: number, data: Partial<InsertPartnership>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(partnerships).set(data).where(eq(partnerships.id, id));
  return getPartnershipById(id);
}

export async function deletePartnership(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(partnerships).where(eq(partnerships.id, id));
}
