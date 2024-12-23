"""Numpy notes."""

import json

import numpy as np
import scipy.stats as st

# ---
# Main
# ---


def main():
    """Run a bunch of example code snippets."""
    print_section_title("basic array creation")
    _basic_array_creation()

    print_section_title("basic multidimensional array")
    _basic_multidimensional_array()

    print_section_title("basic array stats")
    _basic_array_stats()

    print_section_title("basic array shaping")
    _basic_array_shaping()

    print_section_title("basic array arithmetic")
    _basic_array_arithmetic()

    print_section_title("basic array agg")
    _basic_array_agg()

    print_section_title("basic array methods")
    _basic_array_methods()

    print_section_title("basic array round")
    _basic_array_round()

    print_section_title("basic vectorization")
    _basic_vectorization()

    print_section_title("basic ufunc unary")
    _basic_ufunc_unary()

    print_section_title("basic ufunc binary")
    _basic_ufunc_binary()

    print_section_title("basic ufunc comparison")
    _basic_ufunc_comparison()

    print_section_title("basic array sets")
    _basic_array_sets()

    print_section_title("basic array bool")
    _basic_array_bool()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Uppercase and newline wrap a string, then print it."""
    print(f"\n{string.upper()}\n")


def pretty_print(value) -> None:
    """Pretty print any value in json format."""
    print(json.dumps(value, indent=2, default=str))


def pretty_print_results(results: dict) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        print(k)
        print(v)


# ---
# Examples
# ---


def _basic_array_creation():
    pretty_print_results(
        {
            "np.array([1, 2, 3])": np.array([1, 2, 3]),  # np.ndarray
            "np.arange(5)": np.arange(5),  # range
            "np.arange(1, 6)": np.arange(1, 6),  # range with start/stop
            "np.arange(2, 11, 2)": np.arange(2, 12, 2),  # range with start/stop/step
            "np.zeros(shape=(2,3))": np.zeros(shape=(2, 3)),  # ndarray of zeros
            "np.ones(shape=(3,2))": np.ones(shape=(3, 2)),  # ndarray of zeros
            "np.random.randn()": np.random.randn(),  # normal distribution
            "np.random.randn(5)": np.random.randn(5),
            "np.random.randn(2, 3)": np.random.randn(2, 3),
            "np.random.normal(loc=0.0, scale=1.0, size=(3, 3))": np.random.normal(
                loc=0.0, scale=1.0, size=(3, 3)
            ),  # normal distribution (with more options)
            "np.random.uniform(low=0, high=5, size=(3,3))": np.random.uniform(
                low=0, high=5, size=(3, 3)
            ),
            "np.random.randint(low=0, high=10, size=5)": np.random.randint(
                low=0, high=10, size=5
            ),
            "np.linspace(0, 10, 6)": np.linspace(0, 10, 6),
            "np.eye(3)": np.eye(3),
            "np.array([1, 2, 3]).copy()": np.array([1, 2, 3]).copy(),
            "np.arange(1, 10, 1).reshape(3, 3)": np.arange(1, 10, 1).reshape(3, 3),
            "np.concatenate([np.arange(3), np.arange(3)], axis=0)": np.concatenate(
                [np.arange(3), np.arange(3)], axis=0
            ),
            "np.stack([np.arange(3), np.arange(3)])": np.stack(
                [np.arange(3), np.arange(3)]
            ),
        }
    )


def _basic_multidimensional_array():
    """TODO."""
    arr = np.arange(1, 13).reshape(3, 4)

    pretty_print_results(
        {
            "arr": arr,
            "arr.shape": arr.shape,
            "arr.ndim": arr.ndim,
            "arr.size": arr.size,
            "arr.itemsize": arr.itemsize,
            # row 1, col 3
            "arr[0, 2]": arr[0, 2],
            # all rows, col 1
            "arr[:, 0]": arr[:, 0],
            # row 3, all cols
            "arr[2, :]": arr[2, :],
            # rows 1 and2, cols 2 and 3
            "arr[0:2, 1:3]": arr[0:2, 1:3],
            # filter with mask
            "arr[arr > 5]": arr[arr > 5],  # noqa: PLR2004
            # select specific
            "arr[[0,2]]": arr[[0, 2]],
        }
    )

    # Iterate over ndarray element-wise
    print("arr.flat loop")
    for n in arr.flat:
        print(n)


def _basic_array_stats():
    """Get stats about the array."""
    arr: np.ndarray = st.binom.rvs(n=6, size=10, p=0.5)  # type: ignore

    pretty_print_results(
        {
            "arr": arr,
            # Methods
            "arr.argmax()": arr.argmax(),
            "arr.argmin()": arr.argmin(),
            "arr.max()": arr.max(),
            "arr.min()": arr.min(),
            "arr.mean()": arr.mean(),
            "arr.std()": arr.std(),
            "arr.var()": arr.var(),
            # Functions
            "np.median(arr)": np.median(arr),
            "st.mode(arr)": tuple(st.mode(arr)),
        }
    )


def _basic_array_shaping():
    """Reshaping arrays."""
    arr = np.arange(1, 7)

    pretty_print_results(
        {
            "arr": arr,
            "arr.reshape(2, 3)": arr.reshape(2, 3),
            "arr.T": arr.T,
            "arr.reshape(2, 3).swapaxes(0, 1)": arr.reshape(2, 3).swapaxes(0, 1),
            "arr.reshape(2,3).flatten()": arr.reshape(2, 3).flatten(),
        }
    )


def _basic_array_arithmetic():
    """Show array arithmetic examples."""
    arr = np.arange(1, 6)

    pretty_print_results(
        {
            "arr": arr,
            "arr + 5": arr + 5,
            "arr * 2": arr * 2,
            "arr**2": arr**2,
            "arr / 2": arr / 2,
            "arr + arr": arr + arr,
            "arr * arr": arr * arr,
            "1 / arr": 1 / arr,
        }
    )


def _basic_array_agg():
    """Show aggregation function examples."""
    arr = np.arange(9).reshape(3, 3)
    pretty_print_results(
        {
            "arr": arr,
            "arr.max()": arr.max(),
            "arr.min()": arr.min(),
            "arr.prod()": arr.prod(),
            "arr.prod(axis=0)": arr.prod(axis=0),
            "arr.sum()": arr.sum(),
            "arr.sum(axis=0)": arr.sum(axis=0),
        }
    )

    # Also cumprod, cumsum


def _basic_array_methods():
    """TODO."""
    # tolist, view, fill, reshape/resize, transpose, ravel, squeeze
    # take, sort, nonzero
    arr = np.random.randint(low=-10, high=10, size=5)
    pretty_print_results(
        {
            "arr": arr,
            "arr.clip(min=-5, max=5)": arr.clip(min=-5, max=5),
        }
    )


def _basic_array_round():
    """TODO."""
    arr: np.ndarray = st.norm.rvs(size=10, loc=0, scale=10)  # type: ignore

    pretty_print_results(
        {
            "arr": arr,
            "np.round(arr, 3)": np.round(arr, 3),
            "np.ceil(arr)": np.ceil(arr),
            "np.floor(arr)": np.floor(arr),
            "np.trunc(arr)": np.trunc(arr),
        }
    )


def _basic_vectorization():
    """Use vectorization to apply a func element-wise."""
    arr = np.arange(11)

    def add_one(n):
        return n + 1

    add_one_vectorized = np.vectorize(add_one)

    pretty_print_results(
        {
            "arr": arr,
            "add_one_vectorized(arr)": add_one_vectorized(arr),
        }
    )


def _basic_ufunc_unary():
    """Element-wise operations over a single array."""
    arr = np.arange(1, 6)

    pretty_print_results(
        {
            "arr": arr,
            "np.sqrt(arr)": np.sqrt(arr),
            "np.square(arr)": np.square(arr),
            "np.exp(arr)": np.exp(arr),
            "np.exp2(arr)": np.exp2(arr),
            "np.log(arr)": np.log(arr),
            "np.log2(arr)": np.log2(arr),
            "np.log10(arr)": np.log10(arr),
            "np.negative(arr)": np.negative(arr),
            "np.positive(arr)": np.positive(arr),
            "np.absolute(arr)": np.absolute(arr),
            "np.isfinite(arr)": np.isfinite(arr),
        }
    )


def _basic_ufunc_binary():
    """Element-wise operations over two arrays."""
    arr1 = np.arange(1, 6)
    arr2 = np.ones(5) + np.round(np.random.normal(size=5), 2)
    pretty_print_results(
        {
            "arr1": arr1,
            "arr2": arr2,
            "np.add(arr1, arr2)": np.add(arr1, arr2),
            "np.subtract(arr1, arr2)": np.subtract(arr1, arr2),
            "np.multiply(arr1, arr2)": np.multiply(arr1, arr2),
            "np.divide(arr1, arr2)": np.divide(arr1, arr2),
            "np.power(arr1, arr2)": np.power(arr1, arr2),
            "np.maximum(arr1, arr2)": np.maximum(arr1, arr2),
            "np.minimum(arr1, arr2)": np.minimum(arr1, arr2),
        }
    )


def _basic_ufunc_comparison():
    """Element-wise comparisons."""
    arr1 = np.arange(1, 6)
    arr2 = arr1.copy() + np.round(np.random.normal(size=5), 2)

    pretty_print_results(
        {
            "np.greater(arr1, arr2)": np.greater(arr1, arr2),
            "np.greater_equal(arr1, arr2)": np.greater_equal(arr1, arr2),
            "np.less(arr1, arr2)": np.less(arr1, arr2),
            "np.less_equal(arr1, arr2)": np.less_equal(arr1, arr2),
            "np.equal(arr1, arr2)": np.equal(arr1, arr2),
            "np.isin([1, 2, 3], [1, 3, 5])": np.isin(
                [1, 2, 3],
                [1, 3, 5],
            ),
        }
    )


def _basic_array_sets():
    """TODO."""
    pretty_print_results(
        {
            "np.isin([1, 2, 3], [1, 3, 5])": np.isin(
                [1, 2, 3],
                [1, 3, 5],
            ),
            "np.intersect1d([1, 2, 3], [1, 3, 5])": np.intersect1d(
                [1, 2, 3], [1, 3, 5]
            ),
            "np.setdiff1d([1, 2, 3], [1, 3, 5])": np.setdiff1d([1, 2, 3], [1, 3, 5]),
            "np.setxor1d([1, 2, 3], [1, 3, 5])": np.setxor1d([1, 2, 3], [1, 3, 5]),
            "np.union1d([1, 2, 3], [1, 3, 5])": np.union1d([1, 2, 3], [1, 3, 5]),
            "np.unique([1, 1, 1, 2, 2, 3])": np.unique([1, 1, 1, 2, 2, 3]),
        }
    )


def _basic_array_bool():
    """Boolean operations with arrays."""
    arr = np.arange(1, 6)

    arr1 = np.array([True, True, False])
    arr2 = np.array([True, False, False])

    # Use `&` `|`
    # Don't use `and` `or`

    pretty_print_results(
        {
            "arr": arr,
            "arr >= 3": arr >= 3,  # noqa: PLR2004
            "arr[arr % 2 == 0]": arr[arr % 2 == 0],
            "(arr >= 2) & (arr <= 4)": (arr >= 2) | (arr <= 4),  # noqa: PLR2004
            "arr1": arr1,
            "arr2": arr2,
            "np.logical_and(arr1, arr2)": np.logical_and(arr1, arr2),
            "np.logical_or(arr1, arr2)": np.logical_or(arr1, arr2),
            "np.logical_xor(arr1, arr2)": np.logical_xor(arr1, arr2),
            "arr1.all()": arr1.all(),
            "arr1.any()": arr1.any(),
        }
    )

    # TODO: np.logical_not, np.where


# ---
# Run
# ---

if __name__ == "__main__":
    main()
