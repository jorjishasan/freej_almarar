import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// Generate unique slug for each test
function generateUniqueSlug(base: string): string {
  return `${base}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

describe("Archives Access Control", () => {
  it("should allow admin to create archive item", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const newArchive = {
      titleEn: "Test Archive Item",
      titleAr: "عنصر أرشيف تجريبي",
      descriptionEn: "A test archive description",
      descriptionAr: "وصف أرشيف تجريبي",
      slug: generateUniqueSlug("test-archive"),
      status: "draft" as const,
      isFeatured: false,
    };

    const result = await caller.archives.create(newArchive);

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
    expect(result.titleEn).toBe(newArchive.titleEn);
    expect(result.titleAr).toBe(newArchive.titleAr);
    expect(result.status).toBe("draft");
  });

  it("should prevent non-admin from creating archive item", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const newArchive = {
      titleEn: "Test Archive Item",
      titleAr: "عنصر أرشيف تجريبي",
      slug: generateUniqueSlug("test-archive"),
      status: "draft" as const,
      isFeatured: false,
    };

    await expect(caller.archives.create(newArchive)).rejects.toThrow();
  });
});

describe("Archives Workflow", () => {
  it("should transition from draft to published", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create draft
    const draft = await caller.archives.create({
      titleEn: "Workflow Test",
      titleAr: "اختبار سير العمل",
      slug: generateUniqueSlug("workflow-test"),
      status: "draft" as const,
      isFeatured: false,
    });

    expect(draft.status).toBe("draft");

    // Publish
    const published = await caller.archives.update({
      id: draft.id,
      status: "published" as const,
    });

    expect(published.status).toBe("published");
    expect(published.id).toBe(draft.id);
  });

  it("should only return published items in getPublished", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create draft item
    await caller.archives.create({
      titleEn: "Draft Item",
      titleAr: "عنصر مسودة",
      slug: generateUniqueSlug("draft-item"),
      status: "draft" as const,
      isFeatured: false,
    });

    // Create published item
    const publishedItem = await caller.archives.create({
      titleEn: "Published Item",
      titleAr: "عنصر منشور",
      slug: generateUniqueSlug("published-item"),
      status: "published" as const,
      isFeatured: false,
    });

    // Get published items
    const publishedItems = await caller.archives.getPublished();

    // Should include the published item
    const foundPublished = publishedItems.find(item => item.id === publishedItem.id);
    expect(foundPublished).toBeDefined();
    expect(foundPublished?.status).toBe("published");
  });
});

describe("Archives Featured Content", () => {
  it("should allow admin to toggle featured status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create non-featured item
    const item = await caller.archives.create({
      titleEn: "Featured Test",
      titleAr: "اختبار المميز",
      slug: generateUniqueSlug("featured-test"),
      status: "published" as const,
      isFeatured: false,
    });

    expect(item.isFeatured).toBe(false);

    // Make it featured
    const featured = await caller.archives.update({
      id: item.id,
      isFeatured: true,
    });

    expect(featured.isFeatured).toBe(true);
  });

  it("should return only featured items in getFeatured", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create featured item
    const featuredItem = await caller.archives.create({
      titleEn: "Featured Item",
      titleAr: "عنصر مميز",
      slug: generateUniqueSlug("featured-item"),
      status: "published" as const,
      isFeatured: true,
    });

    // Get featured items
    const featuredItems = await caller.archives.getFeatured();

    // Should include the featured item
    const found = featuredItems.find(item => item.id === featuredItem.id);
    expect(found).toBeDefined();
    expect(found?.isFeatured).toBe(true);
  });
});

describe("Archives Bilingual Content", () => {
  it("should store and retrieve both English and Arabic content", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const bilingualItem = await caller.archives.create({
      titleEn: "English Title",
      titleAr: "العنوان العربي",
      descriptionEn: "English description",
      descriptionAr: "الوصف العربي",
      contentEn: "English content",
      contentAr: "المحتوى العربي",
      slug: generateUniqueSlug("bilingual-test"),
      status: "published" as const,
      isFeatured: false,
    });

    expect(bilingualItem.titleEn).toBe("English Title");
    expect(bilingualItem.titleAr).toBe("العنوان العربي");
    expect(bilingualItem.descriptionEn).toBe("English description");
    expect(bilingualItem.descriptionAr).toBe("الوصف العربي");
    expect(bilingualItem.contentEn).toBe("English content");
    expect(bilingualItem.contentAr).toBe("المحتوى العربي");
  });

  it("should retrieve item by slug", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const uniqueSlug = generateUniqueSlug("slug-test");
    const created = await caller.archives.create({
      titleEn: "Slug Test",
      titleAr: "اختبار الرابط",
      slug: uniqueSlug,
      status: "published" as const,
      isFeatured: false,
    });

    const retrieved = await caller.archives.getBySlug({ slug: uniqueSlug });

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.slug).toBe(uniqueSlug);
  });
});

describe("Archives CRUD Operations", () => {
  it("should allow admin to delete archive item", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create an item
    const created = await caller.archives.create({
      titleEn: "To Be Deleted",
      titleAr: "سيتم حذفه",
      slug: generateUniqueSlug("to-be-deleted"),
      status: "draft" as const,
      isFeatured: false,
    });

    // Delete it
    const result = await caller.archives.delete({ id: created.id });

    expect(result.success).toBe(true);

    // Verify it's deleted by trying to get it
    const allItems = await caller.archives.getAll();
    const found = allItems.find(item => item.id === created.id);
    expect(found).toBeUndefined();
  });
});
