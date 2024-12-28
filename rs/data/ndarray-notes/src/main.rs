#![allow(non_snake_case)]

use ndarray::prelude::*;
use ndarray::{array, Array, Array1, Array2, Axis, Zip};
use ndarray_linalg::qr::QR;
use ndarray_linalg::*;
use ndarray_rand::rand_distr::{
    Bernoulli, Binomial, Exp, Geometric, Normal, Poisson, Standard, StandardNormal, Uniform,
};
use ndarray_rand::RandomExt;
use ndarray_stats::{CorrelationExt, DeviationExt, QuantileExt, SummaryStatisticsExt};
use num::{Float, Num};
use std::f64::consts::PI;

// ---
// Main
// ---

fn main() {
    let examples: Vec<(&str, fn() -> ())> = vec![
        // ndarray
        ("array creation", array_creation),
        ("distributions", distributions),
        ("array shape", array_shape),
        ("square array", square_array),
        ("array selection", array_selection),
        ("array view", array_view),
        ("array iter", array_iter),
        ("array stats", array_stats),
        ("array checks", array_checks),
        ("array element-wise operations", array_elementwise),
        // linalg
        ("vector-scalar arithmetic", vector_scalar_arithmetic),
        ("vector-vector arithmetic", vector_vector_arithmetic),
        ("vector-vector product", vector_vector_product),
        ("vector length (norm)", vector_length),
        ("vector cross product", vector_cross_product),
        ("unit vector", unit_vector),
        ("matrix scalar arithmetic", matrix_scalar_arithmetic),
        ("matrix vector arithmetic", matrix_vector_arithmetic),
        ("matrix shift", matrix_shift),
        ("transformation matrices", transformation_matrices),
        (
            "transformation matrices rotation",
            transform_matrices_rotation,
        ),
        ("matrix-matrix arithmetic", matrix_matrix_arithmetic),
        ("matmul order of operations", matmul_order_of_operations),
        (
            "multiplicative symmetric matrices",
            multiplicative_symmetric_matrices,
        ),
        ("frobenius dot product", frobenius_dot_product),
        ("matrix rref", matrix_rref),
        ("matrix rank", matrix_rank),
        ("rank deficient matrix", rank_deficient_matrix),
        ("matrix inverse", matrix_inverse),
        ("matrix inverse via row reduction", matrix_inv_row_reduction),
        ("matrix one-sided inverse", one_sided_inverse),
        ("r2 projections", r2_projections),
        ("qr decomposition", qr_decomposition),
        ("qr decomposition 2", qr_decomposition_2),
        ("qr gram-schmidt", qr_gram_schmidt),
        ("qr decomp inverse", qr_decomp_inverse),
        ("least squares row reduction", least_squares_row_reduction),
    ];

    for (title, example_func) in examples {
        print_section_header(title.into());
        example_func();
    }
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

/// Create a (mxn) matrix (Array2) with random elements.
fn random_matrix(m: usize, n: usize) -> Array2<f64> {
    let arr: Array2<f64> = Array::random((m, n), StandardNormal {});
    arr
}

/// Create a square (nxn) matrix (Array2) with random elements.
fn random_square_matrix(n: usize) -> Array2<f64> {
    random_matrix(n, n)
}

/// Create a square, symmetric nxn matrix (Array2) with random elements.
fn symmetric_square(n: usize) -> Array2<f64> {
    let arr: Array2<f64> = random_square_matrix(n);
    (&arr.t()).dot(&arr)
}

fn rect_eye<T>(m: usize, n: usize) -> Array2<T>
where
    T: Num + Copy,
{
    let mut matrix = Array2::zeros((m, n));
    let smaller_dimension = std::cmp::min(m, n);
    for i in 0..smaller_dimension {
        matrix[[i, i]] = T::one()
    }

    return matrix;
}

/// Assert that two arrays have equal length.
fn assert_equal_length<T, Dim>(arr1: &Array<T, Dim>, arr2: &Array<T, Dim>) -> ()
where
    T: Num + std::ops::Mul<T, Output = T> + num::Zero + Copy + 'static,
    Dim: ndarray::Dimension,
{
    if arr1.len() != arr2.len() {
        panic!(
            "Arrays have different lengths: {} and {}",
            arr1.len(),
            arr2.len()
        )
    }
}
/// Assert that two arrays have equal length.
fn assert_equal_dimensions<T, Dim>(arr1: &Array<T, Dim>, arr2: &Array<T, Dim>) -> ()
where
    T: Num + std::ops::Mul<T, Output = T> + num::Zero + Copy + 'static,
    Dim: ndarray::Dimension,
{
    if arr1.dim() != arr2.dim() {
        panic!(
            "Arrays have different dimensions: {:?} and {:?}",
            arr1.dim(),
            arr2.dim()
        )
    }
}
/// Assert that two arrays have equal length.
fn assert_square<T>(arr: &Array2<T>) -> ()
where
    T: Num + std::ops::Mul<T, Output = T> + num::Zero + Copy + 'static,
{
    let (rows, cols) = arr.dim();
    if rows != cols {
        panic!("Array is not square: {:?}x{:?}", rows, cols)
    }
}

/// Assert that two arrays have equal length.
fn assert_equal_ndarray<T, Dim>(arr1: &Array<T, Dim>, arr2: &Array<T, Dim>) -> ()
where
    T: Num + std::ops::Mul<T, Output = T> + num::Zero + Copy + 'static + std::fmt::Debug,
    Dim: ndarray::Dimension,
{
    assert_equal_dimensions(&arr1, &arr2);

    for (val1, val2) in arr1.iter().zip(arr2.iter()) {
        assert_eq!(val1, val2);
    }
}

/// Get the length of a vector
fn vector_norm<T>(v1: &Array1<T>) -> T
where
    T: Float + std::ops::Mul<T, Output = T> + num::Zero + Copy + 'static,
{
    v1.pow2().sum().sqrt()
}

/// Get dot product of two 1D Arrays. Panics if different lengths.
fn inner_product<T>(v1: &Array1<T>, v2: &Array1<T>) -> T
where
    T: Num + std::ops::Mul<T, Output = T> + num::Zero + Copy + 'static,
{
    assert_equal_length(v1, v2);
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

/// Get outer product of two Array1. Produces Array2 (dimensions mxn).
fn cross_product<T>(v1: &Array1<T>, v2: &Array1<T>) -> Array1<T>
where
    T: Num + std::ops::Mul<T, Output = T> + num::Zero + Copy + 'static,
{
    assert_equal_length(v1, v2);

    let size = v1.len();
    let mut result: Array1<T> = Array1::zeros(size);
    for i in 0..size {
        let plus_1 = (i + 1) % size; // modulus used to wrap around
        let plus_2 = (i + 2) % size;
        result[i] = v1[plus_1] * v2[plus_2] - v1[plus_2] * v2[plus_1]
    }
    result
}

/// Sum of elements along diagonal of matrix (Array2).
fn trace<T>(arr: &Array2<T>) -> T
where
    T: Num + std::ops::Add<T, Output = T> + Copy,
{
    arr.diag().sum()
}

/// Swap two rows in a matrix (Array2)
fn swap_rows(arr: &mut Array2<f64>, index1: usize, index2: usize) -> () {
    let mut it = arr.axis_iter_mut(Axis(0));
    Zip::from(it.nth(index1).unwrap())
        .and(it.nth(index2 - (index1 + 1)).unwrap())
        .for_each(std::mem::swap);
}

/// Get the reduced row echelon form of a matrix (Array2).
fn rref(arr: &Array2<f64>) -> Array2<f64> {
    let mut matrix: Array2<f64> = arr.clone();

    let (rows, cols) = matrix.dim();
    let mut row = 0;
    let mut col = 0;

    while row < rows && col < cols {
        // Find the pivot row and swap it to the current row
        let mut pivot_row = row;
        for r in row + 1..rows {
            if matrix[[r, col]].abs() > matrix[[pivot_row, col]].abs() {
                pivot_row = r;
            }
        }
        // If the pivot is zero, skip this column and move to the next one
        if matrix[[pivot_row, col]].abs() < f64::EPSILON {
            col += 1;
            continue;
        }
        // Swap the current row with the pivot row
        if row != pivot_row {
            swap_rows(&mut matrix, row, pivot_row);
        }
        // Scale the pivot row to make the pivot element 1
        let pivot_value = matrix[[row, col]];
        for c in col..cols {
            matrix[[row, c]] /= pivot_value;
        }
        // Eliminate all entries in the column above and below the pivot
        for r in 0..rows {
            if r != row {
                let factor = matrix[[r, col]];
                for c in col..cols {
                    matrix[[r, c]] -= factor * matrix[[row, c]];
                }
            }
        }
        // Move to the next row and column
        row += 1;
        col += 1;
    }

    matrix
}

/// Get the rank of a matrix (Array2)
fn get_matrix_rank(arr: &Array2<f64>) -> usize {
    let m_rref = rref(arr);
    // Count rows with any non-zero values
    let rank = m_rref
        .rows()
        .into_iter()
        .map(|r| r.iter().any(|&v| v > 1e-10))
        .filter(|&v| v)
        .count();
    rank
}

fn inv_via_row_reduction(arr: &Array2<f64>) -> Array2<f64> {
    assert_square(arr);
    let size = arr.nrows();
    let eye = Array2::eye(size);
    let mut matrix: Array2<f64> = arr.clone();
    matrix = ndarray::concatenate(Axis(1), &[matrix.view(), eye.view()]).unwrap();
    let matrix_rref: Array2<f64> = rref(&matrix);
    matrix_rref.slice_move(s![.., size..(size * 2)])
}

fn gram_schmidt(a: &Array2<f64>) -> Array2<f64> {
    let (rows, cols) = a.dim();
    let mut q: Array2<f64> = Array2::zeros((rows, cols));

    for col in 0..cols {
        // Copy col from A to Q
        for row in 0..rows {
            q[[row, col]] = a[[row, col]];
        }
        // Get newly-copied col as slice
        let a_col = a.slice(s![.., col]);
        // Orthogonalize
        for inner_col in 0..col {
            let q_col = q.slice(s![.., inner_col]);
            let orth_res = (&a_col).dot(&q_col) / (&q_col).dot(&q_col) * &q_col;
            for (idx, val) in orth_res.iter().enumerate() {
                q[[idx, col]] = q[[idx, col]] - val;
            }
        }
        // Normalize
        let q_col_norm = vector_norm(&q.slice(s![.., col]).to_owned());
        for row in 0..rows {
            q[[row, col]] = q[[row, col]] / q_col_norm;
        }
    }

    q
}

fn gs_qr_decomp(a: &Array2<f64>) -> (Array2<f64>, Array2<f64>) {
    let q: Array2<f64> = gram_schmidt(a);
    let r: Array2<f64> = (|| {
        let m: Array2<f64> = (&q.t()).dot(a);
        m.triu(0)
    })();
    (q, r)
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

fn vector_vector_product() {
    let v1: Array1<f64> = round2(&std_norm_vec(6));
    let v2: Array1<f64> = round2(&std_norm_vec(6));

    let results = vec![
        format!("v1: {}", v1),
        format!("v2: {}", v2),
        // hadamard (element-wise) product
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

fn vector_length() {
    let v1: Array1<f64> = array![1.0, 2.0, 3.0];
    let length = vector_norm(&v1);

    let results = vec![format!("v1: {}", v1), format!("length: {}", length)];
    results.iter().for_each(|s| println!("{}", s));
}

fn vector_cross_product() {
    let v1: Array1<f64> = round2(&std_norm_vec(6));
    let v2: Array1<f64> = round2(&std_norm_vec(6));

    let results = vec![
        format!("v1: {}", v1),
        format!("v2: {}", v2),
        format!(
            "cross_product(&v1, &v2):\n{}",
            round2(&cross_product(&v1, &v2))
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn unit_vector() {
    let v1: Array1<f64> = array![1.0, 2.0, 3.0];
    let mu = 1.0 / vector_norm(&v1);
    let unit_v: Array1<f64> = &v1 * mu;

    let results = vec![
        format!("v1: {}", v1),
        format!("mu: {}", mu),
        format!("unit_v: {}", round2(&unit_v)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn matrix_scalar_arithmetic() {
    let m1: Array2<f64> = round2(&symmetric_square(3));

    let results = vec![
        format!("m1:\n{}", m1),
        format!("&m1 + 2.0:\n{}", round2(&(&m1 + 2.0))),
        format!("&m1 - 2.0:\n{}", round2(&(&m1 - 2.0))),
        format!("&m1 * 2.0:\n{}", &m1 * 2.0),
        format!("&m1 / 2.0:\n{}", &m1 / 2.0),
        format!("&m1.pow2():\n{}", round2(&(&m1.pow2()))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn matrix_vector_arithmetic() {
    let m1: Array2<f64> = round2(&symmetric_square(3));
    let v1: Array1<f64> = round2(&std_norm_vec(3));

    let results = vec![
        format!("m1:\n{}", m1),
        format!("v1:\n{}", v1),
        format!("&m1 + &v1:\n{}", round2(&(&m1 + &v1))),
        format!("&m1 - &v1:\n{}", round2(&(&m1 - &v1))),
        format!("&m1 * &v1:\n{}", round2(&(&m1 * &v1))),
        format!("&m1 / &v1:\n{}", round2(&(&m1 / &v1))),
        format!("&m1.dot(&v1):\n{}", round2(&(&m1.dot(&v1)))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn matrix_shift() {
    let m1: Array2<f64> = round2(&symmetric_square(3));
    let m2: Array2<f64> = Array::eye(3) * 2.0;

    assert_equal_dimensions(&m1, &m2);

    let results = vec![
        format!("m1:\n{}", m1),
        format!("m2:\n{}", m2),
        format!("&m1 + &m2:\n{}", round2(&(&m1 + &m2))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn transformation_matrices() {
    let m1: Array2<f64> = array![[1.0, -1.0], [2.0, 1.0]];
    let v1: Array1<f64> = array![3.0, -2.0];

    let results = vec![
        format!("m1:\n{}", m1),
        format!("v1:\n{}", v1),
        format!("&m1.dot(&v1.t()):\n{}", round2(&(&m1.dot(&v1.t())))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn transform_matrices_rotation() {
    let theta = PI / 2.0;
    let m1: Array2<f64> = round2(&array![
        [f64::cos(theta), -f64::sin(theta)],
        [f64::sin(theta), f64::cos(theta)]
    ]);
    let v1: Array1<f64> = array![3.0, -2.0];

    let results = vec![
        format!("theta: {}", theta),
        format!("m1:\n{}", m1),
        format!("v1:\n{}", v1),
        format!("&m1.dot(&v1.t()):\n{}", round2(&(&m1.dot(&v1.t())))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn matrix_matrix_arithmetic() {
    let m1: Array2<f64> = round2(&symmetric_square(3));
    let m2: Array2<f64> = round2(&symmetric_square(3));

    let results = vec![
        format!("m1:\n{}", m1),
        format!("m2:\n{}", m2),
        format!("&m1 + &m2:\n{}", round2(&(&m1 + &m2))),
        format!("&m1 - &m2:\n{}", round2(&(&m1 - &m2))),
        format!("&m1 * &m2:\n{}", round2(&(&m1 * &m2))),
        format!("&m1 / &m2:\n{}", round2(&(&m1 / &m2))),
        format!("&m1.dot(&m2.t()):\n{}", round2(&(&m1.dot(&m2.t())))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn matmul_order_of_operations() {
    let m1: Array2<f64> = round2(&symmetric_square(3));
    let m2: Array2<f64> = round2(&symmetric_square(3));
    let m3: Array2<f64> = round2(&symmetric_square(3));

    // A1 @ A2 @ A3
    // should equal
    // (A3.t @ A2.t @ A1.t).t

    let results = vec![
        format!("m1:\n{}", m1),
        format!("m2:\n{}", m2),
        format!("m3:\n{}", m3),
        format!(
            "&m1.dot(&m2).dot(&m3):\n{}",
            round2(&(&m1.dot(&m2).dot(&m3)))
        ),
        format!(
            "&m3.t().dot(&m2.t()).dot(&m3.t()):\n{}",
            round2(&(&m3.t().dot(&m2.t()).dot(&m1.t())))
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn multiplicative_symmetric_matrices() {
    let m1: Array2<f64> = random_square_matrix(3);

    let at_a: Array2<f64> = (&m1.t()).dot(&m1);
    let a_at: Array2<f64> = (&m1).dot(&m1.t());

    let results = vec![
        format!("m1:\n{}", round2(&m1)),
        format!("at_a:\n{}", round2(&at_a)),
        format!("a_at:\n{}", round2(&a_at)),
        // One is the negative of the other
        format!("&at_a - &a_at.t():\n{}", round2(&(&at_a - &a_at.t()))),
        format!("&a_at - &at_a.t():\n{}", round2(&(&a_at - &at_a.t()))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn frobenius_dot_product() {
    let m1: Array2<f64> = round2(&symmetric_square(3));
    let m2: Array2<f64> = round2(&symmetric_square(3));

    let results = vec![
        format!("m1:\n{}", m1),
        format!("m2:\n{}", m2),
        // Sum of hadamard product
        format!("(&m1 * &m2).sum():\n{}", (&m1 * &m2).sum()),
        // Dot product of vectorized matrices
        format!(
            "(&m1.flatten() * &m2.flatten()).sum():\n{}",
            (&m1.flatten() * &m2.flatten()).sum()
        ),
        // Trace of `At @ B`
        format!("trace(&m1.t().dot(&m2)):\n{}", trace(&m1.t().dot(&m2))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn matrix_rref() {
    let m1: Array2<f64> = array![[1.0, 2.0, -1.0], [2.0, 3.0, 1.0], [3.0, 3.0, 3.0],];
    let expected1: Array2<f64> = Array::eye(3);

    let m2: Array2<f64> = array![[2.0, 1.0, -1.0], [-3.0, -1.0, 2.0], [-2.0, 1.0, 2.0],];
    let expected2: Array2<f64> = Array::eye(3);

    let m3: Array2<f64> = random_square_matrix(3);
    let expected3: Array2<f64> = Array::eye(3);

    let m4: Array2<f64> = random_matrix(4, 3);
    let expected4: Array2<f64> = rect_eye(4, 3);

    let scenarios: Vec<(Array2<f64>, Array2<f64>)> = vec![
        (m1, expected1),
        (m2, expected2),
        (m3, expected3),
        (m4, expected4),
    ];
    for (i, (m, expected)) in scenarios.iter().enumerate() {
        println!("Scenario {}", i + 1);
        let rref_res: Array2<f64> = rref(m);
        let results = vec![
            format!("m:\n{}", m),
            format!("rref_res:\n{}", rref_res),
            format!("expected:\n{}", expected),
        ];
        results.iter().for_each(|s| println!("{}", s));
        assert_equal_ndarray(&rref_res, &expected);
    }
}

fn matrix_rank() {
    let m1: Array2<f64> = array![[1.0, 2.0, -1.0], [2.0, 3.0, 1.0], [3.0, 3.0, 3.0],];
    let m2: Array2<f64> = array![[2.0, 1.0, -1.0], [-3.0, -1.0, 2.0], [-2.0, 1.0, 2.0],];
    let m3: Array2<f64> = random_square_matrix(3);
    let m4: Array2<f64> = random_matrix(4, 3);

    let scenarios: Vec<Array2<f64>> = vec![m1, m2, m3, m4];
    for (i, m) in scenarios.iter().enumerate() {
        println!("Scenario {}", i + 1);
        let rref_res: Array2<f64> = rref(m);
        let rank = get_matrix_rank(m);
        let results = vec![
            format!("m:\n{}", m),
            format!("rref_res:\n{}", rref_res),
            format!("rank:\n{}", rank),
        ];
        results.iter().for_each(|s| println!("{}", s));
    }
}

fn rank_deficient_matrix() {
    // Max rank of mxn matrix is min(m,n)
    let m = 4;
    let n = 3;

    // Rank 3 (max rank is 3)
    let m1: Array2<f64> = random_matrix(m, n);

    // Rank 3 (one row is dependent)
    let mut m2: Array2<f64> = m1.clone();
    for i in 0..n {
        // Overwrite row 4 with row 3
        m2[[3, i]] = m2[[2, i]];
    }

    // Rank 2 (one col is dependent)
    let mut m3: Array2<f64> = m1.clone();
    for i in 0..m {
        // Overwrite col 3 with col 2
        m3[[i, 2]] = m3[[i, 1]];
    }

    // Rank 3 (restore with noise)
    let mut m4: Array2<f64> = m3.clone();
    m4 = &m4 + &random_matrix(m, n) * 0.01;

    // Rank 3 (restore with shift)
    let mut m5: Array2<f64> = m3.clone();
    m5 += &rect_eye(m, n);

    let scenarios: Vec<Array2<f64>> = vec![m1, m2, m3, m4, m5];
    for (i, m) in scenarios.iter().enumerate() {
        println!("Scenario {}", i + 1);
        let rref_res: Array2<f64> = rref(m);
        let rank = get_matrix_rank(m);
        let results = vec![
            format!("m:\n{}", round2(m)),
            format!("m.dim():\n{:?}", m.dim()),
            format!("rref_res:\n{}", rref_res),
            format!("rank:\n{}", rank),
        ];
        results.iter().for_each(|s| println!("{}", s));
    }
}

fn matrix_inverse() {
    let m: Array2<f64> = random_square_matrix(3);
    let rank = get_matrix_rank(&m);
    let m_inv: Array2<f64> = m.inv().unwrap();
    let eye = &m.dot(&m_inv);

    let results = vec![
        format!("m:\n{}", round2(&m)),
        format!("rank:\n{}", rank),
        format!("m_inv:\n{}", round2(&m_inv)),
        format!("eye:\n{}", round2(&eye)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn matrix_inv_row_reduction() {
    let m: Array2<f64> = random_square_matrix(3);
    let m_inv: Array2<f64> = inv_via_row_reduction(&m);
    let eye: Array2<f64> = (&m).dot(&m_inv);

    let results = vec![
        format!("m:\n{}", round2(&m)),
        format!("m_inv:\n{}", round2(&m_inv)),
        format!("eye:\n{}", round2(&eye)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn one_sided_inverse() {
    // Tall 6x3
    let m: Array2<f64> = random_matrix(6, 3);
    // Square 3x3
    let mt_m = (&m.t()).dot(&m);
    // Square 6x6
    let m_mt = (&m).dot(&m.t());

    // Tall: use left inverse
    // Wide: use right inverse

    // Left inverse: `inv(At_A) @ A.T`
    let m_left_inv = (&inv_via_row_reduction(&mt_m)).dot(&m.t());
    // Right inverse: `A.T @ inv(A_At)`
    let m_right_inv = (&m.t()).dot(&inv_via_row_reduction(&m_mt));

    // Identity matrix (use left inverse for tall matrices)
    let left_check = (&m_left_inv).dot(&m);
    // NOT identity matrix (use right inverse for wide matrices)
    let right_check = (&m).dot(&m_right_inv);

    let results = vec![
        format!("m:\n{}", round2(&m)),
        format!("mt_m:\n{}", round2(&mt_m)),
        format!("m_mt:\n{}", round2(&m_mt)),
        format!("m_left_inv:\n{}", round2(&m_left_inv)),
        format!("m_right_inv:\n{}", round2(&m_right_inv)),
        format!("left_check:\n{}", round2(&left_check)),
        format!("right_check:\n{}", round2(&right_check)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn r2_projections() {
    // Line `v`, point `p`, scalar `c` (beta)
    let v: Array1<f64> = array![2., 5.];
    let p: Array1<f64> = array![4., 1.];
    let c = (&v.t()).dot(&p) / (&v.t()).dot(&v);

    // Should be 0.0
    let res = (&v.t()).dot(&(&p - &v * c));

    let results = vec![
        format!("v:\n{}", &v),
        format!("p:\n{}", &p),
        format!("c:\n{}", round(c, 2)),
        format!("res:\n{}", round(res, 2)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn qr_decomposition() {
    let m: Array2<f64> = array![[1., 0.], [1., 0.], [0., 1.]];
    let (q, r) = (&m).qr().unwrap();

    let results = vec![
        format!("m:\n{}", round2(&m)),
        format!("q:\n{}", round2(&q)),
        format!("r:\n{}", round2(&r)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn qr_decomposition_2() {
    // A = QR
    // AtA = RtR

    let m: Array2<f64> = random_matrix(4, 3);
    let (q, r) = (&m).qr().unwrap();

    let mt_m = (&m.t()).dot(&m);
    let rt_r = (&r.t()).dot(&r);

    let results = vec![
        format!("m:\n{}", round2(&m)),
        format!("q:\n{}", round2(&q)),
        format!("r:\n{}", round2(&r)),
        format!("mt_m:\n{}", round2(&mt_m)),
        format!("rt_r:\n{}", round2(&rt_r)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn qr_gram_schmidt() {
    let m: Array2<f64> = random_matrix(4, 3);
    let (q1, r1) = (&m).qr().unwrap();
    let (q2, r2) = gs_qr_decomp(&m);

    let results = vec![
        format!("m:\n{}", round2(&m)),
        // Built-in QR
        format!("q1:\n{}", round2(&q1)),
        format!("r1:\n{}", round2(&r1)),
        // Gram-Schmidt QR
        format!("q2:\n{}", round2(&q2)),
        format!("r2:\n{}", round2(&r2)),
        format!("(&q2).dot(&r2):\n{}", round2(&(&q2).dot(&r2))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn qr_decomp_inverse() {
    // Inverse via QR decomposition
    // A = QR
    // inv(A) = inv(QR)
    // inv(A) = inv(R) @ Qt

    let a: Array2<f64> = random_square_matrix(3);
    let (q, r) = (&a).qr().unwrap();
    let a_inv: Array2<f64> = (&r.inv().unwrap()).dot(&q.t());
    let eye = (&a).dot(&a_inv);

    let results = vec![
        format!("a:\n{}", round2(&a)),
        format!("q:\n{}", round2(&q)),
        format!("r:\n{}", round2(&r)),
        format!("a_inv:\n{}", round2(&a_inv)),
        format!("eye:\n{}", round2(&eye)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn least_squares_row_reduction() {
    // ...
}
