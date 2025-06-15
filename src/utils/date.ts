/**
 * Validates if a string is in ISO 8601 format (accepts multiple variants).
 * 
 * @param {string} dateString - The date string to validate
 * @returns {boolean} True if the string is a valid ISO 8601 date, false otherwise
 * 
 * @example
 * isValidDate('2023-01-15T00:00:00'); // true
 * isValidDate('2024-10-21T17:11:46'); // true
 * isValidDate('2023-01-15T00:00:00.000Z'); // true
 * isValidDate('invalid-date'); // false
 */
export const isValidDate = (dateString: string): boolean => {
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
  
  if (!iso8601Pattern.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};