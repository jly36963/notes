
from typing import List, Dict, Set, Optional, Union, Any, Callable, TypeVar, TypedDict
import datetime
from uuid import UUID

# ---
# Simple types
# ---


def greet(name: str) -> str:
    '''String example'''
    return f"Hello there, {name}!"


def sum_int(*integers: int) -> int:
    '''Integer example'''
    return sum(integers)


def product(x: float, y: float) -> float:
    '''Float example'''
    return x * y


def is_string(value: Any) -> bool:
    '''Boolean example'''
    return isinstance(value, str)


def get_bytes(s: str) -> bytes:
    '''Bytes example'''
    return s.encode('utf-8')


def print_upper(s: str) -> None:
    '''None example'''
    print(s.upper())

# ---
# Generic types
# ---


T = TypeVar('T')


def find(f: Callable, l: List[T]) -> Union[T, None]:
    """
    Callable, Typevar example

    Example usage:
    find(
        lambda x: x.get('id') == 123,
        [{'id': 100}, {'id': 123}]
    )
    """
    if not callable(f):
        raise Exception('Argument "f" must be a callable')
    if not isinstance(l, list):
        raise Exception('Argument "l" must be a list')

    for item in l:
        if f(item):
            return item
    return None


def greet2(name: Optional[str] = None) -> str:
    '''Optional example'''
    if name:
        return f"Hello there, {name}!"
    else:
        return f"Hello there!"


def greet3(name: Union[str, None] = None) -> str:
    '''Union example'''
    if name:
        return f"Hello there, {name}!"
    else:
        return f"Hello there!"


def safe_get(d: Dict[str, T], key: str) -> Union[T, None]:
    '''Dictionary example'''
    if not (isinstance(d, dict) and isinstance(key, str)):
        return None

    return d.get(key)


def sort_by_id(people: List[dict]) -> List[dict]:
    '''List example'''
    people.sort(key=lambda x: x['id'])
    return people


def pop_set(s: Set[T]) -> T:
    '''Set Example'''
    return s.pop()

# ---
# Typed dictionary
# ---


class Ninja(TypedDict):
    id: UUID
    first_name: str
    last_name: str
    age: int
    created_at: datetime.datetime
    updated_at: Union[datetime.datetime, None]
    jutsus: Union[List[dict], None]


class NinjaUpdates(TypedDict, total=False):
    first_name: str
    last_name: str
    age: int


def get_ninja_name(ninja: Ninja):
    """Get the first and last name of the ninja"""
    return f"{ninja['first_name']} {ninja['last_name']}"


def update_ninja(ninja: Ninja, updates: NinjaUpdates) -> Ninja:
    """Take a ninja and override some of the user-defined fields"""
    updated: Ninja = {**ninja, **updates}
    return updated


# ---
# Classes
# ---


class Person:
    def __init__(self, name: str):
        self.name = name


def get_person_name(one_person: Person):
    return one_person.name
