import { pgTable, varchar, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { applications } from "../columns.helper";

export const nationalIdApplications = pgTable(
  "national_id_applications",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id").notNull(),
    contactNumber: varchar("contact_number", { length: 13 }).notNull(),
    nationalIdNumber: varchar("national_id_number", { length: 15 }).notNull(),
    ...applications,
  },
  (table) => {
    return {
      nationalIdAppTrackIndex: uniqueIndex("national_app_track_id_index").on(
        table.trackingId,
      ),
      nationalIdAppIndex: uniqueIndex("national_app_id_index").on(table.id),
    };
  },
);
