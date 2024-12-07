"""Utils."""

from typing import TypeVar

T = TypeVar("T")


def first(input_list: list[T]) -> T | None:
    """Return the first item in a list, returns None if empty."""
    if len(input_list) == 0:
        return None
    return input_list[0]
