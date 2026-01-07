from testing import assert_equal, TestSuite, assert_almost_equal
from result import Result

# ---
# Types
# ---

comptime ResF64 = Result[Float64, Error]
comptime ResF64Str = Result[Float64, String]

# ---
# Utils
# ---


fn divide(n1: Float64, n2: Float64) -> ResF64:
    if n2 == 0.0:
        error = Error("Cannot divide by 0")
        return ResF64.err(error^)
    value = n1 / n2
    return ResF64.ok(value)


fn invert(number: Float64) -> ResF64:
    if number == 0.0:
        error = Error("Cannot divide by 0")
        return ResF64.err(error^)
    value = 1 / number
    return ResF64.ok(value)


fn square(number: Float64) -> Float64:
    return number**2


fn yell_error(err: Error) -> String:
    return repr(err).upper()


# ---
# Tests
# ---


fn test_result() raises -> None:
    n1 = 3.0
    n2 = 2.0
    n3 = 0.0

    res_ok = divide(n1, n2)
    res_ok_exp = ResF64.ok(1.5)
    assert_almost_equal(
        res_ok.unwrap(),
        res_ok_exp.unwrap(),
    )

    res_err = divide(n1, n3)
    res_err_exp = ResF64.err(Error("Cannot divide by 0"))
    assert_equal(
        repr(res_err.unwrap_err()),
        repr(res_err_exp.unwrap_err()),
    )

    res_ok_sq = res_ok.map(square)
    res_ok_sq_exp = ResF64.ok(2.25)
    assert_almost_equal(
        res_ok_sq.unwrap(),
        res_ok_sq_exp.unwrap(),
    )

    res_ok_inv = res_ok.and_then(invert)
    res_ok_inv_exp = ResF64.ok(0.6666666)
    assert_almost_equal(
        res_ok_inv.unwrap(),
        res_ok_inv_exp.unwrap(),
    )

    loud_err = res_err.map_err(yell_error)
    loud_err_exp = ResF64Str.err("ERROR('CANNOT DIVIDE BY 0')")
    assert_equal(
        loud_err.unwrap_err(),
        loud_err_exp.unwrap_err(),
    )


# ---
# Main
# ---


def main():
    TestSuite.discover_tests[__functions_in_module()]().run()
