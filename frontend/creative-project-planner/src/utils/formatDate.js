
/**
 * Formats a date object into a readable string.
 * @param {Date} date - The date object to format.
 * @param {Object} options - Optional formatting options.
 * @param {string} options.locale - The locale string (default is 'en-US').
 * @param {Object} options.formatOptions - The Intl.DateTimeFormat options.
 * @returns {string} The formatted date string.
 */
function formatDate(date, options = {}) {
    const { locale = 'en-US', formatOptions = {} } = options;
    return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

export default formatDate;