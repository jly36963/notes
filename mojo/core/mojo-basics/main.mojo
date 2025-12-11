from utils import Variant
from result import Result
from python import Python
from sys import (
    align_of,
    bit_width_of,
    has_accelerator,
    has_amd_gpu_accelerator,
    has_apple_gpu_accelerator,
    has_nvidia_gpu_accelerator,
    num_logical_cores,
    num_performance_cores,
    num_physical_cores,
    size_of,
)
from pathlib import cwd, Path
import os
from iter import enumerate, zip, map
from subprocess import run

# ---
# Main
# ---


fn main() raises -> None:
    """TODO."""
    examples: List[Tuple[String, fn () raises -> None]] = [
        # Basics
        ("strings", _strings),
        ("bools", _bools),
        ("lists", _lists),
        ("dicts", _dicts),
        ("tuples", _tuples),
        ("sets", _sets),
        ("optionals", _optionals),
        ("structs", _structs),
        # stdlib
        ("variants", _variants),
        ("generic_variants", _generic_variants),
        ("use python", _use_python),
        ("sys", _sys),
        ("path", _path),
        ("os", _os),
        ("iter", _iter),
        ("io", _io),
        ("subprocess", _subprocess),
    ]

    for title, example_fn in examples:
        _print_section_title(title)
        example_fn()


# ---
# Utils
# ---


fn _print_section_title(string: String) raises -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print("\n# ---")
    print("# {}".format(string.upper()))
    print("# ---\n")


# ---
# Examples (basic)
# ---


fn _bools() raises -> None:
    t = True
    f = False
    n = 5

    results = [
        "t: {}".format(t),
        "f: {}".format(f),
        "n: {}".format(n),
        "t and t: {}".format(t and t),
        "t and f: {}".format(t and f),
        "f and f: {}".format(f and f),
        "t or t: {}".format(t or t),
        "t or f: {}".format(t or f),
        "f or f: {}".format(f or f),
        """"even" if n % 2 == 0 else "odd": {}""".format(
            "even" if n % 2 == 0 else "odd"
        ),
    ]

    for result in results:
        print(result)


fn _strings() raises -> None:
    results = [
        """"Help me boy or you're fired".endswith("fired"): {}""".format(
            String("Help me boy or you're fired").endswith("fired")
        ),
        """"It's okay, take your time".startswith("It"): {}""".format(
            String("It's okay, take your time").startswith("It")
        ),
        # """"Me hoy minoy ✏️".as_bytes(): {}""".format(
        #     "Me hoy minoy ✏️".as_bytes().__repr__()
        # ),
        # """"Me hoy minoy ✏️".codepoints(): {}""".format(
        #     "Me hoy minoy ✏️".__repr__().codepoints() # TODO: fix
        # ),
        """"Me hoy minoy ✏️".byte_length(): {}""".format(
            String("Me hoy minoy ✏️").byte_length()
        ),
        """"id" in "Not even Squidward's house": {}""".format(
            "id" in "Not even Squidward's house"
        ),
        """"I'm not ready!".replace("not ", ""): {}""".format(
            String("I'm not ready!").replace("not", "")
        ),
        """"I CAN'T SEE MY FOREHEAD".lower(): {}""".format(
            String("I CAN'T SEE MY FOREHEAD").lower()
        ),
        """"moar!".upper(): {}""".format("moar!".upper()),
        """"   Too bad that didn't kill me   ".strip(): {}""".format(
            String("   Too bad that didn't kill me   ").strip()
        ),
    ]

    for result in results:
        print(result)


fn _lists() raises -> None:
    nums = [1, 2, 3, 4, 5]
    squared = [n**2 for n in nums]

    results = [
        "nums: {}".format(repr(nums)),
        "squared: {}".format(repr(squared)),
    ]

    for result in results:
        print(result)


fn _dicts() raises -> None:
    nums = [1, 2, 3, 4, 5]
    squares = {n: n**2 for n in nums}

    results = [
        "nums: {}".format(repr(nums)),
        "squares: {}".format(repr(squares)),
    ]

    for result in results:
        print(result)


fn _tuples() raises -> None:
    values = [("a", 1), ("b", 2), ("c", 3)]

    for letter, number in values:
        print("{}: {}".format(letter, number))


fn _sets() raises -> None:
    s1 = {1, 2, 3}
    s2 = {3, 4, 5}
    s3 = {1, 2, 3, 4, 5}
    s4 = {10, 20, 30}

    results = [
        "s1: {}".format(repr(s1)),
        "s2: {}".format(repr(s2)),
        "s3: {}".format(repr(s3)),
        "s4: {}".format(repr(s4)),
        "s1.intersection(s2): {}".format(repr(s1.intersection(s2))),
        "s1.union(s2): {}".format(repr(s1.union(s2))),
        "s1.difference(s2): {}".format(repr(s1.difference(s2))),
        "s1.issubset(s3): {}".format(s1.issubset(s3)),
        "s1.isdisjoint(s4): {}".format(s1.isdisjoint(s4)),
        "s3.issuperset(s2): {}".format(s3.issuperset(s2)),
    ]

    for result in results:
        print(result)


fn find[
    T: Copyable & Movable & ImplicitlyCopyable
](values: List[T], predicate: fn (T) raises -> Bool) raises -> Optional[T]:
    for value in values:
        if predicate(value):
            return value
    return None


fn _optionals() raises -> None:
    values = [1, 2, 3, 4, 5]

    fn gt3(num: Int) raises -> Bool:
        return num > 3

    fn gt10(num: Int) raises -> Bool:
        return num > 10

    results = [
        "values: {}".format(values.__str__()),
        "find(values, gt3): {}".format(repr(find(values, gt3))),
        "find(values, gt10): {}".format(repr(find(values, gt10))),
        "Optional(3).value(): {}".format(Optional(3).value()),
        "Optional[Int]().or_else(0): {}".format(Optional[Int]().or_else(0)),
    ]

    for result in results:
        print(result)


@fieldwise_init
struct NinjaNew(Movable, Representable):
    """Ninja creation input."""

    var first_name: String
    var last_name: String
    var age: Int

    fn __repr__(self) -> String:
        try:
            s = "NinjaNew(first_name={}, last_name={}, age={})"
            result = s.format(self.first_name, self.last_name, self.age)
            return String(result)
        except Exception:
            return String("malformed NinjaNew")


@fieldwise_init
struct Ninja(Movable, Representable):
    """Ninja from database."""

    var id: String
    var first_name: String
    var last_name: String
    var age: Int
    var created_at: String
    var updated_at: Optional[String]

    fn __repr__(self) -> String:
        try:
            # fmt: off
            s = "Ninja(id={}, first_name={}, last_name={}, age={}, created_at={}, updated_at={})"
            # fmt: on
            result = s.format(
                self.id,
                self.first_name,
                self.last_name,
                self.age,
                self.created_at,
                repr(self.updated_at),
            )
            return String(result)
        except Exception:
            return String("malformed Ninja")


fn create_ninja(ninja_new: NinjaNew) -> Ninja:
    # Pretend to do Database stuff
    uuid = "06930e7a-7dfe-4df1-8ff5-23f740326d7d"
    datetime = "2024-12-06T04:32:10.878Z"
    return Ninja(
        id=uuid,
        first_name=ninja_new.first_name,
        last_name=ninja_new.last_name,
        age=ninja_new.age,
        created_at=datetime,
        updated_at=Optional[String](datetime),
    )


fn _structs() raises -> None:
    ninja_new = NinjaNew(first_name="Kakashi", last_name="Hatake", age=27)
    ninja = create_ninja(ninja_new)
    print("ninja")
    print(repr(ninja))


# ---
# Examples (stdlib)
# ---


comptime ResultFloat64 = Variant[Float64, Error]


fn to_string(value: ResultFloat64) -> String:
    if value.isa[Float64]():
        return "Ok(" + String(value[Float64]) + ")"
    return "Err('" + String(value[Error]) + "')"


fn _variants() raises -> None:
    n1 = 3.0
    n2 = 2.0
    n3 = 0.0

    fn divide(n1: Float64, n2: Float64) -> ResultFloat64:
        if n2 == 0.0:
            return ResultFloat64(Error("Cannot divide by 0"))
        return ResultFloat64(n1 / n2)

    result_ok = divide(n1, n2)
    result_err = divide(n1, n3)

    results = [
        "n1: {}".format(String(n1)),
        "n2: {}".format(String(n2)),
        "n3: {}".format(String(n3)),
        "result_ok: {}".format(to_string(result_ok)),
        "result_err: {}".format(to_string(result_err)),
    ]

    for result in results:
        print(result)


fn to_string(res: Result[Float64, Error]) -> String:
    value = res._value
    if value.isa[Float64]():
        return "Ok(" + String(value[Float64]) + ")"
    return "Err('" + String(value[Error]) + "')"


fn to_string(res: Result[Float64, String]) -> String:
    value = res._value
    if value.isa[Float64]():
        return "Ok(" + String(value[Float64]) + ")"
    return "Err('" + value[String] + "')"


fn _generic_variants() raises -> None:
    n1 = 3.0
    n2 = 2.0
    n3 = 0.0

    fn divide(n1: Float64, n2: Float64) -> Result[Float64, Error]:
        if n2 == 0.0:
            error = Error("Cannot divide by 0")
            return Result[Float64, Error].err(error^)
        value = n1 / n2
        return Result[Float64, Error].ok(value)

    fn invert(number: Float64) -> Result[Float64, Error]:
        if number == 0.0:
            error = Error("Cannot divide by 0")
            return Result[Float64, Error].err(error^)
        value = 1 / number
        return Result[Float64, Error].ok(value)

    fn square(number: Float64) -> Float64:
        return number**2

    fn loud_error(err: Error) -> String:
        return repr(err).upper()

    result_ok = divide(n1, n2)
    result_err = divide(n1, n3)

    results = [
        "n1: {}".format(String(n1)),
        "n2: {}".format(String(n2)),
        "n3: {}".format(String(n3)),
        "result_ok: {}".format(to_string(result_ok)),
        "result_err: {}".format(to_string(result_err)),
        "result_ok.map(square): {}".format(to_string(result_ok.map(square))),
        "result_ok.and_then(invert): {}".format(
            to_string(result_ok.and_then(invert))
        ),
        "result_err.map_err(loud_error): {}".format(
            to_string(result_err.map_err(loud_error))
        ),
    ]

    for result in results:
        print(result)


fn _use_python() raises -> None:
    np = Python.import_module("numpy")
    arr = np.arange(1, 6)
    print(arr)


fn _sys() raises -> None:
    results = [
        "align_of[Bool](): {}".format(align_of[Bool]()),
        "align_of[String](): {}".format(align_of[String]()),
        "align_of[Optional[String]](): {}".format(align_of[Optional[String]]()),
        "align_of[Int32](): {}".format(align_of[Int32]()),
        "align_of[Float64](): {}".format(align_of[Float64]()),
        "bit_width_of[Bool](): {}".format(bit_width_of[Bool]()),
        "has_accelerator(): {}".format(has_accelerator()),
        "has_amd_gpu_accelerator(): {}".format(has_amd_gpu_accelerator()),
        "has_apple_gpu_accelerator(): {}".format(has_apple_gpu_accelerator()),
        "has_nvidia_gpu_accelerator(): {}".format(has_nvidia_gpu_accelerator()),
        "num_logical_cores(): {}".format(num_logical_cores()),
        "num_performance_cores(): {}".format(num_performance_cores()),
        "num_physical_cores(): {}".format(num_physical_cores()),
        "size_of[Bool](): {}".format(size_of[Bool]()),
        "size_of[String](): {}".format(size_of[String]()),
        "size_of[Optional[String]](): {}".format(size_of[Optional[String]]()),
        "size_of[Int32](): {}".format(size_of[Int32]()),
        "size_of[Float64](): {}".format(size_of[Float64]()),
    ]

    for result in results:
        print(result)


fn _path() raises -> None:
    current_dir = cwd()
    desktop = Path("~/Desktop")
    version_file = Path("./.python-version")
    current_file = Path("./main.mojo")

    results = [
        "cwd(): {}".format(String(cwd())),
        "Path.home(): {}".format(String(Path.home())),
        "desktop: {}".format(String(desktop)),
        "desktop.expanduser(): {}".format(String(desktop.expanduser())),
        "version_file: {}".format(String(version_file)),
        "current_file: {}".format(String(current_file)),
        "current_file.name(): {}".format(current_file.name()),
        "current_file.suffix(): {}".format(current_file.suffix()),
        "current_file.is_dir: {}".format(current_file.is_dir()),
        "current_file.is_file: {}".format(current_file.is_file()),
        "version_file.read_text(): {}".format(version_file.read_text()),
    ]

    for result in results:
        print(result)


fn _os() raises -> None:
    desktop = "~/Desktop"
    current_file = "./main.mojo"

    results = [
        "desktop: {}".format(String(desktop)),
        "current_file: {}".format(String(current_file)),
        "os.path.basename(current_file): {}".format(
            String(os.path.basename(current_file))
        ),
        "os.path.dirname(current_file): {}".format(
            String(os.path.dirname(current_file))
        ),
        "os.path.exists(current_file): {}".format(
            String(os.path.exists(current_file))
        ),
        "os.path.expanduser(desktop): {}".format(
            String(os.path.expanduser(desktop))
        ),
        "os.path.getsize(current_file): {}".format(
            String(os.path.getsize(current_file))
        ),
        "os.path.is_absolute(current_file): {}".format(
            String(os.path.is_absolute(current_file))
        ),
        "os.path.isdir(current_file): {}".format(
            String(os.path.isdir(current_file))
        ),
        "os.path.isfile(current_file): {}".format(
            String(os.path.isfile(current_file))
        ),
        "os.getenv('HOME'): {}".format(String(os.getenv("HOME"))),
    ]

    for result in results:
        print(result)


fn _iter() raises -> None:
    numbers = [1, 2, 3, 4, 5]
    letters = ["a", "b", "c", "d", "e"]

    fn square(number: Int) -> Int:
        return number**2

    results = [
        "numbers: {}".format(repr(numbers)),
        "letters: {}".format(repr(letters)),
    ]

    for result in results:
        print(result)

    print("squared")
    squared = map[square](numbers)
    for s in squared:
        print(s)

    print("zipped")
    zipped = zip(letters, numbers)
    for l, n in zipped:
        print(l, n)

    print("enumerated")
    for i, l in enumerate(letters):
        print(i, l)


fn _io() raises -> None:
    # File descriptor
    with open(".python-version", mode="r") as f:
        contents = f.read()
        print("contents: {}".format(contents))


fn _subprocess() raises -> None:
    command = "pwd"
    result = run(command)
    print(command)
    print(result)
