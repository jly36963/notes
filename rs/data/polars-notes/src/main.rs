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

fn main() {
    print_section_header(String::from("basic series"));
    basic_series();

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

fn basic_series() {
    // Attributes
    let s1 = Series::new("s1", 1..6);
    // let s1: Series = (1..6).collect()
    println!("s1: {}", s1);
    println!("name: {}", s1.name());
    println!("dtype: {}", s1.dtype());
    println!("len: {}", s1.len());

    // Aggregations
    let s2 = Series::new("s1", 1..6).cast(&DataType::Float64).unwrap();
    println!("s2: {}", s2);
    println!("max: {}", s2.f64().unwrap().max().unwrap());
    println!("min: {}", s2.f64().unwrap().min().unwrap());
    println!("mean: {}", s2.mean().unwrap());
    println!("median: {}", s2.median().unwrap());
    println!(
        "mode: {:?}",
        s2.cast(&DataType::Int32)
            .unwrap()
            .extend_constant(AnyValue::Int32(3), 2)
            .unwrap()
            .i32()
            .unwrap()
            .mode()
            .unwrap()
    );
    println!("sum: {}", s2.f64().unwrap().sum().unwrap());
    println!("product: {}", s2.product());
    println!("std: {}", s2.f64().unwrap().std().unwrap());
    println!("var: {}", s2.f64().unwrap().var().unwrap());
    println!("quantile(.5): {}", s2.f64().unwrap().quantile(0.5, Default::default()).unwrap().unwrap());

    // Manipulation
    let s3 = Series::new("s3", [3, 4, 5, 1, 2]);
    println!("s3: {}", s3);
    println!("cast: {}", s3.cast(&DataType::Float64).unwrap());
    println!("sort: {}", s3.sort(false));
    println!("reverse: {}", s3.reverse());
    println!("apply: {}", Series::from(s3.i32().unwrap().apply(|x| x + 1)));

    // Round
    let s4: Series = Series::new("s4", 1..10)
        .cast(&DataType::Float64)
        .unwrap()
        .f64()
        .unwrap()
        .apply(|x| x * 1.1)
        .into();
    println!("s4: {}", s4);
    println!("ceil: {}", s4.ceil().unwrap());
    println!("floor: {}", s4.floor().unwrap());
    println!("round: {}", s4.round(0).unwrap());
    println!("clip: {}", s4.clip(4.0, 6.0).unwrap());

    // Selection
    let s5 = Series::new("s5", [1, 2, 3].repeat(3));
    println!("s5: {}", s5);
    println!("filter: {}", s5.filter(&s5.gt(1).unwrap()).unwrap());
    println!("sample_frac: {}", s5.sample_frac(0.5, false, true, Some(1)).unwrap());
    println!("shuffle: {}", s5.shuffle(1));
    println!("slice: {}", s5.slice(0, 4));
    println!("head: {}", s5.head(Some(3)));
    println!("tail: {}", s5.tail(Some(3)));
    println!("unique: {}", s5.unique().unwrap());
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

    println!("get_column_names: {:?}", df.get_column_names());
    println!("dtypes: {:?}", df.dtypes());
    println!("shape: {:?}", df.shape());
    println!("height: {}", df.height());
    println!("schema: {:?}", df.schema().iter_names().collect::<Vec<&String>>()); // iter_fields, iter_dtypes, iter_names, iter
    println!("is_empty: {:?}", df.is_empty());
    println!("estimated_size: {:?}", df.estimated_size());
    println!("describe: {}", df.describe(None).drop("species").unwrap());
}

fn basic_df_export() {
    let mut df = get_range_df();

    // IO: https://docs.rs/polars/0.23.0/polars/docs/eager/index.html#io

    // To CSV
    let mut csv_bytes = Vec::new();
    CsvWriter::new(&mut csv_bytes).has_header(true).with_delimiter(b',').finish(&mut df).unwrap();
    let csv_string = String::from_utf8(csv_bytes).unwrap();
    println!("df -> csv: \n{}", csv_string);

    // To JSON
    let mut json_bytes = Vec::new();
    JsonWriter::new(&mut json_bytes).with_json_format(JsonFormat::Json).finish(&mut df).unwrap();
    let json_string = String::from_utf8(json_bytes).unwrap();
    println!("df -> json: \n{}", json_string);

    // To Arrow IPC
    // TODO

    // To Vec<Struct>
    // TODO
}

fn basic_df_selection() {
    let df = get_iris_df();

    // Get col/row/cell
    let cols = df.get_column_names();
    println!("get_column_names: {:?}", cols);
    let row = df.get(0).unwrap();
    println!("get: {:?}", row);
    let row_map: HashMap<&str, AnyValue> = cols.into_iter().zip(row.into_iter()).collect();
    println!("get -> hashmap: {:?}", row_map);
    println!("slice: {}", df.slice(1, 2));
    println!("column: {}", df.column("species").unwrap().head(Some(5)));
    println!("columns: {:?}", df.head(Some(5)).columns(["species", "sepal_length"]).unwrap());
    // get_columns will get all columns as Vec<&Series>
    // select_series
    println!(
        "cell: {}",
        match df.column("species").unwrap().get(0) {
            AnyValue::Utf8(x) => x,
            _ => "",
        }
    );
    println!("head: {:?}", df.head(Some(5)));
    println!("tail: {:?}", df.tail(Some(5)));

    // Mask (for multiple conditions, mask = cond1 | cond2)
    let mask = df.column("sepal_length").unwrap().gt(5.0).unwrap();
    println!("boolean mask result: {:?}", df.filter(&mask).unwrap().head(Some(3)));

    // Expressions
    println!(
        "filtered: {:?}",
        df.filter(&df.column("species").unwrap().utf8().unwrap().starts_with("Versicolor"))
            .unwrap()
            .head(Some(3))
    );
}

fn basic_df_agg() {
    let df = get_iris_df().drop("species").unwrap();

    println!("max: {:?}", df.max());
    println!("min: {:?}", df.min());
    println!("mean: {:?}", df.mean());
    println!("median: {:?}", df.median());
    println!("sum: {:?}", df.sum());
    println!("std: {:?}", df.std());
    println!("var: {:?}", df.var());
    println!("quantile(0.5): {:?}", df.quantile(0.5, Default::default()).unwrap());
}

fn basic_df_mutation() {
    let mut df = get_range_df();
    println!("drop: {:?}", df.drop("e").unwrap());
    println!("rename: {:?}", df.rename("e", "E").unwrap()); // in-place
    println!("sort: {:?}", df.sort(&["a", "b"], vec![false, false]).unwrap());
    println!("sample: {:?}", df.sample_frac(0.5, false, true, Some(1)).unwrap());
}

fn basic_df_combine() {
    let df = get_range_df();

    println!("vstack: {:?}", df.clone().vstack(&df.clone()).unwrap());
    println!(
        "hstack: {:?}",
        df.clone()
            .select(&["a", "b"])
            .unwrap()
            .hstack(&df.clone().select(&["c", "d", "e"]).unwrap().get_columns())
            .unwrap()
    );
    println!(
        "join: {:?}",
        df.clone().join(&df.clone(), ["a"], ["a"], JoinType::Inner, Some("_r".into())).unwrap()
    );
}

fn basic_df_add_column() {
    let mut df = get_range_df();

    println!("with_column: {:?}", df.with_column(Series::new("z", [0, 0, 0, 0, 0])).unwrap());
}

fn basic_df_mask() {
    // TODO: &ChunkedArray<BooleanType>, is_duplicated, is_unique
}

fn basic_df_null() {
    // TODO: fill_null, null_count, drop_null
}

fn basic_df_grouping() {
    let df = get_iris_df().sample_n(6, false, true, Some(1)).unwrap();

    let grouped = df.groupby(["species"]).unwrap();

    // Keys
    println!("keys: {:?}", grouped.keys()[0].utf8().unwrap().into_no_null_iter().collect::<Vec<&str>>());
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
