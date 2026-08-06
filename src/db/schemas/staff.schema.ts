import { pgTable, pgEnum, varchar, uuid, index } from "drizzle-orm/pg-core";
import { timestamps, names, credentials } from "../columns.helper";
import { roles } from "./user.schema";

export const status = pgEnum("status", ["ACTIVE", "SUSPENDED", "DELETED"]);

export const staffMember = pgTable(
  "staff_members",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    stationId: uuid("station_id").notNull(),
    staffId: varchar("staff_id", { length: 10 }).notNull().unique(),
    ...names,
    ...credentials,
    status: varchar("status", { length: 255 }).notNull(),
    role: roles("role").notNull().default("REGISTRAR_OFFICER"),
    address: varchar("address", { length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      staffIdIndex: index("staff_id_index").on(table.staffId),
      emailIndex: index("email_index").on(table.email),
    };
  },
);
