import { pgTable, uuid, varchar, index } from "drizzle-orm/pg-core";
import { names, details, timestamps, issueAdnRegistration } from "../columns.helper";

export const birthCertificates = pgTable(
  "birth_certificates",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    nationalIdNumber: varchar("national_id_number", { length: 13 })
      .notNull()
      .unique(),
    ...names,
    ...details,
    address: varchar("address", { length: 255 }).notNull(),
    hospitalOfBirth: varchar("hospital_of_birth", { length: 255 }).notNull(),
    ...issueAdnRegistration,
    ...timestamps,
  },
  (table) => {
    return {
      nationalIdNumberIndex: index("national_id_number_index").on(
        table.nationalIdNumber,
      ),
      birthIdIndex: index("birth_id_index").on(table.id),
    };
  },
);
