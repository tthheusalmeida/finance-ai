"use server";

import {
  TransactionTypeValues,
  TransactionCategoryValues,
  TransactionPaymentMethodValues,
} from "@/app/_lib/database/transactions/schema";
import { auth } from "@clerk/nextjs/server";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import {
  updateTransaction,
  createTransaction,
  deleteTransaction,
} from "@/app/_lib/database/transactions/querys";

interface UpsertTransactionParams {
  id?: string; // uuid
  name: string;
  amount: number;
  type: TransactionTypeValues;
  category: TransactionCategoryValues;
  payment_method: TransactionPaymentMethodValues;
  date: Date; //timestemp
  createAt?: Date; //timestemp
  updateAt?: Date; //timestemp
}

export const editTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { id, ...rest } = params;

  await updateTransaction(id as string, userId, {
    name: rest.name,
    amount: rest.amount,
    type: rest.type,
    category: rest.category,
    payment_method: rest.payment_method,
    date: rest.date,
  });
  revalidatePath("/transactions");
};

export const insertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await createTransaction(userId, {
    name: params.name,
    amount: params.amount,
    type: params.type,
    category: params.category,
    payment_method: params.payment_method,
    date: params.date,
  });
  revalidatePath("/transactions");
};

export const removeTransaction = async (id: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await deleteTransaction(id, userId);

  revalidatePath("/transactions");
};
