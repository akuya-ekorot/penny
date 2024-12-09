"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Account, CompleteAccount } from "@/lib/db/schema/accounts";
import Modal from "@/components/shared/Modal";

import { useOptimisticAccounts } from "@/app/(app)/accounts/useOptimisticAccounts";
import { Button } from "@/components/ui/button";
import AccountForm from "./AccountForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (account?: Account) => void;

export default function AccountList({
  accounts,
   
}: {
  accounts: CompleteAccount[];
   
}) {
  const { optimisticAccounts, addOptimisticAccount } = useOptimisticAccounts(
    accounts,
     
  );
  const [open, setOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const openModal = (account?: Account) => {
    setOpen(true);
    account ? setActiveAccount(account) : setActiveAccount(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeAccount ? "Edit Account" : "Create Account"}
      >
        <AccountForm
          account={activeAccount}
          addOptimistic={addOptimisticAccount}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticAccounts.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticAccounts.map((account) => (
            <Account
              account={account}
              key={account.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Account = ({
  account,
  openModal,
}: {
  account: CompleteAccount;
  openModal: TOpenModal;
}) => {
  const optimistic = account.id === "optimistic";
  const deleting = account.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("accounts")
    ? pathname
    : pathname + "/accounts/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{account.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + account.id }>
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
        No accounts
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new account.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Accounts </Button>
      </div>
    </div>
  );
};
