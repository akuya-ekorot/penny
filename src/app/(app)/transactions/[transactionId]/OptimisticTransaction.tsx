"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/transactions/useOptimisticTransactions";
import { type Transaction } from "@/lib/db/schema/transactions";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import TransactionForm from "@/components/transactions/TransactionForm";
import { type Account, type AccountId } from "@/lib/db/schema/accounts";

export default function OptimisticTransaction({
  transaction,
  accounts,
  accountId
}: {
  transaction: Transaction;

  accounts: Account[];
  accountId?: AccountId
}) {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticTransaction, setOptimisticTransaction] = useOptimistic(transaction);
  const updateTransaction: TAddOptimistic = (input) =>
    setOptimisticTransaction({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <TransactionForm
          transaction={optimisticTransaction}
          accounts={accounts}
          accountId={accountId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateTransaction}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticTransaction.description}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticTransaction.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticTransaction, null, 2)}
      </pre>
    </div>
  );
}
