import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";
import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

interface SummaryCardsProps {
  month: string;
}

const SummaryCards = async ({ month }: SummaryCardsProps) => {
  const { userId } = await auth();
  const where = {
    date: {
      gte: new Date(`2024-${month}-01`),
      lt: new Date(`2024-${month}-31`),
    },
  };

  const getTypeAmount = async (type: TransactionType, userId: string | "") => {
    return Number(
      (
        await db.transaction.aggregate({
          where: { ...where, type, userId },
          _sum: { amount: true },
        })
      )?._sum?.amount,
    );
  };

  const depositsTotal = await getTypeAmount("DEPOSIT", userId || "");
  const investmentsTotal = await getTypeAmount("INVESTMENT", userId || "");
  const expensesTotal = await getTypeAmount("EXPENSE", userId || "");

  const balance = depositsTotal - investmentsTotal - expensesTotal;

  return (
    <div className="space-y-6">
      {/* PRIMEIRO CARD */}
      <SummaryCard
        icon={<WalletIcon size={16} />}
        title="Saldo"
        amount={balance}
        size="large"
      />

      {/* OUTROS CARDS */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<PiggyBankIcon size={16} />}
          title="Investido"
          amount={investmentsTotal}
        />

        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          title="Receita"
          amount={depositsTotal}
        />

        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-red-500" />}
          title="Despesas"
          amount={expensesTotal}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
