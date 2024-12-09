import { type Account } from "@/lib/db/schema/accounts";
import { type Transaction, type CompleteTransaction } from "@/lib/db/schema/transactions";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Transaction>) => void;

export const useOptimisticTransactions = (
  transactions: CompleteTransaction[],
  accounts: Account[]
) => {
  const [optimisticTransactions, addOptimisticTransaction] = useOptimistic(
    transactions,
    (
      currentState: CompleteTransaction[],
      action: OptimisticAction<Transaction>,
    ): CompleteTransaction[] => {
      const { data } = action;

      const optimisticAccount = accounts.find(
        (account) => account.id === data.accountId,
      )!;

      const optimisticTransaction = {
        ...data,
        account: optimisticAccount,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticTransaction]
            : [...currentState, optimisticTransaction];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticTransaction } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticTransaction, optimisticTransactions };
};
