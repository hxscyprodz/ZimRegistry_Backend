import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { districts } from "./district.schema";

export const stations = pgTable("stations", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  districtId: uuid("district_id")
    .defaultRandom()
    .notNull()
    .references(() => districts.id),
  name: varchar("name", { length: 255 }).notNull(),
  town: varchar("town", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
});
