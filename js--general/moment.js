// --------------
// moment
// --------------

// install
`
npm i --save moment moment-timezone
`;

// docs
// https://momentjs.com/

// --------------
// format dates
// --------------

moment().format("MMMM Do YYYY, h:mm:ss a"); // May 16th 2020, 12:53:25 pm
moment().format("dddd"); // Saturday
moment().format("MMM Do YY"); // May 16th 20
moment().format("YYYY [escaped] YYYY"); // 2020 escaped 2020
moment().format(); // 2020-05-16T12:53:25-07:00

// --------------
// relative time
// --------------

moment("20111031", "YYYYMMDD").fromNow(); // 9 years ago
moment("20120620", "YYYYMMDD").fromNow(); // 8 years ago
moment().startOf("day").fromNow(); // 13 hours ago
moment().endOf("day").fromNow(); // in 11 hours
moment().startOf("hour").fromNow(); // an hour ago

// --------------
// calendar time
// --------------

moment().subtract(10, "days").calendar(); // 05/06/2020
moment().subtract(6, "days").calendar(); // Last Sunday at 12:53 PM
moment().subtract(3, "days").calendar(); // Last Wednesday at 12:53 PM
moment().subtract(1, "days").calendar(); // Yesterday at 12:53 PM
moment().calendar(); // Today at 12:53 PM
moment().add(1, "days").calendar(); // Tomorrow at 12:53 PM
moment().add(3, "days").calendar(); // Tuesday at 12:53 PM
moment().add(10, "days").calendar(); // 05/26/2020

// --------------
// multiple locale support
// --------------

moment.locale(); // en
moment().format("LT"); // 12:55 PM
moment().format("LTS"); // 12:55:19 PM
moment().format("L"); // 05/16/2020
moment().format("l"); // 5/16/2020
moment().format("LL"); // May 16, 2020
moment().format("ll"); // May 16, 2020
moment().format("LLL"); // May 16, 2020 12:55 PM
moment().format("lll"); // May 16, 2020 12:55 PM
moment().format("LLLL"); // Saturday, May 16, 2020 12:55 PM
moment().format("llll"); // Sat, May 16, 2020 12:55 PM

// --------------
// moment timezone
// --------------

// format dates in a timezone

var june = moment("2014-06-01T12:00:00Z");
june.tz("America/Los_Angeles").format("ha z"); // 5am PDT
june.tz("America/New_York").format("ha z"); // 8am EDT
june.tz("Asia/Tokyo").format("ha z"); // 9pm JST
june.tz("Australia/Sydney").format("ha z"); // 10pm EST

var dec = moment("2014-12-01T12:00:00Z");
dec.tz("America/Los_Angeles").format("ha z"); // 4am PST
dec.tz("America/New_York").format("ha z"); // 7am EST
dec.tz("Asia/Tokyo").format("ha z"); // 9pm JST
dec.tz("Australia/Sydney").format("ha z"); // 11pm EST

// convert dates between timezones

var newYork = moment.tz("2014-06-01 12:00", "America/New_York");
var losAngeles = newYork.clone().tz("America/Los_Angeles");
var london = newYork.clone().tz("Europe/London");

newYork.format(); // 2014-06-01T12:00:00-04:00
losAngeles.format(); // 2014-06-01T09:00:00-07:00
london.format(); // 2014-06-01T17:00:00+01:00

// --------------
// parse
// --------------

// mode

moment(); // now
moment(/* ... */); // local mode
moment.utc(/* ... */); // utc mode
moment.parseZone(/* ... */); // keep the input zone passed in
moment.tz(/* ... */); // use moment-timezone plugin. (parse specific timezones)

// string + format
// https://momentjs.com/docs/#/parsing/string-format/
moment("1995-12-25"); // string (INCONSISTENT, use 'string + format')
moment("12-25-1995", "MM-DD-YYYY"); // string + format
moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]); // string + formats (use best match of many formats)

// timestamp
// ms since Unix Epoch
moment(1318781876406);
moment.unix(1318781876406); // local
moment.unix(1318781876406).utc(); // utc

// date
const date = new Date();
moment(date);

// clone (method 1)
const a = moment();
const b = moment(a);
// clone (method 2)
const a = moment();
const b = a.clone();

// --------------
// get + set
// --------------

const date = moment();

// get value
date.get("year");
date.get("month"); // 0 to 11
date.get("date");
date.get("hour");
date.get("minute");
date.get("second");
date.get("millisecond");

// set value
date.set("year", 2013);
date.set("month", 3); // April
date.set("date", 1);
date.set("hour", 13);
date.set("minute", 20);
date.set("second", 30);
date.set("millisecond", 123);

// --------------
// compare
// --------------

const date1 = moment();
const date2 = moment();
const date3 = moment();

// max & min
moment.max(date1, date2, date3); // latest
moment.min(date1, date2, date3); // earliest

// difference
date1.diff(date2); // ms
date1.diff(date2, "days"); // years, months, weeks, days, hours, minutes, seconds

// before, after, same
date1.isBefore(date2);
date1.isSameOrBefore(date2);
date1.isSame(date2);
date1.isSameOrAfter(date2);

date1.isBefore(date2, "year");
date1.isSameOrBefore(date2, "year");
date1.isSame(date2, "year");
date1.isSameOrAfter(date2, "year");

// between
date2.isBetween(date1, date3);

// --------------
// current
// --------------

// fromNow & toNow
// https://momentjs.com/docs/#/displaying/fromnow/

const date = moment();

// fromNow (past)
date.fromNow(); // a few seconds ago, 4 years ago, etc
// toNow (future)
date.add(4, "y").toNow(); // in 4 years

// calendar
// https://momentjs.com/docs/#/displaying/calendar-time/
date.calendar(); // Today at 2:30, Yesterday at 2:30, Tomorrow at 2:30, Sunday at 2:30, etc
// custom calendar
moment().calendar(null, {
  sameDay: "[Today]",
  nextDay: "[Tomorrow]",
  nextWeek: "dddd",
  lastDay: "[Yesterday]",
  lastWeek: "[Last] dddd",
  sameElse: "DD/MM/YYYY",
});
// --------------
// manipulate
// --------------

const date = moment();

// add
date.add(7, "days"); // years, months, days, hours, minutes, seconds, milliseconds
date.add(7, "d"); // y, M, d, h, m, s, ms
date.add(7, "days").add(1, "months");
date.add({ days: 7, months: 1 });
// subtract
date.subtract(7, "days"); // years, months, days, hours, minutes, seconds, milliseconds
date.subtract(7, "d"); // y, M, d, h, m, s, ms
date.subtract(7, "days").subtract(1, "months");
date.subtract({ days: 7, months: 1 });
// startOf -- earliest moment of a given unit of time
// year -- set to January 1st, 12:00 am
date.startOf("year"); // year, month, day, hour, minute, second
// endOf
// year -- set the moment to 12-31 23:59:59.999 this year
date.endOf("year"); // year, month, day, hour, minute, second

// --------------
// display
// --------------

// format
// https://momentjs.com/docs/#/displaying/format/

const date = moment();

date.format(); // "2014-09-08T08:02:17-05:00" (ISO 8601, no fractional seconds)
date.format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
date.format("ddd, hA"); // "Sun, 3PM"
date.format("[Today is] dddd"); // "Today is Sunday"

// unix timestamp
date.valueOf(); // ms
+date; // ms
date.unix(); // seconds
// js date
date.toDate();
// object
date.toObject(); // { years, months, date, hours, minutes, seconds, milliseconds }
// string
date.toString();

// --------------
// customize
// --------------

// https://momentjs.com/docs/#/customization/

// --------------
// durations
// --------------

// https://momentjs.com/docs/#/durations/

const twoYears = moment.duration(2, "years");

// --------------
//
// --------------

// --------------
//
// --------------

// --------------
//
// --------------

// --------------
//
// --------------

// --------------
//
// --------------

// --------------
//
// --------------

// --------------
//
// --------------

// --------------
//
// --------------

// --------------
//
// --------------
