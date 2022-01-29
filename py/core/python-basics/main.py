# ---
# Python basics
# ---

import sys
import functools
from typing import Union, Any

# ---
# Variables
# ---

# start with letter or underscore, can contain letters, numbers, underscores
my_var = 'snake case'
MY_CONSTANT = 'capital snake case'
MyClass = 'upper camel case'
__my_dunder__ = 'double underscore variables'

# ---
# Operators
# ---

# + add
# - subtract
# * multiply
# / divide (float result)
# // floor divide (integer result)
# % modulus (remainder)
# ** power
# = assignment
# _ last printed expression (5+5=10 _+3=13)

# ---
# Operator precedence
# ---

# ()
# **
# *, /, //, %
# +, -
# <, <=, >, >=
# ==, !=
# in, not in
# and, or, not

# ---
# Strings
# ---


def basic_strings():
    """
    Strings
    """
    "I don't have school today!"  # basic string
    r'this is a r\a\w\ string!'  # r'string' -- prevents '\' escapes.
    '''use triple quotes for long/multi-line strings.'''  # multiline string
    3*'ha'  # hahaha
    'py' 'thon'  # python automatically concatenates strings, use '+' otherwise.


def basic_string_methods():
    '''
    String methods
    '''
    str1 = 'hello'
    str1.capitalize()  # returns string, first character capitalized
    str1.lower()  # returns string, all characters lowercase
    str1.upper()  # returns string, all characters uppercase
    str1.find('h')  # returns index of substring (-1 if not found)
    str1.find('h', 0, -1)  # substring, start, end
    str1.index('h')  # returns index of substring (ValueError if not found)
    str1.index('h', 0, -1)  # substring, start, end
    str1.isalnum()  # alphanumeric? True : False
    str1.isalpha()  # alpha? True : False
    str1.isnumeric()  # numeric? True : False
    str1.strip()  # returns string, removes whitespace on both ends
    str1.strip('abcdefgh')  # strip chars from left until no match, repeat on right side.
    str1.replace('hello', 'hi')  # return string, replace occurences of old substring with new substring.
    str1.rfind('h')  # returns index of last instance of substring (-1 if not found)
    str1.split(',')  # return list of strings (split at arg value)


def basic_string_formatting():
    '''
    String formatting
    '''
    'We are the {} who say "{}!"'.format('knights', 'Ni')  # We are the knights who say "Ni!"
    '{0} and {1}'.format('spam', 'eggs')  # spam and eggs
    '{1} and {0}'.format('spam', 'eggs')  # eggs and spam
    # This spam is absolutely horrible.
    'This {food} is {adjective}.'.format(food='spam', adjective='absolutely horrible')

    # format -- '!a', '!s', '!r' can be used to apply 'ascii()', 'str()', and 'repr()'.
    # example: 'I had {!s} tacos'.format(12).'


def basic_f_strings():
    """
    F-strings (python 3.6 and later)
    """
    name = 'Kakashi'
    age = 27
    f'My name is {name} and I am {age} years old.'

    # multiline
    f'''
    My name is {name}.
    I am {age} years old.
    '''

    # escape {}
    f'{{ "id": 3 }} '  # json strings would need to have their {} characters escaped


def basic_escape_characters():
    """
    Using \\ in strings
    """
    '\n'  # linefeed (LF) (new line)
    '\r'  # carriage return (CR)
    '\t'  # horizontal tab
    '\''  # escaped single quote
    '\"'  # escaped double quote
    '\\'  # escaped backslash


# ---
# String indexing
# ---

def basic_indexing():
    word = 'Python'
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
    'why ' + word[2:5] + '?'  # why tho?
    len(word) == 6

# ---
# Lists
# ---

# Python knows a number of compound data types, used to group together other values.
# The most versatile is the list, which can be written as a list of comma-separated values (items) between square brackets.
# Lists might contain items of different types, but usually the items all have the same type.


def basic_lists():
    squares = [1, 4, 9, 16, 25]
    squares[0]  # 1

    cubes = [1, 8, 27, 65, 125]  # cubes[3] is incorrect (64).
    cubes[3] = 64  # assignment (lists are mutable)
    cubes.append(216)  # append() adds items to the end of a list.

    letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    len(letters)  # 7 (length = number of items in list)
    letters[2:5] = ['C', 'D', 'E']  # letters = ['a', 'b', 'C', 'D', 'E', 'f', 'g']
    letters[:] = []  # letters is empty now

    # nested lists
    a = ['a', 'b', 'c']
    n = [1, 2, 3]
    x = [a, n]  # [['a', 'b', 'c'], [1, 2, 3]]
    x[0][1]  # 'b'


def basic_list_methods():
    l = []
    l.append('a')  # add to list
    l.extend(['b', 'c', 'd'])  # add iterable to list
    l.insert(4, 'e')  # add element at a given position
    l.index('a')  # return index of the element
    l2 = l.copy()  # shallow copy
    l2.reverse()  # reverse the order of elements
    l2.sort()  # sort elements (alphabetically ascending)
    l2.remove('e')  # remove the first item of matching value. Error if not found
    l2.pop()  # remove and return last item in list
    l2.pop(3)  # remove element at index
    del l2[-1]  # remove element at index
    del l2[0:-1]  # remove elements at index slice
    l2.clear()  # remove all elements


def basic_list_comprehension():
    """
    List comprehension
    """
    l = [1, 2, 3, 4]
    [n**2 for n in l]  # [1, 4, 9, 16]


def basic_map_filter_reduce():
    '''
    Mapping, filtering, reducing
    '''
    # map -- return list with each element transformed
    list(map(
        lambda n: n + 1,  # callable to map with
        [1, 2, 3, 4, 5]  # iterable
    ))

    # filter -- return list with elements that pass predicate
    list(filter(
        lambda n: n % 2 == 0,
        [0, 1, 2, 3, 4, 5]
    ))

    # reduce -- transform list into a single, accumulated value
    functools.reduce(
        lambda acc, curr: acc + curr,
        [0, 1, 2, 3, 4, 5]
    )

    # reduce (with initial accumulator value)
    functools.reduce(
        lambda acc, curr: {**acc, curr['id']: curr['name']},
        [
            {'id': 1, 'name': "Kakashi"},
            {'id': 2, 'name': "Yamato"},
            {'id': 3, 'name': "Iruka"}
        ],
        {}
    )


def basic_membership_testing():
    """
    Membership testing with the "in" keyword
    """
    'a' in 'apple'  # True
    'a' in ['a', 'b', 'c']  # True
    'a' in 'cliff'  # False
    'a' in [1, 2, 3]  # False


def basic_zip():
    a = [1, 2, 3]
    b = ['one', 'two', 'three']
    c = ['ONE', 'TWO', 'THREE', 'FOUR']

    l = zip(a, b, c)
    s = set(l)
    print(s)  # {(1, 'one', 'ONE'), (2, 'two', 'TWO'), (3, 'three', 'THREE')}

# ---
# Dictionaries, Tuples, Sets
# ---


def basic_dictionaries():
    """
    Dictionaries
    """
    # create dictionary using 'dict'
    squares = dict([(1, 1), (2, 4), (3, 9), (4, 16)])
    # create dictionary using '{}'
    squares = {1: 1, 2: 4, 3: 9, 4: 16}
    # assign k,v
    squares[5] = 25
    # dictionary comprehension
    even_squares = {x: x**2 for x in range(2, 11, 2)}  # {2: 4, 4: 16, 6: 36, 8: 64, 10: 100}
    even_squares[12] = 144


def basic_dictionary_looping():
    # for loop (dictionaries)
    dictionary1 = {'a': 3}  # some dictionary
    for k in dictionary1:
        print(k)  # key
        print(dictionary1[k])  # value

    # dictionary (items method: returns a list of tuple pairs) (tuple unpacking)
    squares = {1: 1, 2: 4, 3: 9, 4: 16}
    list_of_squares = []
    for k, v in squares.items():
        list_of_squares.append('{}: {}'.format(k, v))
    print(list_of_squares)  # ['1: 1', '2: 4', '3: 9', '4: 16', '5: 25']


def basic_tuples():
    # tuples are immutable
    digits = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    digits.count(3)  # return number of times a value occurs in a tuple
    digits.index(3)  # return the index of the value

    # tuple unpacking
    mypairs = [('a', 1), ('b', 2), ('c', 3)]
    for letter, num in mypairs:
        print('{}: {}'.format(letter, num))  # a: 1  b: 2  c: 3


def basic_sets():
    # sets (collection of unique items) (unordered) (empty set: x=set())
    basket = {'apple', 'orange', 'apple', 'pear', 'orange', 'banana'}
    print(basket)   # duplicates removed -- {'orange', 'banana', 'pear', 'apple'}
    'orange' in basket  # membership testing

    for fruit in basket:
        print(fruit)

# ---
# Control Flow
# ---


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
    x = int(input('please enter an integer: '))
    if x == 0:
        print('zero is neither positive or negative.')
    elif x > 0:
        if x % 2 == 0:
            print('you chose a positive, even number.')
        elif x % 2 == 1:
            print('you chose a positive, odd number.')
    elif x < 0:
        if x % 2 == 0:
            print('you chose a negative, even number.')
        elif x % 2 == 1:
            print('you chose a negative, odd number.')


def basic_for_loop():
    # for loop
    words = ['cat', 'window', 'defenestrate']
    for w in words:
        print(w, len(w))  # cat 3, window 6, defenestrate 12

    # for loop with index (enumerate)
    words = ['cat', 'window', 'defenestrate']
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

    a = ['Mary', 'had', 'a', 'little', 'lamb']
    for i in range(len(a)):
        print(i, a[i])  # 0 Mary 1 had 2 a 3 little 4 lamb

    l = list(range(11))  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    assert isinstance(l, list)


# ---
# Functions
# ---


def function1(parameter1, parameter2):
    """
    basic function syntax

    example usage:
    first_name, last_name = function1('Kakashi', 'Hatake')

    """
    # use arguments
    print(parameter1)
    print(parameter2)
    # return a value
    return [parameter1, parameter2]


# ---
# Error handling (try/except/else/finally)
# ---


def safe_divide(x: float, y: float) -> float:
    result: float = 0
    try:
        # attempt to do something
        result = x / y
    except ZeroDivisionError:
        # if a specific error (or one that inherits from it) was raised
        pass
    except Exception:
        # if any exception was raised
        pass
    else:
        # if no exception in try block
        pass
    finally:
        # always executes
        return result


# ---
# MODULES
# ---

# # import module
# import module_name
# module_name.func_from_module()

# # import from module
# from module_name import func_from_module, ClassFromModule
# func_from_module()
# class_from_module = ClassFromModule(parameter1=argument1, parameter2=argument2)

# # import as ...
# import my_module as mm
# mm.func_from_module()

# # import from module in sub-directory
# # directory must have __init__.py file
# # (tells python that it's okay to import from that directory)
# from subdirectory1.subdirectory2.python_file import function_name
# function_name()

# ---
# File descriptors and read/write io
# ---

def basic_read_write():
    # mode can be 'r', 'w', 'a', 'r+' (read, write, append, and read/write.)

    fn = 'my_file.txt'

    # read (manually open/close)
    f: Union[Any, None] = None
    try:
        f = open(fn)  # open in read mode
        data = f.read()  # read data
    except:
        print('Error while opening file')
    finally:
        # close descriptor (it is very important to close file descriptors)
        if f is not None:
            f.close()

    # "with" keyword creates a context, descriptor will automatically close at end of block

    # read (in context)
    data = ''
    with open(fn) as f:
        data = f.read()
    print(data)

    # write (in context)
    with open(fn, 'a') as f:
        f.write('This is a test\n')


# ---
# Iterators and generators
# ---

def basic_iterators():
    '''
    Iterators:

    Behind the scenes, the for statement calls 'iter()' on the container object.
    The function returns an iterator object that defines the method '__next__()',
    which accesses elements in the container one at a time.
    When there are no more elements, '__next__()' raises a 'StopIteration' exception,
    which tells the for loop to terminate.
    You can call the '__next__()' method using the 'next()' built-in function.
    '''

    # for ... in ...
    for element in [1, 2, 3]:
        print(element)
    for element in (1, 2, 3):
        print(element)
    for key in {'one': 1, 'two': 2}:
        print(key)
    for char in "123":
        print(char)
    for line in open("myfile.txt"):
        print(line, end='')

    # iterator example
    s = 'abc'
    it = iter(s)
    it  # <iterator object at 0x00A1DB50>
    next(it)  # 'a'
    next(it)  # 'b'
    next(it)  # 'c'
    next(it)  # raises 'StopIteration' exception


def reverse(data):
    """
    Example generator function
    """
    for index in range(len(data)-1, -1, -1):
        yield data[index]


def basic_generators():
    """
    Use generator function
    """
    for char in reverse('golf'):
        print(char)  # f l o g

# ---
# dictionary
# ---


people = [
    {
        'name': 'Yamato',
        'age': 26
    },
    {
        'name': 'Kakashi',
        'age': 27
    }
]

# ---
# *args and **kwargs
# ---

# *args should come at the end of parameters/arguments


def add_two_numbers(arg1, arg2):
    """
    Add two numbers

    example usage:
    add_two_numbers(5, 6)  # 11
    """
    return arg1 + arg2


def sum_list(list_arg):
    """
    Get sum of list of numbers

    exmaple usage:
    sum_list([1, 2, 3]) # 6
    """
    return sum(list_arg)


# add any number of arguments together


def sum_variadic(*args):
    """
    Get sum of numbers

    example usage:
    sum_variadic(1, 2, 3, 4) # 10
    """
    return sum(args)


# use kwargs (key/value pairs ==> dictionary)


def dict_from_kwargs(**kwargs):
    """
    Create a dictionary from kwargs

    example usage:
    dict_from_kwargs(name='Kakashi', age=27)  # {'name': 'Kakashi', 'age': 27}
    """
    return kwargs


# ---
# lambda functions (anonymous functions)
# ---
# lambda
lambda x: print(x)

# execute lambda
(lambda x: print(x))('hello there!')

# lambda example (both functions return the same output)


def f(x):
    return x*3


f(5)  # 15

(lambda x: x*3)(5)  # 15

# filter with lambda
numbers = [1, 2, 3, 4]
print([x for x in numbers if x % 2 == 0])  # list comprehension filter
print(list(filter(lambda x: x % 2 == 0, numbers)))  # lambda filter


# ---
# Function as param/arg
# ---

def func1():
    return 'Hello!'


def func2(func):
    print(func)  # prints function object
    print(func())  # prints the output of func()


func2(func1)

# ---
# Decorators
# ---


def my_decorator(inner_func):
    @functools.wraps(inner_func)
    def outer_func():
        # before inner_func
        print('Before inner function!')
        # inner_func
        inner_func()
        # after func
        print('After the inner function')
    return outer_func


@my_decorator
def my_function():
    print("I'm the inner function!!!")


# -------------
# COMMAND LINE ARGUMENTS
# -------------

# python file_name.py 'hello there!' 'nice to meet you!' 'have a wonderful day!'
# see 'argparse' for named arguments

def basic_command_line_args():
    sys.argv  # file name & arguments
    sys.argv[0]  # print file name
    sys.argv[1]  # arg 1
    sys.argv[2]  # arg 2
    sys.argv[3]  # arg 3
