// Promo codes available in the system
export interface PromoCode {
    code: string;
    description: string;
    discount: number; // Percentage or fixed amount
    type: 'percentage' | 'fixed';
    minOrderValue?: number;
    maxDiscount?: number;
    expiresAt?: Date;
    isActive: boolean;
}

export const PROMO_CODES: PromoCode[] = [
    {
        code: 'WELCOME10',
        description: 'Get 10% off on your first order',
        discount: 10,
        type: 'percentage',
        minOrderValue: 2000,
        maxDiscount: 500,
        isActive: true,
    },
    {
        code: 'FLASH20',
        description: 'Flash Sale: 20% off on orders above ₹5000',
        discount: 20,
        type: 'percentage',
        minOrderValue: 5000,
        maxDiscount: 2000,
        isActive: true,
    },
    {
        code: 'FLAT500',
        description: 'Flat ₹500 off on orders above ₹10000',
        discount: 500,
        type: 'fixed',
        minOrderValue: 10000,
        isActive: true,
    },
    {
        code: 'FURNITURE15',
        description: '15% off on all furniture',
        discount: 15,
        type: 'percentage',
        minOrderValue: 3000,
        maxDiscount: 1500,
        isActive: true,
    },
];

export const validatePromoCode = (
    code: string,
    orderTotal: number
): { valid: boolean; discount: number; message: string } => {
    const promo = PROMO_CODES.find(
        (p) => p.code.toUpperCase() === code.toUpperCase() && p.isActive
    );

    if (!promo) {
        return {
            valid: false,
            discount: 0,
            message: 'Invalid promo code',
        };
    }

    if (promo.minOrderValue && orderTotal < promo.minOrderValue) {
        return {
            valid: false,
            discount: 0,
            message: `Minimum order value of ₹${promo.minOrderValue} required`,
        };
    }

    let discountAmount = 0;
    if (promo.type === 'percentage') {
        discountAmount = (orderTotal * promo.discount) / 100;
        if (promo.maxDiscount) {
            discountAmount = Math.min(discountAmount, promo.maxDiscount);
        }
    } else {
        discountAmount = promo.discount;
    }

    return {
        valid: true,
        discount: discountAmount,
        message: `Promo code applied! You saved ₹${discountAmount}`,
    };
};

export const getAvailablePromoCodes = (orderTotal: number): PromoCode[] => {
    return PROMO_CODES.filter(
        (promo) =>
            promo.isActive &&
            (!promo.minOrderValue || orderTotal >= promo.minOrderValue)
    );
};
