"""Numpy linalg notes."""

import json
from typing import Any, Dict

import matplotlib.pyplot as plt
import numpy as np

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


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print(f"\n{string.upper()}\n")


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
    v1 = np.array([3, -1])
    s1 = 2

    pretty_print_results(
        {
            "v1": v1,
            "s1": s1,
            "v1 + s1": v1 + s1,
            "v1 - s1": v1 - s1,
            "v1 * s1": v1 * s1,
            "v1 / s1": v1 / s1,
        }
    )


def _basic_vector_vector_arithmetic():
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
    v1 = np.array([1, 2, 3, 4, 5, 6])
    v2 = np.array([0, -4, -3, 6, 5, 4])

    def dot_product_loop(v1: np.ndarray, v2: np.ndarray):
        dp = 0
        for val1, val2 in zip(v1, v2):
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
    v1 = np.array([2, 4, -3]).astype(np.float64)
    v2 = np.array([0, -3, -3]).astype(np.float64)

    def algebraic_dot_product(v1, v2):
        res = np.dot(v1, v2)
        return np.round(res, 3)

    def geometric_dot_product(v1, v2):
        # Angle between vectors
        ang = np.arccos(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))
        res = np.linalg.norm(v1) * np.linalg.norm(v2) * np.cos(ang)
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
    v1 = np.array([1, 2, 3, 4, 5, 6])

    pretty_print_results(
        {
            "v1": v1,
            "np.sqrt(sum(np.multiply(v1, v1)))": np.sqrt(sum(np.multiply(v1, v1))),
            "np.linalg.norm(v1)": np.linalg.norm(v1),
        }
    )


def _basic_vector_hadamard_multiplication():
    """Hadamard: element-wise multiplication."""
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
    v1 = np.array([1, 2, 3])
    v2 = np.array([-1, 0, 1])

    def outer_product_explanation(v1, v2):
        """Conceptual example (slow, but good for explaining)."""
        op = np.zeros((len(v1), len(v1)))
        for i, val1 in enumerate(v1):
            for j, val2 in enumerate(v2):
                op[i, j] = val1 * val2
        return op

    pretty_print_results(
        {
            "v1": v1,
            "v2": v2,
            "np.outer(v1, v2)": np.outer(v1, v2),
            "outer_product_explanation(v1, v2)": outer_product_explanation(v1, v2),
        }
    )


# def basic_vector_cross_product():
#     # create vectors
#     v1 = [-3, 2, 5]
#     v2 = [4, -3, 0]
#     # Python's cross-product function
#     v3a = np.cross(v1, v2)
#     print(v3a)
#     # "manual" method
#     v3b = [
#         [v1[1] * v2[3] - v1[2] * v2[1]],
#         [v1[2] * v2[0] - v1[0] * v2[2]],
#         [v1[0] * v2[1] - v1[1] * v2[0]],
#     ]
#     # plot
#     fig = plt.figure()
#     ax = fig.add_subplot(projection="3d")
#     # draw plane defined by span of v1 and v2
#     xx, yy = np.meshgrid(np.linspace(-10, 10, 10), np.linspace(-10, 10, 10))
#     z1 = (-v3a[0] * xx - v3a[1] * yy) / v3a[2]
#     ax.plot_surface(xx, yy, z1)
#     # plot the two vectors
#     ax.plot([0, v1[0]], [0, v1[1]], [0, v1[2]], "k")
#     ax.plot([0, v2[0]], [0, v2[1]], [0, v2[2]], "k")
#     # ax.plot([0, cp[0]],[0, cp[1]],[0, cp[2]],'r')
#     # plot
#     ax.view_init(azim=150, elev=45)
#     plt.show()


# def basic_hermitian_transpose():
#     # hermitian transpose (conjugate transpose)

#     # create a complex number
#     z = complex(3, 4)
#     # magnitude
#     print(np.linalg.norm(z))
#     # by transpose?
#     print(np.transpose(z) * z)
#     # by Hermitian transpose
#     print(np.transpose(z.conjugate()) * z)
#     # complex vector
#     v = np.array([3, 4j, 5 + 2j, complex(2, -5)])
#     print(v.T)
#     print(np.transpose(v))
#     print(np.transpose(v.conjugate()))


# def basic_unit_vector():
#     # vector
#     v1 = np.array([-3, 6])
#     # mu
#     mu = 1 / np.linalg.norm(v1)
#     v1n = v1 * mu
#     # plot them
#     plt.plot([0, v1[0]], [0, v1[1]], "b", label="v1")
#     h = plt.plot([0, v1n[0]], [0, v1n[1]], "r", label="v1-norm")
#     plt.setp(h, linewidth=5)
#     # axis square
#     plt.axis("square")
#     plt.axis((-6, 6, -6, 6))
#     plt.grid()
#     plt.legend()
#     plt.show()


# def basic_span():
#     # set S
#     S1 = np.array([1, 1, 0])
#     S2 = np.array([1, 7, 0])
#     # vectors v and w
#     v = np.array([1, 2, 0])
#     w = np.array([3, 2, 1])
#     # draw vectors
#     fig = plt.figure()
#     ax = fig.add_subplot(projection="3d")
#     ax.plot([0, S1[0]], [0, S1[1]], [0, S1[2]], "r")
#     ax.plot([0, S2[0]], [0, S2[1]], [0, S2[2]], "r")
#     #
#     ax.plot([0, v[0]], [0, v[1]], [0, v[2]], "k")
#     ax.plot([0, w[0]], [0, w[1]], [0, w[2]], "b")
#     # now draw plane
#     xx, yy = np.meshgrid(range(30), range(30))
#     cp = np.cross(S1, S2)
#     z1 = (-cp[0] * xx - cp[1] * yy) * 1.0 / cp[2]
#     ax.plot_surface(xx, yy, z1)
#     # plot
#     plt.show()


# def basic_generate_matrices():
#     # square vs. rectangular
#     S = np.random.randn(5, 5)
#     R = np.random.randn(5, 2)  # 5 rows, 2 columns
#     print(R)

#     # identity
#     I = np.eye(3)
#     print(I)

#     # zeros
#     Z = np.zeros((4, 4))
#     print(Z)

#     # diagonal
#     D = np.diag([1, 2, 3, 5, 2])
#     print(D)

#     # create triangular matrix from full matrices
#     S = np.random.randn(5, 5)
#     U = np.triu(S)
#     L = np.tril(S)
#     print(L)

#     """
#     # concatenate matrices (sizes must match!) (error)
#     A = np.random.randn(3,2)
#     B = np.random.randn(4,4)
#     C = np.concatenate((A,B),axis=1)
#     print(C)
#     """


# # ---
# # TODO
# # ---

# # Left off on "matrix-vector multiplication"


# ---
# Run
# ---

if __name__ == "__main__":
    main()

# ---
# Figures
# ---


def basic_vector_dot_product_geometric_perspective():
    # two vectors
    v1 = np.array([2, 4, -3])
    v2 = np.array([0, -3, -3])
    # compute the angle (radians) between two vectors
    ang = np.arccos(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))
    # draw them
    fig = plt.figure()
    ax = fig.add_subplot(projection="3d")  # GCA
    ax.plot([0, v1[0]], [0, v1[1]], [0, v1[2]], "b")
    ax.plot([0, v2[0]], [0, v2[1]], [0, v2[2]], "r")
    #
    plt.axis((-6, 6, -6, 6))
    plt.title("Angle between vectors: %s rad." % ang)
    plt.show()
