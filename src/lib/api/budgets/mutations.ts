import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  BudgetId, 
  NewBudgetParams,
  UpdateBudgetParams, 
  updateBudgetSchema,
  insertBudgetSchema, 
  budgets,
  budgetIdSchema 
} from "@/lib/db/schema/budgets";
import { getUserAuth } from "@/lib/auth/utils";

export const createBudget = async (budget: NewBudgetParams) => {
  const { session } = await getUserAuth();
  const newBudget = insertBudgetSchema.parse({ ...budget, userId: session?.user.id! });
  try {
    const [b] =  await db.insert(budgets).values(newBudget).returning();
    return { budget: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBudget = async (id: BudgetId, budget: UpdateBudgetParams) => {
  const { session } = await getUserAuth();
  const { id: budgetId } = budgetIdSchema.parse({ id });
  const newBudget = updateBudgetSchema.parse({ ...budget, userId: session?.user.id! });
  try {
    const [b] =  await db
     .update(budgets)
     .set({...newBudget, updatedAt: new Date() })
     .where(and(eq(budgets.id, budgetId!), eq(budgets.userId, session?.user.id!)))
     .returning();
    return { budget: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteBudget = async (id: BudgetId) => {
  const { session } = await getUserAuth();
  const { id: budgetId } = budgetIdSchema.parse({ id });
  try {
    const [b] =  await db.delete(budgets).where(and(eq(budgets.id, budgetId!), eq(budgets.userId, session?.user.id!)))
    .returning();
    return { budget: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

