
export const isValidDate = (str: string): boolean => !isNaN(new Date(str).getTime());

/** Returns date string in DD/MM/YYYY format */
export const getFormattedDateFromTimestamp = (str: string): string => {
  const date = isValidDate(str) ? new Date(str) : new Date();
  const day = String(date.getDate());
  const month = String(date.getMonth() + 1);
  const year = String(date.getFullYear());
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

export const isFutureDate = (str: string): boolean => {
  if (!isValidDate(str)) return false;
  const now = new Date();
  const date = new Date(str);
  return now < date;
};
