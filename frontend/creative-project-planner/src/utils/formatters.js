import Config from "@/utils/config";
const defaultCurrency = Config.currency;

export const formatCurrency = function(value, currency = defaultCurrency) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: currency,
    });
};

export const formatTextToCamelCase = function(text) {
    return text.replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ')
        .replace(/\./g, ' ');
};

export function calculatePercentage(options) {
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

export function formatNumber(num) {
    if (num === null || num === undefined) {
        return '0';
    }

    const parsedNum = typeof num === 'string' ? parseFloat(num) : num;

    if (isNaN(parsedNum)) {
        return '0';
    }

    return parsedNum.toLocaleString('en-US');
}

export function toCamelCase(input) {
    return input.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function transformLabelToClassName(label) {
    const lowercaseLabel = label.toLowerCase();
    const strippedLabel = lowercaseLabel.replace(/<\/?[^>]+(>|$)/g, '');
    const hyphenatedLabel = strippedLabel.replace(/\s+/g, '-');
    return hyphenatedLabel;
}

export function sum(numbers) {
    return numbers.reduce(function(acc, num) {
        const parsedNum = typeof num === 'string' ? parseFloat(num) : num || 0;
        return acc + parsedNum;
    }, 0);
}

export function roundDownToWholeNumber(num) {
    return Math.floor(num);
}

export function roundToNearestWholeNumber(num) {
    return Math.round(num);
}

export function roundToPrecision(options) {
    const { value, precision } = options;
    const rounded = Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    return rounded === 0 ? 0.0001 : rounded;
}
