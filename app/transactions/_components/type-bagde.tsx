import { Transaction, TransactionType } from "@prisma/client";
import { Badge } from "@/app/_components/ui/badge";
import { Circle } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-lime-950 font-bold text-primary hover:bg-lime-900">
        <Circle className="mr-2 fill-primary" size={10} />
        Depósito
      </Badge>
    );
  } else if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-red-950 font-bold text-red-600 hover:bg-red-900">
        <Circle className="mr-2 fill-red-600" size={10} />
        Despesas
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-slate-600 font-bold text-white hover:bg-slate-700">
        <Circle className="mr-2 fill-slate-50" size={10} />
        Investimento
      </Badge>
    );
  }
};

export default TransactionTypeBadge;
