import { Suspense } from "react";

import Loading from "@/app/loading";
import AccountList from "@/components/accounts/AccountList";
import { getAccounts } from "@/lib/api/accounts/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function AccountsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Accounts</h1>
        </div>
        <Accounts />
      </div>
    </main>
  );
}

const Accounts = async () => {
  await checkAuth();

  const { accounts } = await getAccounts();

  return (
    <Suspense fallback={<Loading />}>
      <AccountList accounts={accounts} />
    </Suspense>
  );
};
