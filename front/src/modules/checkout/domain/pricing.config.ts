export const SHIPPING_FEE = 15000; // COP
export const TAX_RATE = 0.16;

export const computeCheckoutTotals = (unitPrice: number, quantity = 1) => {
    const subtotal = unitPrice * quantity;
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes + SHIPPING_FEE;
    return {
        subtotal,
        taxes,
        shipping: SHIPPING_FEE,
        total,
    };
};
