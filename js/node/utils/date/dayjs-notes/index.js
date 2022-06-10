// ---
// dayjs
// ---

// install
// npm i --save dayjs

const dayjs = require("dayjs");

// ---
// dayjs instance
// ---

const basicdayjsInstance = () => {
  const now = dayjs();

  // create instance
  dayjs(); // same as dayjs(new Date())
  dayjs("2018-04-04T16:00:00.000Z"); // dayjs instance from string
  dayjs(1318781876406); // dayjs instance from timestamp (ms)
  dayjs.unix(1318781876); // dayjs instance from unix timestamp (seconds)

  // clone
  now.clone(); // separate instance (same as `dayjs(now)`)

  // timestamp from instance
  dayjs().valueOf(); // timestamp (ms)
  dayjs().unix(); // unix timestamp (s)
  // Date instance
  dayjs().toDate();
  // string (ISO 8601)
  dayjs().toISOString(); // '2019-01-25T02:00:00.000Z'
  dayjs().toJSON();
  // string
  dayjs().toString(); // 'Fri, 25 Jan 2019 02:00:00 GMT'

}

// ---
// usage
// ---

// instance
const basicDayjsUsage = () => {
  const now = dayjs();

  // format
  now.format("MM/DD/YYYY"); // 09/21/2020
  now.format("MMMM DD, YYYY"); // September 21, 2020
  now.format("dddd, MMMM DD, YYYY"); // Monday, September 21, 2020
  now.format("YYYY-MM-DD HH:mm:ss Z"); // 2020-09-21 15:48:29 -06:00

  // isValid
  now.isValid(); // does it contain a valid date?
  // isDayjs
  dayjs.isDayjs(now); // is it a dayjs object?
}

const basicGetAndSet = () => {
  const now = dayjs()
  // get/set units: year, month, date, dag, hour, minute, second, millisecond

  // get
  now.get("month");
  // set
  now.set("month", 3);

  // get
  now.millisecond(); // get millisecond
  now.second(); // get second
  now.minute(); // get minute
  now.hour(); // get hour
  now.date(); // get date (1-31)
  now.day(); // get day (0-6)
  now.month(); // get month (0-11)
  now.year(); // get year
  // set
  now.millisecond(50); // set millisecond
  now.second(30); // set second
  now.minute(30); // set minute
  now.hour(10); // set hour
  now.date(10); // set date
  now.day(10); // set day
  now.month(10); // set month
  now.year(2000); // set year
  // shift
  now.add(1, "day");
  now.subtract(1, "year");
  // start/end
  now.startOf("year");
  now.endOf("month");
}

const basicComparison = () => {
  const now = dayjs();
  const tomorrow = now.add(1, "day");
  const yesterday = now.subtract(1, "day");

  tomorrow.diff(now); // 86400000 (ms)
  tomorrow.diff(now, "day"); // 1
  yesterday.isBefore(now); // true
  tomorrow.isAfter(now); // true
}

const basicPlugins = () => {
  // import & use plugins
  const plugins = [
    "minMax",
    "isBetween",
    "isSameOrBefore",
    "isSameOrAfter",
    "relativeTime",
    "timezone",
    "toObject",
    "UTC",
  ];
  plugins.forEach((plugin) => dayjs.extend(require(`dayjs/plugin/${plugin}`)));

  const now = dayjs();
  const tomorrow = now.add(1, "day");
  const yesterday = now.subtract(1, "day");

  // isBetween
  now.isBetween(yesterday, tomorrow); // true
  // isSameOrBefore
  yesterday.isSameOrBefore(now); // true
  // isSameOrAfter
  tomorrow.isSameOrAfter(now); // true
  // min (minMax)
  dayjs.min(yesterday, now, tomorrow); // min (yesterday)
  // max (minMax)
  dayjs.max(yesterday, now, tomorrow); // max (tomorrow)
  // from (relativeTime)
  now.from(yesterday); // in a day
  // to (relativeTime)
  now.to(tomorrow); // in a day
  // fromNow (relativeTime)
  tomorrow.fromNow(); // in a day
  // toNow (relativeTime)
  yesterday.toNow(); // in a day
  // timezone
  // https://day.js.org/docs/en/plugin/timezone
  // toObject
  now.toObject(); // { years, months, date, hours, minutes, seconds, milliseconds }
  // utc
  // https://day.js.org/docs/en/plugin/utc
}

const main = () => {
  basicdayjsInstance()
  basicDayjsUsage()
  basicGetAndSet()
  basicComparison()
  basicPlugins()
}

main()