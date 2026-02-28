/** Validates card numbers using Luhn's algorithm */
export const validateLuhn = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.length < 13 || cleaned.length > 19) {
        return false;
    }

    let sum = 0;
    let alternate = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let n = Number.parseInt(cleaned[i], 10);
        if (Number.isNaN(n)) {
            return false;
        }

        if (alternate) {
            n *= 2;
            if (n > 9) {
                n -= 9;
            }
        }

        sum += n;
        alternate = !alternate;
    }

    return sum % 10 === 0;
};
