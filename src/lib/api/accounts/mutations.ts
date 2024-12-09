import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  AccountId,
  NewAccountParams,
  UpdateAccountParams,
  updateAccountSchema,
  insertAccountSchema,
  accounts,
  accountIdSchema
} from "@/lib/db/schema/accounts";
import { getUserAuth } from "@/lib/auth/utils";

export const createAccount = async (account: NewAccountParams) => {
  const { session } = await getUserAuth();

  if (!session) throw { error: 'Not authorized' }

  const newAccount = insertAccountSchema.parse({ ...account, userId: session.user.id });
  try {
    const [a] = await db.insert(accounts).values(newAccount).returning();
    return { account: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateAccount = async (id: AccountId, account: UpdateAccountParams) => {
  const { session } = await getUserAuth();

  if (!session) throw { error: 'Not authorized' }

  const { id: accountId } = accountIdSchema.parse({ id });
  const newAccount = updateAccountSchema.parse({ ...account, userId: session.user.id });
  try {
    const [a] = await db
      .update(accounts)
      .set({ ...newAccount, updatedAt: new Date() })
      .where(and(eq(accounts.id, accountId!), eq(accounts.userId, session.user.id)))
      .returning();
    return { account: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteAccount = async (id: AccountId) => {
  const { session } = await getUserAuth();

  if (!session) throw { error: 'Not authorized' }

  const { id: accountId } = accountIdSchema.parse({ id });
  try {
    const [a] = await db.delete(accounts).where(and(eq(accounts.id, accountId!), eq(accounts.userId, session.user.id)))
      .returning();
    return { account: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

