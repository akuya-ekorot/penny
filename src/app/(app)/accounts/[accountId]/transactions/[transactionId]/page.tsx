import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getTransactionById } from "@/lib/api/transactions/queries";
import { getAccounts } from "@/lib/api/accounts/queries"; import OptimisticTransaction from "@/app/(app)/transactions/[transactionId]/OptimisticTransaction";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {

  return (
    <main className="overflow-auto">
      <Transaction id={(await params).transactionId} />
    </main>
  );
}

const Transaction = async ({ id }: { id: string }) => {
  await checkAuth();

  const { transaction } = await getTransactionById(id);
  const { accounts } = await getAccounts();

  if (!transaction) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="transactions" />
        <OptimisticTransaction transaction={transaction} accounts={accounts}
          accountId={transaction.accountId} />
      </div>
    </Suspense>
  );
};
