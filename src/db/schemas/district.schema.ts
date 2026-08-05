import { pgTable, uuid, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helper";

export const districts = pgTable(
  "districts",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    code: varchar("code", { length: 2 }).notNull(),
    name: uuid("name").notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      districtIdIndex: uniqueIndex("district_id_index").on(table.id),
    };
  },
);
