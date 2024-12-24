#![allow(non_snake_case)]

use ndarray::prelude::*;
use ndarray::{array, Array, Array1, Array2, Axis};
use ndarray_rand::rand_distr::{
    Bernoulli, Binomial, Exp, Geometric, Normal, Poisson, Standard, StandardNormal, Uniform,
};
use ndarray_rand::RandomExt;
use ndarray_stats::{CorrelationExt, DeviationExt, QuantileExt, SummaryStatisticsExt};
use num::{Float, Num};

// [TODO] boolean masks?

// ---
// Main
// ---

fn main() {
    // ndarray
    print_section_header(String::from("array creation"));
    array_creation();
    print_section_header(String::from("distributions"));
    distributions();
    print_section_header(String::from("array shape"));
    array_shape();
    print_section_header(String::from("square array"));
    square_array();
    print_section_header(String::from("array selection"));
    array_selection();
    print_section_header(String::from("array view"));
    array_view();
    print_section_header(String::from("array iter"));
    array_iter();
    print_section_header(String::from("array stats"));
    array_stats();
    print_section_header(String::from("array checks"));
    array_checks();
    print_section_header(String::from("array element-wise operations"));
    array_elementwise();

    // linalg
    print_section_header(String::from("basic vector-scalar arithmetic"));
    vector_scalar_arithmetic();
    print_section_header(String::from("basic vector-vector arithmetic"));
    vector_vector_arithmetic();
    print_section_header(String::from("basic vector-vector product"));
    vector_vector_product();
    print_section_header(String::from("basic vector length (norm)"));
    basic_vector_length();
}

// ---
// Utils
// ---

pub fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

/// Round a float to a given precision.
fn round<T>(float: T, precision: u32) -> T
where
    T: Float + std::convert::From<i32>,
{
    let places = 10_i32.pow(precision);
    (float * places.into()).round() / places.into()
}

/// Round all elements in an float ndarray to 2 decimal places.
fn round2<T, Dim>(arr: &Array<T, Dim>) -> Array<T, Dim>
where
    T: Float + std::convert::From<i32>,
    Dim: ndarray::Dimension,
{
    arr.map(|&n| round(n, 2))
}

/// Create a vector (Array1) with n random elements, using std/normal distribution.
fn std_norm_vec(n: usize) -> Array1<f64> {
    Array::random(n, StandardNormal {})
}

/// Create a square, symmetric nxn matrix (Array2) with random elements.
fn symmetric_square(n: usize) -> Array2<f64> {
    let arr: Array2<f64> = Array::random((n, n), StandardNormal {});
    (&arr.t()).dot(&arr)
}

// ---
// Examples (ndarray)
// ---

fn array_creation() {
    // Array1 -> Array -> ArrayBase
    // Array2 -> Array<i32, ndarray::Ix2> -> ...
    let array_from_macro: Array1<i32> = array![1, 2, 3];
    let array_from_vec: Array1<i32> = Array::from_vec(vec![1, 2, 3]);
    let array_from_range: Array1<f64> = Array1::range(1.0, 6.0, 1.0);
    let array_linspace: Array1<f64> = Array1::linspace(1.0, 6.0, 5);
    let array_from_iter: Array1<i32> = Array1::from_iter(1..6);
    let array_of_zeros: Array1<i32> = Array1::zeros(5);
    let array_of_ones: Array1<i32> = Array1::ones(5);

    let results = vec![
        format!("array_from_macro: {}", array_from_macro),
        format!("array_from_vec: {}", array_from_vec),
        format!("array_from_range: {}", array_from_range),
        format!("array_linspace: {}", array_linspace),
        format!("array_from_iter: {}", array_from_iter),
        format!("array_of_zeros: {}", array_of_zeros),
        format!("array_of_ones: {}", array_of_ones),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn distributions() {
    let std_norm_array: Array1<f64> = Array::random(5, StandardNormal {});
    let normal_array: Array1<f64> = Array::random(5, Normal::new(0.0, 1.0).unwrap());
    let std_array: Array1<f64> = Array::random(5, Standard {});
    let uniform_array: Array1<f64> = Array::random(5, Uniform::new(0., 10.));
    let bernoulli_array: Array1<bool> = Array::random(5, Bernoulli::new(0.5).unwrap());
    let binomial_array: Array1<u64> = Array::random(5, Binomial::new(10, 0.5).unwrap());
    let poisson_array: Array1<f64> = Array::random(5, Poisson::new(5.0).unwrap());
    let geometric_array: Array1<u64> = Array::random(5, Geometric::new(0.5).unwrap());
    let exp_array: Array1<f64> = Array::random(5, Exp::new(1.0).unwrap());

    let results = vec![
        format!("std_norm_array: {}", round2(&std_norm_array)),
        format!("normal_array: {}", round2(&normal_array)),
        format!("std_array: {}", round2(&std_array)),
        format!("uniform_array: {}", round2(&uniform_array)),
        format!("bernoulli_array: {}", bernoulli_array),
        format!("binomial_array: {}", binomial_array),
        format!("poisson_array: {}", poisson_array),
        format!("geometric_array: {}", geometric_array),
        format!("exp_array: {}", round2(&exp_array)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn array_shape() {
    let arr: Array2<i32> = Array1::from_iter(1..7)
        .into_shape_with_order((2, 3))
        .unwrap();

    // Also: to_shape

    let results = vec![
        format!("arr:\n{:?}", arr),
        format!("arr.dim(): {:?}", arr.dim()),
        format!("arr.shape(): {:?}", arr.shape()),
        format!("arr.ndim(): {:?}", arr.ndim()),
        format!("arr.nrows(): {:?}", arr.nrows()),
        format!("arr.ncols(): {:?}", arr.ncols()),
        format!("arr.len(): {:?}", arr.len()),
        format!("arr.flatten():\n{:?}", arr.flatten()),
        format!("arr.t():\n{:?}", arr.t()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn square_array() {
    let arr: Array2<f64> = round2(&symmetric_square(3));

    let diag_matrix: Array2<i32> = Array::from_diag(&array![1, 2, 3]);
    let identity_matrix: Array2<i32> = Array::eye(3);

    let results = vec![
        format!("arr:\n{:?}", arr),
        format!("arr.diag():\n{:?}", arr.diag()),
        format!("arr.tril(0):\n{:?}", arr.tril(0)),
        format!("arr.triu(0):\n{:?}", arr.triu(0)),
        format!("identity_matrix:\n{}", identity_matrix),
        format!("diag_matrix:\n{}", diag_matrix),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn array_selection() {
    let arr: Array2<f64> = round2(&symmetric_square(3));

    // Also: slice

    let results = vec![
        format!("arr:\n{:?}", arr),
        format!("arr.first(): {:?}", arr.first()),
        format!("arr.get((1, 1)): {:?}", arr.get((1, 1))),
        format!("arr.last(): {:?}", arr.last()),
        format!("arr.column(1): {:?}", arr.column(1)),
        format!("arr.row(1): {:?}", arr.row(1)),
        format!(
            "arr.select(Axis(0), &[0, 1]):\n{:?}",
            arr.select(Axis(0), &[0, 1])
        ),
        format!("arr.slice(s![1, ..]):\n{:?}", arr.slice(s![1, ..])),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn array_view() {
    // ...
}

fn array_iter() {
    let arr: Array2<f64> = round2(&symmetric_square(3));

    // Also: axes, columns, fold, lanes, rows

    println!("for_each");
    arr.for_each(|&n| println!("{}", n));

    println!("iter");
    for (i, n) in arr.iter().enumerate() {
        println!("{}: {}", i, n);
    }

    let results = vec![
        format!("arr:\n{}", arr),
        format!("arr.map(|&n| n * 2.0):\n{}", arr.map(|&n| n * 2.0)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn array_stats() {
    let arr: Array2<f64> = round2(&symmetric_square(3));
    let other: Array2<f64> = round2(&symmetric_square(3));

    // Also: weighted_mean, cov

    let results = vec![
        format!("arr:\n{}", arr),
        format!("arr.max(): {}", arr.max().unwrap()),
        format!("arr.max_skipnan(): {}", arr.max_skipnan()),
        format!("arr.min(): {}", arr.min().unwrap()),
        format!("arr.min_skipnan(): {}", arr.min_skipnan()),
        format!("arr.sum(): {}", arr.sum()),
        format!("arr.product(): {}", arr.product()),
        format!("arr.mean(): {}", arr.mean().unwrap()),
        format!("arr.kurtosis(): {}", arr.kurtosis().unwrap()),
        format!("arr.skewness(): {}", arr.skewness().unwrap()),
        format!("arr.geometric_mean(): {}", arr.geometric_mean().unwrap()),
        format!(
            "arr.pearson_correlation():\n{}",
            round2(&arr.pearson_correlation().unwrap())
        ),
        format!(
            "arr.mean_abs_err(&other): {}",
            arr.mean_abs_err(&other).unwrap()
        ),
        format!(
            "arr.mean_sq_err(&other): {}",
            arr.mean_sq_err(&other).unwrap()
        ),
        format!(
            "arr.root_mean_sq_err(&other): {}",
            arr.root_mean_sq_err(&other).unwrap()
        ),
        format!("arr.std(0.0): {}", arr.std(0.0)),
        format!("arr.var(0.0): {}", arr.var(0.0)),
        // format!("arr.mode(): {}", arr.mode().unwrap()),
        // format!("arr.median(): {}", arr.median().unwrap()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn array_checks() {
    let arr: Array2<f64> = round2(&symmetric_square(3));

    let results = vec![
        format!("arr:\n{}", arr),
        format!("arr.is_any_infinite(): {}", arr.is_any_infinite()),
        format!("arr.is_any_nan(): {}", arr.is_any_nan()),
        format!("arr.is_empty(): {}", arr.is_empty()),
        format!("arr.is_square(): {}", arr.is_square()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn array_elementwise() {
    let arr: Array2<f64> = round2(&symmetric_square(3));

    // round, trunc, ceil, floor
    // clamp, exp

    let results = vec![
        format!("arr:\n{}", arr),
        format!("arr.abs():\n{}", arr.abs()),
        format!("(&arr * 10.0).round():\n{}", (&arr * 10.0).round()),
        format!("(&arr * 10.0).ceil():\n{}", (&arr * 10.0).ceil()),
        format!("(&arr * 10.0).floor():\n{}", (&arr * 10.0).floor()),
        format!("(&arr * 10.0).trunc():\n{}", (&arr * 10.0).trunc()),
        format!(
            "(&arr * 100.0).clamp(-100.0, 100.0):\n{}",
            (&arr * 100.0).clamp(-100.0, 100.0)
        ),
        format!("arr.pow2():\n{}", round2(&arr.pow2())),
        format!("arr.powf(2.0):\n{}", round2(&arr.powf(2.0))),
        format!("arr.powi(2):\n{}", round2(&arr.powi(2))),
        format!("arr.sqrt():\n{}", round2(&arr.sqrt())),
        format!("arr.cbrt():\n{}", round2(&arr.cbrt())),
        format!("arr.ln():\n{}", round2(&arr.ln())),
        format!("arr.exp2():\n{}", round2(&arr.exp2())),
        format!("arr.exp():\n{}", round2(&arr.exp())),
        format!("arr.log10():\n{}", round2(&arr.log10())),
        format!("arr.log2():\n{}", round2(&arr.log2())),
        format!("arr.log(2.0):\n{}", round2(&arr.log(2.0))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

// ---
// Examples (linalg)
// ---

fn vector_scalar_arithmetic() {
    // Vector `v`, scalar `c`
    let v: Array1<f64> = array![3.0, -1.0];
    let c: f64 = 2.0;

    let results = vec![
        format!("v: {}", v),
        format!("c: {}", c),
        format!("&v + c: {}", &v + c),
        format!("&v - c: {}", &v - c),
        format!("&v * c: {}", &v * c),
        format!("&v / c: {}", &v / c),
        format!("v.powf(c): {}", v.powf(c)),
        format!("v.powi(c as i32): {}", v.powi(c as i32)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn vector_vector_arithmetic() {
    // Vector `v`, scalar `c`
    let v1: Array1<f64> = array![3.0, -1.0];
    let v2: Array1<f64> = array![2.0, 4.0];

    let results = vec![
        format!("v1: {}", v1),
        format!("v2: {}", v2),
        format!("&v1 + &v2: {}", &v1 + &v2),
        format!("&v1 - &v2: {}", &v1 - &v2),
        format!("&v1 * &v2: {}", &v1 * &v2),
        format!("&v1 / &v2: {}", &v1 / &v2),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

/// Get dot product of two 1D Arrays. Panics if different lengths.
fn inner_product<T>(v1: &Array1<T>, v2: &Array1<T>) -> T
where
    T: Num + std::ops::Mul<T, Output = T> + num::Zero + Copy,
{
    if v1.len() != v2.len() {
        panic!(
            "Arrays have different lengths: {} and {}",
            v1.len(),
            v2.len()
        )
    }
    v1.iter()
        .zip(v2.iter())
        .fold(T::zero(), |acc, (&val1, &val2)| acc + val1 * val2)
}

/// Get outer product of two 1D. Produces an Array2 (dimensions mxn).
fn outer_product<T>(v1: &Array1<T>, v2: &Array1<T>) -> Array2<T>
where
    T: Num + std::ops::Mul<T, Output = T> + num::Zero + Copy + 'static,
{
    let v1_view = v1.view().into_shape_with_order((v1.dim(), 1)).unwrap();
    let v2_view = v2.view().into_shape_with_order((1, v2.dim())).unwrap();

    v1_view.dot(&v2_view)
}

fn vector_vector_product() {
    let v1: Array1<f64> = round2(&std_norm_vec(6));
    let v2: Array1<f64> = round2(&std_norm_vec(6));

    let results = vec![
        format!("v1: {}", v1),
        format!("v2: {}", v2),
        // element-wise product
        format!("&v1 * &v2: {}", round2(&(&v1 * &v2))),
        // inner product (manual)
        format!("inner_product(&v1, &v2): {}", inner_product(&v1, &v2)),
        // inner product
        format!("&v1.dot(&v2): {}", &v1.dot(&v2)),
        // outer product (manual)
        format!(
            "outer_product(&v1, &v2):\n{}",
            round2(&outer_product(&v1, &v2))
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_vector_length() {
    let v1: Array1<f64> = array![1.0, 2.0, 3.0];
    let length = v1.pow2().sum().sqrt();

    let results = vec![format!("v1: {}", v1), format!("length: {}", length)];
    results.iter().for_each(|s| println!("{}", s));
}
