import { pgTable, text, timestamp, boolean, integer, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// ==========================================
// 1. DOMAINE MÉTIER (Notre application)
// ==========================================

export const households = pgTable("households", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  inviteCode: text("invite_code").$defaultFn(() => crypto.randomUUID()),
});

export const chores = pgTable("chores", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  frequencyDays: integer("frequency_days").notNull(),
  nfcTagId: text("nfc_tag_id").unique(),
  householdId: text("household_id")
    .notNull()
    .references(() => households.id, { onDelete: "cascade" }),
});

export const choreLogs = pgTable("chore_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  choreId: text("chore_id")
    .notNull()
    .references(() => chores.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at", { mode: "date" }).defaultNow().notNull(),
});

// ==========================================
// 2. NEXTAUTH & EXTENSION UTILISATEUR
// ==========================================

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  
  // -- Champs spécifiques à notre logique métier --
  householdId: text("household_id").references(() => households.id, { onDelete: "set null" }), // Nullable pour le "Workspace Onboarding"
  isGuest: boolean("is_guest").default(false).notNull(),
  gender: text("gender"),
  points: integer("points").default(0).notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ==========================================
// 3. DÉFINITION DES RELATIONS (Pour l'API query Drizzle)
// ==========================================

export const householdsRelations = relations(households, ({ many }) => ({
  users: many(users),
  chores: many(chores),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  household: one(households, { fields: [users.householdId], references: [households.id] }),
  choreLogs: many(choreLogs),
}));

export const choresRelations = relations(chores, ({ one, many }) => ({
  household: one(households, { fields: [chores.householdId], references: [households.id] }),
  logs: many(choreLogs),
}));

export const choreLogsRelations = relations(choreLogs, ({ one }) => ({
  chore: one(chores, { fields: [choreLogs.choreId], references: [chores.id] }),
  user: one(users, { fields: [choreLogs.userId], references: [users.id] }),
}));