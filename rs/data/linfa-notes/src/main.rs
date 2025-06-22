use anyhow::anyhow;
use linfa::dataset::Dataset;
use linfa::prelude::{SingleTargetRegression, ToConfusionMatrix};
use linfa::traits::{Fit, Predict};
use linfa_linear::{FittedLinearRegression, LinearRegression};
use linfa_logistic::{MultiFittedLogisticRegression, MultiLogisticRegression};
use ndarray::{Array, Array1, Array2, s};
use num::{Float, Num};
use polars::prelude::*;
use rand::distributions::Distribution;
use statrs::distribution::Normal;
use std::collections::HashSet;
use std::fs;
use std::hash::Hash;
use std::iter::FromIterator;
use std::path::Path;

// ---
// Main
// ---

fn main() {
    let examples: Vec<(&str, fn())> = vec![
        ("setup", setup),
        ("univariate_linear", univariate_linear),
        ("multivariate_linear", multivariate_linear),
        ("multivariate_logistic", multivariate_logistic),
    ];
    for (title, example_func) in examples {
        print_section_header(title.into());
        example_func();
    }
}

// ---
// Utils
// ---

/// Convert a string to uppercase and print it
fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

/// Get a normally distributed Vec<f64> with n elements
fn get_norm_vec(count: usize) -> Vec<f64> {
    let mut rng = rand::thread_rng();
    let dist = Normal::new(0.0, 1.0).unwrap();
    let mut results = Vec::with_capacity(count);
    for _ in 0..count {
        results.push(dist.sample(&mut rng));
    }
    results
}

/// Add noise to each element of Vec<f64>
fn add_noise(values: &Vec<f64>) -> Vec<f64> {
    let count = values.len();
    let noise: Vec<f64> = get_norm_vec(count).into_iter().map(|n| n / 10.0).collect();
    values.iter().zip(&noise).map(|(&v, &n)| v + n).collect()
}

/// Return true if all elements are equal (or vec is empty)
fn _all_equal<T: PartialEq>(values: &Vec<T>) -> bool {
    if let Some(first) = values.iter().next() {
        values.iter().all(|v| v == first)
    } else {
        true
    }
}

fn get_row_col_counts<T>(rows: &Vec<Vec<T>>) -> anyhow::Result<(usize, usize)> {
    let row_count = rows.len();

    let col_counts: Vec<usize> = rows.iter().map(|r| r.len()).collect();
    let uniq_col_counts = unique_vec(&col_counts);
    let col_count = match uniq_col_counts.as_slice() {
        [count] => match count {
            0 => return Err(anyhow!("There are empty rows")),
            n => *n,
        },
        [] => return Err(anyhow!("No rows")),
        many => return Err(anyhow!("Different column sizes: {:?}", many)),
    };

    Ok((row_count, col_count))
}

fn unique_vec<T: Eq + Hash + Clone>(values: &[T]) -> Vec<T> {
    let set = values.iter().cloned().collect::<HashSet<T>>();
    set.into_iter().collect()
}

fn _unique_set<T: Eq + Hash + Clone>(values: &[T]) -> HashSet<T> {
    HashSet::from_iter(values.iter().cloned())
}

/// Round a float to a given precision.
fn round<T>(float: T, precision: u32) -> T
where
    T: Float + std::convert::From<i32>,
{
    let places = 10_i32.pow(precision);
    (float * places.into()).round() / places.into()
}

fn round_vec<T: Float + std::convert::From<i32>>(values: &Vec<T>, precision: u32) -> Vec<T> {
    values.into_iter().map(|&n| round(n, precision)).collect()
}

/// Round all elements in a float ndarray to 2 decimal places.
fn round_array<T, Dim>(arr: &Array<T, Dim>, precision: u32) -> Array<T, Dim>
where
    T: Float + std::convert::From<i32>,
    Dim: ndarray::Dimension,
{
    arr.map(|&n| round(n, precision))
}

fn row_vecs_to_matrix<T: Num + Copy>(rows: &Vec<Vec<T>>) -> anyhow::Result<Array2<T>> {
    let (row_count, col_count) = get_row_col_counts(rows)?;
    let mut flattened_values = Vec::with_capacity(row_count * col_count);
    for row in rows {
        flattened_values.extend(row)
    }
    let matrix = Array2::from_shape_vec((row_count, col_count), flattened_values)?;
    Ok(matrix)
}

fn transpose_vec<T: Num + Copy>(rows: &Vec<Vec<T>>) -> anyhow::Result<Vec<Vec<T>>> {
    let (row_count, col_count) = get_row_col_counts(rows)?;
    if row_count == 0 || col_count == 0 {
        return Err(anyhow!("Empty data"));
    }
    let transposed = (0..col_count)
        .map(|col| (0..row_count).map(|row| rows[row][col]).collect())
        .collect();
    Ok(transposed)
}

fn col_vecs_to_matrix<T: Num + Copy>(rows: &Vec<Vec<T>>) -> anyhow::Result<Array2<T>> {
    let transposed = transpose_vec(&rows)?;
    let matrix = row_vecs_to_matrix(&transposed)?;
    Ok(matrix)
}

/// Convert a dataframe to a flattened Vec<f64>
fn df_to_f64_flat_vec(df: &DataFrame) -> anyhow::Result<Vec<f64>> {
    let mut result = Vec::with_capacity(df.height() * df.width());
    for row_idx in 0..df.height() {
        for series in df.get_columns() {
            let value = series.f64()?.get(row_idx).unwrap();
            result.push(value);
        }
    }
    Ok(result)
}

/// Convert a dataframe to an Array2<f64>
fn df_to_f64_array2(df: &DataFrame) -> anyhow::Result<Array2<f64>> {
    let (nrows, ncols) = df.shape();
    let flattened_values = df_to_f64_flat_vec(df)?;
    let matrix = Array2::from_shape_vec((nrows, ncols), flattened_values)?;
    Ok(matrix)
}

/// Convert a series to a Vec<f64>
fn series_to_f64_vec(series: &Series) -> anyhow::Result<Vec<f64>> {
    let values = series
        .f64()?
        .into_iter()
        .collect::<Vec<Option<f64>>>()
        .into_iter()
        .collect::<Option<Vec<f64>>>()
        .ok_or(anyhow!("Null values found in vec"))?;
    Ok(values)
}

fn series_to_str_vec(series: &Series) -> anyhow::Result<Vec<&str>> {
    let values = series
        .utf8()?
        .into_iter()
        .collect::<Vec<Option<&str>>>()
        .into_iter()
        .collect::<Option<Vec<&str>>>()
        .ok_or(anyhow!("Null values found in vec"))?;
    Ok(values)
}

// ---
// Examples
// ---

fn setup() {
    let data_dir = Path::new(".").join("data");
    let input_dir = data_dir.join("input");
    let output_dir = data_dir.join("output");

    for dir in vec![data_dir, input_dir, output_dir] {
        fs::create_dir_all(dir).unwrap();
    }
}

fn univariate_linear() {
    // y = 2x + 1
    let x = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
    let y = (|| {
        let values: Vec<f64> = x.clone().into_iter().map(|n| 2.0 * n + 1.0).collect();
        add_noise(&values)
    })();

    let records = col_vecs_to_matrix(&vec![x.clone()]).unwrap();
    let targets = Array1::from(y.clone());
    let ds = Dataset::new(records, targets);

    let model: FittedLinearRegression<f64> = LinearRegression::default().fit(&ds).unwrap();
    let pred = model.predict(&ds);

    let results = vec![
        format!("round_vec(&x, 2):\n{:?}", round_vec(&x, 2)),
        format!("round_vec(&y, 2):\n{:?}", round_vec(&y, 2)),
        format!(
            "round_array(model.params(), 2):\n{:?}",
            round_array(model.params(), 2)
        ),
        format!(
            "round(model.intercept(), 2):\n{:?}",
            round(model.intercept(), 2)
        ),
        format!("round_array(&pred, 2):\n{:?}", round_array(&pred, 2)),
        format!("pred.r2(&ds).unwrap():\n{:?}", pred.r2(&ds).unwrap()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn multivariate_linear() {
    let csv_path = Path::new("data/input/usa-housing-cleaned.csv");
    let df = CsvReader::from_path(csv_path)
        .unwrap()
        .infer_schema(None)
        .has_header(true)
        .finish()
        .unwrap()
        .drop("Address")
        .unwrap();

    let x = df.drop("Price").unwrap();
    let y = df.column("Price").unwrap().clone();

    let records = df_to_f64_array2(&x).unwrap();
    let targets = Array1::from(series_to_f64_vec(&y).unwrap());
    let ds = Dataset::new(records, targets);

    let model: FittedLinearRegression<f64> = LinearRegression::default().fit(&ds).unwrap();
    let pred = model.predict(&ds);

    let results = vec![
        format!("x.head(Some(5)):\n{:?}", x.head(Some(5))),
        format!("y.head(Some(5)):\n{:?}", y.head(Some(5))),
        format!(
            "round_array(model.params(), 2):\n{:?}",
            round_array(model.params(), 2)
        ),
        format!(
            "round(model.intercept(), 2):\n{:?}",
            round(model.intercept(), 2)
        ),
        format!("round_array(&pred, 2):\n{:?}", round_array(&pred, 2)),
        format!("pred.r2(&ds).unwrap():\n{:?}", pred.r2(&ds).unwrap()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn multivariate_logistic() {
    // sepal_length,sepal_width,petal_length,petal_width,species
    let csv_path = Path::new("data/input/iris.csv");
    let df = CsvReader::from_path(csv_path)
        .unwrap()
        .infer_schema(None)
        .has_header(true)
        .finish()
        .unwrap();

    let x = df.drop("species").unwrap();
    let y = df.column("species").unwrap().clone();

    let records = df_to_f64_array2(&x).unwrap();
    let targets = Array1::from(series_to_str_vec(&y).unwrap());
    let ds = Dataset::new(records, targets.clone());

    let model: MultiFittedLogisticRegression<_, _> =
        MultiLogisticRegression::default().fit(&ds).unwrap();
    let pred = model.predict(&ds);

    let cm = pred.confusion_matrix(&targets).unwrap();

    let results = vec![
        format!("x.head(Some(5)):\n{:?}", x.head(Some(5))),
        format!("y.head(Some(5)):\n{:?}", y.head(Some(5))),
        format!("&pred.slice(s![0..5])):\n{:?}", &pred.slice(s![0..5])),
        format!("&cm:\n{:?}", &cm),
    ];
    results.iter().for_each(|s| println!("{}", s));
}
