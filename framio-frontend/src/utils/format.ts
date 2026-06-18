export function formatCurrency(value: unknown): string {
  const amount = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(amount) ? amount.toFixed(2) : '0.00';
}
