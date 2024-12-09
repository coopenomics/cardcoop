export function formatToAsset(amount: string | number, currency: string): string {
  const formattedAmount = (typeof amount === 'number' ? amount : parseFloat(amount)).toFixed(4);
  return `${formattedAmount} ${currency}`;
}
