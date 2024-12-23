import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  TransactionId,
  NewTransactionParams,
  UpdateTransactionParams,
  updateTransactionSchema,
  insertTransactionSchema,
  transactions,
  transactionIdSchema
} from "@/lib/db/schema/transactions";
import { getUserAuth } from "@/lib/auth/utils";

export const createTransaction = async (transaction: NewTransactionParams) => {
  const { session } = await getUserAuth();

  if (!session) throw { error: 'Not authorized' }

  const newTransaction = insertTransactionSchema.parse({ ...transaction, userId: session.user.id });
  try {
    const [t] = await db.insert(transactions).values(newTransaction).returning();
    return { transaction: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateTransaction = async (id: TransactionId, transaction: UpdateTransactionParams) => {
  const { session } = await getUserAuth();

  if (!session) throw { error: 'Not authorized' }

  const { id: transactionId } = transactionIdSchema.parse({ id });
  const newTransaction = updateTransactionSchema.parse({ ...transaction, userId: session.user.id });
  try {
    const [t] = await db
      .update(transactions)
      .set({ ...newTransaction, updatedAt: new Date() })
      .where(and(eq(transactions.id, transactionId), eq(transactions.userId, session.user.id)))
      .returning();
    return { transaction: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteTransaction = async (id: TransactionId) => {
  const { session } = await getUserAuth();
  const { id: transactionId } = transactionIdSchema.parse({ id });

  if (!session) throw { error: 'Not authorized' }

  try {
    const [t] = await db.delete(transactions).where(and(eq(transactions.id, transactionId), eq(transactions.userId, session.user.id)))
      .returning();
    return { transaction: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

