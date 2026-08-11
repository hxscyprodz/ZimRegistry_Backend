import { pgTable, varchar, uuid, index } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helper";
import { districts } from "./district.schema";

export const staffMember = pgTable(
  "staff_members",
  {
    nationalIdNumber: varchar("national_id_number", { length: 15 })
      .notNull()
      .unique(),
    stationId: uuid("station_id")
      .notNull()
      .references(() => districts.id),
    staffId: varchar("staff_id", { length: 10 }).notNull().unique(),
    ...timestamps,
  },
  (table) => {
    return {
      staffIdIndex: index("staff_id_index").on(table.staffId),
      nationalIdNumberIndex: index("staff_national_id_number_index").on(
        table.nationalIdNumber,
      ),
    };
  },
);
