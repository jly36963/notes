use num;

// ---
// Basic
// ---

/// Adds two numbers
pub fn add<T>(a: T, b: T) -> T
where
    T: std::ops::Add<T, Output = T>,
{
    return a + b;
}

/// Subtracts two numbers
pub fn subtract<T>(a: T, b: T) -> T
where
    T: std::ops::Sub<T, Output = T>,
{
    return a - b;
}

/// Multiplies two numbers
pub fn multiply<T>(a: T, b: T) -> T
where
    T: std::ops::Mul<T, Output = T>,
{
    return a * b;
}

/// Divides two numbers
pub fn divide<T>(a: T, b: T) -> f64
where
    T: std::ops::Div<T, Output = T> + std::convert::Into<f64>,
{
    return a.into() / b.into();
}

// ---
// Aggregations
// ---

/// Gets the sum of a slice of numbers
pub fn get_sum<T>(numbers: &[T]) -> T
where
    T: std::ops::Add<T, Output = T> + num::Zero + Copy,
{
    numbers.into_iter().fold(T::zero(), |acc, &curr| acc + curr)
}

/// Gets the product of a slice of numbers
pub fn get_product<T>(numbers: &[T]) -> T
where
    T: std::ops::Mul<T, Output = T> + num::One + Copy,
{
    numbers.into_iter().fold(T::one(), |acc, &curr| acc * curr)
}

/// Gets the mean of a slice of numbers
pub fn get_mean<T>(numbers: &[T]) -> f64
where
    T: std::ops::Mul<T, Output = T> + num::Zero + Copy + std::convert::Into<f64>,
{
    let length = numbers.len();
    if length == 0 {
        return std::f64::NAN;
    }
    let sum = get_sum(numbers);
    let mean = sum.into() / length as f64;
    mean
}

/// Gets the std of a slice of numbers
pub fn get_std<T>(numbers: &[T], complete_sample: bool) -> f64
where
    T: std::ops::Mul<T, Output = T> + num::Zero + Copy + std::convert::Into<f64>,
{
    let length = numbers.len();
    if length == 0 {
        return std::f64::NAN;
    }
    let mean = get_mean(numbers);
    let sum_of_squared_diffs: f64 = numbers
        .into_iter()
        .fold(0_f64, |acc, &curr| acc + (curr.into() - mean).powf(2.0));
    let mut population_size = length;
    if !complete_sample {
        population_size = population_size - 1;
    }
    let std = (sum_of_squared_diffs / population_size as f64).sqrt();
    std
}
