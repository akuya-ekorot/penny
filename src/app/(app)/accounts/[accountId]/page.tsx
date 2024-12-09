import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getAccountByIdWithTransactions } from "@/lib/api/accounts/queries";
import OptimisticAccount from "./OptimisticAccount";
import { checkAuth } from "@/lib/auth/utils";
import TransactionList from "@/components/transactions/TransactionList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function AccountPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {

  return (
    <main className="overflow-auto">
      <Account id={(await params).accountId} />
    </main>
  );
}

const Account = async ({ id }: { id: string }) => {
  await checkAuth();

  const { account, transactions } = await getAccountByIdWithTransactions(id);


  if (!account) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="accounts" />
        <OptimisticAccount account={account} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{account.name}&apos;s Transactions</h3>
        <TransactionList
          accounts={[]}
          accountId={account.id}
          transactions={transactions}
        />
      </div>
    </Suspense>
  );
};
