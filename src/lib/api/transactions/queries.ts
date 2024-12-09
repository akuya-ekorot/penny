import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type TransactionId, transactionIdSchema, transactions } from "@/lib/db/schema/transactions";
import { accounts } from "@/lib/db/schema/accounts";

export const getTransactions = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ transaction: transactions, account: accounts }).from(transactions).leftJoin(accounts, eq(transactions.accountId, accounts.id)).where(eq(transactions.userId, session?.user.id!));
  const t = rows .map((r) => ({ ...r.transaction, account: r.account})); 
  return { transactions: t };
};

export const getTransactionById = async (id: TransactionId) => {
  const { session } = await getUserAuth();
  const { id: transactionId } = transactionIdSchema.parse({ id });
  const [row] = await db.select({ transaction: transactions, account: accounts }).from(transactions).where(and(eq(transactions.id, transactionId), eq(transactions.userId, session?.user.id!))).leftJoin(accounts, eq(transactions.accountId, accounts.id));
  if (row === undefined) return {};
  const t =  { ...row.transaction, account: row.account } ;
  return { transaction: t };
};


