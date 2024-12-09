
import { type Account, type CompleteAccount } from "@/lib/db/schema/accounts";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Account>) => void;

export const useOptimisticAccounts = (
  accounts: CompleteAccount[],

) => {
  const [optimisticAccounts, addOptimisticAccount] = useOptimistic(
    accounts,
    (
      currentState: CompleteAccount[],
      action: OptimisticAction<Account>,
    ): CompleteAccount[] => {
      const { data } = action;



      const optimisticAccount = {
        ...data,

        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticAccount]
            : [...currentState, optimisticAccount];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticAccount } : item,
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

  return { addOptimisticAccount, optimisticAccounts };
};
