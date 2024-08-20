export function formatPrice(
  amount: number,
  currency: string = 'IDR',
  locale: string = 'id-ID',
  removeCurrencySymbol: boolean = false,
): string {
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (removeCurrencySymbol) {
    return formattedPrice.replace(/[^\d,.]/g, '').trim();
  }

  return formattedPrice;
}
