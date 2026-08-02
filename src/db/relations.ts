import { relations } from "drizzle-orm";
import { users, birthApplications, nationalIdApplications } from "./schemas";

export const birthApplicationsRelations = relations(
  birthApplications,
  ({ one }) => ({
    user: one(users, {
      fields: [birthApplications.userId],
      references: [users.id],
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
  }),
);
