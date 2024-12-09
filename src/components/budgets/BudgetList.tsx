"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Budget, CompleteBudget } from "@/lib/db/schema/budgets";
import Modal from "@/components/shared/Modal";

import { useOptimisticBudgets } from "@/app/(app)/budgets/useOptimisticBudgets";
import { Button } from "@/components/ui/button";
import BudgetForm from "./BudgetForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (budget?: Budget) => void;

export default function BudgetList({
  budgets,

}: {
  budgets: CompleteBudget[];

}) {
  const { optimisticBudgets, addOptimisticBudget } = useOptimisticBudgets(
    budgets,

  );
  const [open, setOpen] = useState(false);
  const [activeBudget, setActiveBudget] = useState<Budget | null>(null);
  const openModal = (budget?: Budget) => {
    setOpen(true);
    if (budget) setActiveBudget(budget)
    else setActiveBudget(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeBudget ? "Edit Budget" : "Create Budget"}
      >
        <BudgetForm
          budget={activeBudget}
          addOptimistic={addOptimisticBudget}
          openModal={openModal}
          closeModal={closeModal}

        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticBudgets.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticBudgets.map((budget) => (
            <Budget
              budget={budget}
              key={budget.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Budget = ({
  budget,
}: {
  budget: CompleteBudget;
  openModal: TOpenModal;
}) => {
  const optimistic = budget.id === "optimistic";
  const deleting = budget.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("budgets")
    ? pathname
    : pathname + "/budgets/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{budget.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + budget.id}>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No budgets
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new budget.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Budgets </Button>
      </div>
    </div>
  );
};
