mod utils;
use utils::calculator::{add, divide, get_mean, get_product, get_std, get_sum, multiply, subtract};

fn main() {
    let add_i32_result = add(1, 2);
    let add_f64_result = add(1.0, 2.0);

    let subtract_i32_result = subtract(1, 2);
    let subtract_f64_result = subtract(1.0, 2.0);

    let multiply_i32_result = multiply(1, 2);
    let multiply_f64_result = multiply(1.0, 2.0);

    let divide_i32_result = divide(1, 2);
    let divide_f64_result = divide(1.0, 2.0);

    let get_sum_i32_result = get_sum(&vec![1, 2, 3, 4, 5]);
    let get_sum_f64_result = get_sum(&vec![1.0, 2.0, 3.0, 4.0, 5.0]);

    let get_product_i32_result = get_product(&vec![1, 2, 3, 4, 5]);
    let get_product_f64_result = get_product(&vec![1.0, 2.0, 3.0, 4.0, 5.0]);

    let get_mean_i32_result = get_mean(&vec![1, 2, 3, 4, 5]);
    let get_mean_f64_result = get_mean(&vec![1.0, 2.0, 3.0, 4.0, 5.0]);

    let get_std_i32_result = get_std(&vec![1, 2, 3, 4], false);
    let get_std_f64_result = get_std(&vec![1.0, 2.0, 3.0, 4.0], false);
    let get_std_complete_result = get_std(&vec![1.0, 2.0, 3.0, 4.0], true);

    // Explicit with type
    let _add_result_with_type = add::<i32>(1, 2);

    println!("add_i32_result: {}", add_i32_result);
    println!("add_f64_result: {}", add_f64_result);
    println!("subtract_i32_result: {}", subtract_i32_result);
    println!("subtract_f64_result: {}", subtract_f64_result);
    println!("multiply_i32_result: {}", multiply_i32_result);
    println!("multiply_f64_result: {}", multiply_f64_result);
    println!("divide_i32_result: {}", divide_i32_result);
    println!("divide_f64_result: {}", divide_f64_result);
    println!("get_sum_i32_result: {}", get_sum_i32_result);
    println!("get_sum_f64_result: {}", get_sum_f64_result);
    println!("get_product_i32_result: {}", get_product_i32_result);
    println!("get_product_f64_result: {}", get_product_f64_result);
    println!("get_mean_i32_result: {}", get_mean_i32_result);
    println!("get_mean_f64_result: {}", get_mean_f64_result);
    println!("get_std_i32_result: {}", get_std_i32_result);
    println!("get_std_f64_result: {}", get_std_f64_result);
    println!("get_std_complete_result: {}", get_std_complete_result);
}

#[cfg(test)]
mod tests;
