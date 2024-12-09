import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type BudgetId, budgetIdSchema, budgets } from "@/lib/db/schema/budgets";

export const getBudgets = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(budgets).where(eq(budgets.userId, session?.user.id!));
  const b = rows
  return { budgets: b };
};

export const getBudgetById = async (id: BudgetId) => {
  const { session } = await getUserAuth();
  const { id: budgetId } = budgetIdSchema.parse({ id });
  const [row] = await db.select().from(budgets).where(and(eq(budgets.id, budgetId), eq(budgets.userId, session?.user.id!)));
  if (row === undefined) return {};
  const b = row;
  return { budget: b };
};


