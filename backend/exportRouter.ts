import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const exportRouter = router({
  /**
   * Export all database content as JSON for backup and migration
   */
  exportDatabase: adminProcedure.query(async () => {
    try {
      const [
        navigationItemsData,
        archiveItemsData,
        photosData,
        poemsData,
        booksData,
        heritageEntriesData,
        eventsData,
        peopleData,
        repostsData,
      ] = await Promise.all([
        db.getAllNavigationItems(),
        db.getAllArchiveItems(),
        db.getAllPhotos(),
        db.getAllPoems(),
        db.getAllBooks(),
        db.getAllHeritageEntries(),
        db.getAllEvents(),
        db.getAllPeople(),
        db.getAllReposts(),
      ]);

      const exportData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        data: {
          navigationItems: navigationItemsData,
          archiveItems: archiveItemsData,
          photos: photosData,
          poems: poemsData,
          books: booksData,
          heritageEntries: heritageEntriesData,
          events: eventsData,
          people: peopleData,
          reposts: repostsData,
        },
        statistics: {
          navigationItems: navigationItemsData.length,
          archiveItems: archiveItemsData.length,
          photos: photosData.length,
          poems: poemsData.length,
          books: booksData.length,
          heritageEntries: heritageEntriesData.length,
          events: eventsData.length,
          people: peopleData.length,
          reposts: repostsData.length,
          total: navigationItemsData.length + archiveItemsData.length + photosData.length + 
                 poemsData.length + booksData.length + heritageEntriesData.length + 
                 eventsData.length + peopleData.length + repostsData.length,
        },
      };

      return exportData;
    } catch (error) {
      console.error("[Export] Failed to export database:", error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to export database',
      });
    }
  }),

  /**
   * Get export statistics without full data
   */
  getExportStats: adminProcedure.query(async () => {
    try {
      const [
        navigationItemsData,
        archiveItemsData,
        photosData,
        poemsData,
        booksData,
        heritageEntriesData,
        eventsData,
        peopleData,
        repostsData,
      ] = await Promise.all([
        db.getAllNavigationItems(),
        db.getAllArchiveItems(),
        db.getAllPhotos(),
        db.getAllPoems(),
        db.getAllBooks(),
        db.getAllHeritageEntries(),
        db.getAllEvents(),
        db.getAllPeople(),
        db.getAllReposts(),
      ]);

      return {
        navigationItems: navigationItemsData.length,
        archiveItems: archiveItemsData.length,
        photos: photosData.length,
        poems: poemsData.length,
        books: booksData.length,
        heritageEntries: heritageEntriesData.length,
        events: eventsData.length,
        people: peopleData.length,
        reposts: repostsData.length,
        total: navigationItemsData.length + archiveItemsData.length + photosData.length + 
               poemsData.length + booksData.length + heritageEntriesData.length + 
               eventsData.length + peopleData.length + repostsData.length,
      };
    } catch (error) {
      console.error("[Export] Failed to get export stats:", error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get export statistics',
      });
    }
  }),

  /**
   * Export specific content type
   */
  exportContentType: adminProcedure
    .input(z.object({
      type: z.enum([
        "navigationItems",
        "archiveItems",
        "photos",
        "poems",
        "books",
        "heritageEntries",
        "events",
        "people",
        "reposts"
      ]),
    }))
    .query(async ({ input }) => {
      try {
        let data;
        
        switch (input.type) {
          case "navigationItems":
            data = await db.getAllNavigationItems();
            break;
          case "archiveItems":
            data = await db.getAllArchiveItems();
            break;
          case "photos":
            data = await db.getAllPhotos();
            break;
          case "poems":
            data = await db.getAllPoems();
            break;
          case "books":
            data = await db.getAllBooks();
            break;
          case "heritageEntries":
            data = await db.getAllHeritageEntries();
            break;
          case "events":
            data = await db.getAllEvents();
            break;
          case "people":
            data = await db.getAllPeople();
            break;
          case "reposts":
            data = await db.getAllReposts();
            break;
          default:
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Invalid content type',
            });
        }

        return {
          type: input.type,
          exportDate: new Date().toISOString(),
          count: data.length,
          data,
        };
      } catch (error) {
        console.error(`[Export] Failed to export ${input.type}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to export ${input.type}`,
        });
      }
    }),
});
