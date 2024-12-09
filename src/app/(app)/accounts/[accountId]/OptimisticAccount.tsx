"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/accounts/useOptimisticAccounts";
import { type Account } from "@/lib/db/schema/accounts";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import AccountForm from "@/components/accounts/AccountForm";


export default function OptimisticAccount({ 
  account,
   
}: { 
  account: Account; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Account) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticAccount, setOptimisticAccount] = useOptimistic(account);
  const updateAccount: TAddOptimistic = (input) =>
    setOptimisticAccount({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <AccountForm
          account={optimisticAccount}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateAccount}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticAccount.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticAccount.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticAccount, null, 2)}
      </pre>
    </div>
  );
}
