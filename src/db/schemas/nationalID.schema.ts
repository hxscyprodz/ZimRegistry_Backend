import { pgTable, uuid, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { birthCertificates } from "./birthCert.schema";

export const nationalIDs = pgTable(
  "national_ids",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    nationalIdNumber: varchar("national_id_number", { length: 15 })
      .notNull()
      .references(() => birthCertificates.nationalIdNumber),
    imageUri: varchar("image_uri", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      nationalIdIndex: uniqueIndex("national_id_index").on(
        table.nationalIdNumber,
      ),
    };
  },
);
