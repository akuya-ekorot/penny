"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Transaction, CompleteTransaction } from "@/lib/db/schema/transactions";
import Modal from "@/components/shared/Modal";
import { type Account, type AccountId } from "@/lib/db/schema/accounts";
import { useOptimisticTransactions } from "@/app/(app)/transactions/useOptimisticTransactions";
import { Button } from "@/components/ui/button";
import TransactionForm from "./TransactionForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (transaction?: Transaction) => void;

export default function TransactionList({
  transactions,
  accounts,
  accountId 
}: {
  transactions: CompleteTransaction[];
  accounts: Account[];
  accountId?: AccountId 
}) {
  const { optimisticTransactions, addOptimisticTransaction } = useOptimisticTransactions(
    transactions,
    accounts 
  );
  const [open, setOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const openModal = (transaction?: Transaction) => {
    setOpen(true);
    transaction ? setActiveTransaction(transaction) : setActiveTransaction(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeTransaction ? "Edit Transaction" : "Create Transaction"}
      >
        <TransactionForm
          transaction={activeTransaction}
          addOptimistic={addOptimisticTransaction}
          openModal={openModal}
          closeModal={closeModal}
          accounts={accounts}
        accountId={accountId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticTransactions.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticTransactions.map((transaction) => (
            <Transaction
              transaction={transaction}
              key={transaction.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Transaction = ({
  transaction,
  openModal,
}: {
  transaction: CompleteTransaction;
  openModal: TOpenModal;
}) => {
  const optimistic = transaction.id === "optimistic";
  const deleting = transaction.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("transactions")
    ? pathname
    : pathname + "/transactions/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{transaction.description}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + transaction.id }>
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
        No transactions
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new transaction.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Transactions </Button>
      </div>
    </div>
  );
};
