export interface PricingTotals {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export class PricingCalculator {
  static readonly TAX_RATE = 0.08; // 8% sales tax

  static computeTotals(
    items: Array<{ price: number; quantity: number }>,
    deliveryFee = 0,
    discountAmount = 0
  ): PricingTotals {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * this.TAX_RATE * 100) / 100;
    const fee = items.length > 0 ? deliveryFee : 0;
    const discount = Math.min(discountAmount, subtotal);
    const total = Math.max(0, subtotal + tax + fee - discount);

    return {
      subtotal,
      tax,
      deliveryFee: fee,
      discount,
      total,
    };
  }
}
