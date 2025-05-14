// Project: byte-sized-ui
// Description: This file contains common utility functions used throughout the application. It includes functions for formatting dates and sorting arrays of objects by a specified key. The functions are generic and can be used with any type of data structure that follows the specified format. The date formatting function uses the browser's locale settings to format the date string, while the sorting function allows for both ascending and descending order sorting.
type SortOrder = 'asc' | 'desc';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// function to sort the array of objects by key;
export function sortByKey<T extends Record<string, any>>(
  data: T[],
  key: keyof T,
  order: SortOrder = 'asc'
): T[] {
  return [...data].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}
