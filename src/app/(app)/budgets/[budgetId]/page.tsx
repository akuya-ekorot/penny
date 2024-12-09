import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBudgetById } from "@/lib/api/budgets/queries";
import OptimisticBudget from "./OptimisticBudget";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function BudgetPage({
  params,
}: {
  params: Promise<{ budgetId: string }>;
}) {

  return (
    <main className="overflow-auto">
      <Budget id={(await params).budgetId} />
    </main>
  );
}

const Budget = async ({ id }: { id: string }) => {
  await checkAuth();

  const { budget } = await getBudgetById(id);


  if (!budget) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="budgets" />
        <OptimisticBudget budget={budget} />
      </div>
    </Suspense>
  );
};
