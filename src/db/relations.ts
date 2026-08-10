import { relations } from "drizzle-orm";
import {
  users,
  birthApplications,
  nationalIdApplications,
  districts,
  provinces,
  birthCertificates,
  staffMember,
  nationalIDs,
} from "./schemas";

export const birthApplicationsRelations = relations(
  birthApplications,
  ({ one }) => ({
    user: one(users, {
      fields: [birthApplications.userId],
      references: [users.id],
    }),
    approved: one(staffMember, {
      fields: [birthApplications.approvedBy],
      references: [staffMember.staffId],
    }),
    rejected: one(staffMember, {
      fields: [birthApplications.rejectedBy],
      references: [staffMember.staffId],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  birthApplications: many(birthApplications),
  nationalIdApplications: many(nationalIdApplications),
}));

export const nationalIdApplicationsRelations = relations(
  nationalIdApplications,
  ({ one }) => ({
    user: one(users, {
      fields: [nationalIdApplications.userId],
      references: [users.id],
    }),
    approved: one(staffMember, {
      fields: [nationalIdApplications.approvedBy],
      references: [staffMember.staffId],
    }),
    rejected: one(staffMember, {
      fields: [nationalIdApplications.rejectedBy],
      references: [staffMember.staffId],
    }),
  }),
);

export const districtsRelations = relations(districts, ({ one }) => ({
  province: one(provinces, {
    fields: [districts.provinceId],
    references: [provinces.id],
  }),
}));

export const provincesRelations = relations(provinces, ({ many }) => ({
  districts: many(districts),
}));

export const staffMemberRelations = relations(staffMember, ({ one }) => {
  return {
    station: one(districts, {
      fields: [staffMember.stationId],
      references: [districts.id],
    }),
  };
});

export const nationalIDsRelations = relations(nationalIDs, ({ one }) => {
  return {
    birthCertificate: one(birthCertificates, {
      fields: [nationalIDs.nationalIdNumber],
      references: [birthCertificates.nationalIdNumber],
    }),
  };
});
