

/**
     * Formats a date object into a readable string.
     * @param {Date} date - The date object to format.
     * @param {Object} options - Optional formatting options.
     * @param {string} options.locale - The locale string (default is 'en-US').
     * @param {Object} options.formatOptions - The Intl.DateTimeFormat options.
     * @returns {string} The formatted date string.
*/

interface FormatDateOptions {
    locale?: string;
    formatOptions?: Intl.DateTimeFormatOptions;
}

// function formatDate(date: Date, options: FormatDateOptions = {}): string {
//     const { locale = 'en-US', formatOptions = {} } = options;
//     return new Intl.DateTimeFormat(locale, formatOptions).format(date);
// }

export default function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  