export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const parseDate = (value: string): Date => {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const isToday = (value: string): boolean => {
  return value === formatDate(new Date());
};
