import { pgTable, uuid, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helper";

export const districts = pgTable("districts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  provinceId: uuid("province_id").notNull(),
  name: varchar("name").notNull(),
  ...timestamps,
});
