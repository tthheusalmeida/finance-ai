"use server";

// import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

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

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export type TransactionCategory =
  (typeof TransactionCategory)[keyof typeof TransactionCategory];

export type TransactionPaymentMethod =
  (typeof TransactionPaymentMethod)[keyof typeof TransactionPaymentMethod];

interface UpsertTransactionParams {
  id?: string; // uuid
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date; //timestemp
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // await db.transaction.upsert({
  //   update: { ...params, userId },
  //   create: { ...params, userId },
  //   where: {
  //     id: params.id ?? "",
  //   },
  // });
  revalidatePath("/transactions");
};
