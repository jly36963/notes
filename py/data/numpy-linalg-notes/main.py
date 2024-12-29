"""Numpy linalg notes."""

# pylint: disable=C0103,C0302,C0301
# ruff: noqa: E501

from itertools import permutations
from math import cos, sin
from typing import Any, Iterable, TypeVar, cast  # noqa: UP035

import numpy as np
import scipy
from numpy.linalg import (
    eig,
    inv,
    lstsq,
    matrix_power,
    matrix_rank,
    norm,
    pinv,
    qr,
    solve,
    svd,
)
from numpy.random import randn
from sympy import Matrix, symbols
from tenacity import retry

# ---
# Constants
# ---

MATRIX_DIM = 2
"""How many dimensions a matrix should have."""
VECTOR_DIM = 1
"""How many dimensions a vector should have."""

# ---
# Main
# ---


def main():
    """Numpy linalg examples."""
    examples = {
        # Vector
        "Basic vector-scalar arithmetic": _basic_vector_scalar_arithmetic,
        "Basic vector-vector arithmetic": _basic_vector_vector_arithmetic,
        "Basic vector dot product": _basic_vector_dot_product,
        "Basic vector dot product (perspectives)": _basic_vector_dot_product_perspectives,
        "Basic vector length": _basic_vector_length,
        "Basic vector hadamard multiplication": _basic_vector_hadamard_multiplication,
        "Basic vector outer product": _basic_vector_outer_product,
        "Basic vector cross product": _basic_vector_cross_product,
        "Basic vector hermitian transpose": _basic_vector_hermitian_transpose,
        "Basic unit vector": _basic_unit_vector,
        "Basic vector span": _basic_vector_span,
        # Matrix
        "Basic matrix creation": _basic_matrix_creation,
        "Basic matrix-scalar arithmetic": _basic_matrix_scalar_arithmetic,
        "Basic matrix-vector arithmetic": _basic_matrix_vector_arithmetic,
        "diagonal and trace": _diagonal_and_trace,
        "Basic matrix shift": basic_matrix_shift,
        "transformation matrices": _transformation_matrices,
        "transformation matrices (rotation)": _transform_matrices_rotation,
        "matrix-matrix arithmetic": _basic_matrix_matrix_arithmetic,
        "matmul order of operations": _matmul_order_of_operations,
        "additive symmetric matrices": _additive_symmetric_matrices,
        "multiplicative symmetric matrices": _multiplicative_symmetric_matrices,
        "multiplicative symmetric matrices (sympy)": _multiplicative_symmetric_matrices_sympy,
        "frobenius dot product": _frobenius_dot_product,
        "matrix rank": _matrix_rank,
        "systems of equations and rref": _systems_of_equations_and_rref,
        "matrix inverse": _matrix_inverse,
        "matrix inverse (row reduction)": _matrix_inverse_row_reduction,
        "matrix inverse one-sided (left and right)": _basic_matrix_one_sided_inverse,
        "Projections in R2": _r2_projections,
        "Projections in RN": _rn_projections,
        "QR decomposition": _qr_decomposition,
        "QR decomposition (2)": _qr_decomp_2,
        "QR gram-schmidt": _qr_gram_schmidt,
        "inverse via QR decomposition": _inverse_via_qr_decomposition,
        "sherman morrison inverse": _sherman_morrison_inverse,
        "least squares row reduction": _lease_squares_row_reduction,
        "least squares example": _least_squares_example,
        "least squares via qr decomp": _least_squares_via_qr_decomp,
        "eigendecomposition": _eigendecomposition,
        "diagonalization": _diagonalization,
        "matrix powers via diagonalization": _matrix_powers_via_diagonalization,
        "eigenvectors of related symmetric matrices": _eigenvectors_of_related_symmetric_matrices,
        "orthogonal eigenvectors of symmetric matrices": _orthogonal_eigenvectors_of_symmetric_matrices,
        "eigenlayers": _eigenlayers,
        "generalized decomposition": _generalized_decomposition,
        "SVD": _svd,
        "SVD spectral theory": _svd_spectral_theory,
        "SVD to percent variance": _svd_to_percent_variance,
        "pseudoinverse": _pseudoinverse,
        "SVD pseudoinverse": _svd_pseudoinverse,
        "condition number": _condition_number,
        "quadratic form": _quadratic_form,
        "PCA": _pca,
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


def pretty_print_results(results: dict[str, Any]) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        print(k)
        print(type(v))
        print(v)
        print()


T = TypeVar("T")


def first(input_list: list[T]) -> T | None:
    """Return the first item in a list, returns None if empty."""
    if len(input_list) == 0:
        return None
    return input_list[0]


def last(input_list: list[T]) -> T | None:
    """Return the last item in a list, returns None if empty."""
    if len(input_list) == 0:
        return None
    return input_list[-1]


def pipe(value, *funcs):
    """Unary piping."""
    for func in funcs:
        value = func(value)
    return value


# ---
# Examples
# ---


def _basic_vector_scalar_arithmetic():
    # Vector `v`, scalar `c`
    v = np.array([3, -1])
    c = 2

    pretty_print_results(
        {
            "v": v,
            "c": c,
            "v + c": v + c,
            "v - c": v - c,
            "v * c": v * c,
            "v / c": v / c,
        }
    )


def _basic_vector_vector_arithmetic():
    # Vectors v1, v2
    v1 = np.array([3, -1])
    v2 = np.array([2, 4])

    pretty_print_results(
        {
            "v1": v1,
            "v2": v2,
            "v1 + v2": v1 + v2,
            "v1 - v2": v1 - v2,
            "v1 * v2": v1 * v2,
            "v1 / v2": v1 / v2,
        }
    )


def _basic_vector_dot_product():
    """Dot product: results in scalar."""
    # Vectors v1, v2
    v1 = np.array([1, 2, 3, 4, 5, 6])
    v2 = np.array([0, -4, -3, 6, 5, 4])

    def dot_product_loop(v1: np.ndarray, v2: np.ndarray):
        dp = 0
        for val1, val2 in zip(v1, v2, strict=True):
            dp = dp + (val1 * val2)
        return dp

    pretty_print_results(
        {
            "v1": v1,
            "v2": v2,
            "sum(np.multiply(v1, v2))": sum(np.multiply(v1, v2)),
            "np.dot(v1, v2)": np.dot(v1, v2),
            "np.matmul(v1, v2)": np.matmul(v1, v2),
            "dot_product_loop(v1, v2)": dot_product_loop(v1, v2),
        }
    )


def _basic_vector_dot_product_perspectives():
    # Vectors v1, v2
    v1 = np.array([2, 4, -3]).astype(np.float64)
    v2 = np.array([0, -3, -3]).astype(np.float64)

    def algebraic_dot_product(v1, v2):
        """Dot product (algebraic)."""
        res = np.dot(v1, v2)
        return np.round(res, 3)

    def geometric_dot_product(v1, v2):
        """Dot product (geometric)."""
        # Angle between vectors
        ang = np.arccos(np.dot(v1, v2) / (norm(v1) * norm(v2)))
        res = norm(v1) * norm(v2) * np.cos(ang)
        return np.round(res, 3)

    pretty_print_results(
        {
            "v1": v1,
            "v2": v2,
            "algebraic_dot_product(v1, v2)": algebraic_dot_product(v1, v2),
            "geometric_dot_product(v1, v2)": geometric_dot_product(v1, v2),
        }
    )


def _basic_vector_length():
    """Compute the length of a multidimensional vector."""
    # Vector `v`
    v = np.array([1, 2, 3, 4, 5, 6])

    def length(v: np.ndarray) -> np.generic:
        """Manually calculate length."""
        res = pipe(
            v,
            lambda v: np.multiply(v, v),
            sum,
            np.sqrt,
        )
        return cast(np.float64, res)

    pretty_print_results(
        {
            "v": v,
            "length(v)": length(v),
            "norm(v)": norm(v),
        }
    )


def _basic_vector_hadamard_multiplication():
    """Hadamard: element-wise multiplication."""
    # Vectors v1 and v2
    v1 = np.array([1, 3, 5])
    v2 = np.array([3, 4, 2])

    pretty_print_results(
        {
            "v1": v1,
            "v2": v2,
            "np.multiply(v1, v2)": np.multiply(v1, v2),
        }
    )


def _basic_vector_outer_product():
    # Vectors v1 and v2
    v1 = np.array([1, 2, 3])
    v2 = np.array([-1, 0, 1])

    def outer_product(v1: np.ndarray, v2: np.ndarray) -> np.ndarray:
        """Conceptual example (slow, but good for explaining)."""
        if not v1.size == v2.size:
            raise ValueError("Vectors should be same size for outer product.")
        count = v1.size
        op = np.zeros((count, count))
        for i, val1 in enumerate(v1):
            for j, val2 in enumerate(v2):
                op[i, j] = val1 * val2
        return op

    pretty_print_results(
        {
            "v1": v1,
            "v2": v2,
            "np.outer(v1, v2)": np.outer(v1, v2),
            "outer_product(v1, v2)": outer_product(v1, v2),
        }
    )


def _basic_vector_cross_product():
    # Vectors v1 and v2
    v1 = np.array([-3, 2, 5])
    v2 = np.array([4, -3, 0])

    def manual_cross(v1: np.ndarray, v2: np.ndarray) -> np.ndarray:
        """Conceptual example: slow, but good for explaining."""
        if not v1.size == v2.size:
            raise ValueError("Vectors should be same size for cross product.")
        count = v1.size
        result = np.zeros(count)
        for i in range(count):
            plus_1 = (i + 1) % count  # Modulus used to wrap around
            plus_2 = (i + 2) % count
            result[i] = v1[plus_1] * v2[plus_2] - v1[plus_2] * v2[plus_1]
        return result

    pretty_print_results(
        {
            "v1": v1,
            "v2": v2,
            "np.cross(v1, v2)": np.cross(v1, v2),
            "manual_cross(v1, v2)": manual_cross(v1, v2),
        }
    )


def _basic_vector_hermitian_transpose():
    # Hermitian transpose (conjugate transpose)
    # Transpose of matrix, then take complex conjugate of each entry (negate imaginary)
    z = complex(3, 4)
    v = np.array([3, 4j, 5 + 2j, complex(2, -5)])

    pretty_print_results(
        {
            # Complex scalar
            "z": z,
            "norm(z)": norm(z),  # magnitude
            "np.transpose(z) * z": np.transpose(z) * z,
            "np.transpose(z.conjugate()) * z": np.transpose(z.conjugate()) * z,
            # Complex vector
            "v": v,
            "v.T": v.T,
            "np.transpose(v)": np.transpose(v),
            "np.transpose(v.conjugate())": np.transpose(v.conjugate()),
        }
    )


def _basic_unit_vector():
    """Determine a vector's unit vector."""
    # scalar `mu`, vector `v`, length `norm(v)`
    # mu * norm(v) = 1
    # v * mu = unit_v
    v = np.array([-3, 6])
    mu = 1 / norm(v)
    unit_v = v * mu

    pretty_print_results(
        {
            "v": v,
            "mu": mu,
            "unit_v": unit_v,
        }
    )


def _basic_vector_span():
    # Linear span: the span of a set of vectors.
    # The linear space formed by all vectors, as linear combinations of the vectors.
    # Vectors v1/v2/v3
    v1 = np.array([1, 2, 3])
    v2 = np.array([4, 5, 6])
    v3 = np.array([7, 8, 9])

    def linear_span_basis(*vectors: np.ndarray) -> np.ndarray:
        """Get the basis of the linear span for a set of vectors."""
        matrix = np.array(vectors).T
        _, _, V = svd(matrix)
        tolerance = 1e-10
        rank = np.sum(np.abs(V) > tolerance)
        basis = matrix[:, :rank]
        return basis

    # TODO: Check this (LLM example)
    pretty_print_results(
        {
            "v1": v1,
            "v2": v2,
            "v3": v3,
            "linear_span_basis(v1, v2, v3)": linear_span_basis(v1, v2, v3),
        }
    )


def _basic_matrix_creation():
    # Square matrix `S`, Rectangular matrix `A`
    S = np.round(randn(5, 5), 2)
    A = np.round(randn(3, 4), 2)

    pretty_print_results(
        {
            "S": S,
            "A": A,
            "np.zeros((4, 4))": np.zeros((4, 4)),
            "np.eye(3)": np.eye(3),
            "np.diag([1, 2, 3, 5, 2])": np.diag([1, 2, 3, 5, 2]),
            "np.triu(S)": np.triu(S),
            "np.tril(S)": np.tril(S),
            "np.concatenate((A, A), axis=1)": np.concatenate((A, A), axis=1),
        }
    )


def _basic_matrix_scalar_arithmetic():
    # Matrix `A`
    A = np.arange(1, 10, 1).reshape(3, 3)

    pretty_print_results(
        {
            "A": A,
            "A + 2": A + 2,
            "A - 2": A - 2,
            "A * 2": A * 2,
            "A / 2": A / 2,
            "A**2": A**2,
        }
    )


def _basic_matrix_vector_arithmetic():
    # Matrix `A`, Vector `v`
    A = np.arange(1, 10, 1).reshape(3, 3)
    v = np.array([2, 1, 3])

    pretty_print_results(
        {
            "A": A,
            "v": v,
            "A + v": A + v,
            "A - v": A - v,
            # element-wise multiplication, produces matrix
            "A * v": A * v,
            "v * A": v * A,  # Same as `A * v`
            # matrix multiplication, produces vector
            "A @ v": A @ v,
            "v.T @ A": v.T @ A,
            "A / v": A / v,
            "A**v": A**v,
            # Dot product
            "np.dot(A, v)": np.dot(A, v),
            # Multiply by transposed
            "A.T * v.reshape(-1, 1)": A.T * v.reshape(-1, 1),
        }
    )


def _diagonal_and_trace():
    # Square matrix `S`, vector `v`
    S = np.arange(1, 10).reshape(3, 3)
    v = np.arange(1, 10)

    # NOTE:
    # matmul and hadamard multiplication are the same for diagonal matrices
    # inverse of diagonal matrix: `1/n` for each diagonal element

    pretty_print_results(
        {
            "S": S,
            "v": v,
            "np.diag(S)": np.diag(S),  # diag matrix -> vector
            "np.diag(v)": np.diag(v),  # vector -> diag matrix
            "np.trace(S)": np.trace(S),
            "sum(np.diag(S))": sum(np.diag(S)),
        }
    )


def basic_matrix_shift():
    """Shifting a matrix can be useful in concrete applications of linear algebra."""
    # Square matrix `S`, diagonal matrix `D`
    S = np.arange(1, 10, 1).reshape(3, 3)
    D = np.eye(3) * 2

    def matching_squares(A1, A2) -> bool:
        """Return True if both are square and have same size."""
        if (A1.ndim != MATRIX_DIM) or (A2.ndim != MATRIX_DIM):
            return False
        m1, n1 = A1.shape
        m2, n2 = A2.shape
        return (m1 == n1) and (m2 == n2) and (m1 == m2)

    if not matching_squares(S, D):
        raise ValueError("Matrices must be square and have same shape")

    pretty_print_results(
        {
            "S": S,
            "D": D,
            "S + D": S + D,
        }
    )


def _transformation_matrices():
    # Square matrix `S`, vector `V`
    S = np.array([[1, -1], [2, 1]])
    v = np.array([3, -2])

    def matching_dimensions(A: np.ndarray, v: np.ndarray) -> bool:
        """Check if `A.shape` matches `v.size`."""
        if A.ndim != MATRIX_DIM:
            return False
        if v.ndim != VECTOR_DIM:
            return False
        m, n = A.shape
        return (m == n) and (m == v.size)

    if not matching_dimensions(S, v):
        # If S is not square, input/output vectors will have different dimensionality
        print(f"WARNING: dimensions don't match ({S.shape} and {v.size})")

    pretty_print_results(
        {
            "v": v,
            "S": S,
            "S @ v.T": S @ v.T,  # [5, 4]
        }
    )


def _transform_matrices_rotation():
    # Square matrix `S`, vector `v`, angle `th` (theta)
    v = np.array([3, -2])
    th = np.pi / 2  # 90 degrees
    S = np.array([[cos(th), -sin(th)], [sin(th), cos(th)]])

    pretty_print_results(
        {
            "v": v,
            "S": S,
            "S @ v.T": S @ v.T,  # [2, 3]
        }
    )


def _basic_matrix_matrix_arithmetic():
    # Matrices A1 and A2
    A1 = np.arange(1, 13, 1).reshape(4, 3)
    A2 = np.arange(1, 13, 1).reshape(4, 3)

    # Matmul:
    # For `A1 @ A2`, A1 left-multiples A2
    # For dimensions `(m1, n1) @ (m2, n2)`, n1 must equal m2
    # Shape `(m1, n1) @ (m2, n2)` produce shape `(m1, n2)`

    pretty_print_results(
        {
            "A1": A1,
            "A2": A2,
            # Element-wise operations
            "A1 + A2": A1 + A2,
            "A1 - A2": A1 - A2,
            "A1 * A2": A1 * A2,  # Hadamard product
            "np.multiply(A1, A2)": np.multiply(A1, A2),  # Hadamard product
            "A1 / A2": A1 / A2,  # Hadamard division
            "np.divide(A1, A2)": np.divide(A1, A2),  # Hadamard division
            "A1**A2": A1**A2,
            # Matrix multiplication
            "A1 @ A2.T": A1 @ A2.T,  # Dot product
            "np.dot(A1, A2.T)": np.dot(A1, A2.T),  # Dot product
            "np.matmul(A1, A2.T)": np.matmul(A1, A2.T),  # Dot product
        }
    )


def _matmul_order_of_operations():
    # Square matrices S1 - S4
    S1 = np.arange(1, 10).reshape(3, 3)
    S2 = S1.copy() + 1
    S3 = S1.copy() - 1
    S4 = S1.copy() * 2

    pretty_print_results(
        {
            "S1": S1,
            "S2": S2,
            "S3": S3,
            "S4": S4,
            # Below results are the same (potential computer rounding errors)
            "S1 @ S2 @ S3 @ S4": S1 @ S2 @ S3 @ S4,
            "S4.T @ S3.T @ S2.T @ S1.T": S4.T @ S3.T @ S2.T @ S1.T,
        }
    )


def _additive_symmetric_matrices():
    # Square matrix `S`, symmetric matris `S_sym`
    S = np.arange(1, 10).reshape(3, 3)
    S_sym = (S + S.T) / 2

    pretty_print_results(
        {
            "S": S,
            "S_sym": S_sym,
            "S_sym - S_sym.T": S_sym - S_sym.T,  # zeros
        }
    )


def _multiplicative_symmetric_matrices():
    # Matrix A
    A = np.arange(1, 7).reshape(3, 2)
    At_A = A.T @ A
    A_At = A @ A.T

    def _is_symmetric(matrix: np.ndarray):
        shape = matrix.shape
        if len(shape) != MATRIX_DIM:
            raise ValueError("Not a matrix")
        m, n = shape
        if m != n:
            return False
        return np.allclose(matrix, matrix.T)

    pretty_print_results(
        {
            "A": A,
            "At_A": At_A,
            "A_At": A_At,
            "_is_symmetric(At_A)": _is_symmetric(At_A),
            "_is_symmetric(A_At)": _is_symmetric(A_At),
            "At_A - At_A.T": At_A - At_A.T,
            "A_At - A_At.T": A_At - A_At.T,
        }
    )


def _multiplicative_symmetric_matrices_sympy():
    # Square matrices S1 and S2
    # `S1_sym @ S2_sym -> S3_not_sym` (usually)

    def get_symbols():
        """Return the alphabet as a tuple of symbols."""
        return symbols("a b c d e f g h i j k l m n o p q r s t u v w x y z", real=True)

    a, b, c, d, e, f, _, h, _, _, _, l, m, n, o, _, q, r, _, t, _, _, _, _, _, _ = (  # noqa: E741
        get_symbols()
    )
    # symmetric and constant-diagonal matrices
    S1 = Matrix([[a, b, c, d], [b, a, e, f], [c, e, a, h], [d, f, h, a]])
    S2 = Matrix([[l, m, n, o], [m, l, q, r], [n, q, l, t], [o, r, t, l]])

    def _is_symmetric_sympy(matrix: Matrix):
        shape = matrix.shape
        if len(shape) != MATRIX_DIM:
            raise ValueError("Not a matrix")
        m, n = shape
        if m != n:
            return False
        for i in range(m):
            for j in range(n):
                match matrix[i, j] == matrix[j, i]:
                    case True:
                        continue
                    case False:
                        return False
        return True

    pretty_print_results(
        {
            "S1": S1,
            "S2": S2,
            # Symmetric
            "_is_symmetric_sympy(S1)": _is_symmetric_sympy(S1),
            "_is_symmetric_sympy(S2)": _is_symmetric_sympy(S2),
            # Asymmetric
            "_is_symmetric_sympy(S1 @ S2)": _is_symmetric_sympy(S1 @ S2),
        }
    )


def _frobenius_dot_product():
    # Matrices A1 and A2
    A1 = np.arange(1, 13).reshape(4, 3)
    A2 = A1.copy()

    pretty_print_results(
        {
            "A1": A1,
            "A2": A2,
            # Sum of hadamard
            "np.sum(A1 * A2)": np.sum(A1 * A2),
            # Dot product of vectorized matrices (flatten, ravel, reshape)
            "np.dot(A1.ravel(), A2.ravel())": np.dot(A1.ravel(), A2.ravel()),
            # trace(At @ B)
            "np.trace(A1.T @ A2)": np.trace(A1.T @ A2),
        }
    )


def _matrix_rank():
    # Full-rank matrices A1/A2/A4/A5, rank-deficient matrix A3
    m, n = 4, 3  # 4 rows, 3 cols; Max rank of 3 (min dimension)
    A1 = np.round(randn(m, n), 2)

    # Make a row dependent (rank unaffected)
    A2 = A1.copy()
    A2[m - 1] = A2[m - 2]

    # Make a col dependent (rank decreased)
    A3 = A1.copy()
    A3[:, n - 1] = A3[:, n - 2]

    noise_amplifier = 0.001

    # Noise to fix rank-deficiency (rank restored)
    A4 = A3.copy()
    A4 = A4 + noise_amplifier * randn(m, n)

    # Shift to fix rank-deficiency (rank restored)
    A5 = A3.copy()
    A5 = A5 + noise_amplifier * np.eye(m, n)

    # Symmetric matrices
    At_A = A1.T @ A1  # (3,3), rank 3
    A_At = A1 @ A1.T  # (4,4), rank 3

    pretty_print_results(
        {
            # 4 by 3, max rank is 3
            "A1": A1,
            "A2": A2,
            "A3": A3,
            "A4": A4,
            "A5": A5,
            # Rank is 3 (no cols are dependent)
            "matrix_rank(A1)": matrix_rank(A1),
            # Rank is 3 (some rows are dependent, but no cols are)
            "matrix_rank(A2)": matrix_rank(A2),
            # Rank is 2 (some cols are dependent)
            "matrix_rank(A3)": matrix_rank(A3),
            # Rank is 3 (noise added to rank-deficient matrix)
            "matrix_rank(A4)": matrix_rank(A4),
            # Rank is 3 (shift added to rank-deficient matrix)
            "matrix_rank(A5)": matrix_rank(A5),
            # AtA (3,3) and AAt (4,4): rank 3
            "At_A": At_A,
            "A_At": A_At,
            "matrix_rank(At_A)": matrix_rank(At_A),
            "matrix_rank(A_At)": matrix_rank(A_At),
        }
    )


def _systems_of_equations_and_rref():
    """Reduced row echelon form."""
    # Square matrix `S`, matrix `A`
    S = randn(4, 4)
    A = randn(4, 3)

    def rref(A: np.ndarray) -> np.ndarray:
        if A.ndim != MATRIX_DIM:
            raise ValueError("A is not a matrix")
        result = pipe(
            A,
            Matrix,
            lambda m: m.rref(),
            first,
            np.array,
        )
        return cast(np.ndarray, result)

    pretty_print_results(
        {
            "S": S,
            "A": A,
            "rref(S)": rref(S),
            "rref(A)": rref(A),
        }
    )


def _matrix_inverse():
    # Square matrix `S`
    S = randn(3, 3)

    pretty_print_results(
        {
            "S": S,
            "inv(S)": inv(S),
            "S @ inv(S)": np.round(S @ inv(S), 2),
        }
    )


def _matrix_inverse_row_reduction():
    # Square matrix `S`
    S = pipe(
        randn(4, 4),
        lambda a: a * 10,
        np.round,
    )

    def inv_rr(S: np.ndarray) -> np.ndarray:
        """Get the inverse using row reduction."""
        if S.ndim != MATRIX_DIM:
            raise ValueError("Not a matrix")
        rows, cols = S.shape
        if rows != cols:
            raise ValueError(f"Not a square matrix ({rows}, {cols})")
        size = rows
        return pipe(
            S,
            lambda a: Matrix(a, dtype="float64"),
            lambda m: Matrix(np.concatenate((m, np.eye(size, size)), axis=1)),
            lambda m: m.rref(),
            first,
            lambda res: res[:, size : size * 2],
            lambda m: np.array(m, dtype=np.float64),
        )

    pretty_print_results(
        {
            "S": S,
            "inv(S)": np.round(inv(S), 2),
            "inv_rr(S)": np.round(inv_rr(S), 2),
        }
    )


@retry
def _basic_matrix_one_sided_inverse():
    """One-sided, left or right inverse."""
    # tenacity.retry because randn can produce singular matrix

    # Matrix `A`
    A = randn(6, 3)  # Tall, use left inverse
    At_A = A.T @ A
    A_At = A @ A.T

    A_inv_left = inv(At_A) @ A.T
    A_inv_right = A.T @ inv(A_At)

    left_check = A_inv_left @ A
    right_check = A @ A_inv_right

    pretty_print_results(
        {
            "A": A,
            # Full rank (3 out of 3), left inverse will work
            "At_A": np.round(At_A, 3),
            "At_A.shape": At_A.shape,
            "matrix_rank(At_A)": matrix_rank(At_A),
            "A_inv_left": np.round(A_inv_left, 3),  # Left inverse
            "A_inv_left @ A": np.round(left_check, 3),  # Left inverse check
            # Rank deficient (3 out of 6), right inverse will not work
            "A_At": np.round(A_At, 3),
            "A_At.shape": A_At.shape,
            "matrix_rank(A_At)": matrix_rank(A_At),
            "A_inv_right": np.round(A_inv_right, 3),  # Right inverse
            "A @ A_inv_right": np.round(right_check, 3),  # Right inverse check
        }
    )


def _r2_projections():
    # Line `v`, point `p`, scalar `c` (beta)
    v = np.array([2, 5])
    p = np.array([4, 1])
    c = (v.T @ p) / (v.T @ v)

    pretty_print_results(
        {
            "v": v,
            "p": p,
            "c": np.round(c, 2),
            # Should be 0
            "v.T @ (p - v * c)": np.round(v.T @ (p - v * c), 2),
        }
    )


def _rn_projections():
    # Matrix A, vector b, vector x
    m, n = 3, 5  # Rows, Cols
    A = randn(m, n)
    b = randn(m, 1)

    At_A_rank = matrix_rank(A.T @ A)
    if At_A_rank != m:
        # AtA must be full rank
        raise RuntimeError(f"Matrix is not full rank ({At_A_rank} / {m})")

    # Explicit inverse solution
    # Can cause computer rounding errors
    x = inv(A.T @ A) @ (A.T @ b)
    # Preferred solution
    x = solve(A.T @ A, A.T @ b)

    pretty_print_results(
        {
            "m": m,
            "n": n,
            "A": A,
            "b": b,
            "At_A_rank": At_A_rank,
            # Two ways to solve for `x`
            "inv(A.T @ A) @ (A.T @ b)": inv(A.T @ A) @ (A.T @ b),
            "solve(A.T @ A, A.T @ b)": solve(A.T @ A, A.T @ b),
            # Should be zeros vector
            "A.T @ (b - A @ x)": np.round(A.T @ (b - A @ x), 2),
        }
    )


def _qr_decomposition():
    # Matrix A
    A = [[1, 0], [1, 0], [0, 1]]

    # "reduced" QR decompmosition (economy) (default)
    Q1, R1 = qr(A)
    # "complete" QR decomposition (full)
    Q2, R2 = qr(A, "complete")

    pretty_print_results(
        {
            "A": A,
            # economy
            "Q1": np.round(Q1, 2),
            "R1": np.round(R1, 2),
            # full
            "Q2": np.round(Q2, 2),
            "R2": np.round(R2, 2),
        }
    )


def _qr_decomp_2():
    # QR decomposition where A = QR
    # AtA = RtR
    A = randn(4, 3)
    Q, R = np.linalg.qr(A)

    At_A = A.T @ A
    Rt_R = R.T @ R

    pretty_print_results(
        {
            "A": A,
            "Q": np.round(Q, 2),
            "R": np.round(R, 2),
            "At_A": np.round(At_A, 2),
            "Rt_R": np.round(Rt_R, 2),
        }
    )


def _qr_gram_schmidt():
    """QR decomposition example using gram-schmidt procedure."""

    def gs(A: np.ndarray) -> np.ndarray:
        """Do gram-schmidt procedure on a matrix."""
        if A.ndim != MATRIX_DIM:
            raise ValueError("A is not a matrix")
        m, n = A.shape
        Q = np.zeros((m, n))

        for i in range(n):
            Q[:, i] = A[:, i]
            a = A[:, i]
            # Orthogonalize
            for j in range(i):
                q = Q[:, j]
                Q[:, i] = Q[:, i] - np.dot(a, q) / np.dot(q, q) * q
            # Normalize
            Q[:, i] = Q[:, i] / norm(Q[:, i])
        return Q

    def gs_qr_decomp(A: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        """Do QR decomposition using gram-schmidt."""
        Q = gs(A)
        R = np.triu(Q.T @ A)
        return Q, R

    A = randn(4, 3)
    Q1, R1 = qr(A)  # reduced
    Q2, R2 = qr(A, "complete")  # complete
    Q3, R3 = gs_qr_decomp(A)  # Q/R dimensions will be like `reduced`

    pretty_print_results(
        {
            "A": A,
            # qr reduced
            "Q1": np.round(Q1, 2),
            "R1": np.round(R1, 2),
            # qr complete
            "Q2": np.round(Q2, 2),
            "R2": np.round(R2, 2),
            # qr gs (manual)
            "Q3": np.round(Q3, 2),
            "R3": np.round(R3, 2),
            # Check
            "Q3 @ R3": np.round(Q3 @ R3, 2),
        }
    )


def _inverse_via_qr_decomposition():
    # Square for this example so that `inv(A)` works
    A = randn(3, 3)

    # Inverse via QR decomposition
    # A = QR
    # inv(A) = inv(QR)
    # inv(A) = inv(R) @ Qt
    Q, R = qr(A)
    A_inv_qr = inv(R) @ Q.T

    # Regular inverse
    A_inv = inv(A)

    pretty_print_results(
        {
            "A": A,
            "Q": np.round(Q, 2),
            "R": np.round(R, 2),
            "A_inv_qr": np.round(A_inv_qr, 2),
            "A_inv": np.round(A_inv, 2),
        }
    )


def _sherman_morrison_inverse():
    print("...")


def _lease_squares_row_reduction():
    # Ax = beta
    # A is square matrix
    # x is (m, 1) vector of unknowns
    # beta is (m, 1) vector of constants (solution vector)

    # X is design matrix, y is outcome measures
    X = randn(5, 3)
    y = randn(5, 1)

    def mat_to_ndarray(matrix: Matrix) -> np.ndarray:
        res = pipe(
            matrix,
            lambda m: np.array(m).astype(np.float64),
            lambda a: np.round(a, 2),
        )
        return cast(np.ndarray, res)

    # Try directly applying RREF
    Xy = Matrix(np.concatenate([X, y], axis=1))
    Xy_rref, _ = Xy.rref()

    # At_A_x = At_b
    Xt_X = X.T @ X
    Xt_y = X.T @ y

    # Normal equation solution
    normal_equations = Matrix(np.concatenate([Xt_X, Xt_y], axis=1))
    X_solved, _ = normal_equations.rref()
    beta1 = X_solved[:, -1]
    # left-inverse solution
    beta2 = inv(Xt_X) @ Xt_y
    # `solve` solution
    beta3 = solve(Xt_X, Xt_y)

    pretty_print_results(
        {
            "Xy": mat_to_ndarray(Xy),
            "Xy_rref": mat_to_ndarray(Xy_rref),
            "X_solved": mat_to_ndarray(X_solved),
            "beta1": mat_to_ndarray(beta1),
            "beta2": np.round(beta2, 2),
            "beta3": np.round(beta3, 2),
        }
    )


def _least_squares_example():
    data = scipy.io.loadmat("./data/EEG_RT_data.mat")
    EEGdata: np.ndarray = data["EEGdata"]  # Matrix of channel/time (30, 99)
    rts: np.ndarray = data["rts"][0]  # Real-time signals/samples (99,)
    # frex: np.ndarray = data["frex"][0]  # frequency features (30,)

    eeg = EEGdata.T  # row: times, col: channels

    def get_beta(X_timeseries: np.ndarray, y: np.ndarray) -> np.ndarray:
        # Initialize beta coefficients vector
        rows, cols = X_timeseries.shape  # times, frequencies
        beta = np.zeros(cols)
        # Loop over frequencies
        for idx in np.arange(cols):
            # Design matrix
            feature = X_timeseries[:, idx]
            shape = (rows, 1)
            X = np.concatenate(
                [np.ones(shape), np.reshape(feature, shape)],
                axis=1,
            )
            # Compute parameters
            t = np.linalg.solve(X.T @ X, X.T @ y)
            beta[idx] = t[1]

        return beta

    # Not sure what the result is supposed to be lmao
    beta = get_beta(eeg, rts)

    pretty_print_results(
        {
            "eeg.shape": eeg.shape,
            "eeg": np.round(eeg, 2),
            "len(beta)": len(beta),
            "beta": np.round(beta, 2),
        }
    )


def _least_squares_via_qr_decomp():
    # X @ Beta = y
    X = randn(10, 3)
    y = randn(10, 1)

    # QR least squares solution
    Q, R = qr(X)
    Beta1 = inv(R.T @ R) @ (Q @ R).T @ y

    # `lstsq` solution
    Beta2, *_ = lstsq(X, y, rcond=None)

    pretty_print_results(
        {
            "X": X,
            "y": y,
            "Q": np.round(Q, 2),
            "R": np.round(R, 2),
            "Beta1": np.round(Beta1, 2),
            "Beta2": np.round(Beta2, 2),
        }
    )


def _eigendecomposition():
    # Square matrix S
    S = np.array([[1, 5], [2, 4]])
    # S = np.array([[4, -2], [1, 1]])
    eigenvalues, eigenvectors = eig(S)

    def check(S: np.ndarray, eigenvalues: np.ndarray, eigenvectors: np.ndarray) -> None:
        """Check eigenvalues/eigenvectors."""
        # Eigenvectors are columns, transpose or use `eigenvectors[:, idx]`
        for eigenval, eigenvec in zip(eigenvalues, eigenvectors.T, strict=True):
            # lambda @ v = w
            # lambda @ v = A @ v
            if not np.allclose(eigenval * eigenvec, S @ eigenvec):
                raise RuntimeError("Eigenvalues/eigenvectors don't match")

    check(S, eigenvalues, eigenvectors)

    pretty_print_results(
        {
            "S": S,
            "eigenvalues": eigenvalues,
            "eigenvectors": np.round(eigenvectors, 2),
        }
    )


def _diagonalization():
    # Symmetric matrix S
    A = np.round(10 * randn(4, 4))
    S = A.T @ A
    eigenvalues, eigenvectors = eig(S)
    # Reconstruct `A = P @ D @ inv(P)`
    S2 = eigenvectors @ np.diag(eigenvalues) @ inv(eigenvectors)

    def rmse(diffs: np.ndarray) -> np.float64:
        res = pipe(
            diffs,
            lambda m: np.reshape(m, (1, -1)),
            np.square,
            np.mean,
            np.sqrt,
        )
        return cast(np.float64, res)

    pretty_print_results(
        {
            "S": S,
            "S2": S2,
            "rmse(S - S2)": np.round(rmse(S - S2), 3),
        }
    )


def _matrix_powers_via_diagonalization():
    # A = P @ D @ inv(P)
    # A^n = P @ (D^n) @ inv(P)
    # D^n -- each diagonal element to the power of n

    A = np.random.rand(3, 3)
    S = A.T @ A

    # Compute using diagonalization
    def power_via_diagonalization(S: np.ndarray, power: int) -> np.ndarray:
        """Diagonalize, then raise diagonal to power."""
        eigenvalues, eigenvectors = np.linalg.eig(S)
        D = np.diag(eigenvalues)
        res = eigenvectors @ matrix_power(D, power) @ inv(eigenvectors)
        return res

    pretty_print_results(
        {
            "S": S,
            "matrix_power(S, 3)": matrix_power(S, 3),
            "power_via_diagonalization(S, 3)": power_via_diagonalization(S, 3),
        }
    )


@retry
def _eigenvectors_of_related_symmetric_matrices():
    # Symmetric matrix S
    A = np.random.rand(3, 3)
    S = A.T @ A

    _, V = np.linalg.eig(S)
    _, V3 = np.linalg.eig(S @ S @ S)

    if not np.allclose(V, V3):
        raise RuntimeError("Vectors are not close in value.")
    print("...")


def _orthogonal_eigenvectors_of_symmetric_matrices():
    # eigendecomposition of symmetric matrices
    # symmetric matrices -- eigenvectors are all orthogonal to each other

    A = randn(4, 4)
    S = A.T @ A

    _, eigenvectors = eig(S)

    def check_orthogonality(vectors: Iterable[np.ndarray]) -> None:
        """Check that each combination of vectors is orthogonal."""
        vectors = list(vectors)
        size = len(vectors)
        combinations = permutations(range(size), 2)
        for idx1, idx2 in combinations:
            vec1, vec2 = vectors[idx1], vectors[idx2]
            if not np.round(np.dot(vec1, vec2), 2) == 0:
                raise ValueError("Vectors are not all orthogonal.")

    check_orthogonality(eigenvectors.T)
    print("...")


def _eigenlayers():
    """Reconstruct matrix from eigenlayers (outer products)."""
    # Symmetric matrix S
    A = randn(4, 4)
    S = A.T @ A
    eigenvalues, eigenvectors = eig(S)
    # get P and D (for P @ D @ inv(P))
    D = np.diag(eigenvalues)
    P = eigenvectors

    # reconstruction in layers
    S2 = np.zeros(S.shape)
    for i in range(len(eigenvalues)):
        layer = np.outer(P[:, i] * D[i, i], P[:, i].T)
        S2 += layer

    if not np.allclose(S, S2):
        raise RuntimeError("Matrices are not close in value")
    print("...")


def _generalized_decomposition():
    A = np.array([[3, 2], [1, 3]])
    B = np.array([[1, 1], [4, 1]])

    # GED
    _, eigenvectors = scipy.linalg.eig(A, B)

    # matrix-vector multiplication
    Av = A @ eigenvectors[:, 1]
    Bv = B @ eigenvectors[:, 1]
    BinvAv = inv(B) @ A @ eigenvectors[:, 1]

    # This example is incomplete...
    print("...")


def _svd():
    # Matrix A
    A = np.array([[3, 0, 5], [8, 1, 3]])
    U, s, Vt = svd(A)  # matrix U, eigenvalues, matrix Vt

    Sigma = np.zeros(A.shape)
    max_rank = min(A.shape)
    Sigma[:max_rank, :max_rank] = np.diag(s)
    A2 = U @ Sigma @ Vt

    pretty_print_results(
        {
            "A": A,
            "A2": np.round(A2, 2),
        }
    )


def _svd_spectral_theory():
    def _get_g2d(shape: tuple[int, int]) -> np.ndarray:
        """Define a 2D Gaussian for smoothing."""
        k = int(sum(shape) / 4)
        xx = np.linspace(-3, 3, k)
        [X, Y] = np.meshgrid(xx, xx)
        g2d = np.exp(-(X**2 + Y**2) / (k / 8))
        return g2d

    # Rectangular matrix A
    shape = (40, 30)
    g2d = _get_g2d(shape)
    A = scipy.signal.convolve2d(randn(*shape), g2d, "same")

    # SVD
    # Singular values for A are related to the eigenvalues of At_A and A_At
    U, s, Vt = np.linalg.svd(A)

    # Reconstruct
    Sigma = np.zeros(shape)
    max_rank = min(*shape)
    Sigma[:max_rank, :max_rank] = np.diag(s)
    A2 = U @ Sigma @ Vt

    pretty_print_results(
        {
            "A": A,
            "A2": np.round(A2, 2),
        }
    )


def _svd_to_percent_variance():
    """Get percent-change-normalized singular values."""

    def _get_g2d(shape: tuple[int, int]) -> np.ndarray:
        """Define a 2D Gaussian for smoothing."""
        k = int(sum(shape) / 4)
        xx = np.linspace(-3, 3, k)
        [X, Y] = np.meshgrid(xx, xx)
        g2d = np.exp(-(X**2 + Y**2) / (k / 8))
        return g2d

    # Rectangular matrix A
    shape = (40, 30)
    g2d = _get_g2d(shape)
    A = scipy.signal.convolve2d(randn(*shape), g2d, "same")

    # SVD
    _, s, _ = np.linalg.svd(A)
    percent_variance = 100 * s / np.sum(s)
    print(f"percent_variance: {np.round(percent_variance, 2)}")


def _pseudoinverse():
    # # pseudoinverse for square matrix

    # Singular matrix
    A = np.arange(1, 10, 1).reshape(3, 3)
    A_rank = matrix_rank(A)
    # A = randn(4, 4)

    # Singular matrix won't have an inverse
    # A @ A_inv != I
    A_inv = inv(A)

    # A @ pinv(A) != I
    # pinv(A) @ A != I
    A_pinv = pinv(A)

    pretty_print_results(
        {
            "A": A,
            "A_rank": A_rank,
            "A_inv": A_inv,
            "A_inv @ A": A_inv @ A,
            "A @ A_inv": A @ A_inv,
            "A_pinv": np.round(A_pinv, 3),
            "A_pinv @ A": np.round(A_pinv @ A, 3),
            "A @ A_pinv": np.round(A @ A_pinv, 3),
        }
    )


def _svd_pseudoinverse():
    # Singular matrix
    A = np.arange(1, 10, 1).reshape(3, 3)
    max_rank = min(*A.shape)
    A_rank = matrix_rank(A)

    def invert_singular_values(s: np.ndarray) -> np.ndarray:
        s_inv = s.copy()
        threshold = 0.001
        s_inv[s_inv > threshold] **= -1
        s_inv[s_inv <= threshold] *= 0
        S_inv = np.zeros(A.shape)
        S_inv[:max_rank, :max_rank] = np.diag(s_inv)
        return S_inv

    U, s, Vt = svd(A)
    V = Vt.T
    S_inv = invert_singular_values(s)
    A_pinv = V @ S_inv.T @ U.T

    pretty_print_results(
        {
            "A": A,
            "A_rank": A_rank,
            "max_rank": max_rank,
            "A_pinv": np.round(A_pinv, 3),
            "A_pinv @ A": np.round(A_pinv @ A, 3),
            "pinv(A) @ A": np.round(pinv(A) @ A, 3),
        }
    )


def _condition_number():
    """Show condition number for different matrices."""
    m = 40
    n = 40

    # define a 2D Gaussian for smoothing
    k = int((m + n) / 4)
    xx = np.linspace(-3, 3, k)
    [X, Y] = np.meshgrid(xx, xx)
    g2d = np.exp(-(X**2 + Y**2) / (k / 8))

    # matrix
    A = randn(m, m)
    A2 = scipy.signal.convolve2d(randn(m, n), g2d, "same")
    A3 = np.arange(1, 10, 1).reshape(3, 3)

    def get_condition_number(A: np.ndarray) -> np.float64:
        _, s, _ = svd(A)
        condition_number = s[0] / s[-1]  # max(s) / min(s)
        return condition_number

    pretty_print_results(
        {
            # Larger condition numbers indicate ill-conditioned matrix
            "get_condition_number(A)": get_condition_number(A),
            "get_condition_number(A2)": get_condition_number(A2),
            "get_condition_number(A3)": get_condition_number(A3),
        }
    )


def _quadratic_form():
    S = [[1, 3, -2], [0, 3, 4], [-5, -2, 4]]
    w = np.transpose([[-2, 4, 3]])
    # compute the quadratic form
    # marix and vector produce scalar value
    quadratic_form = np.transpose(w) @ S @ w
    print(f"quadratic_form: {quadratic_form}")


def _pca():
    def create_data(m: int, n: int) -> np.ndarray:
        # time vector (radian units)
        t = np.linspace(0, 6 * np.pi, n)
        # Create relationship across channels (imposing covariance)
        channel_relationship = np.sin(np.linspace(0, 2 * np.pi, m))
        # initialize data
        data = np.zeros((m, n))
        # create dataset
        for i in np.arange(0, m):
            data[i, :] = np.sin(t) * channel_relationship[i]
        # add noise
        data = data + randn(m, n) / 3
        return data

    def normalize(data: np.ndarray) -> np.ndarray:
        data_centered: np.ndarray = data - data.mean()
        data_normalized: np.ndarray = data_centered / data_centered.std()
        return data_normalized

    def pca(data: np.ndarray, top_components: int) -> np.ndarray:
        covariance_matrix = np.cov(data.T)
        eigenvalues, eigenvectors = eig(covariance_matrix)
        eigenvalue_indices = eigenvalues.argsort()[::-1]
        # eigenvalues_sorted = np.real(eigenvalues[eigenvalue_indices])
        eigenvectors_sorted = eigenvectors[:, eigenvalue_indices]
        data_pca = data_normalized.dot(eigenvectors_sorted[:, :top_components])
        return data_pca

    m, n = (4, 10)  # channels, time points
    # m, n = (20, 1000)  # channels, time points
    data = create_data(m, n)
    data_normalized = normalize(data)
    data_pca = pca(data_normalized, 2)

    # TODO: Not sure if the results are correct
    pretty_print_results(
        {
            "data": np.round(data, 2),
            "data_pca": np.round(data_pca, 2),
        }
    )


# ---
# Run
# ---

if __name__ == "__main__":
    main()
