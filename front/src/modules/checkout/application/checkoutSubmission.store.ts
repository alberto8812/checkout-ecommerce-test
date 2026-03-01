import type { CheckoutFormValues } from '../presentation/constants/checkoutFormConfig';

let submissionSnapshot: CheckoutFormValues | null = null;

export const checkoutSubmissionStore = {
    set(values: CheckoutFormValues): void {
        submissionSnapshot = { ...values };
    },
    consume(): CheckoutFormValues | null {
        const snapshot = submissionSnapshot;
        submissionSnapshot = null;
        return snapshot;
    },
    peek(): CheckoutFormValues | null {
        return submissionSnapshot;
    },
};
