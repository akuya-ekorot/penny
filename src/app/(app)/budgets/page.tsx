import { Suspense } from "react";

import Loading from "@/app/loading";
import BudgetList from "@/components/budgets/BudgetList";
import { getBudgets } from "@/lib/api/budgets/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function BudgetsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Budgets</h1>
        </div>
        <Budgets />
      </div>
    </main>
  );
}

const Budgets = async () => {
  await checkAuth();

  const { budgets } = await getBudgets();
  
  return (
    <Suspense fallback={<Loading />}>
      <BudgetList budgets={budgets}  />
    </Suspense>
  );
};
