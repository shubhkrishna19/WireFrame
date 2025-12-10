export interface DeliveryEstimate {
    minDays: number;
    maxDays: number;
    estimatedDate: string;
    isFastDelivery: boolean;
}

export const calculateDeliveryEstimate = (
    pincode?: string,
    isExpress?: boolean
): DeliveryEstimate => {
    // Base delivery days
    let minDays = isExpress ? 2 : 5;
    let maxDays = isExpress ? 3 : 7;

    // Adjust based on pincode (simplified logic)
    if (pincode) {
        const firstDigit = parseInt(pincode[0]);
        // Metro cities (1-3) get faster delivery
        if (firstDigit >= 1 && firstDigit <= 3) {
            minDays = Math.max(1, minDays - 1);
            maxDays = Math.max(2, maxDays - 1);
        }
    }

    const today = new Date();
    const estimatedDelivery = new Date(today);
    estimatedDelivery.setDate(today.getDate() + maxDays);

    const isFastDelivery = maxDays <= 3;

    return {
        minDays,
        maxDays,
        estimatedDate: estimatedDelivery.toLocaleDateString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }),
        isFastDelivery,
    };
};

export const formatDeliveryEstimate = (estimate: DeliveryEstimate): string => {
    if (estimate.minDays === estimate.maxDays) {
        return `Estimated delivery in ${estimate.minDays} ${estimate.minDays === 1 ? 'day' : 'days'
            }`;
    }
    return `Estimated delivery in ${estimate.minDays}-${estimate.maxDays} days`;
};
