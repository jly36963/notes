"""Python basics."""

import collections
import functools
import sys
from collections.abc import Callable
from typing import Any

# ---
# Main
# ---


def main():
    """Run python examples."""
    examples = {
        "strings": _strings,
        "lists": _lists,
        "dicts": _dicts,
        "tuples": _tuples,
        "sets": _sets,
        "control flow": _control_flow,
        "functions": _functions,
        "error handling": _error_handling,
        "io": _io,
        "iterators": _iterators,
        "generators": _generators,
        "decorators": _decorators,
        "built_ins": _built_ins,
        "args": _args,
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


def _strings():
    # "I don't have school today!"
    # r"this is a r\a\w\ string!"
    # """use triple quotes for long/multi-line strings."""
    # 3 * "ha"  # hahaha
    # "py" + "thon"

    str1 = "hello"
    str1.capitalize()  # returns string, first character capitalized
    str1.lower()  # returns string, all characters lowercase
    str1.upper()  # returns string, all characters uppercase
    str1.find("h")  # returns index of substring (-1 if not found)
    str1.find("h", 0, -1)  # substring, start, end
    str1.index("h")  # returns index of substring (ValueError if not found)
    str1.index("h", 0, -1)  # substring, start, end
    str1.isalnum()  # alphanumeric? True : False
    str1.isalpha()  # alpha? True : False
    str1.isnumeric()  # numeric? True : False
    str1.strip()  # returns string, removes whitespace on both ends
    str1.strip(
        "abcdefgh"
    )  # strip chars from left until no match, repeat on right side.
    str1.replace(
        "hello", "hi"
    )  # return string, replace occurences of old substring with new substring.
    str1.rfind("h")  # returns index of last instance of substring (-1 if not found)
    str1.split(",")  # return list of strings (split at arg value)

    def _string_formatting():
        # # We are the knights who say "Ni!"
        # 'We are the {} who say "{}!"'.format("knights", "Ni")
        # # spam and eggs
        # "{0} and {1}".format("spam", "eggs")
        # # eggs and spam
        # "{1} and {0}".format("spam", "eggs")
        # # This spam is absolutely horrible.
        # "This {food} is {adjective}.".format(food="spam", adjective="absolutely horrible")

        name = "Kakashi"
        age = 27
        f"My name is {name} and I am {age} years old."

    def _indexing():
        word = "Python"
        word[0]  # P (index starts at 0)
        word[5]  # n
        word[-1]  # n (negative indices start at -1)
        word[-6]  # P
        word[0:2]  # Py (slices before '0' and right before '2'.)
        word[2:5]  # tho
        word[:5]  # Pytho
        word[2:]  # thon
        word[42]  # error
        word[4:42]  # on
        word[42:]  # [empty string]
        "why " + word[2:5] + "?"  # why tho?
        len(word) == 6


def _lists():
    squares = [1, 4, 9, 16, 25]
    squares[0]  # 1

    cubes = [1, 8, 27, 65, 125]  # cubes[3] is incorrect (64).
    cubes[3] = 64  # assignment (lists are mutable)
    cubes.append(216)  # append() adds items to the end of a list.

    letters = ["a", "b", "c", "d", "e", "f", "g"]
    len(letters)  # 7 (length = number of items in list)
    letters[2:5] = ["C", "D", "E"]  # letters = ['a', 'b', 'C', 'D', 'E', 'f', 'g']
    letters[:] = []  # letters is empty now

    # nested lists
    a = ["a", "b", "c"]
    n = [1, 2, 3]
    x = [a, n]  # [['a', 'b', 'c'], [1, 2, 3]]
    x[0][1]  # 'b'

    def _list_methods():
        l = []
        l.append("a")  # add to list
        l.extend(["b", "c", "d"])  # add iterable to list
        l.insert(4, "e")  # add element at a given position
        l.index("a")  # return index of the element
        l2 = l.copy()  # shallow copy
        l2.reverse()  # reverse the order of elements
        l2.sort()  # sort elements (alphabetically ascending)
        l2.remove("e")  # remove the first item of matching value. Error if not found
        l2.pop()  # remove and return last item in list
        l2.pop(3)  # remove element at index
        del l2[-1]  # remove element at index
        del l2[0:-1]  # remove elements at index slice
        l2.clear()  # remove all elements

    def _list_comprehension():
        values = [1, 2, 3, 4]
        result = [n**2 for n in values]  # [1, 4, 9, 16]

    def _map_filter_reduce():
        # map -- return list with each element transformed
        list(
            map(
                lambda n: n + 1,  # callable to map with
                [1, 2, 3, 4, 5],  # iterable
            )
        )

        # filter -- return list with elements that pass predicate
        list(filter(lambda n: n % 2 == 0, [0, 1, 2, 3, 4, 5]))

        # reduce -- transform list into a single, accumulated value
        functools.reduce(lambda acc, curr: acc + curr, [0, 1, 2, 3, 4, 5])

        # reduce (with initial accumulator value)
        functools.reduce(
            lambda acc, curr: {**acc, curr["id"]: curr["name"]},
            [
                {"id": 1, "name": "Kakashi"},
                {"id": 2, "name": "Yamato"},
                {"id": 3, "name": "Iruka"},
            ],
            {},
        )

        def _membership_testing():
            """Membership testing with the "in" keyword."""
            "a" in "apple"  # True
            "a" in ["a", "b", "c"]  # True
            "a" in "cliff"  # False
            "a" in [1, 2, 3]  # False

    def _zip():
        a = [1, 2, 3]
        b = ["one", "two", "three"]
        c = ["ONE", "TWO", "THREE", "FOUR"]

        l = zip(a, b, c, strict=False)
        s = set(l)
        print(s)  # {(1, 'one', 'ONE'), (2, 'two', 'TWO'), (3, 'three', 'THREE')}


def _dicts():
    # create dictionary using 'dict'
    squares = dict([(1, 1), (2, 4), (3, 9), (4, 16)])
    # create dictionary using '{}'
    squares = {1: 1, 2: 4, 3: 9, 4: 16}
    # assign k,v
    squares[5] = 25
    # dictionary comprehension
    even_squares = {
        x: x**2 for x in range(2, 11, 2)
    }  # {2: 4, 4: 16, 6: 36, 8: 64, 10: 100}
    even_squares[12] = 144

    def dict_looping():
        # for loop (dictionaries)
        dictionary1 = {"a": 3}  # some dictionary
        for k in dictionary1:
            print(k)  # key

        # dictionary (items method: returns a list of tuple pairs) (tuple unpacking)
        squares = {1: 1, 2: 4, 3: 9, 4: 16}
        list_of_squares = []
        for k, v in squares.items():
            list_of_squares.append(f"{k}: {v}")
        print(list_of_squares)  # ['1: 1', '2: 4', '3: 9', '4: 16', '5: 25']


def _tuples():
    # tuples are immutable
    digits = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    digits.count(3)  # return number of times a value occurs in a tuple
    digits.index(3)  # return the index of the value

    # tuple unpacking
    mypairs = [("a", 1), ("b", 2), ("c", 3)]
    for letter, num in mypairs:
        print(f"{letter}: {num}")  # a: 1  b: 2  c: 3


def _sets():
    # sets (collection of unique items) (unordered) (empty set: x=set())
    basket = {"apple", "orange", "pear", "banana"}
    print(basket)  # duplicates removed -- {'orange', 'banana', 'pear', 'apple'}
    "orange" in basket  # membership testing

    for fruit in basket:
        print(fruit)


# ---
# Control Flow
# ---


def _control_flow():
    def _truthiness():
        # Falsy
        None, False, 0, 0.0, "", (), [], {}  # etc
        # Truthy
        True, 1, 1.0, "not empty", (1,), [1, 2, 3], {"id": 1234}
        # Truthiness
        0 or 5  # 5
        2 and 3  # 3
        not 5  # False

    def basic_while_loop():
        a = 1
        l = []
        while a < 1000:
            l.append(a)
            a *= 2

    def basic_break_and_continue():
        a = 1
        l = []
        while True:
            if a % 2 != 0:
                continue
            if a > 100:
                break
            l.append(a)

    def basic_if():
        x = int(input("please enter an integer: "))
        if x == 0:
            print("zero is neither positive or negative.")
        elif x > 0:
            if x % 2 == 0:
                print("you chose a positive, even number.")
            elif x % 2 == 1:
                print("you chose a positive, odd number.")
        elif x < 0:
            if x % 2 == 0:
                print("you chose a negative, even number.")
            elif x % 2 == 1:
                print("you chose a negative, odd number.")

    # TODO: match

    def basic_for_loop():
        # for loop
        words = ["cat", "window", "defenestrate"]
        for w in words:
            print(w, len(w))  # cat 3, window 6, defenestrate 12

        # for loop with index (enumerate)
        words = ["cat", "window", "defenestrate"]
        for i, word in enumerate(words):
            print(i, word)

    def basic_range():
        # range produces an iterable
        for i in range(5, 10):
            print(i)  # 5 6 7 8 9

        for i in range(0, 10, 3):
            print(i)  # 0 3 6 9

        for i in range(10, 100, 30):
            print(i)  # 10, 40, 70

        a = ["Mary", "had", "a", "little", "lamb"]
        for i in range(len(a)):
            print(i, a[i])  # 0 Mary 1 had 2 a 3 little 4 lamb

        l = list(range(11))  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        assert isinstance(l, list)


def _functions():
    people = [{"name": "Yamato", "age": 26}, {"name": "Kakashi", "age": 27}]

    def add_two_numbers(arg1, arg2):
        return arg1 + arg2

    def sum_list(list_arg):
        return sum(list_arg)

    def sum_variadic(*args):
        return sum(args)

    def dict_from_kwargs(**kwargs):
        return kwargs

    # lambda
    lambda x: print(x)

    # execute lambda
    (lambda x: print(x))("hello there!")

    def f(x):
        return x * 3

    f(5)  # 15
    (lambda x: x * 3)(5)  # 15

    # filter with lambda
    numbers = [1, 2, 3, 4]
    print([x for x in numbers if x % 2 == 0])  # list comprehension filter
    print(list(filter(lambda x: x % 2 == 0, numbers)))  # lambda filter

    # ---
    # Function as param/arg
    # ---

    def func1():
        return "Hello!"

    def func2(func):
        print(func)  # prints function object
        print(func())  # prints the output of func()

    func2(func1)


def _error_handling():
    pass  # TODO


def _io():
    # mode can be 'r', 'w', 'a', 'r+' (read, write, append, and read/write.)

    fn = "my_file.txt"

    # read (manually open/close)
    f: Any | None = None
    try:
        f = open(fn)  # open in read mode
        data = f.read()  # read data
    except:
        print("Error while opening file")
    finally:
        # close descriptor (it is very important to close file descriptors)
        if f is not None:
            f.close()

    # "with" keyword creates a context, descriptor will automatically close at end of block

    # read (in context)
    data = ""
    with open(fn) as f:
        data = f.read()
    print(data)

    # write (in context)
    with open(fn, "a") as f:
        f.write("This is a test\n")


# ---
# Iterators and generators
# ---


def _iterators():
    # for ... in ...
    for element in [1, 2, 3]:
        print(element)
    for element in (1, 2, 3):
        print(element)
    for key in {"one": 1, "two": 2}:
        print(key)
    for char in "123":
        print(char)
    for line in open("myfile.txt"):
        print(line, end="")

    # iterator example
    s = "abc"
    it = iter(s)
    it  # <iterator object at 0x00A1DB50>
    next(it)  # 'a'
    next(it)  # 'b'
    next(it)  # 'c'
    next(it)  # raises 'StopIteration' exception


def _generators():
    def reverse(data):
        for index in range(len(data) - 1, -1, -1):
            yield data[index]

    for char in reverse("golf"):
        print(char)  # f l o g


# ---
# Decorators
# ---


def _decorators():
    def my_dec(fn: Callable) -> Callable:
        def wrapped(*args, **kwargs):
            print("starting")
            res = fn(*args, **kwargs)
            print("got the result")
            print("returning result")
            return res

        return wrapped

    @my_dec
    def greet(name: str | None = None) -> str:
        return f'Hello, {name or "friend"}'

    # With @functools.wraps
    # "wraps" will copy func attrs from input to return value
    # https://stackoverflow.com/a/309000

    def my_dec2(fn: Callable) -> Callable:
        @functools.wraps(fn)
        def wrapped(*args, **kwargs):
            print("starting")
            res = fn(*args, **kwargs)
            print("got the result")
            print("returning result")
            return res

        return wrapped

    @my_dec2
    def greet2(name: str | None = None) -> str:
        return f'Hello, {name or "friend"}'

    # Without functools.wraps
    res1 = greet("Kakashi")
    print("\n")
    print(greet.__name__)  # wrapped
    print(greet.__doc__)  # Wrapped func
    print(res1)  # Hello, Kakashi
    print("\n")

    # With functools.wraps
    res2 = greet("Iruka")
    print("\n")
    print(greet2.__name__)  # greet2
    print(greet2.__doc__)  # Greet someone
    print(res2)  # Hello, Iruka


# ---
# Built-in functions and constants
# ---


def _built_ins():
    """Basic usage of built in functions"""
    abs(-5)  # 5
    # aiter
    all([n > 0 for n in [1, 2, 3, 4, 5]])  # True
    any([n > 4 for n in [1, 2, 3, 4, 5]])  # True
    # anext
    ascii("µ")  # '\xb5'
    bin(3)  # '0b11'
    bool("not empty")  # True
    # breakpoint
    bytearray("hello", "utf-8")  # bytearray(b'hello')
    bytes("hello", "utf-8")  # b'hello'
    callable(lambda x: x + 2)  # True
    chr(97)  # 'a' # unicode int to character
    # classmethod
    # compile
    complex(2, 4)  # (2+4j)
    # delattr
    dict(first_name="Kakashi", last_name="Hatake")  # { "first_name": "Kakashi", ... }
    # dir
    divmod(5, 2)  # (2, 1) # dividend and remainder
    enumerate(
        ["a", "b", "c"]
    )  # [(0,'a'),(1,'b'),(2,'c')] # for i, char in enumerate(['a','b','c'])
    eval("2 + 1")  # 3
    exec("a = 5; b = 3; print(a + b)")  # executes, returns None
    list(filter(lambda x: x > 3, [1, 2, 3, 4, 5]))  # [4, 5]
    float("-1.23")  # -1.23
    format(45, "b")  # 101101
    frozenset(("a", "e", "i", "o", "u"))  # immutable set
    ("a").isalpha()  # get (and call) attribute
    # globals
    hasattr("a", "isalpha")  # True
    # hash
    # help
    hex(255)  # 0xff
    # id
    # input
    int("10")  # 10
    isinstance("a", str)  # True
    issubclass(
        collections.OrderedDict, dict
    )  # True (OrderedDict in dict.__subclasses__())
    iter(["a", "e", "i", "o", "u"])  # iterator object (call next(iterator_object))
    len([1, 2, 3])  # 3
    list("abc")  # ['a','b','c'] # convert iterable to list
    # locals
    list(map(lambda x: x**2, [1, 2, 3]))  # [1,4,9]
    max(1, 2, 3)  # 3
    min(1, 2, 3)  # 1
    next(iter([1, 2, 3]))  # 1
    # object # create new object # object is the base for all classes
    oct(8)  # '0o10' # integer to octal string
    # open
    ord("a")  # 97 # opposite of chr
    pow(3, 3)  # 27
    # print
    # property
    list(range(5))  # [0,1,2,3,4]
    repr(
        str.isalpha
    )  # <method 'isalpha' of 'str' objects> # printable representation (__repr__)
    list(reversed([1, 2, 3]))  # [3,2,1]
    round(3.015, 2)  # 3.02
    # setattr # counterpart of getattr
    [1, 2, 3, 4, 5][slice(3)]  # [1,2,3] # slice object that represents indices
    sorted(["d", "A", "c", "B"], key=str.lower)  # ['A','B','c','d']
    # staticmethod
    sum([1, 2, 3, 4, 5])  # 15
    # super
    tuple("abc")  # ('a','b','c')
    str  # <class 'str'>
    # vars
    zip([0, 1, 2], ["a", "b", "c"], strict=False)  # [(0,'a'),(1,'b'),(2,'c')]


# -------------
# COMMAND LINE ARGUMENTS
# -------------

# python file_name.py 'hello there!' 'nice to meet you!' 'have a wonderful day!'
# see 'argparse' for named arguments


def _args():
    sys.argv  # file name & arguments
    sys.argv[0]  # print file name
    sys.argv[1]  # arg 1
    sys.argv[2]  # arg 2
    sys.argv[3]  # arg 3
