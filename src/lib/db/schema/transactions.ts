import { sql } from "drizzle-orm";
import { text, integer, varchar, timestamp, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { accounts } from "./accounts"
import { users } from "@/lib/db/schema/auth";
import { type getTransactions } from "@/lib/api/transactions/queries";

import { nanoid, timestamps } from "@/lib/utils";
import { budgets } from "./budgets";

export const transactions = pgTable('transactions', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  description: text("description"),
  amount: integer("amount").notNull(),
  budgetId: varchar("budget_id", { length: 256 }).references(() => budgets.id, { onDelete: 'set null' }),
  accountId: varchar("account_id", { length: 256 }).references(() => accounts.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id", { length: 256 }).references(() => users.id, { onDelete: "cascade" }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

}, (transactions) => ([{
  budgetIdIndex: uniqueIndex('transaction_budget_id_idx').on(transactions.budgetId),
  accountIdIndex: uniqueIndex('transaction_account_id_idx').on(transactions.accountId),
}]));


// Schema for transactions - used to validate API requests
const baseSchema = createSelectSchema(transactions).omit(timestamps)

export const insertTransactionSchema = createInsertSchema(transactions).omit(timestamps);
export const insertTransactionParams = baseSchema.extend({
  amount: z.coerce.number(),
  accountId: z.coerce.string().min(1)
}).omit({
  id: true,
  userId: true
});

export const updateTransactionSchema = baseSchema;
export const updateTransactionParams = baseSchema.extend({
  amount: z.coerce.number(),
  accountId: z.coerce.string().min(1)
}).omit({
  userId: true
});
export const transactionIdSchema = baseSchema.pick({ id: true });

// Types for transactions - used to type API request params and within Components
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = z.infer<typeof insertTransactionSchema>;
export type NewTransactionParams = z.infer<typeof insertTransactionParams>;
export type UpdateTransactionParams = z.infer<typeof updateTransactionParams>;
export type TransactionId = z.infer<typeof transactionIdSchema>["id"];

// this type infers the return from getTransactions() - meaning it will include any joins
export type CompleteTransaction = Awaited<ReturnType<typeof getTransactions>>["transactions"][number];

