import { timestamp, varchar, pgEnum, date, boolean } from "drizzle-orm/pg-core";

export const sex = pgEnum("sex", ["male", "female"]);
export const status = pgEnum("status", ["pending", "approved", "rejected"]);

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
};

export const names = {
  firstName: varchar("first_name", { length: 100 }).notNull(),
  surname: varchar("surname", { length: 100 }).notNull(),
};

export const credentials = {
  nationalIdNumber: varchar("national_id_number", { length: 15 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
};

export const details = {
  middleNames: varchar("middle_names", { length: 200 }),
  sex: sex("sex").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  placeOfBirth: varchar("place_of_birth", { length: 100 }).notNull(),
  villageOfOrigin: varchar("village_of_origin", { length: 100 }).notNull(),
};

export const issueAdnRegistration = {
  dateOfIssue: date("date_of_issue").notNull(),
  dateOfRegistration: date("date_of_registration").notNull(),
  placeOfIssue: varchar("place_of_issue", { length: 255 }).notNull(),
  issuedBy: varchar("issued_by", { length: 100 }).notNull(),
};

export const applications = {
  applicationId: varchar("application_id", { length: 15 }).notNull().unique(),
  stationId: varchar("station_id", { length: 100 }).notNull(),
  status: status("status").default("pending").notNull(),
  approvedBy: varchar("approved_by", { length: 100 }),
  approvedAt: timestamp("approved_at"),
  rejectedBy: varchar("rejected_by", { length: 100 }),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: varchar("rejection_reason", { length: 500 }),
};
