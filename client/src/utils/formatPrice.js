/**
 * Format a number as Indian Rupees
 */
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const formatPriceShort = (price) => `₹${price}`;

export const discountPercent = (mrp, price) =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const savingsAmount = (higher, lower) => Math.max(0, higher - lower);
