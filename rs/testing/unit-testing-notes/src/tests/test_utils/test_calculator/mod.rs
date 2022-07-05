use crate::utils::calculator::{
    add, divide, get_mean, get_product, get_std, get_sum, multiply, subtract,
};

#[test]
fn test_add() {
    let result = add(1, 2);
    let expected = 3;
    assert_eq!(result, expected);
}

#[test]
fn test_subtract() {
    let result = subtract(1, 2);
    let expected = -1;
    assert_eq!(result, expected);
}

#[test]
fn test_multiply() {
    let result = multiply(1, 2);
    let expected = 2;
    assert_eq!(result, expected);
}

#[test]
fn test_divide() {
    let result = divide(1, 2);
    let expected = 0.5;
    assert_eq!(result, expected);
}

#[test]
fn test_get_sum() {
    let result = get_sum(&vec![1, 2, 3, 4, 5]);
    let expected = 15;
    assert_eq!(result, expected);
}

#[test]
fn test_get_product() {
    let result = get_product(&vec![1, 2, 3, 4, 5]);
    let expected = 120;
    assert_eq!(result, expected);
}

#[test]
fn test_get_mean() {
    let result = get_mean(&vec![1, 2, 3, 4, 5]);
    let expected = 3.0;
    assert_eq!(result, expected);
}

#[test]
fn test_get_std1() {
    let result = get_std(&vec![1, 2, 3, 4], false);
    let expected = 1.2909944487358056;
    assert!(result - expected < 0.000001);
}

#[test]
fn test_get_std2() {
    let result = get_std(&vec![1, 2, 3, 4], true);
    let expected = 1.118033988749895;
    assert!(result - expected < 0.000001);
}
