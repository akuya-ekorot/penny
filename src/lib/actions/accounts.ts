"use server";

import { revalidatePath } from "next/cache";
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/lib/api/accounts/mutations";
import {
  AccountId,
  NewAccountParams,
  UpdateAccountParams,
  accountIdSchema,
  insertAccountParams,
  updateAccountParams,
} from "@/lib/db/schema/accounts";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateAccounts = () => revalidatePath("/accounts");

export const createAccountAction = async (input: NewAccountParams) => {
  try {
    const payload = insertAccountParams.parse(input);
    await createAccount(payload);
    revalidateAccounts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateAccountAction = async (input: UpdateAccountParams) => {
  try {
    const payload = updateAccountParams.parse(input);
    await updateAccount(payload.id, payload);
    revalidateAccounts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteAccountAction = async (input: AccountId) => {
  try {
    const payload = accountIdSchema.parse({ id: input });
    await deleteAccount(payload.id);
    revalidateAccounts();
  } catch (e) {
    return handleErrors(e);
  }
};
