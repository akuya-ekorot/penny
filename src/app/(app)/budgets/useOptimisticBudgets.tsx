
import { type Budget, type CompleteBudget } from "@/lib/db/schema/budgets";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Budget>) => void;

export const useOptimisticBudgets = (
  budgets: CompleteBudget[],
  
) => {
  const [optimisticBudgets, addOptimisticBudget] = useOptimistic(
    budgets,
    (
      currentState: CompleteBudget[],
      action: OptimisticAction<Budget>,
    ): CompleteBudget[] => {
      const { data } = action;

      

      const optimisticBudget = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticBudget]
            : [...currentState, optimisticBudget];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticBudget } : item,
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

  return { addOptimisticBudget, optimisticBudgets };
};
