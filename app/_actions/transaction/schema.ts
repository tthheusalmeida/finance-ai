import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "../../_lib/database/transactions/schema";
import { z } from "zod";

export const upsertTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  payment_method: z.nativeEnum(TransactionPaymentMethod),
  date: z.date(),
});
