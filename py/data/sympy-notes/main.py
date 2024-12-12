"""sympy notes."""

# pylint: disable=C0103

import math
from typing import TYPE_CHECKING, Any, Callable, cast  # noqa: UP035

import numpy as np
import sympy
import sympy.utilities
from sympy.ntheory.generate import composite, primorial
from sympy.utilities.lambdify import lambdify

if TYPE_CHECKING:
    from sympy.core.symbol import Symbol

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
        "latex basics": _latex_basics,
        "substitution": _substitution,
        "polynomials": _polynomials,
        "powers": _powers,
        "lambdify": _lambdify,
        "function composition": _function_composition,
        "function inverse": _function_inverse,
        "discontinuity": _discontinuity,
        "piecewise functions": _piecewise_functions,
        "number theory": _number_theory,
        "solve algebra": _solve_algebra,
        "solve inequalities": _solve_inequalities,
        "complex numbers": _complex_numbers,
        "complex quadratics": _complex_quadratics,
        "mean value theorem": _mean_value_theorem,
        "derivative polynomials": _derivative_polynomials,
        "derivative trig": _derivative_trig,
        "derivative exponential": _derivative_exponential,
        "derivative product": _derivative_product,
        "derivative quotient": _derivative_quotient,
        "derivative chain": _derivative_chain,
        "integral": _integral,
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


def _get_common_trig_values() -> list:
    pi = sympy.pi
    negative_values = [-pi, -pi / 2, -pi / 3, -pi / 4, -pi / 6]
    positive_values = [pi / 6, pi / 4, pi / 3, pi / 2, pi]
    all_values = [*negative_values, 0, *positive_values]
    return all_values


# ---
# Examples
# ---


def _latex_basics():
    def _get_integral_expression():
        x: Symbol = sympy.symbols("x")
        expression = sympy.Integral(x**2, x)
        latex_expression = sympy.latex(expression)
        return latex_expression

    def _get_fraction_expression():
        x: Symbol = sympy.symbols("x")
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

    def _get_trig_expression():
        t = sympy.symbols("theta")
        expression = sympy.Eq(1, sympy.sin(t) ** 2 + sympy.cos(t) ** 2)  # type: ignore [reportOperatorIssue]
        latex_expression = sympy.latex(expression)
        return latex_expression

    def _get_derivative_expression():
        x, y_prime = sympy.symbols("x yprime")
        expression = sympy.Eq(y_prime, 2 * x + 2)
        latex_expression = sympy.latex(expression)
        return latex_expression

    integral_expression = _get_integral_expression()
    fraction_expression = _get_fraction_expression()
    greek_expression = _get_greek_expression()
    trig_expression = _get_trig_expression()
    derivative_expression = _get_derivative_expression()

    # Modifiers: prime, hat, check, tilde, acute, grave, dot, ddot, breve, bar, vec

    pretty_print_results(
        {
            "integral_expression": integral_expression,
            "fraction_expression": fraction_expression,
            "greek_expression": greek_expression,
            "trig_expression": trig_expression,
            "derivative_expression": derivative_expression,
        }
    )


def _substitution():
    x: Symbol = sympy.symbols("x")
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


def _polynomials():
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


def _powers():
    a, b, x = sympy.symbols("a b x")
    exp1 = x**a
    exp2 = x**b
    product = exp1 * exp2
    quotient = exp1 / exp2

    pretty_print_results(
        {
            "exp1": exp1,
            "exp2": exp2,
            # product
            "product": product,
            "product.subs({a: 4, b: 2, x: 2})": product.subs({a: 4, b: 2, x: 2}),
            "sympy.simplify(product)": sympy.simplify(product),
            # quotient
            "quotient": quotient,
            "sympy.simplify(quotient)": sympy.simplify(quotient),
            "quotient.subs({a: 4, b: 2, x: 2})": quotient.subs({a: 4, b: 2, x: 2}),
        }
    )


def _lambdify():
    x: Symbol = sympy.symbols("x")
    Int = sympy.Integer
    expression = Int(2) * x + Int(1)
    func = cast(
        Callable[[Any], Any],
        lambdify(x, expression, modules=["numpy"]),
    )

    values: np.ndarray = np.arange(1, 6)
    results = func(values)

    pretty_print_results(
        {
            "expression": expression,
            "func": func,
            "values": values,
            "results": results,
        }
    )


def _function_composition():
    x: Symbol = sympy.symbols("x")

    def f(x):
        return 2 * x + 1

    def g(x):
        return x**2 + 2

    pretty_print_results(
        {
            "x": x,
            "f(x)": f(x),
            "g(x)": g(x),
            "f(g(x))": f(g(x)),
            "g(f(x))": g(f(x)),
            "f(g(x)).subs({x: 1})": f(g(x)).subs({x: 1}),
            "g(f(x)).subs({x: 1})": g(f(x)).subs({x: 1}),
        }
    )


def _function_inverse():
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


def _discontinuity():
    x: Symbol = sympy.symbols("x")
    Int = sympy.Integer

    func_expr = Int(1) / x  # type: ignore [reportOperatorIssue]
    inputs = list(range(-3, 4))
    results = [func_expr.subs({x: n}) for n in inputs]

    pretty_print_results(
        {
            "func_expr": func_expr,
            "inputs": inputs,
            "results": results,
        }
    )


def _piecewise_functions():
    x: Symbol = sympy.symbols("x")
    Int = sympy.Integer

    func = sympy.Piecewise(
        (x, x <= Int(0)),
        (x**2, x > Int(0)),
    )
    inputs = list(range(-3, 4))
    results = [func.subs({x: n}) for n in inputs]

    pretty_print_results(
        {
            "func": func,
            "inputs": inputs,
            "results": results,
        }
    )


def _number_theory():
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


def _solve_algebra():
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


def _solve_inequalities():
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


def _complex_numbers():
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


def _complex_quadratics():
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


def _mean_value_theorem():
    x = sympy.symbols("x")
    f_of_x = x**2

    x1 = 0
    x2 = 2
    y1 = f_of_x.subs({x: x1})
    y2 = f_of_x.subs({x: x2})

    avg_rate_of_change = y2 - y1 / x2 - x1

    # f'(c) = (f(b) - f(a)) / (b - a)
    # f'(x) = `(f(x + h) - f(x)) / h` as h approaches 0
    # d/dx(x^2) = x^2 + 2xh + h^2 - x^2 / h = (2xh + h^2) / h = 2x + h
    # as h approaches 0, d/dx(x^2) = 2x

    pretty_print_results(
        {
            "f_of_x": f_of_x,
            "x1": x1,
            "x2": x2,
            "y1": y1,
            "y2": y2,
            "avg_rate_of_change": avg_rate_of_change,
        }
    )


def _derivative_polynomials():
    x = sympy.symbols("x")
    values = list(range(-3, 4))

    f_of_x = x**3 - 3 * x  # x**2
    f_of_x_results = [f_of_x.subs({x: n}) for n in values]

    # Power rule
    # d/dx(x^n) = n * x^(n-1)
    f_prime_of_x = sympy.diff(f_of_x)
    f_prime_of_x_results = [f_prime_of_x.subs({x: n}) for n in values]
    # Critical points (maximum/minimum, point where slope is zero)
    critical_points = sympy.solve(f_prime_of_x, x)

    f_double_prime_of_x = sympy.diff(f_prime_of_x)
    f_double_prime_of_x_results = [f_double_prime_of_x.subs({x: n}) for n in values]
    # Inflection points (concave up/down switch, point where acceleration is 0)
    inflection_points = sympy.solve(f_double_prime_of_x, x)

    pretty_print_results(
        {
            "values": values,
            # Function
            "f_of_x": f_of_x,
            "f_of_x_results": f_of_x_results,
            # First derivative
            "f_prime_of_x": f_prime_of_x,
            "f_prime_of_x_results": f_prime_of_x_results,
            "critical_points": critical_points,
            # Second derivative
            "f_double_prime_of_x": f_double_prime_of_x,
            "f_double_prime_of_x_results": f_double_prime_of_x_results,
            "inflection_points": inflection_points,
        }
    )


def _derivative_trig():
    x = sympy.symbols("x")
    values = _get_common_trig_values()

    f_of_x = sympy.sin(x)
    f_of_x_results = [f_of_x.subs({x: n}) for n in values]

    f_prime_of_x = sympy.diff(f_of_x)
    f_prime_of_x_results = [f_prime_of_x.subs({x: n}) for n in values]

    f_double_prime_of_x = sympy.diff(f_prime_of_x)
    f_double_prime_of_x_results = [f_double_prime_of_x.subs({x: n}) for n in values]

    pretty_print_results(
        {
            "f_of_x": f_of_x,
            "f_of_x_results": f_of_x_results,
            "f_prime_of_x": f_prime_of_x,
            "f_prime_of_x_results": f_prime_of_x_results,
            "f_double_prime_of_x": f_double_prime_of_x,
            "f_double_prime_of_x_results": f_double_prime_of_x_results,
        }
    )


def _derivative_exponential():
    x = sympy.symbols("x")
    values = list(range(-3, 4))

    func_expressions = [2**x, sympy.E**x, x**x]

    for f_of_x in func_expressions:
        f_of_x_results = [f_of_x.subs({x: n}) for n in values]

        f_prime_of_x = sympy.diff(f_of_x)
        f_prime_of_x_results = [f_prime_of_x.subs({x: n}) for n in values]

        f_double_prime_of_x = sympy.diff(f_prime_of_x)
        f_double_prime_of_x_results = [f_double_prime_of_x.subs({x: n}) for n in values]

        pretty_print_results(
            {
                "f_of_x": f_of_x,
                "f_of_x_results": f_of_x_results,
                "f_prime_of_x": f_prime_of_x,
                "f_prime_of_x_results": f_prime_of_x_results,
                "f_double_prime_of_x": f_double_prime_of_x,
                "f_double_prime_of_x_results": f_double_prime_of_x_results,
            }
        )


def _derivative_product():
    x = sympy.symbols("x")
    values = list(range(-3, 4))

    f_of_x = x**2 + 2 * x + 1
    g_of_x = x**2 - 1

    func = f_of_x * g_of_x
    func_results = [func.subs({x: n}) for n in values]

    # Product rule
    # d/dx(f*g) = fg' + gf'
    func_prime = sympy.diff(func)
    func_prime_results = [func_prime.subs({x: n}) for n in values]

    pretty_print_results(
        {
            "f_of_x": f_of_x,
            "g_of_x": g_of_x,
            "func": func,
            "func_results": func_results,
            "func_prime": func_prime,
            "func_prime_results": func_prime_results,
        }
    )


def _derivative_quotient():
    x = sympy.symbols("x")
    values = list(range(-3, 4))

    f_of_x = x**2 + 2 * x + 1
    g_of_x = x**2 + 1

    func = f_of_x / g_of_x
    func_results = [func.subs({x: n}) for n in values]

    # Quotient rule
    # d/dx(f/g) = (gf' - fg') / g^2
    func_prime = sympy.diff(func)
    func_prime_results = [func_prime.subs({x: n}) for n in values]

    pretty_print_results(
        {
            "f_of_x": f_of_x,
            "g_of_x": g_of_x,
            "func": func,
            "func_results": func_results,
            "func_prime": func_prime,
            "func_prime_results": func_prime_results,
        }
    )


def _derivative_chain():
    x = sympy.symbols("x")
    values = list(range(-3, 4))

    f_of_x = x**4
    g_of_x = 2 * x + 1

    func = f_of_x.subs({x: g_of_x})
    func_results = [func.subs({x: n}) for n in values]

    # Chain rule
    # d/dx(f o g) = (f' o g) * g'
    func_prime = sympy.diff(func)
    func_prime_results = [func_prime.subs({x: n}) for n in values]

    pretty_print_results(
        {
            "f_of_x": f_of_x,
            "g_of_x": g_of_x,
            "func": func,
            "func_results": func_results,
            "func_prime": func_prime,
            "func_prime_results": func_prime_results,
        }
    )


def _integral():
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
