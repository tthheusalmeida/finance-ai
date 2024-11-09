import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";

interface getTypeAmounProps {
  type: TransactionType;
  userId: string | "";
  where: object;
}

const getTypeAmount = async ({ type, userId, where }: getTypeAmounProps) => {
  return Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type, userId },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
};

const getTransactionAmount = async (userId: string, where: object) => {
  return Number(
    (
      await db.transaction.aggregate({
        where: { ...where, userId },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
};

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const where = {
    date: {
      gte: new Date(`2024-${month}-01`),
      lt: new Date(`2024-${month}-31`),
    },
  };

  const depositsTotal = await getTypeAmount({
    type: "DEPOSIT",
    userId: userId || "",
    where,
  });
  const investmentsTotal = await getTypeAmount({
    type: "INVESTMENT",
    userId: userId || "",
    where,
  });
  const expensesTotal = await getTypeAmount({
    type: "EXPENSE",
    userId: userId || "",
    where,
  });
  const balance = depositsTotal - investmentsTotal - expensesTotal;
  const transactionsTotal = await getTransactionAmount(userId || "", where);
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

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal: Math.round(
      (Number(category._sum.amount) / Number(expensesTotal)) * 100,
    ),
  }));
  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

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
