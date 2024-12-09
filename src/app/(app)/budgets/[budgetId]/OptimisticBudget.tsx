"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/budgets/useOptimisticBudgets";
import { type Budget } from "@/lib/db/schema/budgets";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import BudgetForm from "@/components/budgets/BudgetForm";


export default function OptimisticBudget({
  budget,

}: {
  budget: Budget;


}) {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticBudget, setOptimisticBudget] = useOptimistic(budget);
  const updateBudget: TAddOptimistic = (input) =>
    setOptimisticBudget({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <BudgetForm
          budget={optimisticBudget}

          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateBudget}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticBudget.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticBudget.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticBudget, null, 2)}
      </pre>
    </div>
  );
}
