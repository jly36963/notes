"""Python standard library examples."""

import csv
import functools
import gzip
import io
import json
import logging
import math
import os
import platform
import subprocess
import sys
import time
import timeit
import uuid
import zlib
from array import array
from base64 import b64encode
from collections import Counter, deque
from concurrent.futures import ThreadPoolExecutor, as_completed
from copy import copy, deepcopy
from datetime import UTC, date, datetime, timedelta
from enum import Enum
from multiprocessing import Pool
from pathlib import Path, PurePath
from typing import TypedDict

# ---
# Main
# ---


def main():
    """Run std lib examples."""
    examples = {
        "array": _array,
        "collections": _collections,
        "copy": _copy,
        "csv": _csv,
        "datetime": _datetime,
        "enum": _enum,
        "functools": _functools,
        "gzip": _gzip,
        "io": _io,
        "json": _json,
        "logging": _logging,
        "math": _math,
        "os_path": _os_path,
        "os": _os,
        "pathlib": _pathlib,
        "platform": _platform,
        "subprocess": _subprocess,
        "time": _time,
        "threading and multiprocessing": _threading_and_multiprocessing,
        "uuid": _uuid,
        "timeit": _timeit,
        "sys": _sys,
        "zlib": _zlib,
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


def _array():
    a = array("I", [1, 2, 3, 4, 5])
    a.append(6)
    a.pop()  # 6
    a.insert(0, 0)  # position to insert before, element to add
    a.tolist()  # convert array to list


def _collections():
    # Counter
    colors = [
        "red",
        "blue",
        "blue",
        "green",
        "purple",
        "green",
        "white",
        "purple",
        "blue",
    ]
    c = Counter(colors)
    c["purple"]  # 2
    c["black"]  # 0
    c.elements()  # list of elments, in order of first encountered
    c.most_common(3)  # [('blue', 3), ('green', 2), ('purple', 2)]
    c.subtract(Counter(red=1, white=1))  # subtract arg counts from counter (in-place)
    # c.total()  # sum of counts (new in python 3.10)
    c.clear()  # reset counts
    list(c)  # list of unique elements
    set(c)  # set of elements
    dict(c)  # convert to dict
    +c  # remove zero and negative counts
    c + c  # add two counters
    c - c  # subtract counters (only keep positive counts)
    c & c  # intersection
    c | c  # union

    # deque
    d = deque(["b", "c", "d"])
    d.append("e")  # add to right sight (end)
    d.appendleft("a")  # add to left side (beginning)
    d.count("a")  # 1
    d.clear()  # remove all elements
    d.extend(["f", "g"])  # extend right side using an interable
    d.extendleft(["a", "b", "c", "d", "e"])
    d.pop()  # 'g'
    d.popleft()  # 'a'
    # also index, insert, remove, reverse, rotate,


def _copy():
    ninjas = [
        {"first_name": "Kakashi", "last_name": "Hatake"},
        {"first_name": "Iruka", "last_name": "Umino"},
        {"first_name": "Tenzo", "last_name": "Yamato"},
        {"first_name": "Itachi", "last_name": "Uchiha"},
    ]
    copy(ninjas)  # shallow copy
    deepcopy(ninjas)  # deep copy (keeps memo dict to avoid circular references)


def _datetime():
    # date
    date(2022, 1, 1)  # 2022-01-01
    date.today()  # 2022-03-01
    date.today() + timedelta(days=1)  # 2022-03-02
    date(2011, 10, 11).replace(day=1)  # 2021-10-01
    date(2022, 3, 1).weekday()  # 1 (day of week, 0-6)(tuesday)
    date(2022, 3, 1).isoweekday()  # 2 (day of week, 1-7)(tuesday)
    date(2022, 3, 1).isoformat()  # 2022-03-01
    date.fromisoformat("2024-01-01")
    date.today().isoformat()

    # datetime
    datetime(2022, 3, 1)  # 2022-03-01 00:00:00
    datetime(2022, 3, 1) + timedelta(days=1)  # 2022-03-02 ...
    datetime.today()  # 2022-03-01 ...
    datetime.now()  # 2022-03-01 ... (current time)
    datetime.fromtimestamp(time.time())  # 2022-03-01 ... (current time)
    datetime.now(UTC)  # 2022-03-01 ... (current time)(utc)
    datetime.fromtimestamp(time.time(), tz=UTC)  # 2022-03-01 ... (current time)(utc)

    # split/combine datetime:
    # date (get date portion), time (get time portion), combine (combine d/t portions)


def _enum():
    class Village(Enum):
        """TODO."""

        LEAF = "leaf"
        SAND = "sand"
        MIST = "mist"
        STONE = "stone"
        CLOUD = "cloud"

    class Ninja(TypedDict):
        """TODO."""

        first_name: str
        last_name: str
        village: Village

    kakashi: Ninja = {
        "first_name": "Kakashi",
        "last_name": "Hatake",
        "village": Village.LEAF,
    }
    village = kakashi["village"]

    if village == Village.LEAF:
        print("You're from the same village as Itachi!")
    else:
        print(f"Is the {village.value.capitalize()} village nice?")


def _math():
    # constants
    math.pi
    math.e
    math.tau  # 2 * pi
    math.inf
    math.nan

    # methods
    math.ceil(4.1)  # 5 (round up)
    math.fabs(-1)  # 1
    math.factorial(5)  # 120
    math.floor(4.9)  # (round down)
    math.fsum([0.1, 0.1, 0.1, 0.1, 0.1])  # .5 (accurate floating point sum)
    math.gcd(12, 24, 30)  # 6
    math.isclose(1.01, 1.02, rel_tol=0.01)  # True
    math.isfinite(5)  # True (not infinity or NaN)
    math.isinf(math.inf)  # True
    math.isnan(math.nan)  # True
    math.lcm(5, 6, 10)  # 30
    math.ldexp(3, 4)  # 3 * 2**4
    math.prod([1, 2, 3, 4, 5])  # 120

    math.exp(3)  # math.e ** 3
    math.log(math.e**2)  # 2
    math.log10(10**2)  # 2
    math.pow(3, 2)  # 9
    math.sqrt(4)  # 2

    # sin, cos, tan,
    # asin, acos, atan,
    # degrees, radians,
    # ...hyperbolic,


# ---
# functional programming
# ---


def _functools():
    # cache

    @functools.cache
    def factorial(n):
        return n * factorial(n - 1) if n else 1

    factorial(10)  # no cached result
    factorial(5)  # uses cached result
    factorial(12)  # mostly cached result, 2 new calls

    # partial (partially applied function)
    def add(a, b):
        return a + b

    add_five = functools.partial(add, 5)
    add_five(3)  # 8

    # reduce
    functools.reduce(lambda x, y: x + y, [1, 2, 3, 4, 5])  # 15

    # singledispatch (generics)(overloading)(multiple call signatures)
    # https://docs.python.org/3/library/functools.html#functools.singledispatch


def _pathlib():
    # Path: list all python files in a directory
    p = Path()
    list(p.glob("**/*.py"))

    # Path: methods
    p = Path("./some-file.txt")
    p.exists()  # False
    p.is_dir()  # False
    p.is_file()  # True
    p.resolve()  # converts to absolute path
    p.read_text()  # read file as string
    Path().iterdir()  # iterator of path objects

    # Path: mutate methods
    # chmod, mkdir, rename, replace, rmdir, touch, unlink, write_text

    # Path: slash
    p = Path()
    p = p / "src" / "types"  # './src/types'

    # Path: open file
    p = Path("./main.py")
    with p.open("r") as f:
        print(f.read())

    # PurePath: join
    p = PurePath("./src", "types")  # 'src/types'

    # PurePath: slash
    p = PurePath() / "src" / "types"  # 'src/types'

    # PurePath attributes
    p = PurePath("/usr/bin/python3")
    p.parts  # ('/', 'usr', 'bin', 'python3')
    p.anchor  # '/'
    p.parents[0]  # '/usr/bin'
    p.parent  # '/usr/bin' # if '..' is used, call p.resolve() first
    p.name  # 'python3'
    (p / "file.py").suffix  # 'file.py'
    (p / "file.tar.gz").suffixes  # ['.tar', '.gz']
    (p / "file.py").stem  # 'file'

    # PurePath methods
    p = PurePath("./src/types/")
    PurePath("/etc").joinpath("passwd")  # '/etc/passwd'
    PurePath("./my-file.txt").match("*.txt")  # True

    # PurePath: update path
    # with_name, with_stem, with_suffix


def _os_path():
    os.getcwd()  # get path of entry point
    os.path.abspath(".")  # get absolute path
    os.path.exists(".")  # True
    os.path.getatime("./main.py")  # time of last access (float, seconds since epoch)
    os.path.getmtime("./main.py")  # time of last modify (float)
    os.path.getsize("./main.py")  # size in bytes (err if not exixts/accessible)
    os.path.isfile("./main.py")  # True
    os.path.isdir("./main.py")  # False
    os.path.join("/etc", "/passwd")  # '/etc/passwd'
    os.path.normpath("./src/types/../types")  # 'src/types'
    os.path.split("./src/types")  # ( './src', 'types)


def _zlib():
    # compress string to smaller string
    s: str = "Is mayonnaise an instrument?"
    encoded: bytes = s.encode("utf-8")
    compressed: bytes = zlib.compress(encoded)
    b64encoded: bytes = b64encode(compressed)
    s2: str = b64encoded.decode("ascii")
    print(s2)


def _gzip():
    # compress string to smaller string
    s: str = "Is mayonnaise an instrument?"
    encoded: bytes = s.encode("utf-8")
    compressed: bytes = gzip.compress(encoded)
    b64encoded: bytes = b64encode(compressed)
    s2: str = b64encoded.decode("ascii")
    print(s2)


# ---
# file formats
# ---


def _csv():
    # read dict
    f: list[str] = (
        "first_name,last_name,age\nKakashi,Hatake,27\nIruka,Umino,25\nYamato,Tenzo,26\n".splitlines()
    )
    reader = csv.DictReader(f)  # f: file descriptor or List[str]
    ninjas = []
    cols = ["first_name", "last_name", "age"]
    fn, ln, a = cols
    for row in reader:
        print(f"name: {row[fn]} {row[ln]}, age: {row[a]}")
        ninjas.append(row)

    # write dicts
    stream = io.StringIO()
    writer = csv.DictWriter(stream, fieldnames=cols)
    writer.writeheader()
    for n in ninjas:
        writer.writerow(n)
    output = stream.getvalue()
    print(output)


def _os():
    # read
    os.name  # 'posix'
    os.environ  # env vars dict
    os.getcwd()  # current working directory
    os.getenv("USER")  # value of env var or default (None)
    os.getpid()  # current process id
    info = os.uname()  # sysname, nodename, release, version, machine
    info.sysname  # Darwin
    info.machine  # x86_64
    os.listdir(".")  # list of names/entries in path (exclude . & .. from result)
    os.scandir(
        "."
    )  # entries with properties/methods (is_dir, is_file, is_symlink, name, path)
    os.cpu_count()  # 16 (number of logical cores)

    # constants
    os.curdir  # '.'
    os.pardir  # '..'
    os.sep  # '/' (posix) '\\' (windows)
    os.linesep  # '\n' (posix) '\r\n' (windows)
    os.pathsep  # delimiter for paths likd $PATH -- ':' (posix) ';' (windows)
    os.devnull  # '/dev/null' (posix) 'nul' (windows)

    # command
    os.system("ls")  # run command in subprocess, returns exit code
    with os.popen("ls") as pipe:
        result = pipe.read()
        print(result)  # result of command

    # change (cwd)
    os.chdir  # change directory

    # change (ownership and permissions)
    os.chmod  # change permissions
    os.chown  # change ownership
    os.chroot  # change root dir of current process
    os.lchmod  # change permissions (doesn't follow symlinks, edits symlink itself)
    os.lchown  # change permissions (doesn't follow symlinks)

    # change (fs)
    os.mkdir  # make directory
    os.makedirs  # make directory (recursive) (creates intermediate dirs)
    os.remove  # remove existing file
    os.removedirs  # remove existing directories (recursive)
    os.rename  # rename existing file/dir
    os.rmdir  # remove directory
    os.symlink  # create symlink
    os.unlink  # same as remove (unlink is traditional unix name)
    os.walk  # dirpath, dirnames, filenames

    # change process
    os.abort
    os._exit
    os.fork
    os.kill

    # ---
    # file objects
    # ---

    # file descriptor
    os.fdopen  # alias of built-in open
    os.fchmod  # fd chmod
    os.fchown  # fd chown

    # low-level fd
    os.open  # low-level open (incompatible with built-in open/close)
    os.read  # read fd (os.open)
    os.write  # write fd (os.open)
    os.close  # close fd (os.open)

    # pipe
    os.pipe  # create a pipe


def _io():
    # text streams

    # text io (file)
    with open("my-file.txt", encoding="utf-8") as f:
        type(f)  # io.TextIOWrapper
        f.reconfigure(encoding="utf-8")
        f.encoding  # utf-8
    # text io (string)
    with io.StringIO("Some text data") as f:
        type(f)  # io.StringIO (inherits io.TextIOBase)
        # most of these methods have params for limiting how much is read
        for line in f:
            print(line)
        f.getvalue()  # get all contents as string
        f.read()  # read all contents
        f.readline()  # read and return one line
        f.readlines()  # read and return list of lines

    # buffered streams

    # binary io (file)
    with open("my-file.txt", "rb") as f:
        type(f)  # io.BytesIO
    # binary io (string)
    with io.BytesIO(b"Hello there") as f:
        type(f)  # io.BytesIO
        f.getvalue()  # get all contents as bytes


def _json():
    s: str = json.dumps({"name": "Kakashi Hatake"})
    d: dict = json.loads(s)
    d  # {'name': "Kakashi Hatake"}


def _logging():
    # Set logging output to stdout
    logging.basicConfig(stream=sys.stdout)
    # Create logger
    logger = logging.getLogger()
    # Set minimum level (debug, info, warning, error, critical)
    logger.setLevel(logging.INFO)
    # Log at info level
    logger.info("Hello there!")
    # Pass level as arg
    logger.log(logging.INFO, "Hello there!")
    # Ignored because under logging level
    logger.debug("I will be ignored")

    # Don't use f-strings, use %
    name = "Kakashi"
    logging.debug("Hello there %s", name)

    try:
        result = 5 / 0
        print(result)
    except Exception:
        # Log at error level with exception info included in message
        logger.exception("Something went wrong")


def _platform():
    platform.architecture()  # (bits, linkage)
    platform.machine()  # 'x86_64'
    platform.node()  # computer's network name (string)
    platform.platform()  # underlying platform info (string) (eg: "macOS...")
    platform.processor()  # processor name (ie: "i386")
    platform.python_implementation()  # CPython
    platform.python_compiler()  # 'Clang 10.0.0 '
    platform.python_version()  # "3.9.1"
    platform.system()  # 'Darwin'
    platform.uname()  # system, node, release, version, machine, processor


def _subprocess():
    result: subprocess.CompletedProcess[bytes] = subprocess.run(
        ["ls", "-l"], capture_output=True, check=False
    )
    result.returncode  # 0
    out = result.stdout.decode("utf-8")  # stdout
    err = result.stderr.decode("utf-8")  # stderr
    print("out", out, "err", err, sep="\n")


def _sys():
    sys.argv  # command line arguments (List[str])
    sys.exit  # callable: exit python
    sys.getsizeof("hello")  # size in bytes
    sys.implementation  # name, cache tag, version, hexversion, _multiarch
    sys.path  # search paths for modules (List[str]) (initialized from PYTHONPATH)
    sys.platform  # darwin
    sys.version  # python version & additional info (string)


def _threading_and_multiprocessing():
    def _multiprocessing():
        # Pool

        def square(x):
            return x**2

        numbers = list(range(25))
        pool = Pool(4)  # multiprocessing.Pool with 4 processes

        result = pool.map(square, numbers)

        print(result)  # [0, 1, 4, 9, 16, 25, ...]

    def _concurrent_futures():
        # Setup

        def double(x: int) -> int:
            return 2 * x

        numbers: list[int] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

        # ThreadPoolExecutor (results in order completed)

        results = []
        futures = []

        with ThreadPoolExecutor(max_workers=4) as executor:
            for n in numbers:
                futures.append(executor.submit(double, n))

        for future in as_completed(futures):
            try:
                results.append(future.result())
            except Exception as e:
                print(e)

        print(results)

        # ThreadPoolExecutor (results in original order)

        results = []

        with ThreadPoolExecutor(max_workers=4) as executor:
            for result in executor.map(double, numbers):
                results.append(result)

        print(results)


def _time():
    time.ctime(
        1_000_000_000
    )  # 'Sat Sep  8 19:46:40 2001' (seconds since epoch -> local time)
    time.localtime()  # time.struct_time
    time.sleep  # callable: sleep for n seconds

    time.strftime("%b %d %Y %H:%M:%S", time.localtime())  # Feb 27 2022 21:52:42
    time.strftime(
        "%b %d %Y %H:%M:%S",
        time.gmtime(
            time.mktime(
                (2021, 10, 11, 17, 3, 38, 1, 48, 0)  # Oct 11 2021 17:03:38
            )
        ),
    )
    time.time()  # seconds since epoch (float)


def _timeit():
    def count_to_n(n: int) -> int:
        x = 0
        for _ in range(n):
            x += 1
        return x

    partial = functools.partial(count_to_n, 100)  # partial is used to capture args
    timer = timeit.Timer(partial)
    result = timer.timeit(number=10)  # 10 executions
    print(result)  # seconds (float)


def _uuid():
    uuid.uuid4()  # uuid v4 (type uuid.UUID)
    uuid.UUID("900e018a-6bb8-47e4-9c4d-cae3e922a63e")  # uuid from string
    str(uuid.uuid4())  # uuid as string
    uuid.uuid4().bytes  # uuid as bytes


# ---
# TODO
# ---


# abc
# https://docs.python.org/3/library/collections.abc.html
# abc (TODO)
# https://docs.python.org/3/library/abc.html

# argparse
# https://docs.python.org/3/library/argparse.html

# asyncio (TODO)
# https://docs.python.org/3/library/asyncio.html

# decmials
# https://docs.python.org/3/library/decimal.html

# difflib
# https://docs.python.org/3/library/difflib.html

# fractions
# https://docs.python.org/3/library/fractions.html

# hashlib
# https://docs.python.org/3/library/hashlib.html

# http
# https://docs.python.org/3/library/http.html

# itertools
# https://docs.python.org/3/library/itertools.html

# mimetypes
# https://docs.python.org/3/library/mimetypes.html

# operator
# https://docs.python.org/3/library/operator.html

# queue
# https://docs.python.org/3/library/queue.html

# re
# https://docs.python.org/3/library/re.html

# secrets
# https://docs.python.org/3/library/secrets.html

# socket
# https://docs.python.org/3/library/socket.html

# ssl
# https://docs.python.org/3/library/ssl.html

# string
# https://docs.python.org/3/library/string.html

# statistics
# https://docs.python.org/3/library/statistics.html

# sysconfig
# https://docs.python.org/3/library/sysconfig.html

# textwrap
# https://docs.python.org/3/library/textwrap.html

# typing
# https://docs.python.org/3/library/typing.html

# unittest
# https://docs.python.org/3/library/unittest.html

# urllib
# https://docs.python.org/3/library/urllib.html

# urllib.parse
# https://docs.python.org/3/library/urllib.parse.html
