"""Typing notes."""

import json
import random
from typing import (  # noqa: UP035
    Any,
    Callable,
    Literal,
    NotRequired,
    ParamSpec,
    TypedDict,
    TypeGuard,
    TypeVar,
)

import pandas as pd
import pendulum

# ---
# Main
# ---


def main():
    """Run examples."""
    examples = {
        "basic primitive typing": _basic_primitive_typing,
        "basic container typing": _basic_container_typing,
        "basic type unions": _basic_type_unions,
        "basic type guards": _basic_type_guards,
        "basic literal types": _basic_literal_types,
        "basic function typing": _basic_function_typing,
        "basic generic types": _basic_generic_types,
        "basic type params": _generic_type_params,
        "basic typeddict usage": _basic_typedict_usage,
        "basic class typing": _basic_class_typing,
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


def _basic_primitive_typing():
    # NOTE: python can infer primitive types, these are unnecessary
    str_: str = "Is mayonnaise an instrument"
    int_: int = 5
    float_: float = 5.0
    bytes_: bytes = b"Where's the leak, mam?"

    results: dict[str, Any] = {
        "str": str_,
        "int": int_,
        "float": float_,
        "bytes": bytes_,
    }

    pretty_print_results(results)


def _basic_container_typing():
    """Adding types to generic container types."""
    ints: list[int] = []
    ints.append(1)

    id_name_map: dict[str, str] = {}
    id_name_map["af893761-e36f-492e-aa3d-13f11b3f529e"] = "Kakashi"

    colors: set[str] = set()
    colors.add("red")
    colors.add("yellow")
    colors.add("blue")

    # You might annotate a function return like this (if tuple return/unpack)
    result: tuple[int, bool] = (1, True)

    results = {
        "List[int]": ints,
        "Dict[str, str]": id_name_map,
        "Set[str]": colors,
        "Tuple[int, bool]": result,
    }
    pretty_print_results(results)


def coin_toss() -> bool:
    """Randomly return True/False."""
    return bool(random.randint(0, 1))  # noqa: S311


def _basic_type_unions():
    """Handle type unions."""
    # Use `Union[str, None]` in older python versions (instead of `str | None`)
    # Can use `Optional[T]` instead of `Union[T, None]`

    # `val` is one of two types
    val: str | None = None
    if coin_toss():
        val = "The inner machinations of my mind are an enigma"

    # At this point, you cannot safely call string methods on `val`
    # `val` could be `str | None`, and `None` does not have string methods

    # Type narrowing
    if isinstance(val, str):
        # In this block, `val` is a str
        # Can safely call string methods
        print(val.upper())  # str
        return

    print(val)  # None


def is_str(val: Any) -> TypeGuard[str]:
    """Type narrow in a function."""
    return isinstance(val, str)


def _basic_type_guards():
    """Functions that type narrow."""
    # NOTE: TypeGuard added in python 3.10
    val: str | None = None
    if coin_toss():
        val = "No one can know, not even Squidward's house"
    if is_str(val):
        print(val.upper())  # str
        return
    print(val)  # None


Direction = Literal["up", "down", "left", "right"]
Button = Literal["a", "b", "x", "y"]
Code = list[Direction | Button]


def _basic_literal_types():
    """Literal types (basically enums)."""
    cheat_code: Code = [
        "up",
        "up",
        "down",
        "down",
        "left",
        "right",
        "left",
        "right",
        "b",
        "a",
    ]
    print(cheat_code)


Num = int | float


def _basic_function_typing():
    """Use type annotations in functions."""

    def greet(name: str) -> str:
        return f"Hello there, {name}!"

    def sum_int(*integers: int) -> int:
        return sum(integers)

    def max_(numbers: list[Num]) -> Num:
        return max(numbers)

    def quotient(x: Num, y: Num) -> float:
        return x / y

    def is_even(val: int) -> bool:
        return val % 2 == 0

    def get_bytes(s: str) -> bytes:
        return s.encode("utf-8")

    result = {
        "str -> str": greet("Kakashi"),
        "int (variadic) -> int": sum_int(1, 2, 3),
        "List[Num] -> Num": max_([1, 2, 3]),
        "(Num, Num) -> float": quotient(3, 2),
        "int -> bool": is_even(4),
        "str -> bytes": get_bytes("Patrick, go be stupid somewhere else"),
    }

    pretty_print_results(result)


# TypeVar:
# Generic type variable
# Can use `bound` to limit to type/subtypes
# Can pass variadic types to limit type scope
T = TypeVar("T")
P = ParamSpec("P")
# Ts = TypeVarTuple("Ts")


def find(func: Callable[[T], bool], values: list[T]) -> T | None:
    """Return first element matching a predicate, else None."""
    for value in values:
        if func(value):
            return value
    return None


def _basic_generic_types():
    """Use generic types."""
    result = {
        "int": find(lambda n: n > 3, [1, 2, 3, 4, 5]),  # noqa: PLR2004
        "str": find(lambda s: s.lower().startswith("a"), ["abc", "123", "ãêí"]),
    }
    pretty_print_results(result)


def _generic_type_params():
    """Use generic type parameters."""

    def make_noisy(func: Callable[P, T]) -> Callable[P, T]:
        """Add unnecessary printing to a function."""

        def inner(*args: P.args, **kwargs: P.kwargs) -> T:
            print(f'"{func.__name__}" was called')
            print(f"args: {args} and kwargs: {kwargs}")
            res = func(*args, **kwargs)
            print(f"result: {res}")
            return res

        return inner

    def add(a: int, b: int) -> int:
        """Add two integers."""
        return a + b

    noisy_add = make_noisy(add)
    noisy_add(1, 2)


def _basic_typedict_usage():
    """Use TypedDict to annotate dictionary types."""
    # NOTE:
    # TypedDict added in python 3.8 (use `typing_extensions` for 3.7)
    # TypedDict does not support runtime validation (use pydantic instead)
    # Optional fields: `NotRequired` or `total=False` and `Required`

    class NinjaNew(TypedDict):
        """Ninja creation input."""

        first_name: str
        last_name: str
        age: int

    class Ninja(NinjaNew):
        """Ninja from database."""

        id: str
        created_at: str
        updated_at: NotRequired[str]

    class Jutsu(TypedDict):
        """Jutsu from database."""

        id: str
        name: str
        description: str
        chakra_nature: str
        created_at: str
        updated_at: NotRequired[str]

    class NinjaWithJutsus(Ninja):
        """Ninja with jutsus."""

        jutsus: list[Jutsu]

    def do_something_with_ninja(ninja: NinjaWithJutsus):
        print(json.dumps(ninja, indent=2, ensure_ascii=False))

    do_something_with_ninja(
        {
            "id": "af893761-e36f-492e-aa3d-13f11b3f529e",
            "first_name": "Kakashi",
            "last_name": "Hatake",
            "age": 26,
            "created_at": pendulum.now().to_iso8601_string(),
            "jutsus": [
                {
                    "id": "af893761-e36f-492e-aa3d-13f11b3f529e",
                    "name": "Chidori",
                    "description": "A thousand birds",
                    "chakra_nature": "Lightning",
                    "created_at": pendulum.now().to_iso8601_string(),
                }
            ],
        }
    )


def _basic_class_typing():
    """Class as function parameter."""

    def df_to_rows_json(df: pd.DataFrame) -> str:
        """Convert dataframe to list of rows."""
        return json.dumps(df.to_dict(orient="records"), indent=2)

    df: pd.DataFrame = pd.DataFrame([{"a": 1, "b": 2, "c": 3}])
    print(df_to_rows_json(df))


# ---
# Run
# ---


if __name__ == "__main__":
    main()
