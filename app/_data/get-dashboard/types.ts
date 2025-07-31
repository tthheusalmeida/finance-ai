import {
  TransactionCategoryValues,
  TransactionTypeValues,
} from "../../_lib/database/transactions/schema";

export type TransactionPercentagePerType = {
  [key in TransactionTypeValues]: number;
};

export interface TotalExpensePerCategory {
  category: TransactionCategoryValues;
  totalAmount: number;
  percentageOfTotal: number;
}
