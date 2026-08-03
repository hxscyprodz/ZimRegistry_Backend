import { index, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps, names, credentials } from "../columns.helper";

export const roles = pgEnum("roles", [
  "SUPER_ADMIN",
  "STATION_ADMIN",
  "REGISTRAR_OFFICER",
  "USER",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    role: roles("role").notNull().default("USER"),
    ...names,
    ...credentials,
    ...timestamps,
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index").on(table.id),
      userEmailIndex: index("user_email_index").on(table.email),
    };
  },
);
