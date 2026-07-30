import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const chores = pgTable("chores", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  frequencyDays: integer("frequency_days").notNull(),
  nfcTagId: varchar("nfc_tag_id", { length: 255 }).unique(),
});

export const choreLogs = pgTable("chore_logs", {
  id: serial("id").primaryKey(),
  choreId: integer("chore_id").references(() => chores.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const choresRelations = relations(chores, ({ many }) => ({
  logs: many(choreLogs),
}));

export const choreLogsRelations = relations(choreLogs, ({ one }) => ({
  chore: one(chores, { fields: [choreLogs.choreId], references: [chores.id] }),
  user: one(users, { fields: [choreLogs.userId], references: [users.id] }),
}));