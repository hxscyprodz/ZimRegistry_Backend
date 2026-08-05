import { pgTable, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helper";

export const provinces = pgTable(
  "provinces",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: uuid("name").notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      provinceIdIndex: uniqueIndex("province_id_index").on(table.id),
    };
  },
);
