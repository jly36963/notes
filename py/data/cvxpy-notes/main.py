"""Optimization notes."""

# pylint: disable=C0103

from collections.abc import Sequence
from pathlib import Path
from typing import TypeVar, cast

import cvxpy as cp
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

# ---
# Constants
# ---

DATA_DIR = Path("data")
INPUT_DIR = DATA_DIR / "input"
OUTPUT_DIR = DATA_DIR / "output"

# ---
# Main
# ---


def main():
    """Run optimization examples."""
    examples = {
        "setup": _setup,
        "least squares": _least_squares,
        "linear program": _linear_program,
        "quadratic program": _quadratic_program,
        "mixed integer quadratic program": _mixed_integer_quadratic_program,
        "portfolio rebalance (long only)": _portfolio_rebalance_long_only,
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


T = TypeVar("T")


def first(values: Sequence[T]) -> T | None:
    """Return the first item in a list, returns None if empty."""
    if len(values) == 0:
        return None
    return values[0]


def _symmetric_square(n: int) -> np.ndarray:
    A = np.random.randn(n, n)
    return A.T @ A


def get_output_path(filename: str) -> Path:
    """Get path to input file."""
    return OUTPUT_DIR / filename


def save_output_image(filename: str) -> None:
    """Save current plot to file."""
    print(f"Saving image: {filename}")
    plt.savefig(get_output_path(filename))
    plt.clf()


# ---
# Examples
# ---


def _setup():
    """Set defaults for seaborn."""
    sns.set_style(style="white")

    for d in [DATA_DIR, INPUT_DIR, OUTPUT_DIR]:
        Path.mkdir(d, parents=True, exist_ok=True)
        # os.makedirs(d, exist_ok=True)

    print("...")


def _least_squares():
    m = 5
    n = 3
    np.random.seed(1)
    A = np.random.randn(m, n)
    b = np.random.randn(m)

    x = cp.Variable(n)
    cost = cp.sum_squares(A @ x - b)
    prob = cp.Problem(cp.Minimize(cost))
    prob.solve(solver=cp.CLARABEL)

    pretty_print_results(
        {
            "A": A,
            "b": b,
            "x": x,
            "prob.value": prob.value,
            "x.value": x.value,
            "cp.norm(A @ x - b, p=2).value": cp.norm(A @ x - b, p=2).value,
        }
    )


def _linear_program():
    m = 5
    n = 3
    np.random.seed(1)
    values = np.random.randn(m)
    lamb0 = np.maximum(-values, 0)
    s0 = np.maximum(values, 0)
    x0 = np.random.randn(n)
    A = np.random.randn(m, n)
    b = A @ x0 + s0
    c = -A.T @ lamb0

    x = cp.Variable(n)
    prob = cp.Problem(
        objective=cp.Minimize(c.T @ x),
        constraints=[A @ x <= b],
    )
    prob.solve(solver=cp.CLARABEL)

    pretty_print_results(
        {
            "A": A,
            "b": b,
            "x": x,
            "prob.value": prob.value,
            "x.value": x.value,
            "prob.constraints[0].dual_value": prob.constraints[0].dual_value,
        }
    )


def _quadratic_program():
    m = 15
    n = 10
    p = 5
    np.random.seed(1)

    P = _symmetric_square(n)
    q = np.random.randn(n)
    G = np.random.randn(m, n)
    h = G @ np.random.randn(n)
    A = np.random.randn(p, n)
    b = np.random.randn(p)

    x = cp.Variable(n)
    prob = cp.Problem(
        objective=cp.Minimize(
            (1 / 2) * cp.quad_form(x, P) + q.T @ x,
        ),
        constraints=[
            G @ x <= h,
            A @ x == b,
        ],
    )
    prob.solve(solver=cp.CLARABEL)

    pretty_print_results(
        {
            "A": A,
            "b": b,
            "x": x,
            "prob.value": prob.value,
            "x.value": x.value,
            "prob.constraints[0].dual_value": prob.constraints[0].dual_value,
        }
    )


def _mixed_integer_quadratic_program():
    m = 5
    n = 3
    np.random.seed(1)
    A = np.random.rand(m, n)
    b = np.random.randn(m)

    x = cp.Variable(n, integer=True)
    prob = cp.Problem(
        objective=cp.Minimize(cp.sum_squares(A @ x - b)),
    )
    # SCIP solver supports MINLP
    prob.solve(solver=cp.SCIP)

    pretty_print_results(
        {
            "A": A,
            "b": b,
            "x": x,
            "prob.value": prob.value,
            "x.value": x.value,
        }
    )


def _portfolio_rebalance_long_only():
    np.random.seed(1)
    n = 10
    mu = np.abs(np.random.randn(n, 1))
    Sigma = _symmetric_square(n)
    samples_count = 100
    gamma_values = np.logspace(-2, 3, num=samples_count)

    w = cp.Variable(n)
    gamma = cp.Parameter(nonneg=True)
    returns = mu.T @ w
    risk = cp.quad_form(w, Sigma)
    prob = cp.Problem(
        objective=cp.Maximize(returns - gamma * risk),
        constraints=[
            cast(cp.Expression, cp.sum(w)) == 1,
            w >= 0,
        ],
    )

    # Solve with different gamma values
    results: list[dict[str, float]] = []
    for gamma_value in gamma_values:
        gamma.value = gamma_value
        prob.solve()
        results.append(
            {
                "gamma": float(gamma_value),
                "risk": float(cast(np.generic, cp.sqrt(risk).value)),
                "returns": float(cast(np.ndarray, returns.value).tolist()[0]),
            }
        )
    results_df = pd.DataFrame(results)
    pretty_print_results({"results": results_df})

    # Compare risk/returns for each gamma
    ax = sns.lineplot(results_df, x="risk", y="returns", color="black")
    # Add gamma labels at some points
    for i, risk_i, returns_i, gamma_i in zip(
        range(len(results_df)),
        results_df["risk"],
        results_df["returns"],
        np.round(results_df["gamma"], 3),
        strict=False,
    ):
        if (i < 15) or (i > 55) or (i % 5 != 0):  # noqa: PLR2004
            # Thin out points
            continue
        ax.plot(risk_i, returns_i, marker="o", color="black")
        ax.text(
            x=risk_i + 0.05,
            y=returns_i - 0.05,
            s=f"γ={gamma_i}",  # noqa: RUF001
        )
    save_output_image("risk-vs-returns.jpg")


# ---
# Run
# ---

main()
