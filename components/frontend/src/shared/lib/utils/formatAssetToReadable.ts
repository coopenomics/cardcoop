export const formatAssetToReadable = (amountString: string): string => {
// Разбиваем строку на сумму и валюту
  const [amount, currency] = amountString.split(' ');

  // Преобразуем сумму в число и затем обратно в строку с удалением незначащих нулей
  const formattedAmount = parseFloat(amount).toString();

  // Возвращаем форматированную строку с валютой
  return `${formattedAmount} ${currency}`;
}
