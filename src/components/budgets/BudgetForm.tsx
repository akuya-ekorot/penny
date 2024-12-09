import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/budgets/useOptimisticBudgets";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import { Checkbox } from "@/components/ui/checkbox"


import { type Budget, insertBudgetParams } from "@/lib/db/schema/budgets";
import {
  createBudgetAction,
  deleteBudgetAction,
  updateBudgetAction,
} from "@/lib/actions/budgets";


const BudgetForm = ({

  budget,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  budget?: Budget | null;

  openModal?: (budget?: Budget) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Budget>(insertBudgetParams);
  const editing = !!budget?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("budgets");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Budget },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      if (openModal) openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      if (postSuccess) postSuccess();
      toast.success(`Budget ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const budgetParsed = await insertBudgetParams.safeParseAsync({ ...payload });
    if (!budgetParsed.success) {
      setErrors(budgetParsed?.error.flatten().fieldErrors);
      return;
    }

    if (closeModal) closeModal();
    const values = budgetParsed.data;
    const pendingBudget: Budget = {
      updatedAt: budget?.updatedAt ?? new Date(),
      createdAt: budget?.createdAt ?? new Date(),
      id: budget?.id ?? "",
      userId: budget?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        if (addOptimistic) addOptimistic({
          data: pendingBudget,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateBudgetAction({ ...values, id: budget.id })
          : await createBudgetAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingBudget
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
          defaultValue={budget?.name ?? ""}
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
          defaultValue={budget?.description ?? ""}
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
            errors?.isRecurring ? "text-destructive" : "",
          )}
        >
          Is Recurring
        </Label>
        <br />
        <Checkbox defaultChecked={budget?.isRecurring} name={'isRecurring'} className={cn(errors?.isRecurring ? "ring ring-destructive" : "")} />
        {errors?.isRecurring ? (
          <p className="text-xs text-destructive mt-2">{errors.isRecurring[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.recurringPeriod ? "text-destructive" : "",
          )}
        >
          Recurring Period
        </Label>
        <Input
          type="text"
          name="recurringPeriod"
          className={cn(errors?.recurringPeriod ? "ring ring-destructive" : "")}
          defaultValue={budget?.recurringPeriod ?? ""}
        />
        {errors?.recurringPeriod ? (
          <p className="text-xs text-destructive mt-2">{errors.recurringPeriod[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.recurringFrequency ? "text-destructive" : "",
          )}
        >
          Recurring Frequency
        </Label>
        <Input
          type="text"
          name="recurringFrequency"
          className={cn(errors?.recurringFrequency ? "ring ring-destructive" : "")}
          defaultValue={budget?.recurringFrequency ?? ""}
        />
        {errors?.recurringFrequency ? (
          <p className="text-xs text-destructive mt-2">{errors.recurringFrequency[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.targetAmount ? "text-destructive" : "",
          )}
        >
          Target Amount
        </Label>
        <Input
          type="text"
          name="targetAmount"
          className={cn(errors?.targetAmount ? "ring ring-destructive" : "")}
          defaultValue={budget?.targetAmount ?? ""}
        />
        {errors?.targetAmount ? (
          <p className="text-xs text-destructive mt-2">{errors.targetAmount[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.assignedAmount ? "text-destructive" : "",
          )}
        >
          Assigned Amount
        </Label>
        <Input
          type="text"
          name="assignedAmount"
          className={cn(errors?.assignedAmount ? "ring ring-destructive" : "")}
          defaultValue={budget?.assignedAmount ?? ""}
        />
        {errors?.assignedAmount ? (
          <p className="text-xs text-destructive mt-2">{errors.assignedAmount[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.spentAmount ? "text-destructive" : "",
          )}
        >
          Spent Amount
        </Label>
        <Input
          type="text"
          name="spentAmount"
          className={cn(errors?.spentAmount ? "ring ring-destructive" : "")}
          defaultValue={budget?.spentAmount ?? ""}
        />
        {errors?.spentAmount ? (
          <p className="text-xs text-destructive mt-2">{errors.spentAmount[0]}</p>
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
            if (closeModal) closeModal();
            startMutation(async () => {
              if (addOptimistic) addOptimistic({ action: "delete", data: budget });
              const error = await deleteBudgetAction(budget.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: budget,
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

export default BudgetForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: boolean;
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
