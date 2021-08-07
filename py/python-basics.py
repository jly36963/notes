# ---
# PYTHON BASICS
# ---

# ---
# VARIABLES
# ---

# start with letter or underscore, can contain letters, numbers, underscores
my_var = 'snake case'
MY_CONSTANT = 'capital snake case'
MyClass = 'upper camel case'
__my_dunder__ = 'double underscore variables'

# ---
# MATH OPERATORS
# ---

# python supports int, float, decimal, fraction
'''
+ add
- subtract
* multiply
/ divide (float result)
// floor divide (integer result)
% modulus (remainder)
** power
= assignment
_ last printed expression (5+5=10 _+3=13)
'''

# ---
# OPERATOR PRECEDENCE 
# ---

'''
()
**
*, /, //, %
+, - 
<, <=, >, >=
==, !=
in, not in
and, or, not
'''

# ---
# STRING METHODS
# ---

str1 = 'hello'
str1.capitalize() # returns string, first character capitalized
str1.lower() # returns string, all characters lowercase
str1.upper() # returns string, all characters uppercase
str1.find('h') # returns index of substring (-1 if not found)
str1.find('h', 0, -1) # substring, start, end
str1.index('h') # returns index of substring (ValueError if not found)
str1.index('h', 0, -1) # substring, start, end
str1.isalnum() # alphanumeric? True : False
str1.isalpha() # alpha? True : False
str1.isnumeric() # numeric? True : False
str1.strip() # returns string, removes whitespace on both ends
str1.strip('abcdefgh') # strip chars from left until no match, repeat on right side.
str1.replace('hello', 'hi') # return string, replace occurences of old substring with new substring.
str1.rfind('h') # returns index of last instance of substring (-1 if not found)
str1.split(',') # return list of strings (split at arg value)

# ---
# STRINGS AND FORMATTING
# ---

print("I don't have school today!")
print(r'this is a r\a\w\ string!') # r'string' -- prevents '\' escapes.
print('''use triple quotes for long/multi-line strings.''')
print(3*'ha') # hahaha
print('py' 'thon') # python (automatically concatenates two literals, use '+' otherwise.)
print('We are the {} who say "{}!"'.format('knights', 'Ni')) # We are the knights who say "Ni!"
print('{0} and {1}'.format('spam', 'eggs')) # spam and eggs
print('{1} and {0}'.format('spam', 'eggs')) # eggs and spam
print('This {food} is {adjective}.'.format(food='spam', adjective='absolutely horrible')) # This spam is absolutely horrible.

# by default, print will add '\n' to every print statement. to change, use 'print(stuff, end=' ').'
# format -- '!a', '!s', '!r' can be used to apply 'ascii()', 'str()', and 'repr()'.
  # example: 'I had {!s} tacos'.format(12).'

# ---
# F-STRINGS (PYTHON 3.6) (FORMATING)
# ---

# formatted string literals
name = 'Landon'
age = 26
greeting = f'My name is {name} and I am {age} years old'.
multi_line = f'''
My name is {name}.
I am {age} years old.
'''

# ---
# ESCAPE CHARACTERS
# ---

str1 = '\n' # linefeed (LF) (new line)
str1 = '\r' # carriage return (CR)
str1 = '\t' # horizontal tab
str1 = '\'' # escaped single quote
str1 = '\"' # escaped double quote
str1 = '\\' # escaped backslash

# ---
# INDEX
# ---

word='Python'
word[0] # P (index starts at 0)
word[5] # n
word[-1] # n (negative indices start at -1)
word[-6] # P
word[0:2] # Py (slices before '0' and right before '2'.)
word[2:5] # tho
word[:5] # Pytho
word[2:] # thon
word[42] # error
word[4:42] # on
word[42:] # [empty string]
'why ' + word[2:5] + '?' # why tho?
len(word) = 6

# ---
# LISTS
# ---

# Python knows a number of compound data types, used to group together other values.
# The most versatile is the list, which can be written as a list of comma-separated values (items) between square brackets.
# Lists might contain items of different types, but usually the items all have the same type.

squares = [1, 4, 9, 16, 25]
squares[0] # 1

cubes = [1, 8, 27, 65, 125] # cubes[3] is incorrect (64).
cubes[3] = 64 # assignment (lists are mutable)
cubes.append(216) # append() adds items to the end of a list.

letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
len(letters) # 7 (length = number of items in list)
letters[2:5]=['C', 'D', 'E'] # letters = ['a', 'b', 'C', 'D', 'E', 'f', 'g']
letters[:]=[] # letters is empty now

# nested lists
a = ['a', 'b', 'c']
n = [1, 2, 3]
x = [a, n] # [['a', 'b', 'c'], [1, 2, 3]]
x[0][1] # 'b'

# ---
# LIST METHODS
# ---

list1 = []
list1.append(x) # Add an item to the end of the list. Equivalent to a[len(a):] = [x].
list1.extend(iterable) # Extend the list by appending all items from the iterable. Equivalent to a[len(a):] = iterable.
list1.insert(i, x) # Insert an item at a given position. i = index of the element before which to insert.
list1.remove(x) # Remove the first item from the list whose value is x. It is an error if there is no such item.
list1.pop(i) # Remove the item at the given position in the list, and return it. If no index is specified, a.pop() removes and returns the last item in the list.
list1.clear() # removes all items from the list.
list1.index(x[, start[, end]]) # Return zero-based index in the list of the first item whose value is x. Raises a ValueError if there is no such item.
list1.sort(key=None, reverse=False) # sort the items of the list in place.
list1.reverse() # Reverse the elements of the list in place.

# list.remove -- del list[i] deletes item by index (instead of value).

# ---
# MAP
# ---

# function for map
def add_one(num1):
    num1 = num1 + 1
    return num1
# iterable for map
numbers1 = [1,2,3,4,5]
# map function (produces iterable, convert iterable to list)
numbers2 = list(map(add_one, numbers1))
print(numbers2)

# map with lambda
numbers1 = [1,2,3,4,5]
numbers2 = list(map(lambda x: x-1, numbers1))
print(numbers2)

# ---
# FILTER
# ---

numbers1 = [1,2,3,4,5]
numbers2 = list(filter(lambda x: x > 2, numbers1))
print(numbers2)

# ---
# MEMBERSHIP TESTING
# ---

print('a' in 'apple') # True
print('a' in ['a', 'b', 'c']) # True
print('a' in 'cliff') # False
print('a' in [1, 2, 3]) # False

# ---
# DICTIONARIES, TUPLES, SETS
# ---

# dictionaries ({key:value}) (unordered) (like JS objects)
squares = dict([(1,1), (2,4), (3,9), (4,16)])
squares = {1: 1, 2: 4, 3: 9, 4: 16}
squares[5] = 25
even_squares = {x: x**2 for x in range(2, 11, 2)} # {2: 4, 4: 16, 6: 36, 8: 64, 10: 100}

# for loop (dictionaries)
dictionary1 = { 'a': 3 } # some dictionary
for k in dictionary1:
    print(k) # key
    print(dictionary1[k]) # value

# dictionary (items method: returns a list of tuple pairs) (tuple unpacking)
list_of_squares = []
for k, v in squares.items():
    list_of_squares.append('{}: {}'.format(k, v))
print(list_of_squares) # ['1: 1', '2: 4', '3: 9', '4: 16', '5: 25']

# nested dictionary
people = {
    'landon': {'age': 26, 'hobbies': ['guitar', 'soccer', 'running', 'zombies']},
    'kakashi': {'age': 27, 'hobbies': ['reading']}
}

print(people['landon']['hobbies'][0]) # guitar
print(people.keys()) # dict_keys(['landon', 'kakashi'])

# tuples (immutable)
numbers = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

# tuple unpacking
mypairs = [('a',1), ('b',2), ('c',3)]
for letter, num in mypairs:
    print('{}: {}'.format(letter, num)) # a: 1  b: 2  c: 3


# sets (collection of unique items) (unordered) (empty set: x=set())
basket = {'apple', 'orange', 'apple', 'pear', 'orange', 'banana'}
print(basket)   # duplicates removed -- {'orange', 'banana', 'pear', 'apple'}
'orange' in basket # membership testing

for fruit in basket:
    print(fruit)

# ---
# CONTROL FLOW
# ---

# while loop
b=1
l=[]
while b < 1000:
    l.append(b)
    b *= 2

# if (nested)
x = int(input('please enter an integer: '))
if x==0:
    print('zero is neither positive or negative.')
elif x>0:
    if x%2==0:
        print('you chose a positive, even number.')
    elif x%2==1:
        print('you chose a positive, odd number.')
elif x<0:
    if x%2==0:
        print('you chose a negative, even number.')
    elif x%2==1:
        print('you chose a negative, odd number.')

# for loop
words = ['cat', 'window', 'defenestrate']
for w in words:
    print(w, len(w)) # cat 3, window 6, defenestrate 12

# for loop with index (enumerate)
words = ['cat', 'window', 'defenestrate']
for i, word in enumerate(words):
    print(i, word)

# range
for i in range(5, 10):
    print(i) # 5 6 7 8 9

for i in range(0, 10, 3):
    print(i) # 0 3 6 9

for i in range(10, 100, 30):
    print(i) # 10, 40, 70

a = ['Mary', 'had', 'a', 'little', 'lamb']
for i in range(len(a)):
    print(i, a[i]) # 0 Mary 1 had 2 a 3 little 4 lamb

print(range(10)) # doesn't do what I want
print(list(range(10))) # does what I want (iterable objects)

num_list = list(range(0,10)) # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]


# break (breaks out of the innermost enclosing loop)
for n in range(2, 10):
    for x in range(2, n):
        if n % x == 0:
            print(n, 'equals', x, '*', n//x)
            break
        else:
            # loop fell through without finding a factor
            print(n, 'is a prime number')


# continue (continues with the next iteration of the loop)
for num in range(2, 10):
    if num % 2 == 0:
        print("Found an even number", num)
        continue
    print("Found a number", num)


# ---
# FUNCTIONS
# ---

# function syntax
def function1(parameter1, parameter2):
    print(parameter1)
    print(parameter2)
    my_list = [parameter1, parameter2]
    return my_list

function1('landon', 'yarrington') # this calls the function

# function with default parameters
def greeting(name='friend'):
    print(f'Hello {name}!')

greeting() # Hello friend!
greeting('Kakashi') # Hello Kakashi!



# try/except/else/finally
# try something
    # if error -- raise exception
    # if no error -- execute else clause
    # regardless of error -- execute finally clause

def divider(x, y):
    try:
        result = x / y
    except ZeroDivisionError:
        print("division by zero!")
    else:
        print("result is", result)
    finally:
        print("MATH SUCKS, BUT IT IS IMPORTANT")

divider(2,4)
divider(2,0)

# function (fibonacci sequence) (docstring)
def fib(n):    # write Fibonacci series up to n
    """Print a Fibonacci series up to n.""" # docstring
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b

fib(10) # 0 1 1 2 3 5 8
print(fib.__doc__) # print docstring



# ---
# LOCAL/GLOBAL
# ---
var1 = 5
def func():
    var2 = 10
    print(locals()) # dict of all local variables
    print(globals()) # dict of all global variables (includes built in ones)
    print(locals()['var2']) # 10 (key provided, value returned)
    print(globals()['var1']) # 5 (key provided, value returned)


# ---
# MODULES
# ---

# import module
import module_name
module_name.func_from_module() # calling a function from imported module

# import from module
from module_name import func_from_module, ClassFromModule
func_from_module()
class_from_module = ClassFromModule(parameter1=argument1,
                                    parameter2=argument2)

# import as ...
import my_module as mm
mm.func_from_module()

# import from module in sub-directory
    # directory must have (usually empty) __init__.py file
    # (tells python that it's okay to import from that directory)
from subdirectory1.subdirectory2.python_file import function_name
function_name()


# ---
# READ/WRITE TO FILE
# ---

# mode can be 'r', 'w', 'a', 'r+' (read, write, append, and read/write.)

# write
f = open('my_file.txt', 'a')
f.write('This is a test\n') # writes/appends to file

# read file ('with' properly closes file)
with open('my_file.txt') as f:
    read_data = f.read()
f.close()

# read (iterate) ('with')
with open('my_file.txt') as f:
    for line in f:
        print(line, end='\n')
f.close()

# ---
# ITERATORS
# ---

# for ... in ...
for element in [1, 2, 3]:
    print(element)
for element in (1, 2, 3):
    print(element)
for key in {'one':1, 'two':2}:
    print(key)
for char in "123":
    print(char)
for line in open("myfile.txt"):
    print(line, end='')

iterator explanation = '''
Behind the scenes, the for statement calls 'iter()' on the container object.
The function returns an iterator object that defines the method '__next__()',
which accesses elements in the container one at a time.
When there are no more elements, '__next__()' raises a 'StopIteration' exception,
which tells the for loop to terminate.
You can call the '__next__()' method using the 'next()' built-in function.
'''

# iterator example
s = 'abc'
it = iter(s)
it # <iterator object at 0x00A1DB50>
next(it) # 'a'
next(it) # 'b'
next(it) # 'c'
next(it) # raises 'StopIteration' exception

# generator example
def reverse(data):
    for index in range(len(data)-1, -1, -1):
        yield data[index]

for char in reverse('golf'):
     print(char) # f l o g

# ---
# list comprehension
# ---

a = [1,2,3,4]
b = [x**2 for x in a]
print(b)

# ---
# dictionary
# ---

people = [
    {
        'name': 'Landon',
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

# add 2 numbers
def add_method(arg1, arg2):
    return arg1 + arg2

print(add_method(5, 6)) # 11

# find sum of list of numbers
def add_list(list_arg):
    return sum(list_arg)

print(add_list([1, 2, 3])) # 6

# add any number of arguments together
def add_args(*args):
    return sum(args)

print(add_args(1, 2, 3, 4)) # 10

# use kwargs (key/value pairs ==> dictionary)
def return_kwargs(**kwargs):
    return kwargs

print(return_kwargs(name='Landon', age=26)) # {'name': 'Landon', 'age': 26}


# ---
# classes // objects
# ---

# object1 != object2 (self is different for each object)
# object1.name == object2.name (if they have the same name)

class Person:
    type = 'Human' # class object attribute (true for all instances)

    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.greeting = 'Hi! my name is {}!'.format(name)

    def how_old(self):
        return 'I am {} years old!'.format(self.age)

landon = Person('Landon', 26)
print(landon.type) # human
print(landon.greeting) # Hi! my name is Landon!
print(landon.how_old()) # I am 26 years old!


# ---
# class and static methods
# ---

class Student:
    def __init__(self, name, age, major, classes):
        self.name = name
        self.age = age
        self.major = major
        self.classes = classes
        self.marks = []

    def add_grade(self, grade):
        self.marks.append(grade)
        return self.marks

    def av_grade(self):
        if len(self.marks) != 0:
            return sum(self.marks) / len(self.marks)
        else:
            return 'No grades entered yet!'

    def speak_truth1(self): # instance method
        truth = 'School is killing me :D'
        return truth

    @classmethod
    def speak_truth2(cls):
        truth = 'I am a {}'.format(cls)
        return truth  # '{}'.format(cls) == <class '__main__.Student'>

    @staticmethod
    def speak_truth3():
        truth = 'School is killing me :D'
        return truth


landon = Student('Landon', 26, 'Computer Science', ['Pandas', 'Tensorflow', 'Flask', 'MERN'])
landon.add_grade(100)
print(landon.av_grade())
print(Student.speak_truth2()) # uses 'Student' class name (not 'landon')
print(Student.speak_truth3())


# ---
# inheritance
# ---

class Student:
    def __init__(self, name, school):
        self.name = name
        self.school = school

    # add friend from same school
    @classmethod
    def friend(cls, origin, friend_name, *args): # args is for 'self.workplace'
        return cls(friend_name, origin.school, *args)

class WorkingStudent(Student):
    # inherits all from 'Student'
    def __init__(self, name, school, workplace):
        super().__init__(name, school)
        self.workplace = workplace

# Student
kakashi = Student('Kakashi', 'Berkley')
yamato = Student.friend(kakashi, 'Yamato') # args is not used for 'workplace'.

# WorkingStudent
kakashi2 = WorkingStudent('Kakashi', 'Berkley', "Dion's Pizza")
yamato2 = WorkingStudent.friend(kakashi, 'Yamato', "Dion's Pizza") # args is used.
print(nate2.workplace)


# ---
# repr (class instance -- represent the object with a string)
# ---
class Book():
    def __init__(self,title,author,pages):
        self.title = title
        self.author = author
        self.pages = pages

    def __repr__(self):
        return f'Title: {self.title}, Author: {self.author}'

mybook = Book('Python Rocks!', 'Landon', 250)
print(mybook) # <__main__.Book object at 0x000000270FF8ED828>
print(mybook) # Title: Python Rocks!, Author: Landon

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

f(5) # 15

(lambda x: x*3)(5) # 15

# filter with lambda
numbers = [1, 2, 3, 4]
print([x for x in numbers if x % 2 == 0]) # list comprehension filter
print(list(filter(lambda x: x % 2 == 0, numbers))) # lambda filter

# ---
# functions as parameters
# ---

def outer_function(inner_function):
    return inner_function()

def greeting():
    return 'Hello there!'

# defined function as inner_function
print(outer_function(greeting)) # Hello there!


# ---
# function as parameter/argument
# ---

def func1():
    return 'Hello!'
def func2(func):
    print(func) # prints function object
    print(func()) # prints the output of func()

func2(func1)


# ---
# functions inside of functions (flask example)
# ---

app.route('/')
def index(logged_in=False):
    print('checking login status')
    def already_logged_in():
        print('already logged in!')
        return render_template('index.html')
    def needs_to_log_in():
        print('needs to log in!')
        return render_template('login.html')
    if logged_in==True:
        already_logged_in():
    if logged_in==False:
        needs_to_log_in():


# ---
# decorator functions (how to create)
# ---

import functools

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

my_function() # my_function is passed as argument to my_decorator


# example 2
def decorator_with_parameters(logged_in = True):
    def my_decorator(inner_func):
        @functools.wraps(inner_func)
        def outer_func():
            print('Before inner function!')
            if logged_in == True:
                inner_func(*args, **kwargs)
            else:
                print('Not running the inner function!')
            print('After inner function!')
        return outer_func
    return my_decorator

@decorator_with_parameters(logged_in)
def greeting(name, day_of_week):
    print("I'm the inner function!")
    print("Hello there {}, have a great {}!".format(name, day_of_week))

logged_in = True
greeting('Landon', 'Tuesday')

# -------------
# ZIP
# -------------

a = [1,2,3]
b = ['one', 'two', 'three']
c = ['ONE', 'TWO', 'THREE', 'FOUR']

d = zip(a,b,c)
d_set = set(d)
print(d_set) # {(1, 'one', 'ONE'), (2, 'two', 'TWO'), (3, 'three', 'THREE')}


# -------------
# COMMAND LINE ARGUMENTS
# -------------

# command
    # python file_name.py 'hello there!' 'nice to meet you!' 'have a wonderful day!'

import sys

print(sys.argv) # file name & arguments
print(sys.argv[0]) # print file name
print(sys.argv[1]) # arg 1
print(sys.argv[2]) # arg 2
print(sys.argv[3]) # arg 3

# see 'argparse' for named arguments








# END
