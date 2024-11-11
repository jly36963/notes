"""Numpy linalg notes."""

import json
import math
from typing import Any, Dict

import numpy as np
from numpy.linalg import matrix_rank, norm, svd
from sympy import Matrix, symbols

# ---
# Main
# ---


def main():
    """Numpy linalg examples"""
    print_section_title("Basic vector-scalar arithmetic")
    _basic_vector_scalar_arithmetic()

    print_section_title("Basic vector-vector arithmetic")
    _basic_vector_vector_arithmetic()

    print_section_title("Basic vector dot product")
    _basic_vector_dot_product()

    print_section_title("Basic vector dot product (perspectives)")
    _basic_vector_dot_product_perspectives()

    print_section_title("Basic vector length")
    _basic_vector_length()

    print_section_title("Basic vector hadamard multiplication")
    _basic_vector_hadamard_multiplication()

    print_section_title("Basic vector outer product")
    _basic_vector_outer_product()

    print_section_title("Basic vector cross product")
    _basic_vector_cross_product()

    print_section_title("Basic vector hermitian transpose")
    _basic_vector_hermitian_transpose()

    print_section_title("Basic unit vector")
    _basic_unit_vector()

    print_section_title("Basic vector span")
    _basic_vector_span()

    print_section_title("Basic matrix creation")
    _basic_matrix_creation()

    print_section_title("Basic matrix-scalar arithmetic")
    _basic_matrix_scalar_arithmetic()

    print_section_title("Basic matrix-vector arithmetic")
    _basic_matrix_vector_arithmetic()

    print_section_title("diagonal and trace")
    _diagonal_and_trace()

    print_section_title("Basic matrix shift")
    basic_matrix_shift()

    print_section_title("transformation matrices")
    _transformation_matrices()

    print_section_title("transformation matrices (rotation)")
    _transform_matrices_rotation()

    print_section_title("matrix-matrix arithmetic")
    _basic_matrix_matrix_arithmetic()

    print_section_title("matmul order of operations")
    _matmul_order_of_operations()

    print_section_title("additive symmetric matrices")
    _additive_symmetric_matrices()

    print_section_title("multiplicative symmetric matrices")
    _multiplicative_symmetric_matrices()

    print_section_title("multiplicative symmetric matrices (sympy)")
    _multiplicative_symmetric_matrices_sympy()

    print_section_title("frobenius dot product")
    _frobenius_dot_product()

    print_section_title("matrix rank")
    _matrix_rank()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print("\n# ---")
    print(f"{string.upper()}")
    print("# ---\n")


def pretty_print(value: Any) -> None:
    """Pretty print any value in json format."""
    print(json.dumps(value, indent=2, default=str))


def pretty_print_results(results: Dict[str, Any]) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        print(k)
        print(type(v))
        print(v)
        print()


# ---
# Examples
# ---


def _basic_vector_scalar_arithmetic():
    vec1 = np.array([3, -1])
    scalar1 = 2

    pretty_print_results(
        {
            "vec1": vec1,
            "scalar1": scalar1,
            "vec1 + scalar1": vec1 + scalar1,
            "vec1 - scalar1": vec1 - scalar1,
            "vec1 * scalar1": vec1 * scalar1,
            "vec1 / scalar1": vec1 / scalar1,
        }
    )


def _basic_vector_vector_arithmetic():
    vec1 = np.array([3, -1])
    vec2 = np.array([2, 4])

    pretty_print_results(
        {
            "vec1": vec1,
            "vec2": vec2,
            "vec1 + vec2": vec1 + vec2,
            "vec1 - vec2": vec1 - vec2,
            "vec1 * vec2": vec1 * vec2,
            "vec1 / vec2": vec1 / vec2,
        }
    )


def _basic_vector_dot_product():
    """Dot product: results in scalar."""
    vec1 = np.array([1, 2, 3, 4, 5, 6])
    vec2 = np.array([0, -4, -3, 6, 5, 4])

    def dot_product_loop(vec1: np.ndarray, vec2: np.ndarray):
        dp = 0
        for val1, val2 in zip(vec1, vec2):
            dp = dp + (val1 * val2)
        return dp

    pretty_print_results(
        {
            "vec1": vec1,
            "vec2": vec2,
            "sum(np.multiply(vec1, vec2))": sum(np.multiply(vec1, vec2)),
            "np.dot(vec1, vec2)": np.dot(vec1, vec2),
            "np.matmul(vec1, vec2)": np.matmul(vec1, vec2),
            "dot_product_loop(vec1, vec2)": dot_product_loop(vec1, vec2),
        }
    )


def _basic_vector_dot_product_perspectives():
    vec1 = np.array([2, 4, -3]).astype(np.float64)
    vec2 = np.array([0, -3, -3]).astype(np.float64)

    def algebraic_dot_product(vec1, vec2):
        res = np.dot(vec1, vec2)
        return np.round(res, 3)

    def geometric_dot_product(vec1, vec2):
        # Angle between vectors
        ang = np.arccos(np.dot(vec1, vec2) / (norm(vec1) * norm(vec2)))
        res = norm(vec1) * norm(vec2) * np.cos(ang)
        return np.round(res, 3)

    pretty_print_results(
        {
            "vec1": vec1,
            "vec2": vec2,
            "algebraic_dot_product(vec1, vec2)": algebraic_dot_product(vec1, vec2),
            "geometric_dot_product(vec1, vec2)": geometric_dot_product(vec1, vec2),
        }
    )


def _basic_vector_length():
    """Compute the length of a multidimensional vector."""
    vec1 = np.array([1, 2, 3, 4, 5, 6])

    pretty_print_results(
        {
            "vec1": vec1,
            "np.sqrt(sum(np.multiply(vec1, vec1)))": np.sqrt(
                sum(np.multiply(vec1, vec1))
            ),
            "norm(vec1)": norm(vec1),
        }
    )


def _basic_vector_hadamard_multiplication():
    """Hadamard: element-wise multiplication."""
    vec1 = np.array([1, 3, 5])
    v2 = np.array([3, 4, 2])

    pretty_print_results(
        {
            "vec1": vec1,
            "v2": v2,
            "np.multiply(vec1, v2)": np.multiply(vec1, v2),
        }
    )


def _basic_vector_outer_product():
    vec1 = np.array([1, 2, 3])
    v2 = np.array([-1, 0, 1])

    def outer_product_explanation(vec1, v2):
        """Conceptual example (slow, but good for explaining)."""
        op = np.zeros((len(vec1), len(vec1)))
        for i, val1 in enumerate(vec1):
            for j, val2 in enumerate(v2):
                op[i, j] = val1 * val2
        return op

    pretty_print_results(
        {
            "vec1": vec1,
            "v2": v2,
            "np.outer(vec1, v2)": np.outer(vec1, v2),
            "outer_product_explanation(vec1, v2)": outer_product_explanation(vec1, v2),
        }
    )


def _basic_vector_cross_product():
    vec1 = [-3, 2, 5]
    v2 = [4, -3, 0]

    def manual_cross(vec1, v2):
        count = len(vec1)
        result = np.zeros(count)
        for i in range(count):
            plus_1 = (i + 1) % count  # Modulus used to wrap around
            plus_2 = (i + 2) % count
            result[i] = vec1[plus_1] * v2[plus_2] - vec1[plus_2] * v2[plus_1]
        return result

    pretty_print_results(
        {
            "vec1": vec1,
            "v2": v2,
            "np.cross(vec1, v2)": np.cross(vec1, v2),
            "manual_cross(vec1, v2)": manual_cross(vec1, v2),
        }
    )


def _basic_vector_hermitian_transpose():
    # Hermitian transpose (conjugate transpose)
    # Transpose of matrix, then taking complex conjugate of each entry (negate imaginary)
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
    vec1 = np.array([-3, 6])
    mu = 1 / norm(vec1)
    v1n = vec1 * mu

    pretty_print_results(
        {
            "vec1": vec1,
            "mu": mu,
            "v1n": v1n,
        }
    )


def _basic_vector_span():
    # TODO: Check this (LLM example)
    # Linear span: the span of a set of vectors
    # The linear space formed by all vectors, as linear combinations of the vectors
    vec1 = np.array([1, 2, 3])
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

    pretty_print_results(
        {
            "vec1": vec1,
            "v2": v2,
            "v3": v3,
            "linear_span_basis(vec1, v2, v3)": linear_span_basis(vec1, v2, v3),
        }
    )


def _basic_matrix_creation():
    sq_mat = np.round(np.random.randn(5, 5), 2)
    rect_mat = np.round(np.random.randn(3, 4), 2)

    pretty_print_results(
        {
            "sq_mat": sq_mat,
            "rect_mat": rect_mat,
            "np.zeros((4, 4))": np.zeros((4, 4)),
            "np.eye(3)": np.eye(3),
            "np.diag([1, 2, 3, 5, 2])": np.diag([1, 2, 3, 5, 2]),
            "np.triu(sq_mat)": np.triu(sq_mat),
            "np.tril(sq_mat)": np.tril(sq_mat),
            "np.concatenate((rect_mat, rect_mat), axis=1)": np.concatenate(
                (rect_mat, rect_mat), axis=1
            ),
        }
    )


def _basic_matrix_scalar_arithmetic():
    mat1 = np.arange(1, 10, 1).reshape(3, 3)

    pretty_print_results(
        {
            "mat1": mat1,
            "mat1 + 2": mat1 + 2,
            "mat1 - 2": mat1 - 2,
            "mat1 * 2": mat1 * 2,
            "mat1 / 2": mat1 / 2,
            "mat1**2": mat1**2,
        }
    )


def _basic_matrix_vector_arithmetic():
    mat1 = np.arange(1, 13, 1).reshape(4, 3)
    vec1 = np.array([2, 1, 3])

    pretty_print_results(
        {
            "mat1": mat1,
            "vec1": vec1,
            "mat1 + vec1": mat1 + vec1,
            "mat1 - vec1": mat1 - vec1,
            "mat1 * vec1": mat1 * vec1,
            "vec1 * mat1": vec1 * mat1,  # Same as `mat1 * vec1`
            "mat1 / vec1": mat1 / vec1,
            "mat1**vec1": mat1**vec1,
            # Dot product
            "np.dot(mat1, vec1)": np.dot(mat1, vec1),
            # Multiply by transposed
            "mat1.T * vec1.reshape(-1, 1)": mat1.T * vec1.reshape(-1, 1),
        }
    )


def _diagonal_and_trace():
    vec1 = np.arange(1, 10)
    mat1 = np.arange(1, 10).reshape(3, 3)

    # NOTE:
    # matmul and hadamard multiplication are the same for diagonal matrices
    # inverse of diagonal matrix: `1/n` for each diagonal element

    pretty_print_results(
        {
            "vec1": vec1,
            "mat1": mat1,
            "np.diag(mat1)": np.diag(mat1),  # diag matrix -> vector
            "np.diag(vec1)": np.diag(vec1),  # vector -> diag matrix
            "np.trace(mat1)": np.trace(mat1),
            "sum(np.diag(mat1))": sum(np.diag(mat1)),
        }
    )


def basic_matrix_shift():
    """Shifting a matrix can be useful in concrete applications of linear algebra."""
    mat1 = np.arange(1, 10, 1).reshape(3, 3)  # Must be square
    diag1 = np.eye(3) * 2

    pretty_print_results(
        {
            "mat1": mat1,
            "diag1": diag1,
            "mat1 + diag1": mat1 + diag1,
        }
    )


def _transformation_matrices():
    vec1 = np.array([3, -2])
    mat1 = np.array([[1, -1], [2, 1]])
    # res1 = mat1 @ vec1.T # [5, 4]

    pretty_print_results(
        {
            "vec1": vec1,
            "mat1": mat1,
            "mat1 @ vec1.T": mat1 @ vec1.T,
        }
    )


def _transform_matrices_rotation():
    vec1 = np.array([3, -2])
    theta = np.pi / 2  # 90 degrees
    mat1 = np.array(
        [
            [math.cos(theta), -math.sin(theta)],
            [math.sin(theta), math.cos(theta)],
        ]
    )
    # res1 = mat1 @ vec1.T # [2, 3]

    pretty_print_results(
        {
            "vec1": vec1,
            "mat1": mat1,
            "mat1 @ vec1.T": mat1 @ vec1.T,
        }
    )


def _basic_matrix_matrix_arithmetic():
    # Matmul:
    # mat1 left-multiples mat2
    # For dimensions `(m1, n1) @ (m2, n2)`, n1 must equal m2
    # Shape `(m1, n1) @ (m2, n2)` produce shape `(m1, n2)`

    mat1 = np.arange(1, 13, 1).reshape(4, 3)
    mat2 = np.arange(1, 13, 1).reshape(4, 3)

    pretty_print_results(
        {
            "mat1": mat1,
            "mat2": mat2,
            # Element-wise operations
            "mat1 + mat2": mat1 + mat2,
            "mat1 - mat2": mat1 - mat2,
            "mat1 * mat2": mat1 * mat2,  # Hadamard product
            "np.multiply(mat1, mat2)": np.multiply(mat1, mat2),  # Hadamard product
            "mat1 / mat2": mat1 / mat2,  # Hadamard division
            "np.divide(mat1, mat2)": np.divide(mat1, mat2),  # Hadamard division
            "mat1**mat2": mat1**mat2,
            # Matrix multiplication
            "mat1 @ mat2.T": mat1 @ mat2.T,  # Dot product
            "np.dot(mat1, mat2.T)": np.dot(mat1, mat2.T),  # Dot product
            "np.matmul(mat1, mat2.T)": np.matmul(mat1, mat2.T),  # Dot product
        }
    )


def _matmul_order_of_operations():
    mat1 = np.arange(1, 10).reshape(3, 3)
    mat2 = mat1.copy() + 1
    mat3 = mat1.copy() - 1
    mat4 = mat1.copy() * 2

    pretty_print_results(
        {
            "mat1": mat1,
            "mat2": mat2,
            "mat3": mat3,
            "mat4": mat4,
            # Below results are the same (potential computer rounding errors)
            "mat1 @ mat2 @ mat3 @ mat4": mat1 @ mat2 @ mat3 @ mat4,
            "mat4.T @ mat3.T @ mat2.T @ mat1.T": mat4.T @ mat3.T @ mat2.T @ mat1.T,
        }
    )


def _additive_symmetric_matrices():
    mat1 = np.arange(1, 10).reshape(3, 3)
    mat_sym = (mat1 + mat1.T) / 2

    pretty_print_results(
        {
            "mat1": mat1,
            "mat_sym": mat_sym,
            "mat_sym - mat_sym.T": mat_sym - mat_sym.T,  # zeros
        }
    )


def _multiplicative_symmetric_matrices():
    mat1 = np.arange(1, 7).reshape(3, 2)
    at_a = mat1.T @ mat1
    a_at = mat1 @ mat1.T

    def _is_symmetric(matrix: np.ndarray):
        shape = matrix.shape
        if len(shape) != 2:
            raise ValueError("Not a matrix")
        m, n = shape
        if m != n:
            return False
        return np.allclose(matrix, matrix.T)

    pretty_print_results(
        {
            "mat1": mat1,
            "at_a": at_a,
            "a_at": a_at,
            "_is_symmetric(at_a)": _is_symmetric(at_a),
            "_is_symmetric(a_at)": _is_symmetric(a_at),
            "at_a - at_a.T": at_a - at_a.T,
            "a_at - a_at.T": a_at - a_at.T,
        }
    )


def _multiplicative_symmetric_matrices_sympy():
    # multiplication of two symmetric matrices (pt1)
    # multiplying two symmetric matrices (most likely) produces a non-symmetric matrix

    def get_symbols():
        """Return the alphabet as a tuple of symbols."""
        return symbols("a b c d e f g h i j k l m n o p q r s t u v w x y z", real=True)

    a, b, c, d, e, f, _, h, _, _, _, l, m, n, o, _, q, r, _, t, _, _, _, _, _, _ = (
        get_symbols()
    )
    # symmetric and constant-diagonal matrices
    mat1 = Matrix([[a, b, c, d], [b, a, e, f], [c, e, a, h], [d, f, h, a]])
    mat2 = Matrix([[l, m, n, o], [m, l, q, r], [n, q, l, t], [o, r, t, l]])

    def _is_symmetric_sympy(matrix: Matrix):
        shape = matrix.shape
        if len(shape) != 2:
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
            "mat1": mat1,
            "mat2": mat2,
            # Symmetric
            "_is_symmetric_sympy(mat1)": _is_symmetric_sympy(mat1),
            "_is_symmetric_sympy(mat2)": _is_symmetric_sympy(mat2),
            # Asymmetric
            "_is_symmetric_sympy(mat1 @ mat2)": _is_symmetric_sympy(mat1 @ mat2),
        }
    )


def _frobenius_dot_product():
    mat1 = np.arange(1, 13).reshape(4, 3)
    mat2 = mat1.copy()

    pretty_print_results(
        {
            "mat1": mat1,
            "mat2": mat2,
            # Sum of hadamard
            "np.sum(mat1 * mat2)": np.sum(mat1 * mat2),
            # Dot product of vectorized matrices (flatten, ravel, reshape)
            "np.dot(mat1.ravel(), mat2.ravel())": np.dot(mat1.ravel(), mat2.ravel()),
            # trace(At @ B)
            "np.trace(mat1.T @ mat2)": np.trace(mat1.T @ mat2),
        }
    )


def _matrix_rank():
    # 4 rows, 3 cols
    # Max rank of 3 (min dimension)
    m, n = 4, 3
    mat1 = np.round(np.random.randn(m, n), 2)

    # Make a row dependent (rank unaffected)
    mat2 = mat1.copy()
    mat2[m - 1] = mat2[m - 2]

    # Make a col dependent (rank decreased)
    mat3 = mat1.copy()
    mat3[:, n - 1] = mat3[:, n - 2]

    # Noise to fix rank-deficiency (rank restored)
    mat4 = mat3.copy()
    mat4 = mat4 + 0.001 * np.random.randn(m, n)

    # Shift to fix rank-deficiency (rank restored)
    mat5 = mat3.copy()
    mat5 = mat5 + 0.001 * np.eye(m, n)

    # Symmetric matrices
    at_a = mat1.T @ mat1  # (3,3), rank 3
    a_at = mat1 @ mat1.T  # (4,4), rank 3

    pretty_print_results(
        {
            # 4 by 3, max rank is 3
            "mat1": mat1,
            "mat2": mat2,
            "mat3": mat3,
            "mat4": mat4,
            "mat5": mat5,
            # Rank is 3 (no cols are dependent)
            "matrix_rank(mat1)": matrix_rank(mat1),
            # Rank is 3 (some rows are dependent, but no cols are)
            "matrix_rank(mat2)": matrix_rank(mat2),
            # Rank is 2 (some cols are dependent)
            "matrix_rank(mat3)": matrix_rank(mat3),
            # Rank is 3 (noise added to rank-deficient matrix)
            "matrix_rank(mat4)": matrix_rank(mat4),
            # Rank is 3 (shift added to rank-deficient matrix)
            "matrix_rank(mat5)": matrix_rank(mat5),
            # AtA (3,3) and AAt (4,4): rank 3
            "at_a": at_a,
            "a_at": a_at,
            "matrix_rank(at_a)": matrix_rank(at_a),
            "matrix_rank(a_at)": matrix_rank(a_at),
        }
    )


# ---
# Run
# ---

if __name__ == "__main__":
    main()
