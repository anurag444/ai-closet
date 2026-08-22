export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const WEEKDAY_ABBREVIATIONS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAYS_IN_WEEK = 7;
const WEEKS_IN_MONTH_GRID = 6;

// Local-time date key. Deliberately not toISOString(), which converts to UTC and
// can land on the wrong day for anyone west of Greenwich.
export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const fromDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Strips the time so date-only comparisons and arithmetic stay stable
export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, count: number): Date => {
  const result = startOfDay(date);
  result.setDate(result.getDate() + count);
  return result;
};

export const addWeeks = (date: Date, count: number): Date => addDays(date, count * DAYS_IN_WEEK);

// Clamps to the last valid day of the target month, so Jan 31 + 1 month is
// Feb 28/29 rather than overflowing into March.
export const addMonths = (date: Date, count: number): Date => {
  const target = new Date(date.getFullYear(), date.getMonth() + count, 1);
  const lastDayOfTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDayOfTargetMonth));
  return target;
};

// Weeks start on Sunday
export const startOfWeek = (date: Date): Date => {
  const result = startOfDay(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
};

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date);
  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => addDays(start, index));
};

// 6 rows of 7, padded with the adjacent months' days so every row is full
export const getMonthGrid = (year: number, month: number): Date[][] => {
  const start = startOfWeek(new Date(year, month, 1));

  return Array.from({ length: WEEKS_IN_MONTH_GRID }, (_, week) =>
    Array.from({ length: DAYS_IN_WEEK }, (_, day) => addDays(start, week * DAYS_IN_WEEK + day))
  );
};

export const isSameDay = (a: Date, b: Date): boolean => toDateKey(a) === toDateKey(b);

export const isToday = (date: Date): boolean => isSameDay(date, new Date());

export const formatMonthYear = (date: Date): string => `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

export const formatMonthDay = (date: Date): string => `${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getDate()}`;

export const formatShortDate = (date: Date): string =>
  `${WEEKDAY_ABBREVIATIONS[date.getDay()]}, ${formatMonthDay(date)}`;
