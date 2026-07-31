import { pgTable, uuid, varchar, index } from "drizzle-orm/pg-core";
import { names, applications, timestamps, details } from "../columns.helper";
import { users } from "./user.schema";

export const birthApplications = pgTable("birth_applications",{
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    ...names,
    ...details,
    ...applications,
    mothersIdNumber: varchar("mothers_id_number", { length: 13 }).notNull(),
    fathersIdNumber: varchar("fathers_id_number", { length: 13 }).notNull(),
    hospitalRecordUri: varchar("hospital_record_uri", { length: 255 }),
    motherIdUri: varchar("mother_id_uri", { length: 255 }),
    fatherIdUri: varchar("father_id_uri", { length: 255 }),
    address: varchar("address", { length: 255 }).notNull(),
    hospitalOfBirth: varchar("hospital_of_birth", { length: 255 }).notNull(),
    ...timestamps,
}, table => {
    return {
        birthCIdIndex: index("birthC_id_index").on(table.id),
        applicationIdIndex: index("application_id_index").on(table.applicationId),
    }
})
