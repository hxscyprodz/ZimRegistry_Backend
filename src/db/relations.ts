import { relations } from "drizzle-orm";
import { users, birthApplications } from "./schemas";

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
}));
