import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type AccountId, accountIdSchema, accounts } from "@/lib/db/schema/accounts";
import { transactions, type CompleteTransaction } from "@/lib/db/schema/transactions";

export const getAccounts = async () => {
  const { session } = await getUserAuth();

  if (!session) throw { error: 'Not authorized' }

  const rows = await db.select().from(accounts).where(eq(accounts.userId, session.user.id));

  const a = rows
  return { accounts: a };
};

export const getAccountById = async (id: AccountId) => {
  const { session } = await getUserAuth();

  if (!session) throw { error: 'Not authorized' }

  const { id: accountId } = accountIdSchema.parse({ id });
  const [row] = await db.select().from(accounts).where(and(eq(accounts.id, accountId), eq(accounts.userId, session.user.id)));
  if (row === undefined) return {};
  const a = row;
  return { account: a };
};

export const getAccountByIdWithTransactions = async (id: AccountId) => {
  const { session } = await getUserAuth();

  if (!session) throw { error: 'Not authorized' }

  const { id: accountId } = accountIdSchema.parse({ id });
  const rows = await db.select({ account: accounts, transaction: transactions }).from(accounts).where(and(eq(accounts.id, accountId), eq(accounts.userId, session.user.id))).leftJoin(transactions, eq(accounts.id, transactions.accountId));
  if (rows.length === 0) return {};
  const a = rows[0].account;
  const at = rows.filter((r) => r.transaction !== null).map((t) => t.transaction) as CompleteTransaction[];

  return { account: a, transactions: at };
};

