use polars::df;
use polars::prelude::*;
use std::collections::HashMap;
use std::path::Path;

// Docs: https://docs.rs/polars/latest/polars/
// Features: https://docs.rs/polars/latest/polars/#compile-times-and-opt-in-features
// Cookbooks: https://docs.rs/polars/latest/polars/index.html#cookbooks

// Series: https://docs.rs/polars/latest/polars/series/struct.Series.html
// DataFrame: https://docs.rs/polars/latest/polars/frame/struct.DataFrame.html
// ChunkedArray: https://docs.rs/polars/latest/polars/chunked_array/struct.ChunkedArray.html
// GroupBy: https://docs.rs/polars/latest/polars/frame/groupby/struct.GroupBy.html

// ---
// Main
// ---

fn main() {
    print_section_header(String::from("basic series"));
    basic_series();

    print_section_header(String::from("basic series agg"));
    basic_series_agg();

    print_section_header(String::from("basic series manipulation"));
    basic_series_manipulation();

    print_section_header(String::from("basic series rounding"));
    basic_series_rounding();

    print_section_header(String::from("basic series selection"));
    basic_series_selection();

    print_section_header(String::from("basic df creation"));
    basic_df_creation();

    print_section_header(String::from("basic df details"));
    basic_df_details();

    print_section_header(String::from("basic df export"));
    basic_df_export();

    print_section_header(String::from("basic df selection"));
    basic_df_selection();

    print_section_header(String::from("basic df agg"));
    basic_df_agg();

    print_section_header(String::from("basic df mutation"));
    basic_df_mutation();

    print_section_header(String::from("basic df combine"));
    basic_df_combine();

    print_section_header(String::from("basic df add column"));
    basic_df_add_column();

    print_section_header(String::from("basic df mask"));
    basic_df_mask();

    print_section_header(String::from("basic df null"));
    basic_df_null();

    print_section_header(String::from("basic df grouping"));
    basic_df_grouping();
}

// ---
// Utils
// ---

pub fn get_iris_df() -> DataFrame {
    CsvReader::from_path(Path::new("src/data/iris.csv"))
        .unwrap()
        .infer_schema(None)
        .has_header(true)
        .finish()
        .unwrap()
}

pub fn get_range_df() -> DataFrame {
    DataFrame::new(vec![
        Series::new("a", [1, 6, 11, 16, 21]),
        Series::new("b", [2, 7, 12, 17, 22]),
        Series::new("c", [3, 8, 13, 18, 23]),
        Series::new("d", [4, 9, 14, 19, 24]),
        Series::new("e", [5, 10, 15, 20, 25]),
    ])
    .unwrap()
}

pub fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

// ---
// Examples
// ---

fn basic_series() {
    // Attributes
    let s1 = Series::new("s1", 1..6);
    // let s1: Series = (1..6).collect()

    let results = vec![
        format!("s1: {}", s1),
        format!("name: {}", s1.name()),
        format!("dtype: {}", s1.dtype()),
        format!("len: {}", s1.len()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_series_agg() {
    // Aggregations
    let s2 = Series::new("s1", 1..6).cast(&DataType::Float64).unwrap();
    let results = vec![
        format!("s2: {}", s2),
        format!("max: {}", s2.f64().unwrap().max().unwrap()),
        format!("min: {}", s2.f64().unwrap().min().unwrap()),
        format!("mean: {}", s2.mean().unwrap()),
        format!("median: {}", s2.median().unwrap()),
        format!(
            "mode: {:?}",
            s2.cast(&DataType::Int32)
                .unwrap()
                .extend_constant(AnyValue::Int32(3), 2)
                .unwrap()
                .i32()
                .unwrap()
                .mode()
                .unwrap()
        ),
        format!("sum: {}", s2.f64().unwrap().sum().unwrap()),
        format!("product: {}", s2.product()),
        format!("std: {}", s2.f64().unwrap().std().unwrap()),
        format!("var: {}", s2.f64().unwrap().var().unwrap()),
        format!(
            "quantile(.5): {}",
            s2.f64()
                .unwrap()
                .quantile(0.5, Default::default())
                .unwrap()
                .unwrap()
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_series_manipulation() {
    // Manipulation
    let s3 = Series::new("s3", [3, 4, 5, 1, 2]);

    let results = vec![
        format!("s3: {}", s3),
        format!("cast: {}", s3.cast(&DataType::Float64).unwrap()),
        format!("sort: {}", s3.sort(false)),
        format!("reverse: {}", s3.reverse()),
        format!(
            "apply: {}",
            Series::from(s3.i32().unwrap().apply(|x| x + 1))
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_series_rounding() {
    // Round
    let s4: Series = Series::new("s4", 1..10)
        .cast(&DataType::Float64)
        .unwrap()
        .f64()
        .unwrap()
        .apply(|x| x * 1.1)
        .into();

    let results = vec![
        format!("s4: {}", s4),
        format!("ceil: {}", s4.ceil().unwrap()),
        format!("floor: {}", s4.floor().unwrap()),
        format!("round: {}", s4.round(0).unwrap()),
        format!("clip: {}", s4.clip(4.0, 6.0).unwrap()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_series_selection() {
    // Selection
    let s5 = Series::new("s5", [1, 2, 3].repeat(3));
    let results = vec![
        format!("s5: {}", s5),
        format!("filter: {}", s5.filter(&s5.gt(1).unwrap()).unwrap()),
        format!(
            "sample_frac: {}",
            s5.sample_frac(0.5, false, true, Some(1)).unwrap()
        ),
        format!("shuffle: {}", s5.shuffle(1)),
        format!("slice: {}", s5.slice(0, 4)),
        format!("head: {}", s5.head(Some(3))),
        format!("tail: {}", s5.tail(Some(3))),
        format!("unique: {}", s5.unique().unwrap()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_df_creation() {
    // From Vec<Series>
    let df1 = DataFrame::new(vec![
        Series::new("a", [1, 6, 11, 16, 21]),
        Series::new("b", [2, 7, 12, 17, 22]),
        Series::new("c", [3, 8, 13, 18, 23]),
        Series::new("d", [4, 9, 14, 19, 24]),
        Series::new("e", [5, 10, 15, 20, 25]),
    ])
    .unwrap();
    println!("df1: {}", df1);

    // Using macro
    let df2 = df! [
        "a" => [1, 6, 11, 16, 21],
        "b" => [2, 7, 12, 17, 22],
        "c" => [3, 8, 13, 18, 23],
        "d" => [4, 9, 14, 19, 24],
        "e" => [5, 10, 15, 20, 25],
    ]
    .unwrap();
    println!("df2: {}", df2);
}

fn basic_df_details() {
    let df = get_iris_df();

    let results = vec![
        format!("get_column_names: {:?}", df.get_column_names()),
        format!("dtypes: {:?}", df.dtypes()),
        format!("shape: {:?}", df.shape()),
        format!("height: {}", df.height()),
        format!(
            "schema: {:?}",
            df.schema().iter_names().collect::<Vec<&String>>()
        ), // iter_fields, iter_dtypes, iter_names, iter
        format!("is_empty: {:?}", df.is_empty()),
        format!("estimated_size: {:?}", df.estimated_size()),
        format!("describe: {}", df.describe(None).drop("species").unwrap()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_df_export() {
    let mut df = get_range_df();

    // IO: https://docs.rs/polars/0.23.0/polars/docs/eager/index.html#io

    // To CSV
    let mut csv_bytes = Vec::new();
    CsvWriter::new(&mut csv_bytes)
        .has_header(true)
        .with_delimiter(b',')
        .finish(&mut df)
        .unwrap();
    let csv_string = String::from_utf8(csv_bytes).unwrap();
    println!("df -> csv: \n{}", csv_string);

    // To JSON
    let mut json_bytes = Vec::new();
    JsonWriter::new(&mut json_bytes)
        .with_json_format(JsonFormat::Json)
        .finish(&mut df)
        .unwrap();
    let json_string = String::from_utf8(json_bytes).unwrap();
    println!("df -> json: \n{}", json_string);

    // To Arrow IPC
    // TODO

    // To Vec<Struct>
    // TODO
}

fn basic_df_selection() {
    let df = get_iris_df();

    let results = vec![
        // Get col/row/cell
        format!("get_column_names: {:?}", df.get_column_names()),
        format!("get: {:?}", df.get(0).unwrap()),
        format!(
            "get -> hashmap: {:?}",
            df.get_column_names()
                .into_iter()
                .zip(df.get(0).unwrap().into_iter())
                .collect::<HashMap<&str, AnyValue>>()
        ),
        format!("slice: {}", df.slice(1, 2)),
        format!("column: {}", df.column("species").unwrap().head(Some(5))),
        format!(
            "columns: {:?}",
            df.head(Some(5))
                .columns(["species", "sepal_length"])
                .unwrap()
        ),
        // get_columns will get all columns as Vec<&Series>
        // select_series
        format!(
            "cell: {}",
            match df.column("species").unwrap().get(0) {
                AnyValue::Utf8(x) => x,
                _ => "",
            }
        ),
        format!("head: {:?}", df.head(Some(5))),
        format!("tail: {:?}", df.tail(Some(5))),
        // Mask (for multiple conditions, mask = cond1 | cond2)
        format!(
            "boolean mask result: {:?}",
            df.filter(&df.column("sepal_length").unwrap().gt(5.0).unwrap())
                .unwrap()
                .head(Some(3))
        ),
        // Expressions
        format!(
            "filtered: {:?}",
            df.filter(
                &df.column("species")
                    .unwrap()
                    .utf8()
                    .unwrap()
                    .starts_with("Versicolor")
            )
            .unwrap()
            .head(Some(3))
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_df_agg() {
    let df = get_iris_df().drop("species").unwrap();

    let results = vec![
        format!("max: {:?}", df.max()),
        format!("min: {:?}", df.min()),
        format!("mean: {:?}", df.mean()),
        format!("median: {:?}", df.median()),
        format!("sum: {:?}", df.sum()),
        format!("std: {:?}", df.std()),
        format!("var: {:?}", df.var()),
        format!(
            "quantile(0.5): {:?}",
            df.quantile(0.5, Default::default()).unwrap()
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_df_mutation() {
    let mut df = get_range_df();
    let results = vec![
        format!("drop: {:?}", df.drop("e").unwrap()),
        format!("rename: {:?}", df.rename("e", "E").unwrap()), // in-place
        format!(
            "sort: {:?}",
            df.sort(&["a", "b"], vec![false, false]).unwrap()
        ),
        format!(
            "sample: {:?}",
            df.sample_frac(0.5, false, true, Some(1)).unwrap()
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_df_combine() {
    let df = get_range_df();

    let results = vec![
        format!("vstack: {:?}", df.clone().vstack(&df.clone()).unwrap()),
        format!(
            "hstack: {:?}",
            df.clone()
                .select(&["a", "b"])
                .unwrap()
                .hstack(&df.clone().select(&["c", "d", "e"]).unwrap().get_columns())
                .unwrap()
        ),
        format!(
            "join: {:?}",
            df.clone()
                .join(
                    &df.clone(),
                    ["a"],
                    ["a"],
                    JoinType::Inner,
                    Some("_r".into())
                )
                .unwrap()
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_df_add_column() {
    let mut df = get_range_df();

    let results = vec![
        format!("df: {:?}", df),
        format!(
            "with_column: {:?}",
            df.with_column(Series::new("z", [0, 0, 0, 0, 0])).unwrap()
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_df_mask() {
    // TODO: &ChunkedArray<BooleanType>, is_duplicated, is_unique
    println!("...")
}

fn basic_df_null() {
    // TODO: fill_null, null_count, drop_null
    println!("...")
}

fn basic_df_grouping() {
    let df = get_iris_df().sample_n(6, false, true, Some(1)).unwrap();
    let grouped = df.groupby(["species"]).unwrap();

    // Keys
    println!(
        "keys: {:?}",
        grouped.keys()[0]
            .utf8()
            .unwrap()
            .into_no_null_iter()
            .collect::<Vec<&str>>()
    );
    // Agg
    println!("mean: {:?}", grouped.mean().unwrap());
    // Groups
    let groups = grouped.groups().unwrap();
    let groups_species = groups.column("species").unwrap();
    let groups_indices = groups.column("groups").unwrap();
    for i in 0..groups_species.len() {
        println!(
            "group: {}",
            match groups_species.get(i) {
                AnyValue::Utf8(x) => x,
                _ => "",
            }
        );
        println!(
            "group_df: {:?}",
            match groups_indices.get(i) {
                AnyValue::List(indices) => df.take(&indices.u32().unwrap()).unwrap(),
                _ => DataFrame::default(),
            }
        );
    }
}
