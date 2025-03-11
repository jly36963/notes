use base64::{decode as b64_decode, encode as b64_encode};
use bytes::Bytes;
use camino::Utf8Path;
use chrono::Duration;
use chrono::prelude::*;
use flate2::Compression;
use flate2::read::{GzDecoder, ZlibDecoder};
use flate2::write::{GzEncoder, ZlibEncoder};
use futures::future::BoxFuture;
use glob::glob;
use heck::{ToKebabCase, ToLowerCamelCase, ToSnakeCase};
use imara_diff::intern::InternedInput;
use imara_diff::{Algorithm, UnifiedDiffBuilder, diff};
use rayon::prelude::*;
use regex::Regex;
use similar::{ChangeTag, TextDiff};
use std::fs::read_to_string;
use std::io::{Read, Write};
use std::thread;
use std::time;
use unicode_segmentation::UnicodeSegmentation;
use url::Url;
use uuid::Uuid;

// TODO
// rustix -- https://github.com/bytecodealliance/rustix
// jiff -- https://docs.rs/jiff/latest/jiff/
// itertools -- https://github.com/rust-itertools/itertools
// path-absolutize -- https://github.com/magiclen/path-absolutize
// zip -- https://github.com/zip-rs/zip2
// nom -- https://github.com/rust-bakery/nom
// jsonschema -- https://github.com/Stranger6667/jsonschema

// Also
// hashbrown, dashmap, indexmap/ordermap
// eyre, anyhow, thiserror
// num, rand

// ---
// Main
// ---

#[tokio::main]
async fn main() {
    // Sync
    let examples: Vec<(&str, fn() -> ())> = vec![
        ("basic_time", basic_time),
        ("basic_chrono", basic_chrono),
        ("basic_regex", basic_regex),
        ("basic_gzip", basic_gzip),
        ("basic_zlib", basic_zlib),
        ("basic_serde", basic_serde),
        ("basic_csv", basic_csv),
        ("basic_rayon", basic_rayon),
        ("basic_bytes", basic_bytes),
        ("basic_unicode_segmentation", basic_unicode_segmentation),
        ("basic_url", basic_url),
        ("basic_imara_diff", basic_imara_diff),
        ("basic_similar", basic_similar),
        ("basic_heck", basic_heck),
        ("basic_glob", basic_glob),
        ("basic_camino", basic_camino),
    ];
    for (title, example_func) in examples {
        print_section_header(title.into());
        example_func();
    }

    // Async
    let async_examples: Vec<(&str, fn() -> BoxFuture<'static, ()>)> = vec![
        ("basic_reqwest", || Box::pin(basic_reqwest())),
        ("basic_async_func", || Box::pin(basic_async_func())),
    ];
    for (title, async_example_func) in async_examples {
        print_section_header(title.into());
        async_example_func().await;
    }
}

// ---
// Utils
// ---

/// Convert a string to uppercase and print it
fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

// ---
// Examples
// ---

fn basic_time() {
    // std::time should not be used as a human-readable date/time library.
    // for human readable values, use tailhook/humantime

    // elapsed (Instant + Duration)
    {
        let start = time::Instant::now();
        thread::sleep(time::Duration::from_millis(100));
        let duration = start.elapsed();
        println!("elapsed: {:?}", duration);
    }

    // shift (SystemTime) (not human-readable)
    {
        let now = time::SystemTime::now();
        println!("now: {:#?}", now);
        let same_time_tomorrow = now + time::Duration::new(86400, 0);
        println!(": {:#?}", same_time_tomorrow);
    }
}

fn basic_chrono() {
    // Date, Time, and DateTime are timezone aware
    // NaiveDate, NaiveTime, and NaiveDateTime are not

    // datetime now
    {
        let now_utc: DateTime<Utc> = Utc::now();
        let now_local: DateTime<Local> = Local::now();
        println!("now_utc: {}", now_utc);
        println!("now_local: {}", now_local);
    }

    // date now
    {
        let date_utc = Utc::now().date_naive();
        let date_local = Local::now().date_naive();
        println!("date_utc: {}", date_utc);
        println!("date_local: {}", date_local);
    }

    // parse date from string
    {
        let dt = NaiveDate::parse_from_str("2021-08-17", "%Y-%m-%d").unwrap();
        println!("parsed from string: {}", dt);
    }

    // format
    {
        let dt = Utc::now();
        let formatted1 = dt.format("%Y-%m-%d");
        let formatted2 = dt.format("%a, %h %d");
        println!("formatted (yyyy-mm-dd): {}", formatted1);
        println!("formatted (human-readable): {}", formatted2);
    }

    // custom datetime
    {
        let dt = Utc.with_ymd_and_hms(2021, 5, 26, 1, 2, 3).unwrap();
        println!("custom datetime: {}", dt);
    }

    // shift
    {
        let dt1 = Utc.with_ymd_and_hms(2021, 10, 3, 0, 0, 0).unwrap();
        let dt2 = dt1 + Duration::days(7);
        println!(
            "one week from {} is {}",
            dt1.format("%Y-%m-%d"),
            dt2.format("%Y-%m-%d")
        );
    }

    // select part of datetime
    {
        let dt = Utc.with_ymd_and_hms(2021, 9, 15, 0, 0, 0).unwrap();
        println!(
            "year: {}, month: {}, day: {}, hour: {}, minute: {}, second: {}",
            dt.year(),
            dt.month(),
            dt.day(),
            dt.hour(),
            dt.minute(),
            dt.second()
        );
    }

    // override part
    {
        let dt = Local::now();
        let first_of_month = dt.with_day(1).unwrap().format("%Y-%m-%d");
        println!("first_of_month: {}", first_of_month);
    }

    // check weekday
    {
        let dt = Local::now();
        let is_saturday = dt.weekday() == Weekday::Sat;
        println!("today is saturday: {}", is_saturday);
    }

    // check duration
    {
        let dt1 = Utc.with_ymd_and_hms(2021, 5, 26, 0, 0, 0).unwrap();
        let dt2 = Utc.with_ymd_and_hms(2021, 9, 15, 0, 0, 0).unwrap();
        let duration = dt2.signed_duration_since(dt1);
        assert_eq!(duration, Duration::days(112));
    }
}

fn test_pattern(text: &str, pattern: &str) -> bool {
    let re = Regex::new(pattern).unwrap();
    re.is_match(text)
}

fn basic_regex() {
    let text: String = "In order to survive, ".to_string()
        + "we cling to all we know and understand. "
        + "And label it reality. "
        + "But knowledge and understanding are ambiguous. "
        + "That reality could be an illusion. "
        + "All humans live with the wrong assumptions.";

    println!("text: {}", text);

    let contains = test_pattern(&text, r"ambiguous".into());
    let begins_with = test_pattern(&text, r"^In".into());
    let ends_with = test_pattern(&text, r"assumptions.$".into());
    let one_or_more = test_pattern(&text, r"Al+".into());
    let zero_or_one = test_pattern(&text, r"labels?".into());
    let zero_or_more = test_pattern(&text, r"il*usion".into());
    let one_of = test_pattern(&text, r"B[aeiou]t".into());
    let match_or = test_pattern(&text, r"equivocal|ambiguous".into());
    let not = test_pattern(&text, r"[^sharingan]".into());
    let any_char = test_pattern(&text, r"under.tanding".into());
    let zero_to_three = test_pattern(&text, r"Al{0,3}".into());
    let insensitive = test_pattern(&text, r"(?i)REALITY".into());
    let seven_lower = test_pattern(&text, r"[a-z]{7}".into());
    let four_alumn = test_pattern(&text, r"[[:alnum:]]{4} reality".into());

    println!("contains: {}", contains);
    println!("begins_with: {}", begins_with);
    println!("ends_with: {}", ends_with);
    println!("one_or_more: {}", one_or_more);
    println!("zero_or_one: {}", zero_or_one);
    println!("zero_or_more: {}", zero_or_more);
    println!("one_of: {}", one_of);
    println!("match_or: {}", match_or);
    println!("not: {}", not);
    println!("any_char: {}", any_char);
    println!("zero_to_three: {}", zero_to_three);
    println!("insensitive: {}", insensitive);
    println!("seven_lower: {}", seven_lower);
    println!("four_alumn: {}", four_alumn);
}

fn basic_zlib() {
    // Zlib compress
    let contents: String = "'Never go back on your word, and never give up.' ".to_string()
        + "That's your ninja way -- and as your mentor, I have no business whining!";
    println!("contents: {}", contents);

    let contents_bytes = contents.as_bytes();
    println!("contents_bytes: {:?}", contents_bytes);

    let mut encoder = ZlibEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(contents_bytes).unwrap();
    let contents_compressed_bytes = encoder.finish().unwrap();
    println!("contents_compressed_bytes: {:?}", contents_compressed_bytes);

    // Base64 encode
    let contents_base64_encoded = b64_encode(&contents_compressed_bytes);
    println!("contents_base64_encoded: {:?}", contents_base64_encoded);

    // Base64 decode
    let contents_base64_decoded = b64_decode(&contents_base64_encoded).unwrap();
    println!("contents_base64_decoded: {:?}", contents_base64_decoded);

    // Zlib decompress
    let mut decoder = ZlibDecoder::new(&*contents_base64_decoded);
    let mut contents_uncompressed = String::new();
    let bytes_read = decoder
        .read_to_string(&mut contents_uncompressed)
        .unwrap_or(0);
    println!("contents_uncompressed: {}", contents_uncompressed);
    println!("bytes_read: {}", bytes_read);
}

fn basic_gzip() {
    // Gzip compress
    let contents: String = "I have faith that there will come a time ".to_string()
        + "when people can truly understand one another.";
    println!("contents: {}", contents);

    let contents_bytes = contents.as_bytes();
    println!("contents_bytes: {:?}", contents_bytes);

    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(contents_bytes).unwrap();
    let contents_compressed_bytes = encoder.finish().unwrap();
    println!("contents_compressed_bytes: {:?}", contents_compressed_bytes);

    // Base64 encode
    let contents_base64_encoded = b64_encode(&contents_compressed_bytes);
    println!("contents_base64_encoded: {:?}", contents_base64_encoded);

    // Base64 decode
    let contents_base64_decoded = b64_decode(&contents_base64_encoded).unwrap();
    println!("contents_base64_decoded: {:?}", contents_base64_decoded);

    // Gzip decompress
    let mut decoder = GzDecoder::new(&*contents_base64_decoded);
    let mut contents_uncompressed = String::new();
    let bytes_read = decoder
        .read_to_string(&mut contents_uncompressed)
        .unwrap_or(0);
    println!("contents_uncompressed: {}", contents_uncompressed);
    println!("bytes_read: {}", bytes_read);
}

mod ninja {
    use serde::{Deserialize, Serialize};
    use uuid::Uuid;

    #[derive(Serialize, Deserialize, PartialEq, Debug, Clone)]
    pub struct Ninja {
        pub id: Uuid,
        pub first_name: String,
        pub last_name: String,
        pub age: i32,
        pub created_at: chrono::NaiveDateTime,
        pub updated_at: Option<chrono::NaiveDateTime>,
        pub jutsus: Option<Vec<Jutsu>>,
    }

    #[derive(Serialize, Deserialize, PartialEq, Debug, Clone)]
    pub struct Jutsu {
        pub id: Uuid,
        pub name: String,
        pub description: String,
        pub chakra_nature: String,
        pub created_at: chrono::NaiveDateTime,
        pub updated_at: Option<chrono::NaiveDateTime>,
        pub ninjas: Option<Vec<Ninja>>,
    }
}

fn basic_serde() {
    // JSON
    {
        let now = chrono::Utc::now().naive_utc();

        let jutsu = ninja::Jutsu {
            id: Uuid::new_v4(),
            name: "Chidori".into(),
            description: "Lightning blade".into(),
            chakra_nature: "Lightning".into(),
            created_at: now.clone(),
            updated_at: None,
            ninjas: None,
        };

        let ninja = ninja::Ninja {
            id: Uuid::new_v4(),
            first_name: String::from("Kakashi"),
            last_name: String::from("Hatake"),
            age: 27,
            created_at: now,
            updated_at: None,
            jutsus: Some(vec![jutsu]),
        };

        // Serialize
        let ninja_serialized = serde_json::to_string(&ninja.clone()).unwrap();
        println!("ninja_serialized: {}", ninja_serialized);
        let ninja_serialized_pretty = serde_json::to_string_pretty(&ninja).unwrap();
        println!("ninja_serialized_pretty: {}", ninja_serialized_pretty);

        // Deserialize
        let ninja_deserialized: ninja::Ninja = serde_json::from_str(&ninja_serialized).unwrap();
        println!("ninja_deserialized: {:#?}", ninja_deserialized);
    }
    // CSV
    {
        // Deserialize
        let data: String = "id,first_name,last_name,age,created_at".to_string()
            + "\n83652eed-d28e-4ae4-95a8-9c218a778cc3,Kakashi,Hatake,27,2022-03-15T04:11:20.319369"
            + "\na5f8d71f-5eef-4189-bc05-de9297013f25,Iruka,Umino,25,2022-03-15T04:11:20.319369"
            + "\nfaac984f-edaf-4afa-ba0f-fa5881312c20,Yamato,Tenzo,26,2022-03-15T04:11:20.319369"
                .into();

        let deserialize_ninjas = |data: &str| {
            let mut reader = csv::Reader::from_reader(data.as_bytes());
            let mut ninjas: Vec<ninja::Ninja> = vec![];
            for record in reader.deserialize() {
                let r: ninja::Ninja = record.unwrap();

                ninjas.push(ninja::Ninja {
                    id: r.id,
                    first_name: r.first_name,
                    last_name: r.last_name,
                    age: r.age,
                    created_at: r.created_at,
                    updated_at: None,
                    jutsus: None,
                });
            }
            ninjas
        };
        let ninjas = deserialize_ninjas(&data);
        println!("ninjas: {:#?}", ninjas);

        // Serialize
        let serialize_ninjas = |ninjas| {
            let mut wtr = csv::Writer::from_writer(vec![]);
            for ninja in ninjas {
                wtr.serialize(ninja).unwrap();
            }
            String::from_utf8(wtr.into_inner().unwrap()).unwrap()
        };

        let serialized_data = serialize_ninjas(ninjas);
        println!("serialized_data:\n{:#?}", serialized_data);
    }

    // YAML
    {
        // ...
    }
    // Msgpack
    {
        // ...
    }
}

fn basic_csv() {
    // Deserialize using csv StringRecord
    let now = chrono::Utc::now().naive_utc();
    let data: String = "first_name,last_name,age".to_string()
        + "\nKakashi,Hatake,27"
        + "\nIruka,Umino,25"
        + "\nYamato,Tenzo,26\n".into();

    let deserialize_ninjas = |data: &str| {
        let mut reader = csv::Reader::from_reader(data.as_bytes());
        let mut ninjas: Vec<ninja::Ninja> = vec![];
        for record in reader.records() {
            let r = record.unwrap();

            let first_name = r[0].into();
            let last_name = r[1].into();
            let age = r[2].parse::<i32>().unwrap_or(0);

            ninjas.push(ninja::Ninja {
                id: Uuid::new_v4(),
                first_name,
                last_name,
                age,
                created_at: now,
                updated_at: None,
                jutsus: None,
            });
        }
        ninjas
    };

    let ninjas = deserialize_ninjas(&data);
    println!("ninjas: {:#?}", ninjas);
}

fn basic_rayon() {
    let values: Vec<i32> = vec![1, 2, 3, 4, 5];
    let result: Vec<i32> = values.par_iter().map(|n: &i32| n.pow(2)).collect();
    println!("result: {:#?}", result);
}

fn basic_bytes() {
    let string = "Is mayonnaise an instrument?";
    let data = Bytes::from(string);

    // See also the methods from `Deref<Target=[u8]>`

    let results = vec![
        format!("string: {}", string),
        format!("data: {:?}", data),
        format!("data.len(): {}", data.len()),
        format!("data.is_empty(): {}", data.is_empty()),
        // NOTE: `is_unique` refers to the reference (not the content)
        format!("data.is_unique(): {}", data.is_unique()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_unicode_segmentation() {
    let string = "Se eu não fizer nada, certamente trará uma dor muito maior.";
    let graphemes = string.graphemes(true);
    let words: Vec<&str> = string.unicode_words().collect();

    let results = vec![
        format!("string: {}", string),
        format!("string.len(): {}", string.len()),
        format!("graphemes.count(): {}", graphemes.count()),
        format!("words.len(): {}", words.len()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_url() {
    let text = "https://youtu.be/c3hyGK-XPZI?si=I6qkhUHdIhw5TiSR&t=60";
    let yt_url = Url::parse(text).unwrap();

    // See also: username, password, host, port

    let results = vec![
        format!("text: {}", text),
        format!("yt_url.scheme(): {}", yt_url.scheme()),
        format!("yt_url.host_str(): {:?}", yt_url.host_str()),
        format!("yt_url.path(): {}", yt_url.path()),
        format!("yt_url.query(): {:?}", yt_url.query()),
        format!("yt_url.fragment(): {:?}", yt_url.fragment()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_imara_diff() {
    let text1 = "1\n2\n3\n4\n5\n";
    let text2 = "1\n2\n3\n5\n8\n";

    let input = InternedInput::new(text1, text2);
    let res = diff(
        Algorithm::Histogram,
        &input,
        UnifiedDiffBuilder::new(&input),
    );

    println!("{}", res);
}

fn basic_similar() {
    let text1 = "1\n2\n3\n4\n5\n";
    let text2 = "1\n2\n3\n5\n8\n";

    let diff = TextDiff::from_lines(text1, text2);

    for change in diff.iter_all_changes() {
        let sign = match change.tag() {
            ChangeTag::Delete => "-",
            ChangeTag::Insert => "+",
            ChangeTag::Equal => " ",
        };
        print!("{}{}", sign, change);
    }
}

fn basic_heck() {
    let text = "me hoy minoy";

    let results = vec![
        format!("text: {}", text),
        format!("text.to_kebab_case(): {}", text.to_kebab_case()),
        format!("text.to_lower_camel_case(): {}", text.to_lower_camel_case()),
        format!("text.to_snake_case(): {}", text.to_snake_case()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_glob() {
    for entry in glob("./*").unwrap() {
        let path = entry.unwrap();
        if path.is_file() {
            println!("{}", path.into_os_string().into_string().unwrap());
        }
    }
}

fn basic_camino() {
    let path = Utf8Path::new("./Cargo.toml");
    let contents = read_to_string(path).unwrap();
    let results = vec![
        format!("path: {}", path),
        format!("contents.len(): {}", contents.len()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

// ---
// Async Examples
// ---

mod person {
    use serde::{Deserialize, Serialize};

    #[derive(Serialize, Deserialize, Debug)]
    pub struct PersonNew {
        pub name: String,
        pub username: String,
    }

    #[derive(Serialize, Deserialize, Debug)]
    pub struct Person {
        pub id: i32,
        pub name: String,
        pub username: String,
    }

    #[derive(Serialize, Deserialize, Debug)]
    pub struct PersonUpdates {
        pub name: Option<String>,
        pub username: Option<String>,
    }
}

async fn basic_reqwest() -> () {
    // Setup
    let base_url = "https://jsonplaceholder.typicode.com";
    let client = reqwest::Client::new();

    // Create person
    let person: person::Person = client
        .post(format!("{}/users/", base_url))
        .json(&person::PersonNew {
            name: String::from("Kakashi Hatake"),
            username: String::from("kakashi"),
        })
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Create person result: {:#?}", person);
    let person_id = 10;

    // Select person
    let person: person::Person = client
        .get(format!("{}/users/{}/", base_url, person_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Select person result: {:#?}", person);

    // Update person
    let person: person::Person = client
        .put(format!("{}/users/{}/", base_url, person_id.clone()))
        .json(&person::PersonUpdates {
            name: Some(String::from("Kaka Sensei")),
            username: Some(String::from("kaka.sensei")),
        })
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Update person result: {:#?}", person);

    // Delete person
    client
        .delete(format!("{}/users/{}/", base_url, person_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap();

    println!("Delete person result: ok");
}

async fn basic_async_func() -> () {
    // ...
}
