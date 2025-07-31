import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "../../_lib/database/transactions/schema";
import { TransactionPercentagePerType } from "./types";
import {
  getLastTransaction,
  getTransactionAmountGroupedByCategory,
  getTransactionAmountGroupedByTypeAndDate,
} from "@/app/_lib/database/transactions/querys";

interface AmountInterface {
  type: string;
  sum: string;
}

function getAmountByType(amountList: AmountInterface[], type: string): number {
  return Number(
    amountList
      .filter((item) => item.type === type)
      .map((item) => Number(item.sum)) ?? 0,
  );
}

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const date = {
    start: new Date(`2025-${month}-01`),
    end: new Date(`2025-${month}-31`),
  };

  const amountList = await getTransactionAmountGroupedByTypeAndDate(
    userId,
    date,
  );

  const depositsTotal = getAmountByType(amountList, TransactionType.DEPOSIT);
  const investmentsTotal = getAmountByType(
    amountList,
    TransactionType.INVESTMENT,
  );
  const expensesTotal = getAmountByType(amountList, TransactionType.EXPENSE);

  const balance = depositsTotal - investmentsTotal - expensesTotal;
  const transactionsTotal = amountList.reduce(
    (acc, item) => acc + Number(item.sum),
    0,
  );
  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: Math.round(
      ((depositsTotal || 0) / transactionsTotal) * 100,
    ),
    [TransactionType.EXPENSE]: Math.round(
      ((expensesTotal || 0) / transactionsTotal) * 100,
    ),
    [TransactionType.INVESTMENT]: Math.round(
      ((investmentsTotal || 0) / transactionsTotal) * 100,
    ),
  };

  const listExpensePerCategory = await getTransactionAmountGroupedByCategory(
    userId,
    date,
  );
  const totalCategoryExpense = listExpensePerCategory.reduce(
    (acc, item) => acc + Number(item.sum),
    0,
  );
  const totalExpensePerCategory = listExpensePerCategory.map((category) => ({
    category: category.category,
    totalAmount: Number(category.sum),
    percentageOfTotal: Math.round(
      (Number(category.sum) / Number(totalCategoryExpense)) * 100,
    ),
  }));
  const lastTransactions = await getLastTransaction(userId, date, 15);

  return {
    userId,
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  };
};
