// ------------
// date-fnx
// ------------

// install
// npm i --save date-fns

// ------------
// time zones
// ------------

// install
// npm i --save date-fns-tz

// tree shake
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");

// usage (1)
const utcDate = zonedTimeToUtc("2018-09-01 18:01:36.386", "Europe/Berlin");

// usage (2)
const date = new Date("2018-09-01T16:01:36.386Z");
const timeZone = "Europe/Berlin";
const zonedDate = utcToZonedTime(date, timeZone);

// ------------
// common helpers
// ------------

const {
  add,
  formatDistance,
  formatDistanceToNow,
  formatISO,
  formatRelative,
  getTime,
  intervalToDuration,
  isAfter,
  isBefore,
  isDate,
  isFuture,
  isPast,
  isValid,
  max,
  min,
  sub,
  toDate,
  closestTo,
} = require("date-fns");
const { endOfMonth } = require("date-fns/esm");

// date
const now = new Date();
const tomorrow = add(now, { days: 1 });
const yesterday = sub(now, { days: 1 });

// add (years, months, weeks, days, hours, minutes, seconds)
add(now, { days: 1 });
// closestTo
closestTo(now, [yesterday, now, tomorrow]); // closest date (now)
// format -- https://date-fns.org/v2.16.1/docs/format
format(now, "MMMM dd, yyyy"); // September 21, 2020
format(now, "MM/dd/yyyy"); // 09/21/2020 (fill with zeros)
format(now, "M/d/y"); // 9/21/2020 (don't fill)
// formatISO
formatISO(now); // 2020-09-21T14:42:34-06:00
// formatDistance (distance between in words)
formatDistance(tomorrow, now, { includeSeconds: true }); // 1 day
// formatDistanceToNow (distance between date and now in words)
formatDistanceToNow(tomorrow, { includeSeconds: true }); // 1 day
// formatRelative
formatRelative(tomorrow, now, { includeSeconds: true }); // tomorrow at 2:50 PM
// getTime (timestamp)
getTime(now); // 1600721242925
// intervalToDuration
intervalToDuration({ start: now, end: tomorrow }); // { years: 0, months: 0, days: 1, ... }
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
// toDate
toDate(1392098430000); // 2014-02-11T06:00:30.000Z

// ------------
// end of
// ------------

// endOfSecond, endOfMinute, endOfHour, endOfDay, endOfWeek, endOfMonth, endOfYear

const { endOfMonth } = require("date-fns");

endOfMonth(now);

// ------------
// get (zero-indexed for many)
// ------------

// getMilliseconds, getSeconds, getMinutes, getHours,
// getDate (of month), getDay (of week)
// getWeek, getMonth, getQuarter, getYear

const { getDay } = require("date-fns");

getDay(now); // 0 - 6

// ------------
// difference
// ------------

// differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays,
// differenceInWeeks, differenceInMonths, differenceInYears

const { differenceInDays } = require("date-fns");

differenceInDays(now, tomorrow); // -1

// ------------
// isThis / isSame
// ------------

// isThisSecond, isThisHour, isToday, isThisWeek, isThisMonth, isThisYear
// isSameSecond, isSameHour, isSameDay, isSameWeek, isSameMonth, isSameYear

const { isSameWeek, isThisWeek } = require("date-fns");

isSameWeek(now, tomorrow); // true (in most cases)
isThisWeek(tomorrow); // true (in most cases)

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------
