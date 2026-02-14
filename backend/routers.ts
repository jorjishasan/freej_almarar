import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { systemRouter } from "./_core/systemRouter";
import { exportRouter } from "./exportRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Content status enum for validation
const contentStatusSchema = z.enum(["draft", "review", "published"]);

export const appRouter = router({
  system: systemRouter,
  export: exportRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      return new Promise<{ success: true }>((resolve, reject) => {
        ctx.req.logout((err) => (err ? reject(err) : resolve({ success: true })));
      });
    }),
  }),

  // ============ NAVIGATION MANAGEMENT ============
  navigation: router({
    getAll: adminProcedure.query(async () => {
      return await db.getAllNavigationItems();
    }),
    
    getActive: publicProcedure.query(async () => {
      return await db.getActiveNavigationItems();
    }),
    
    create: adminProcedure
      .input(z.object({
        labelEn: z.string().min(1),
        labelAr: z.string().min(1),
        url: z.string().min(1),
        parentId: z.number().optional(),
        order: z.number().default(0),
        featuredImageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createNavigationItem({
          ...input,
          isActive: true,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        labelEn: z.string().optional(),
        labelAr: z.string().optional(),
        url: z.string().optional(),
        parentId: z.number().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
        featuredImageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateNavigationItem(id, updates);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteNavigationItem(input.id);
        return { success: true };
      }),
  }),

  // ============ ARCHIVE ITEMS ============
  archives: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedArchiveItems();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedArchiveItems(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getArchiveItemBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllArchiveItems();
    }),
    
    create: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().min(1),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        contentEn: z.string().optional(),
        contentAr: z.string().optional(),
        slug: z.string().min(1),
        thumbnailUrl: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
        fileUrls: z.array(z.string()).optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        year: z.number().optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createArchiveItem({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        contentEn: z.string().optional(),
        contentAr: z.string().optional(),
        slug: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
        fileUrls: z.array(z.string()).optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        year: z.number().optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: any = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updateArchiveItem(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteArchiveItem(input.id);
        return { success: true };
      }),
  }),

  // ============ PHOTOS ============
  photos: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedPhotos();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedPhotos(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getPhotoBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllPhotos();
    }),
    
    create: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().min(1),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        slug: z.string().min(1),
        imageUrl: z.string().min(1),
        thumbnailUrl: z.string().optional(),
        photographer: z.string().optional(),
        year: z.number().optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createPhoto({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        slug: z.string().optional(),
        imageUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        photographer: z.string().optional(),
        year: z.number().optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: any = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updatePhoto(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePhoto(input.id);
        return { success: true };
      }),
  }),

  // ============ POEMS ============
  poems: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedPoems();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedPoems(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getPoemBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllPoems();
    }),
    
    create: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().min(1),
        contentEn: z.string().min(1),
        contentAr: z.string().min(1),
        slug: z.string().min(1),
        poetId: z.number().optional(),
        poetEn: z.string().optional(),
        poetAr: z.string().optional(),
        year: z.number().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        audioUrl: z.string().optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createPoem({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        contentEn: z.string().optional(),
        contentAr: z.string().optional(),
        slug: z.string().optional(),
        poetId: z.number().optional(),
        poetEn: z.string().optional(),
        poetAr: z.string().optional(),
        year: z.number().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        audioUrl: z.string().optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: any = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updatePoem(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePoem(input.id);
        return { success: true };
      }),
  }),

  // ============ POETS ============
  poets: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedPoets();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedPoets(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getPoetBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllPoets();
    }),
    
    create: adminProcedure
      .input(z.object({
        nameEn: z.string().min(1),
        nameAr: z.string().min(1),
        slug: z.string().min(1),
        originEn: z.string().optional(),
        originAr: z.string().optional(),
        bioEn: z.string().optional(),
        bioAr: z.string().optional(),
        profileImageUrl: z.string().optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createPoet({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameAr: z.string().optional(),
        slug: z.string().optional(),
        originEn: z.string().optional(),
        originAr: z.string().optional(),
        bioEn: z.string().optional(),
        bioAr: z.string().optional(),
        profileImageUrl: z.string().optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: Record<string, unknown> = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updatePoet(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePoet(input.id);
        return { success: true };
      }),
  }),

  // ============ BOOKS ============
  books: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedBooks();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedBooks(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getBookBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllBooks();
    }),
    
    create: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().min(1),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        slug: z.string().min(1),
        authorEn: z.string().optional(),
        authorAr: z.string().optional(),
        isbn: z.string().optional(),
        publisherEn: z.string().optional(),
        publisherAr: z.string().optional(),
        publishYear: z.number().optional(),
        coverImageUrl: z.string().optional(),
        pdfUrl: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createBook({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        slug: z.string().optional(),
        authorEn: z.string().optional(),
        authorAr: z.string().optional(),
        isbn: z.string().optional(),
        publisherEn: z.string().optional(),
        publisherAr: z.string().optional(),
        publishYear: z.number().optional(),
        coverImageUrl: z.string().optional(),
        pdfUrl: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: any = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updateBook(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBook(input.id);
        return { success: true };
      }),
  }),

  // ============ HERITAGE ENTRIES ============
  heritage: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedHeritageEntries();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedHeritageEntries(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getHeritageEntryBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllHeritageEntries();
    }),
    
    create: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().min(1),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        contentEn: z.string().optional(),
        contentAr: z.string().optional(),
        slug: z.string().min(1),
        category: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
        videoUrls: z.array(z.string()).optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createHeritageEntry({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        contentEn: z.string().optional(),
        contentAr: z.string().optional(),
        slug: z.string().optional(),
        category: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
        videoUrls: z.array(z.string()).optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: any = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updateHeritageEntry(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteHeritageEntry(input.id);
        return { success: true };
      }),
  }),

  // ============ EVENTS ============
  events: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedEvents();
    }),
    
    getUpcoming: publicProcedure.query(async () => {
      return await db.getUpcomingEvents();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedEvents(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getEventBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllEvents();
    }),
    
    create: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().min(1),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        slug: z.string().min(1),
        startDate: z.date(),
        endDate: z.date().optional(),
        locationEn: z.string().optional(),
        locationAr: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
        registrationUrl: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createEvent({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        slug: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        locationEn: z.string().optional(),
        locationAr: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
        registrationUrl: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: any = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updateEvent(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEvent(input.id);
        return { success: true };
      }),
  }),

  // ============ PEOPLE ============
  people: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedPeople();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedPeople(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getPersonBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllPeople();
    }),
    
    create: adminProcedure
      .input(z.object({
        nameEn: z.string().min(1),
        nameAr: z.string().min(1),
        slug: z.string().min(1),
        bioEn: z.string().optional(),
        bioAr: z.string().optional(),
        roleEn: z.string().optional(),
        roleAr: z.string().optional(),
        photoUrl: z.string().optional(),
        birthYear: z.number().optional(),
        deathYear: z.number().optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createPerson({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameAr: z.string().optional(),
        slug: z.string().optional(),
        bioEn: z.string().optional(),
        bioAr: z.string().optional(),
        roleEn: z.string().optional(),
        roleAr: z.string().optional(),
        photoUrl: z.string().optional(),
        birthYear: z.number().optional(),
        deathYear: z.number().optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: any = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updatePerson(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePerson(input.id);
        return { success: true };
      }),
  }),

  // ============ REPOSTS ============
  reposts: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedReposts();
    }),
    
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return await db.getFeaturedReposts(input.limit);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getRepostBySlug(input.slug);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllReposts();
    }),
    
    create: adminProcedure
      .input(z.object({
        titleEn: z.string(),
        titleAr: z.string(),
        slug: z.string(),
        sourceType: z.enum(["instagram", "twitter", "facebook", "manual", "other"]),
        sourceUrl: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        captionEn: z.string().optional(),
        captionAr: z.string().optional(),
        sourceNameEn: z.string().optional(),
        sourceNameAr: z.string().optional(),
        mediaUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        mediaType: z.enum(["image", "video", "carousel"]).optional(),
        placeId: z.number().optional(),
        figureId: z.number().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.default("draft"),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createRepost({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        slug: z.string().optional(),
        sourceUrl: z.string().optional(),
        sourceNameEn: z.string().optional(),
        sourceNameAr: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: contentStatusSchema.optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, status, ...updates } = input;
        const updateData: any = updates;
        
        if (status === "published") {
          updateData.status = status;
          updateData.publishedAt = new Date();
        } else if (status) {
          updateData.status = status;
        }
        
        await db.updateRepost(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteRepost(input.id);
        return { success: true };
      }),
  }),

  // ============ HOMEPAGE DATA ============
  homepage: router({
    getLatestContent: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return await db.getLatestContent(input.limit);
      }),
  }),

  // ============ PLACES ============
  places: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedPlaces();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getPlaceBySlug(input.slug);
      }),
    
    create: adminProcedure
      .input(z.object({
        nameEn: z.string().min(1),
        nameAr: z.string().min(1),
        slug: z.string().min(1),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        overviewImageUrl: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        status: contentStatusSchema.default("draft"),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createPlace({
          ...input,
          authorId: ctx.user.id,
        });
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameAr: z.string().optional(),
        slug: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        overviewImageUrl: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        status: contentStatusSchema.optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await db.updatePlace(id, updates);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePlace(input.id);
        return { success: true };
      }),
  }),

  // ============ HISTORY ENTRIES ============
  history: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedHistoryEntries();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getHistoryEntryBySlug(input.slug);
      }),
    
    create: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().min(1),
        slug: z.string().min(1),
        descriptionEn: z.string(),
        descriptionAr: z.string(),
        year: z.number(),
        month: z.number().optional(),
        day: z.number().optional(),
        imageUrl: z.string().optional(),
        status: contentStatusSchema.default("draft"),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createHistoryEntry({
          ...input,
          authorId: ctx.user.id,
        });
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        slug: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        year: z.number().optional(),
        month: z.number().optional(),
        day: z.number().optional(),
        imageUrl: z.string().optional(),
        status: contentStatusSchema.optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await db.updateHistoryEntry(id, updates);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteHistoryEntry(input.id);
        return { success: true };
      }),
  }),

  // ============ SUBMISSIONS ============
  submissions: router({
    getAll: adminProcedure.query(async () => {
      return await db.getAllSubmissions();
    }),
    
    create: publicProcedure
      .input(z.object({
        submitterName: z.string().min(1),
        submitterContact: z.string().min(1),
        contentType: z.string(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        fileUrls: z.array(z.string()).optional(),
        datePeriod: z.string().optional(),
        placeEn: z.string().optional(),
        placeAr: z.string().optional(),
        hasPermission: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        return await db.createSubmission({
          ...input,
          status: "draft",
        });
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: contentStatusSchema,
      }))
      .mutation(async ({ input }) => {
        return await db.updateSubmission(input.id, { status: input.status });
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSubmission(input.id);
        return { success: true };
      }),
  }),

  // ============ PARTNERSHIPS ============
  partnerships: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedPartnerships();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getPartnershipBySlug(input.slug);
      }),
    
    create: adminProcedure
      .input(z.object({
        nameEn: z.string().min(1),
        nameAr: z.string().min(1),
        slug: z.string().min(1),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        logoUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        status: contentStatusSchema.default("draft"),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createPartnership({
          ...input,
          authorId: ctx.user.id,
        });
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameAr: z.string().optional(),
        slug: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        logoUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        status: contentStatusSchema.optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await db.updatePartnership(id, updates);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePartnership(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
