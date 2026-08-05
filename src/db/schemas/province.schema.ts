import { pgTable, uuid, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helper";

export const provinces = pgTable("provinces", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  ...timestamps,
});
