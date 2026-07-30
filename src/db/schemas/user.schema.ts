import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "../timestamps.helper";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    surname: varchar("surname", { length: 255 }).notNull(),
    idNumber: varchar("id_number", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    ...timestamps,
})