use chrono::prelude::*;
use chrono::Duration;
use std::thread;

fn main() {
    use_chrono();
    use_time();
}

fn use_chrono() {
    // Date, Time, and DateTime are timezone aware
    // NaiveDate, NaiveTime, and NaiveDateTime are not

    // datetime now
    let now_utc: DateTime<Utc> = Utc::now();
    let now_local: DateTime<Local> = Local::now();
    println!("now_utc: {}", now_utc);
    println!("now_local: {}", now_local);

    // date now
    let date_utc = Utc::today(); // Utc::now().date()
    let date_local = Local::today(); // Local::now().date()
    println!("date_utc: {}", date_utc);
    println!("date_local: {}", date_local);

    // parse date from string
    let dt = NaiveDate::parse_from_str("2021-08-17", "%Y-%m-%d").unwrap();
    println!("parsed from string: {}", dt);

    // format (https://docs.rs/chrono/0.4.19/chrono/struct.DateTime.html#method.format)
    let dt = Utc::now();
    let formatted1 = dt.format("%Y-%m-%d");
    let formatted2 = dt.format("%a, %h %d");
    println!("formatted (yyyy-mm-dd): {}", formatted1);
    println!("formatted (human-readable): {}", formatted2);

    // custom datetime
    let dt = Utc.ymd(2021, 5, 26).and_hms(1, 2, 3);
    println!("custom datetime: {}", dt);

    // shift
    let dt1 = Utc.ymd(2021, 10, 3).and_hms(0, 0, 0);
    let dt2 = dt1 + Duration::days(7);
    println!("one week from {} is {}", dt1.format("%Y-%m-%d"), dt2.format("%Y-%m-%d"));

    // select part of datetime
    let dt = Utc.ymd(2021, 9, 15).and_hms(0, 0, 0);
    println!(
        "year: {}, mmonth: {}, day: {}, hour: {}, minute: {}, second: {}",
        dt.year(),
        dt.month(),
        dt.day(),
        dt.hour(),
        dt.minute(),
        dt.second()
    );

    // override part
    let dt = Local::now();
    let first_of_month = dt.with_day(1).unwrap().format("%Y-%m-%d");
    println!("first_of_month: {}", first_of_month);

    // check weekday
    let dt = Local::now();
    let is_saturday = dt.weekday() == Weekday::Sat;
    println!("today is saturday: {}", is_saturday);

    // check duration
    let dt1 = Utc.ymd(2021, 5, 26).and_hms(0, 0, 0);
    let dt2 = Utc.ymd(2021, 9, 15).and_hms(0, 0, 0);
    let duration = dt2.signed_duration_since(dt1);
    assert_eq!(duration, Duration::days(112));
}

fn use_time() {
    // std::time should not be used as a human-readable date/time library.
    // for human readable values, use tailhook/humantime

    // elapsed (Instant + Duration)
    let start = std::time::Instant::now();
    thread::sleep(std::time::Duration::from_millis(100));
    let duration = start.elapsed();
    println!("elapsed: {:?}", duration);

    // shift (SystemTime) (not human-readable)
    let now = std::time::SystemTime::now();
    println!("now: {:#?}", now);
    let same_time_tomorrow = now + std::time::Duration::new(86400, 0);
    println!(": {:#?}", same_time_tomorrow);
}
