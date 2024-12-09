import { sql } from "drizzle-orm";
import { text, integer, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getAccounts } from "@/lib/api/accounts/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const accounts = pgTable('accounts', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  institution: text("institution"),
  balance: integer("balance").notNull().default(0),
  currency: text("currency").notNull().default('KES'),
  userId: varchar("user_id", { length: 256 }).references(() => users.id, { onDelete: "cascade" }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for accounts - used to validate API requests
const baseSchema = createSelectSchema(accounts).omit(timestamps);

export const insertAccountSchema = createInsertSchema(accounts).omit(timestamps);
export const insertAccountParams = baseSchema.extend({
  balance: z.coerce.number()
}).omit({
  id: true,
  userId: true
});

export const updateAccountSchema = baseSchema;
export const updateAccountParams = baseSchema.extend({
  balance: z.coerce.number()
}).omit({
  userId: true
});
export const accountIdSchema = baseSchema.pick({ id: true });

// Types for accounts - used to type API request params and within Components
export type Account = typeof accounts.$inferSelect;
export type NewAccount = z.infer<typeof insertAccountSchema>;
export type NewAccountParams = z.infer<typeof insertAccountParams>;
export type UpdateAccountParams = z.infer<typeof updateAccountParams>;
export type AccountId = z.infer<typeof accountIdSchema>["id"];

// this type infers the return from getAccounts() - meaning it will include any joins
export type CompleteAccount = Awaited<ReturnType<typeof getAccounts>>["accounts"][number];

