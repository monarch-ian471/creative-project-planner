import Config from "@/utils/config";
const defaultCurrency = Config.currency;

export const formatCurrency = function(value: number, currency: string = defaultCurrency): string {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: currency,
    });
};

export const formatTextToCamelCase = function(text: string): string {
    return text.replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ')
        .replace(/\./g, ' ');
};

interface CalculatePercentageOptions {
    part?: number;
    whole?: number;
    roundToNearestWholeNumber?: boolean;
    roundDownToWholeNumber?: boolean;
}

export function calculatePercentage(options: CalculatePercentageOptions): number {
    const {
        part = 0,
        whole = 1,
        roundToNearestWholeNumber = false,
        roundDownToWholeNumber = false,
    } = options;

    if (whole === 0) {
        return 0;
    }

    const percentage = (part / whole) * 100;

    return roundToNearestWholeNumber
        ? Math.round(percentage)
        : roundDownToWholeNumber
            ? Math.floor(percentage)
            : percentage;
}

export function formatNumber(num: number | string | null | undefined): string {
    if (num === null || num === undefined) {
        return '0';
    }

    const parsedNum = typeof num === 'string' ? parseFloat(num) : num;

    if (isNaN(parsedNum)) {
        return '0';
    }

    return parsedNum.toLocaleString('en-US');
}

export function toCamelCase(input: string): string {
    return input.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function transformLabelToClassName(label: string): string {
    const lowercaseLabel = label.toLowerCase();
    const strippedLabel = lowercaseLabel.replace(/<\/?[^>]+(>|$)/g, '');
    const hyphenatedLabel = strippedLabel.replace(/\s+/g, '-');
    return hyphenatedLabel;
}

export function sum(numbers: (number | string)[]): number {
    return numbers.reduce(function(acc: number, num: number | string): number {
        const parsedNum = typeof num === 'string' ? parseFloat(num) : num || 0;
        return acc + (isNaN(parsedNum) ? 0 : parsedNum);
    }, 0 as number);
}

export function roundDownToWholeNumber(num: number): number {
    return Math.floor(num);
}

export function roundToNearestWholeNumber(num: number): number {
    return Math.round(num);
}

interface RoundToPrecisionOptions {
    value: number;
    precision: number;
}

export function roundToPrecision(options: RoundToPrecisionOptions): number {
    const { value, precision } = options;
    const rounded = Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    return rounded === 0 ? 0.0001 : rounded;
}
export function initializeFormatters(): void {
    console.log("Formatters initialized");
}