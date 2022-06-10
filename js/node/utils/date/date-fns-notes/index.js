// ---
// date-fns
// ---

const {
  add,
  closestTo,
  differenceInDays,
  endOfMonth,
  format,
  formatDistance,
  formatDistanceToNow,
  formatISO,
  formatRelative,
  getTime,
  getDay,
  intervalToDuration,
  isAfter,
  isBefore,
  isDate,
  isFuture,
  isPast,
  isSameWeek,
  isThisWeek,
  isValid,
  max,
  min,
  startOfMonth,
  sub,
  toDate,
} = require("date-fns");

const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");

/*
// esm
const { endOfMonth } = require("date-fns/esm");
*/

const basicCreation = () => {
  // date
  const now = new Date();
  // toDate
  toDate(1392098430000); // 2014-02-11T06:00:30.000Z
}

const basicComparisonAndValidation = () => {
  const now = new Date();
  const tomorrow = add(now, { days: 1 });
  const yesterday = sub(now, { days: 1 });
  // isAfter
  isAfter(tomorrow, now); // true
  // isBefore
  isBefore(now, tomorrow); // true
  // isDate (instance of Date)
  isDate(now); // true
  isDate({}); // false
  // isFuture
  isFuture(tomorrow); // true
  // isPast
  isPast(yesterday); // true
  // isValid (valid instance of Date)
  isValid(now); // true
  // max
  max([yesterday, now, tomorrow]); // max date (tomorrow)
  // min
  min([yesterday, now, tomorrow]); // min date (yesterday)
}

const basicFormat = () => {
  const now = new Date();
  const tomorrow = add(now, { days: 1 });
  format(now, "MMMM dd, yyyy"); // September 21, 2020
  format(now, "MM/dd/yyyy"); // 09/21/2020 (fill with zeros)
  format(now, "M/d/y"); // 9/21/2020 (don't fill)
  formatISO(now); // 2020-09-21T14:42:34-06:00
  formatDistance(tomorrow, now, { includeSeconds: true }); // 1 day
  formatDistanceToNow(tomorrow, { includeSeconds: true }); // 1 day
  formatRelative(tomorrow, now, { includeSeconds: true }); // tomorrow at 2:50 PM
}

const basicStartEnd = () => {
  // endOf_/startOf_: endOfSecond, endOfMinute, endOfHour, endOfDay, endOfWeek, endOfMonth, endOfYear
  // add/sub units: years, months, weeks, days, hours, minutes, seconds

  const now = new Date();
  // start/end
  startOfMonth(now)
  endOfMonth(now);
  // add/sub
  add(now, { days: 1 });
  sub(now, { days: 1 });
}

const basicGet = () => {
  // zero-indexed for many

  // getMilliseconds, getSeconds, getMinutes, getHours,
  // getDate (of month), getDay (of week)
  // getWeek, getMonth, getQuarter, getYear

  const now = new Date();
  getDay(now); // 0 - 6
}

const basicMisc = () => {
  const now = new Date();
  const tomorrow = add(now, { days: 1 });
  const yesterday = sub(now, { days: 1 });
  // closestTo
  closestTo(now, [yesterday, now, tomorrow]); // closest date (now)
  // getTime (timestamp)
  getTime(now); // 1600721242925
  // intervalToDuration
  intervalToDuration({ start: now, end: tomorrow }); // { years: 0, months: 0, days: 1, ... }

  // toDate
  toDate(1392098430000); // 2014-02-11T06:00:30.000Z
}

const basicDifference = () => {
  // differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays,
  // differenceInWeeks, differenceInMonths, differenceInYears

  const now = new Date();
  const tomorrow = add(now, { days: 1 });
  differenceInDays(now, tomorrow); // -1
}

const basicIs = () => {
  // isThisSecond, isThisHour, isToday, isThisWeek, isThisMonth, isThisYear
  // isSameSecond, isSameHour, isSameDay, isSameWeek, isSameMonth, isSameYear

  const now = new Date();
  const tomorrow = add(now, { days: 1 });
  isSameWeek(now, tomorrow); // true (in most cases)
  isThisWeek(tomorrow); // true (in most cases)
}

const basicTz = () => {
  const now = new Date();
  // usage (utc)
  const utcDate = zonedTimeToUtc("2018-09-01 18:01:36.386", "Europe/Berlin");
  // usage (tz-aware)
  const date = new Date("2018-09-01T16:01:36.386Z");
  const timeZone = "Europe/Berlin";
  const zonedDate = utcToZonedTime(date, timeZone);
}

const main = () => {
  basicCreation()
  basicComparisonAndValidation()
  basicFormat()
  basicStartEnd()
  basicGet()
  basicMisc()
  basicDifference()
  basicIs()
  basicTz()
}

main()