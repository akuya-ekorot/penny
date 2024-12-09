import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/accounts/useOptimisticAccounts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";




import { type Account, insertAccountParams } from "@/lib/db/schema/accounts";
import {
  createAccountAction,
  deleteAccountAction,
  updateAccountAction,
} from "@/lib/actions/accounts";


const AccountForm = ({
  
  account,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  account?: Account | null;
  
  openModal?: (account?: Account) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Account>(insertAccountParams);
  const editing = !!account?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("accounts");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Account },
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
      toast.success(`Account ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const accountParsed = await insertAccountParams.safeParseAsync({  ...payload });
    if (!accountParsed.success) {
      setErrors(accountParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = accountParsed.data;
    const pendingAccount: Account = {
      updatedAt: account?.updatedAt ?? new Date(),
      createdAt: account?.createdAt ?? new Date(),
      id: account?.id ?? "",
      userId: account?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingAccount,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateAccountAction({ ...values, id: account.id })
          : await createAccountAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingAccount 
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
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={account?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
          defaultValue={account?.description ?? ""}
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
            errors?.institution ? "text-destructive" : "",
          )}
        >
          Institution
        </Label>
        <Input
          type="text"
          name="institution"
          className={cn(errors?.institution ? "ring ring-destructive" : "")}
          defaultValue={account?.institution ?? ""}
        />
        {errors?.institution ? (
          <p className="text-xs text-destructive mt-2">{errors.institution[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.balance ? "text-destructive" : "",
          )}
        >
          Balance
        </Label>
        <Input
          type="text"
          name="balance"
          className={cn(errors?.balance ? "ring ring-destructive" : "")}
          defaultValue={account?.balance ?? ""}
        />
        {errors?.balance ? (
          <p className="text-xs text-destructive mt-2">{errors.balance[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.currency ? "text-destructive" : "",
          )}
        >
          Currency
        </Label>
        <Input
          type="text"
          name="currency"
          className={cn(errors?.currency ? "ring ring-destructive" : "")}
          defaultValue={account?.currency ?? ""}
        />
        {errors?.currency ? (
          <p className="text-xs text-destructive mt-2">{errors.currency[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic && addOptimistic({ action: "delete", data: account });
              const error = await deleteAccountAction(account.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: account,
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

export default AccountForm;

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
