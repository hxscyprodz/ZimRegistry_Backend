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
  stations,
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
    station: one(stations, {
      fields: [birthApplications.stationId],
      references: [stations.id],
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
    station: one(stations, {
      fields: [nationalIdApplications.stationId],
      references: [stations.id],
    }),
  }),
);

export const districtsRelations = relations(districts, ({ one, many }) => ({
  province: one(provinces, {
    fields: [districts.provinceId],
    references: [provinces.id],
  }),
  stations: many(districts),
}));

export const provincesRelations = relations(provinces, ({ many }) => ({
  districts: many(districts),
}));

export const staffMemberRelations = relations(staffMember, ({ one }) => {
  return {
    station: one(stations, {
      fields: [staffMember.stationId],
      references: [stations.id],
    }),
    user: one(users, {
      fields: [staffMember.nationalIdNumber],
      references: [users.nationalIdNumber],
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

export const stationsRelations = relations(stations, ({ one, many }) => ({
  province: one(districts, {
    fields: [stations.districtId],
    references: [districts.id],
  }),
  staffMembers: many(staffMember),
  birthApplications: many(birthApplications),
  nationalIdApplications: many(nationalIdApplications),
}));
