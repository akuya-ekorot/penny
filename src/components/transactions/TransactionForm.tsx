import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/transactions/useOptimisticTransactions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Transaction, insertTransactionParams } from "@/lib/db/schema/transactions";
import {
  createTransactionAction,
  deleteTransactionAction,
  updateTransactionAction,
} from "@/lib/actions/transactions";
import { type Account, type AccountId } from "@/lib/db/schema/accounts";

const TransactionForm = ({
  accounts,
  accountId,
  transaction,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  transaction?: Transaction | null;
  accounts: Account[];
  accountId?: AccountId
  openModal?: (transaction?: Transaction) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Transaction>(insertTransactionParams);
  const editing = !!transaction?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("transactions");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Transaction },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Transaction ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const transactionParsed = await insertTransactionParams.safeParseAsync({ accountId, ...payload });
    if (!transactionParsed.success) {
      setErrors(transactionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = transactionParsed.data;
    const pendingTransaction: Transaction = {
      updatedAt: transaction?.updatedAt ?? new Date(),
      createdAt: transaction?.createdAt ?? new Date(),
      id: transaction?.id ?? "",
      userId: transaction?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingTransaction,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateTransactionAction({ ...values, id: transaction.id })
          : await createTransactionAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingTransaction 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.description ? "text-destructive" : "",
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? "ring ring-destructive" : "")}
          defaultValue={transaction?.description ?? ""}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">{errors.description[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.amount ? "text-destructive" : "",
          )}
        >
          Amount
        </Label>
        <Input
          type="text"
          name="amount"
          className={cn(errors?.amount ? "ring ring-destructive" : "")}
          defaultValue={transaction?.amount ?? ""}
        />
        {errors?.amount ? (
          <p className="text-xs text-destructive mt-2">{errors.amount[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.budgetId ? "text-destructive" : "",
          )}
        >
          Budget Id
        </Label>
        <Input
          type="text"
          name="budgetId"
          className={cn(errors?.budgetId ? "ring ring-destructive" : "")}
          defaultValue={transaction?.budgetId ?? ""}
        />
        {errors?.budgetId ? (
          <p className="text-xs text-destructive mt-2">{errors.budgetId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {accountId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.accountId ? "text-destructive" : "",
          )}
        >
          Account
        </Label>
        <Select defaultValue={transaction?.accountId} name="accountId">
          <SelectTrigger
            className={cn(errors?.accountId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a account" />
          </SelectTrigger>
          <SelectContent>
          {accounts?.map((account) => (
            <SelectItem key={account.id} value={account.id.toString()}>
              {account.id}{/* TODO: Replace with a field from the account model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.accountId ? (
          <p className="text-xs text-destructive mt-2">{errors.accountId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: transaction });
              const error = await deleteTransactionAction(transaction.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: transaction,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default TransactionForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
