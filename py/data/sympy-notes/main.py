"""sympy notes."""

# pylint: disable=C0103

import math
from typing import cast

import numpy as np
import sympy
from sympy.ntheory.generate import composite, primorial

# ---
# Constants
# ---

# ...

# ---
# Main
# ---


def main():
    """Run sympy examples."""
    examples = {
        "sympy latex basics": _sympy_latex_basics,
        "sympy expressions": _sympy_polynomials,
        "sympy substitution": _sympy_substitution,
        "sympy number theory": _sympy_number_theory,
        "sympy solve algebra": _sympy_solve_algebra,
        "sympy solve inequalities": _sympy_solve_inequalities,
        "sympy complex numbers": _sympy_complex_numbers,
        "sympy complex quadratics": _sympy_complex_quadratics,
        "sympy function inverse": _sympy_function_inverse,
        "sympy derivative": _sympy_derivative,
        "sympy integral": _sympy_integral,
    }

    for title, example_fn in examples.items():
        print_section_title(title)
        example_fn()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print("\n# ---")
    print(f"# {string.upper()}")
    print("# ---\n")


def pretty_print_results(results: dict) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        print(k, type(v), v, sep="\n")
        print()


# ---
# Examples
# ---


def _sympy_latex_basics():
    def _get_integral_expression():
        x = sympy.symbols("x")
        expression = sympy.Integral(x**2, x)
        latex_expression = sympy.latex(expression)
        return latex_expression

    def _get_fraction_expression():
        x = sympy.symbols("x")
        Int = sympy.Integer
        expression = Int(1) / sympy.sqrt(x ** Int(2) + Int(1))  # type: ignore [reportOperatorIssue]
        latex_expression = sympy.latex(expression)
        return latex_expression

    def _get_greek_expression():
        # A = U @ Sigma @ V.T
        A, U, Sigma, Vt = sympy.symbols(
            "A U Sigma V^T",
            commutative=False,  # Prevents reordering of variables
        )
        expression = sympy.Eq(A, U * Sigma * Vt)
        latex_expression = sympy.latex(expression)
        return latex_expression

    integral_expression = _get_integral_expression()
    fraction_expression = _get_fraction_expression()
    greek_expression = _get_greek_expression()

    pretty_print_results(
        {
            "integral_expression": integral_expression,
            "fraction_expression": fraction_expression,
            "greek_expression": greek_expression,
        }
    )


def _sympy_polynomials():
    a, b, c, d, x = sympy.symbols("a b c d x")

    exp1 = x**2 + 2 * x + 1
    exp2 = 2 * x**2 + 5 * x + 2
    exp3 = x**5 + 1

    sympy.factor(exp2)

    pretty_print_results(
        {
            "exp1": exp1,
            "exp2": exp2,
            "exp3": exp3,
            "exp1 + exp2": exp1 + exp2,
            "a * (b * c) - (a * b) * c": a * (b * c) - (a * b) * c,
            "sympy.expand((a + b) * (c + d))": sympy.expand((a + b) * (c + d)),
            "sympy.expand(exp1 * exp2)": sympy.expand(exp1 * exp2),
            "sympy.Poly(exp3).degree()": sympy.Poly(exp3).degree(),
            "sympy.factor(exp2)": sympy.factor(exp2),
        }
    )


def _sympy_substitution():
    x = sympy.symbols("x")
    Int = sympy.Integer
    expression = Int(2) * x + Int(1)
    values = {x: 2}
    pretty_print_results(
        {
            "expression": expression,
            "values": values,
            "expression.subs(values)": expression.subs(values),
        }
    )


def _sympy_number_theory():
    def factors(number: int) -> list[int]:
        """Get the factors of an integer number."""
        values = [v for v in range(2, number // 2 + 1) if number % v == 0]
        return [1, *values, number]

    pretty_print_results(
        {
            # Factors
            "factors(24)": factors(24),
            "math.gcd(24, 30)": math.gcd(24, 30),
            "math.lcm(24, 30)": math.lcm(24, 30),
            # Primes
            "primorial(5)": primorial(5),
            "composite(5)": composite(5),
            "sympy.nextprime(24)": sympy.nextprime(24),
            "sympy.prevprime(24)": sympy.prevprime(24),
        }
    )


def _sympy_solve_algebra():
    x, y = sympy.symbols("x y")
    Int = sympy.Integer

    # One variable
    exp1 = x ** Int(2) - Int(1)
    # Two variables
    exp2 = x * y + 2

    pretty_print_results(
        {
            "exp1": exp1,
            "sympy.solve(exp1, x)": sympy.solve(exp1, x),
            "exp2": exp2,
            "sympy.solve(exp2, x)": sympy.solve(exp2, x),
            "sympy.solve(exp2, y)": sympy.solve(exp2, y),
            "sympy.solve(exp2.subs({x: 1}), y)": sympy.solve(exp2.subs({x: 1}), y),
        }
    )


def _sympy_solve_inequalities():
    a, b, c, x = sympy.symbols("a b c x")
    Int = sympy.Integer

    expression = a * x > b ** Int(2) / c

    pretty_print_results(
        {
            "expression": expression,
            # Not enough information, can't solve
            "sympy.solve(expression, x)": sympy.solve(expression, x),
        }
    )


def _sympy_complex_numbers():
    i = sympy.I
    Int = sympy.Integer

    sympy_complex_number = Int(3) + 2 * i

    num1 = 3 + 4j
    num2 = complex(2, 3)
    complex_numbers = [num1, num2]
    complex_tuples = [(np.real(n), np.imag(n)) for n in complex_numbers]

    pretty_print_results(
        {
            "sympy_complex_number": sympy_complex_number,
            "num1": num1,
            "num2": num2,
            "complex_numbers": complex_numbers,
            "complex_tuples": complex_tuples,
            "num1 + num2": num1 + num2,
            "num1 - num2": num1 - num2,
            "num1 * num2": num1 * num2,
            "num1 / num2": num1 / num2,
        }
    )


def _sympy_complex_quadratics():
    x = sympy.symbols("x")

    def quadratic(a: int, b: int, c: int) -> tuple[float, float]:
        discriminant = b**2 - 4 * a * c
        mid = np.lib.scimath.sqrt(discriminant)
        v1 = (-b - mid) / (2 * a)
        v2 = (-b + mid) / (2 * a)
        return v1, v2

    poly_expr = x**2 + 9
    coefficients = cast(
        tuple[int, int, int],
        sympy.Poly(poly_expr).all_coeffs(),  # 1, 0, 9
    )
    solutions = quadratic(*coefficients)

    pretty_print_results(
        {
            # Quadratic (sympy)
            "poly_expr": poly_expr,
            "coefficients": coefficients,
            "solutions": solutions,
            # Quadratic (numpy)
            "np.roots(coefficients)": np.roots(coefficients),
        }
    )


def _sympy_function_inverse():
    x, y = sympy.symbols("x y")

    f_of_x = (x + 2) ** 2 - 1
    switched = f_of_x.subs({x: y})
    equality = sympy.Eq(x, switched)
    inverses = sympy.solve(equality, y)

    # `f(x)` such that `f(f_inv(x)) == x`
    # `x |> f_inv |> f` should be `x`
    inverse_checks = [f_of_x.subs(x, inverse) for inverse in inverses]

    pretty_print_results(
        {
            "f_of_x": f_of_x,
            "inverses": inverses,
            "inverse_checks": inverse_checks,
        }
    )


def _sympy_derivative():
    x = sympy.symbols("x")
    f_of_x = x**3 - 3 * x  # x**2
    f_prime_of_x = sympy.diff(f_of_x)
    critical_points = sympy.solve(f_prime_of_x, x)
    f_double_prime_of_x = sympy.diff(f_prime_of_x)
    inflection_points = sympy.solve(f_double_prime_of_x, x)

    pretty_print_results(
        {
            "f_of_x": f_of_x,
            "f_prime_of_x": f_prime_of_x,
            "f_double_prime_of_x": f_double_prime_of_x,
            # Critical points (maximum/minimum, point where slope is zero)
            "critical_points": critical_points,
            # Inflection points (concave up/down switch, point where acceleration is 0)
            "inflection_points": inflection_points,
        }
    )


def _sympy_integral():
    x = sympy.symbols("x")
    f_of_x = 2 * x
    indefinite_integral = sympy.integrate(f_of_x, x)
    definite_integral = sympy.integrate(f_of_x, (x, 0, 3))

    pretty_print_results(
        {
            "f_of_x": f_of_x,
            "indefinite_integral": indefinite_integral,
            "definite_integral": definite_integral,
        }
    )


# TODO: sympy.Piecewise, sympy.limit, sympy.Matrix

# ---
# Run
# ---

main()
