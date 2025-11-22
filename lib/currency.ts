export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.85 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.73 },
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 83.12 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
}

export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount
  const fromRate = currencies[from as keyof typeof currencies]?.rate || 1
  const toRate = currencies[to as keyof typeof currencies]?.rate || 1
  return (amount / fromRate) * toRate
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencyInfo = currencies[currency as keyof typeof currencies] || currencies.USD
  return `${currencyInfo.symbol}${amount.toFixed(2)}`
}
