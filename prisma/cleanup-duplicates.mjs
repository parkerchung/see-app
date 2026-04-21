import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Deduplicate TrackingEvent rows: for each (campaignTargetId, eventType)
// combination, keep only the earliest row.
// Must run BEFORE `prisma db push` that adds @@unique([campaignTargetId, eventType]),
// otherwise the unique constraint creation fails on existing duplicates.
async function main() {
  // Silently succeed if the table doesn't exist yet (fresh install)
  try {
    const deleted = await prisma.$executeRawUnsafe(`
      DELETE FROM "TrackingEvent"
      WHERE id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY "campaignTargetId", "eventType"
            ORDER BY timestamp ASC, id ASC
          ) AS rn
          FROM "TrackingEvent"
        ) t
        WHERE t.rn > 1
      )
    `);
    if (deleted > 0) {
      console.log(`Removed ${deleted} duplicate tracking events.`);
    }
  } catch (err) {
    if (err?.meta?.code === "42P01" || /does not exist/.test(err?.message || "")) {
      console.log("TrackingEvent table not present yet, skipping cleanup.");
      return;
    }
    throw err;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
