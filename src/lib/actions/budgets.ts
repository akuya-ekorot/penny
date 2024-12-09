"use server";

import { revalidatePath } from "next/cache";
import {
  createBudget,
  deleteBudget,
  updateBudget,
} from "@/lib/api/budgets/mutations";
import {
  BudgetId,
  NewBudgetParams,
  UpdateBudgetParams,
  budgetIdSchema,
  insertBudgetParams,
  updateBudgetParams,
} from "@/lib/db/schema/budgets";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateBudgets = () => revalidatePath("/budgets");

export const createBudgetAction = async (input: NewBudgetParams) => {
  try {
    const payload = insertBudgetParams.parse(input);
    await createBudget(payload);
    revalidateBudgets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateBudgetAction = async (input: UpdateBudgetParams) => {
  try {
    const payload = updateBudgetParams.parse(input);
    await updateBudget(payload.id, payload);
    revalidateBudgets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteBudgetAction = async (input: BudgetId) => {
  try {
    const payload = budgetIdSchema.parse({ id: input });
    await deleteBudget(payload.id);
    revalidateBudgets();
  } catch (e) {
    return handleErrors(e);
  }
};