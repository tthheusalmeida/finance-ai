"use server";

import { Gemini } from "../../../_lib/ai";
import { auth } from "@clerk/nextjs/server";
import { readTransactions } from "../../../_lib/database/transactions/querys";

const gemini = new Gemini();

export const generateAiReport = async () => {
  const { userId } = await auth();

  const rawData = await readTransactions(userId as string);
  const data = rawData.map((item) => ({
    name: item.name,
    amount: item.amount,
    type: item.type,
    category: item.category,
    payment_method: item.payment_method,
  }));

  const promp = `
      Você é um especialista financeiro.
      Com base no seguinte conjunto de dados financeiros, elabore um relatório detalhado com análise geral,
      identificação de padrões, pontos de atenção e recomendações para melhorar a saúde financeira do usuário.
      Os dados incluem: Tipos de transação: DEPOSIT, EXPENSE e INVESTMENT. Categorias: EDUCATION, HEALTH, HOUSING, FOOD, TRANSPORTATION e OTHER.
      Métodos de pagamento: BANK_TRANSFER, BANK_SLIP, PIX e CASH.
      Gere um relatório estruturado em Markdown com:
      Análise geral das transações
      - Pontos de atenção
      - Recomendações de melhoria financeira
      - Conclusão clara e objetiva
      Com os seguintes dados: ${JSON.stringify(data)}
   `;

  console.log(promp);

  const response = await gemini.sendMessage(promp);
  return response;
};
