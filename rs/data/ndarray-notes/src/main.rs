#![allow(non_snake_case)]

use ndarray::{array, Array, Array1, Array2, Axis};
use ndarray_rand::rand_distr::{
    Bernoulli, Binomial, Exp, Geometric, Normal, Poisson, Standard, StandardNormal, Uniform,
};
use ndarray_rand::RandomExt;
use num::Float;

// ---
// Main
// ---

fn main() {
    // ndarray
    print_section_header(String::from("array creation"));
    basic_array_creation();
    print_section_header(String::from("distributions"));
    basic_distributions();
    print_section_header(String::from("array shape"));
    basic_array_shape();
    print_section_header(String::from("square array"));
    basic_square_array();
    print_section_header(String::from("array selection"));
    basic_array_selection();
    print_section_header(String::from("array iter"));
    basic_array_iter();

    // linalg
    print_section_header(String::from("basic vector-scalar arithmetic"));
    basic_vector_scalar_arithmetic();
    print_section_header(String::from("basic vector-vector arithmetic"));
    basic_vector_vector_arithmetic();
}

// ---
// Utils
// ---

pub fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

fn round<T>(float: T, precision: u32) -> T
where
    T: Float + std::convert::From<i32>,
{
    let places = 10_i32.pow(precision);
    (float * places.into()).round() / places.into()
}

fn symmetric_square(n: usize) -> Array2<f64> {
    let arr: Array2<f64> = Array::random((n, n), StandardNormal {});
    arr.clone().t().dot(&arr)
}

// ---
// Examples (ndarray)
// ---

fn basic_array_creation() {
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

fn basic_distributions() {
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
        format!("std_norm_array: {}", std_norm_array.map(|&n| round(n, 2))),
        format!("normal_array: {}", normal_array.map(|&n| round(n, 2))),
        format!("std_array: {}", std_array.map(|&n| round(n, 2))),
        format!("uniform_array: {}", uniform_array.map(|&n| round(n, 2))),
        format!("bernoulli_array: {}", bernoulli_array),
        format!("binomial_array: {}", binomial_array),
        format!("poisson_array: {}", poisson_array),
        format!("geometric_array: {}", geometric_array),
        format!("exp_array: {}", exp_array.map(|&n| round(n, 2))),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_array_shape() {
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

fn basic_square_array() {
    let arr: Array2<f64> = symmetric_square(3).map(|&n| round(n, 2));

    let diag_matrix: Array2<i32> = Array::from_diag(&array![1, 2, 3]);
    let identity_matrix: Array2<i32> = Array::eye(3);

    let results = vec![
        format!("arr:\n{:?}", arr),
        format!("arr.tril(0):\n{:?}", arr.tril(0)),
        format!("arr.triu(0):\n{:?}", arr.triu(0)),
        format!("identity_matrix:\n{}", identity_matrix),
        format!("diag_matrix:\n{}", diag_matrix),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_array_selection() {
    let arr: Array2<f64> = symmetric_square(3).map(|&n| round(n, 2));

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
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_array_iter() {
    let arr: Array2<f64> = symmetric_square(3).map(|&n| round(n, 2));

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

// ---
// Examples (linalg)
// ---

fn basic_vector_scalar_arithmetic() {
    // Vector `v`, scalar `c`
    let v: Array1<i32> = array![3, -1];
    let c: i32 = 2;

    let results = vec![
        format!("v: {}", v),
        format!("c: {}", c),
        format!("v.clone() + c: {}", v.clone() + c),
        format!("v.clone() - c: {}", v.clone() - c),
        format!("v.clone() * c: {}", v.clone() * c),
        format!("v.clone() / c: {}", v.clone() / c),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn basic_vector_vector_arithmetic() {
    // Vector `v`, scalar `c`
    let v1: Array1<i32> = array![3, -1];
    let v2: Array1<i32> = array![2, 4];

    let results = vec![
        format!("v1: {}", v1),
        format!("v2: {}", v2),
        format!("v1.clone() + v2.clone(): {}", v1.clone() + v2.clone()),
        format!("v1.clone() - v2.clone(): {}", v1.clone() - v2.clone()),
        format!("v1.clone() * v2.clone(): {}", v1.clone() * v2.clone()),
        format!("v1.clone() / v2.clone(): {}", v1.clone() / v2.clone()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}
