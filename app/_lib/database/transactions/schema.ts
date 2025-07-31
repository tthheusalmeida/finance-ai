export const TransactionType = {
  DEPOSIT: "DEPOSIT",
  EXPENSE: "EXPENSE",
  INVESTMENT: "INVESTMENT",
};

export const TransactionCategory = {
  HOUSING: "HOUSING",
  TRANSPORTATION: "TRANSPORTATION",
  FOOD: "FOOD",
  ENTERTAINMENT: "ENTERTAINMENT",
  HEALTH: "HEALTH",
  UTILITY: "UTILITY",
  SALARY: "SALARY",
  EDUCATION: "EDUCATION",
  OTHER: "OTHER",
};

export const TransactionPaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  BANK_SLIP: "BANK_SLIP",
  CASH: "CASH",
  PIX: "PIX",
  OTHER: "OTHER",
};

export type TransactionTypeValues =
  (typeof TransactionType)[keyof typeof TransactionType];
export type TransactionCategoryValues =
  (typeof TransactionCategory)[keyof typeof TransactionCategory];
export type TransactionPaymentMethodValues =
  (typeof TransactionPaymentMethod)[keyof typeof TransactionPaymentMethod];

export interface Transaction {
  id: string; // id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name: string; // name TEXT NOT NULL,
  amount: number; // amount NUMERIC NOT NULL,
  type: TransactionTypeValues; // type transaction_type NOT NULL,
  category: TransactionCategoryValues; // category transaction_category NOT NULL,
  payment_method: TransactionPaymentMethodValues; // payment_method transaction_payment_method NOT NULL,
  user_id: string; // user_id TEXT NOT NULL
  date: Date; // date TIMESTAMP NOT NULL,
  created_at: Date; // created_at TIMESTAMP NOT NULL,
  updated_at: Date; // updated_at TIMESTAMP NULL,
}
