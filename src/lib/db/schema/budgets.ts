import { sql } from "drizzle-orm";
import { text, boolean, integer, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getBudgets } from "@/lib/api/budgets/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const budgets = pgTable('budgets', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  isRecurring: boolean("is_recurring").notNull(),
  recurringPeriod: text("recurring_period"),
  recurringFrequency: integer("recurring_frequency"),
  targetAmount: integer("target_amount").notNull(),
  assignedAmount: integer("assigned_amount").notNull(),
  spentAmount: integer("spent_amount").notNull(),
  userId: varchar("user_id", { length: 256 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for budgets - used to validate API requests
const baseSchema = createSelectSchema(budgets).omit(timestamps)

export const insertBudgetSchema = createInsertSchema(budgets).omit(timestamps);
export const insertBudgetParams = baseSchema.extend({
  isRecurring: z.coerce.boolean(),
  recurringFrequency: z.coerce.number(),
  targetAmount: z.coerce.number(),
  assignedAmount: z.coerce.number(),
  spentAmount: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updateBudgetSchema = baseSchema;
export const updateBudgetParams = baseSchema.extend({
  isRecurring: z.coerce.boolean(),
  recurringFrequency: z.coerce.number(),
  targetAmount: z.coerce.number(),
  assignedAmount: z.coerce.number(),
  spentAmount: z.coerce.number()
}).omit({ 
  userId: true
});
export const budgetIdSchema = baseSchema.pick({ id: true });

// Types for budgets - used to type API request params and within Components
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = z.infer<typeof insertBudgetSchema>;
export type NewBudgetParams = z.infer<typeof insertBudgetParams>;
export type UpdateBudgetParams = z.infer<typeof updateBudgetParams>;
export type BudgetId = z.infer<typeof budgetIdSchema>["id"];
    
// this type infers the return from getBudgets() - meaning it will include any joins
export type CompleteBudget = Awaited<ReturnType<typeof getBudgets>>["budgets"][number];

