import { db } from "../index";

export async function createTransaction(
  userId: string,
  data: {
    name: string;
    amount: number;
    type: string;
    category: string;
    payment_method: string;
    date: Date;
  },
) {
  const query = `
    INSERT INTO transactions (
      user_id,
      name,
      amount,
      type,
      category,
      payment_method,
      date,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    );
  `;

  const values = [
    userId,
    data.name,
    data.amount,
    data.type,
    data.category,
    data.payment_method,
    data.date,
    new Date(),
    new Date(),
  ];

  await db.query(query, values);
}

export async function readTransactions(userId: string) {
  const { rows } = await db.query(
    "SELECT * FROM transactions WHERE user_id = $1",
    [userId],
  );

  return rows || [];
}

export async function updateTransaction(
  id: string,
  userId: string,
  data: {
    name: string;
    amount: number;
    type: string;
    category: string;
    payment_method: string;
    date: Date;
  },
) {
  const query = `
    UPDATE transactions
    SET
      name = $1,
      amount = $2,
      type = $3,
      category = $4,
      payment_method = $5,
      date = $6,
      updated_at = $7
    WHERE id = $8 AND user_id = $9;
  `;

  const values = [
    data.name,
    data.amount,
    data.type,
    data.category,
    data.payment_method,
    data.date,
    new Date(),
    id,
    userId,
  ];

  await db.query(query, values);
}

export async function deleteTransaction(id: string, userId: string) {
  const query = `
    DELETE FROM transactions
    WHERE id = $1 AND user_id = $2;
  `;

  const values = [id, userId];

  await db.query(query, values);
}

export interface DateTransactionByTypeAmount {
  start: Date;
  end: Date;
}

export async function getTransactionAmountGroupedByTypeAndDate(
  userId: string,
  date: DateTransactionByTypeAmount,
) {
  const query = `
    SELECT type, SUM(amount)
    FROM transactions
    WHERE user_id = $1
      AND date >= $2
      AND date <= $3
    GROUP BY type;
  `;

  const values = [userId, date.start, date.end];

  const { rows } = await db.query(query, values);

  return rows;
}

export async function getTransactionAmountGroupedByCategory(
  userId: string,
  date: DateTransactionByTypeAmount,
) {
  const query = `
    SELECT category, SUM(amount)
    FROM transactions
    WHERE user_id = $1
      AND date >= $2
      AND date <= $3
    GROUP BY category;
  `;

  const values = [userId, date.start, date.end];

  const { rows } = await db.query(query, values);

  return rows;
}

export async function getLastTransaction(
  userId: string,
  date: DateTransactionByTypeAmount,
  limit: number,
) {
  const query = `
    SELECT *
    FROM transactions
    WHERE user_id = $1
      AND date >= $2
      AND date <= $3
    ORDER BY date DESC
    LIMIT $4;
  `;

  const values = [userId, date.start, date.end, limit];

  const { rows } = await db.query(query, values);

  return rows;
}
