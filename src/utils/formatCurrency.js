/**
 * Utility functions for currency formatting (e.g., "1 705 USD", "3 410 USD")
 * - Uses a space as the thousands separator for amounts >= 1,000
 * - Appends 'USD' with a preceding space
 * - No '$' prefix
 */

export const formatCurrency = (val) => {
  if (val === null || val === undefined || val === '') return '0 USD';

  let num;
  if (typeof val === 'number') {
    num = val;
  } else {
    const clean = String(val).replace(/[^0-9.]/g, '');
    num = parseFloat(clean);
  }

  if (isNaN(num)) return '0 USD';

  const isInteger = num % 1 === 0;
  const numStr = isInteger ? Math.round(num).toString() : num.toFixed(2);
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const formattedNumber = parts.join('.');

  return `${formattedNumber} USD`;
};

export const parseCurrency = (priceStr) => {
  if (!priceStr && priceStr !== 0) return 0;
  if (typeof priceStr === 'number') return priceStr;
  const numericStr = String(priceStr).replace(/[^0-9.]/g, '');
  return parseFloat(numericStr) || 0;
};

