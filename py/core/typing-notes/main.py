
from typing import List, Dict, Set, Set, Tuple, Union, Any, \
    Literal, Callable, TypeVar, ParamSpec, TypedDict, TypeGuard, NotRequired
# from typing_extensions import Literal
import pendulum
import json
import random
import pandas as pd


# ---
# Main
# ---


def main():
    """Run examples"""
    print_section_title('basic primitive typing')
    basic_primitive_typing()

    print_section_title('basic container typing')
    basic_container_typing()

    print_section_title('basic type unions')
    basic_type_unions()

    print_section_title('basic type guards')
    basic_type_guards()

    print_section_title('basic literal types')
    basic_literal_types()

    print_section_title('basic function typing')
    basic_function_typing()

    print_section_title('basic generic types')
    basic_generic_types()

    print_section_title('basic type params')
    generic_type_params()

    print_section_title('basic typeddict usage')
    basic_typedict_usage()

    print_section_title('basic class typing')
    basic_class_typing()

# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


def map_res(val):
    """Map type to more print-friendly type"""
    if isinstance(val, set):
        return repr(val)
    if isinstance(val, bytes):
        return list(val)
    return val


def pretty_print_result_map(results: dict) -> None:
    """Convert values to more print-friendly types, then print"""
    mapped = {k: map_res(v) for k, v in results.items()}
    print(json.dumps(mapped, indent=2, default=str, ensure_ascii=False))


# ---
# Examples
# ---


def basic_primitive_typing():
    '''Examples of basic types'''
    # NOTE: python can infer primitive types, these are unnecessary
    str_: str = 'Is mayonnaise an instrument'
    int_: int = 5
    float_: float = 5.0
    bytes_: bytes = b"Where's the leak, mam?"

    results: Dict[str, Any] = {
        'str': str_,
        'int': int_,
        'float': float_,
        'bytes': bytes_,
    }

    pretty_print_result_map(results)


def basic_container_typing():
    """Adding types to generic container types"""

    ints: List[int] = []
    ints.append(1)

    id_name_map: Dict[str, str] = {}
    id_name_map['af893761-e36f-492e-aa3d-13f11b3f529e'] = 'Kakashi'

    colors: Set[str] = set()
    colors.add('red')
    colors.add('yellow')
    colors.add('blue')

    # You might annotate a function return like this (if tuple return/unpack)
    result: Tuple[int, bool] = (1, True)

    results = {
        'List[int]': ints,
        'Dict[str, str]': id_name_map,
        'Set[str]': colors,
        'Tuple[int, bool]': result,
    }
    pretty_print_result_map(results)


def coin_toss() -> bool:
    '''Randomly return True/False'''
    return bool(random.randint(0, 1))


def basic_type_unions():
    """Handling type unions"""
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
    """Type narrowing in a function"""
    return isinstance(val, str)


def basic_type_guards():
    """Functions that type narrow"""
    # NOTE: TypeGuard added in python 3.10
    val: str | None = None
    if coin_toss():
        val = "No one can know, not even Squidward's house"
    if is_str(val):
        print(val.upper())  # str
        return
    print(val)  # None


def basic_literal_types():
    """Literal types (basically enums)"""
    Direction = Literal['up', 'down', 'left', 'right']
    Button = Literal['a', 'b', 'x', 'y']
    Code = List[Direction | Button]

    cheat_code: Code = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a']
    print(cheat_code)


Num = Union[int, float]


def basic_function_typing():
    """Use type annotations in functions"""
    def greet(name: str) -> str:
        return f"Hello there, {name}!"

    def sum_int(*integers: int) -> int:
        return sum(integers)

    def max_(numbers: List[Num]) -> Num:
        return max(numbers)

    def quotient(x: Num, y: Num) -> float:
        return x / y

    def is_even(val: int) -> bool:
        return val % 2 == 0

    def get_bytes(s: str) -> bytes:
        return s.encode('utf-8')

    result = {
        'str -> str': greet('Kakashi'),
        'int (variadic) -> int': sum_int(1, 2, 3),
        'List[Num] -> Num': max_([1, 2, 3]),
        '(Num, Num) -> float': quotient(3, 2),
        'int -> bool': is_even(4),
        'str -> bytes': get_bytes("Patrick, go be stupid somewhere else")
    }

    pretty_print_result_map(result)


# TypeVar:
# Generic type variable
# Can use `bound` to limit to type/subtypes
# Can pass variadic types to limit type scope
T = TypeVar('T')
P = ParamSpec('P')
# Ts = TypeVarTuple("Ts")


def find(f: Callable[[T], bool], l: List[T]) -> Union[T, None]:
    """Return first element matching a predicate, else None"""
    for item in l:
        if f(item):
            return item
    return None


def basic_generic_types():
    """Generic typing"""
    result = {
        'int': find(lambda n: n > 3, [1, 2, 3, 4, 5]),
        'str': find(lambda s: s.lower().startswith('a'), ['abc', '123', 'ãêí']),
    }
    pretty_print_result_map(result)


def generic_type_params():
    """Generic type parameters"""
    def make_noisy(func: Callable[P, T]) -> Callable[P, T]:
        """Add unnecessary printing to a function"""
        def inner(*args: P.args, **kwargs: P.kwargs) -> T:
            print(f'"{func.__name__}" was called')
            print(f'args: {args} and kwargs: {kwargs}')
            res = func(*args, **kwargs)
            print(f'result: {res}')
            return res
        return inner

    def add(a: int, b: int) -> int:
        """Add two integers"""
        return a + b

    noisy_add = make_noisy(add)
    noisy_add(1, 2)


def basic_typedict_usage():
    """Using TypedDict to annotate dictionary types"""
    # NOTE:
    # TypedDict added in python 3.8 (use `typing_extensions` for 3.7)
    # TypedDict does not support runtime validation (use pydantic instead)
    # Optional fields: `NotRequired` or `total=False` and `Required`

    class NinjaNew(TypedDict):
        """Ninja creation input"""
        first_name: str
        last_name: str
        age: int

    class Ninja(NinjaNew):
        """Ninja from database"""
        id: str
        created_at: str
        updated_at: NotRequired[str]

    class Jutsu(TypedDict):
        """Jutsu from database"""
        id: str
        name: str
        description: str
        chakra_nature: str
        created_at: str
        updated_at: NotRequired[str]

    class NinjaWithJutsus(Ninja):
        """Ninja with jutsus"""
        jutsus: List[Jutsu]

    class NinjaUpdates(TypedDict, total=False):
        """Ninja update input"""
        first_name: str
        last_name: str
        age: int

    def do_something_with_ninja(ninja: Ninja | NinjaWithJutsus):
        print(json.dumps(ninja, indent=2, ensure_ascii=False))

    do_something_with_ninja({
        'id': 'af893761-e36f-492e-aa3d-13f11b3f529e',
        'first_name': 'Kakashi',
        'last_name': 'Hatake',
        'age': 26,
        'created_at': pendulum.now().to_iso8601_string(),
        'jutsus': [{
            'id': 'af893761-e36f-492e-aa3d-13f11b3f529e',
            'name': 'Chidori',
            'description': 'A thousand birds',
            'chakra_nature': 'Lightning',
            'created_at': pendulum.now().to_iso8601_string(),
        }]

    })


def basic_class_typing():
    """Class as function parameter"""

    def df_to_rows_json(df: pd.DataFrame) -> str:
        """Convert dataframe to list of rows"""
        return json.dumps(df.to_dict(orient='records'), indent=2)

    df: pd.DataFrame = pd.DataFrame([{'a': 1, 'b': 2, 'c': 3}])
    print(df_to_rows_json(df))

# ---
# Run
# ---


if __name__ == '__main__':
    main()
