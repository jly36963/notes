const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    printSectionTitle("Basic std out");
    try basicIO();

    printSectionTitle("Basic print");
    basicPrint();

    printSectionTitle("Basic interpolation");
    basicInterpolation();

    printSectionTitle("Basic types");
    basicTypes();

    printSectionTitle("Basic strings");
    basicStrings();

    printSectionTitle("Basic variables");
    basicVariables();

    printSectionTitle("Basic Arrays");
    basicArrays();

    printSectionTitle("Basic If");
    basicIf();

    printSectionTitle("Basic if expression");
    basicIfExpression();

    printSectionTitle("Basic while");
    basicWhile();

    printSectionTitle("Basic for loop");
    basicForLoop();

    printSectionTitle("Basic functions");
    basicFunctions();

    printSectionTitle("Basic allocation");
    try basicAllocation();

    printSectionTitle("Basic error");
    basicError();

    printSectionTitle("Basic switch");
    basicSwitch();

    printSectionTitle("Basic undefined");
    basicUndefined();

    printSectionTitle("Basic optional");
    basicOptional();

    printSectionTitle("Basic enums");
    basicEnums();

    printSectionTitle("Basic unions");
    basicUnions();

    printSectionTitle("Basic structs");
    basicStructs();

    printSectionTitle("Basic comptime");
    basicComptime1();
    basicComptime2();
}

// ---
// Helpers
// ---

fn printSectionTitle(s: []const u8) void {
    print("\n// ---\n", .{});
    print("// {s}", .{s});
    print("\n// ---\n\n", .{});
}

// ---
// Print
// ---

/// Print example
fn basicPrint() void {
    print("Finland!\n", .{});
}

/// String interpolation example
fn basicInterpolation() void {
    print("The inner machinations of my mind are an {s}.\n", .{"enigma"});
}

/// Basic io usage
fn basicIO() !void {
    // Using standard out
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, {s}!\n", .{"world"});
}

// ---
// Types
// ---

/// Basic type introduction
fn basicTypes() void {
    // TypeOf
    const str = "Hello there!\n";
    const t = @TypeOf(str);
    print("TypeOf str is {}\n", .{t});

    // Primitive
    const u: u38 = 22;
    print("u32: ({}) {d}\n", .{ @TypeOf(u), u });
    const i: i32 = 11;
    print("i32: ({}) {d}\n", .{ @TypeOf(i), i });
    const f: f64 = 13;
    print("f64: ({}) {d}\n", .{ @TypeOf(f), f });
    const b: bool = true;
    print("bool: ({}) {}\n", .{ @TypeOf(b), b });

    // Strings (u8 arrays)
    const s = "Hello there!"; // Type: *const [12:0]u8
    print("string: ({}) {s}\n", .{ @TypeOf(s), s });
    const s2: []const u8 = "Hey!"; // Type: []const u8
    print("string: ({}) {s}\n", .{ @TypeOf(s2), s2 });

    // String type as function param: []const u8
}

// ---
// Strings
// ---

fn basicStrings() void {
    // ...
}

// ---
// Assignment
// ---

fn basicVariables() void {
    // Constants (immutable)
    const s1 = "Where's the leak ma'am?";
    print("s1: {s}\n", .{s1});

    // Var (mutable)
    var float1: f64 = 2.0;
    float1 = 3.0;
    print("s2: {d}\n", .{float1});

    // Inferred
    const bool1 = true;
    print("bool1: {}\n", .{bool1});
    const int1 = @as(u32, 5);
    print("int1: {}\n", .{int1});
}

// ---
// Arrays
// ---

/// Basic array example
fn basicArrays() void {
    // Arrays are defined like `[N]T`
    // N can be inferred `_`
    const arr1 = [5]u8{ 1, 2, 3, 4, 5 };
    const arr2 = [_]u8{ 'a', 'b', 'c', 'd', 'e' };

    // var arr3 = [5]u8{};
    var arr3 = std.mem.zeroes([5]u8);
    for (0..5) |i| {
        arr3[i] = @intCast(i);
    }

    // Properties
    print("arr1.len is {d}\n", .{arr1.len}); // usizes
    print("arr2 ** 2 is {any}\n", .{arr2 ** 2});
}

// ---
// Control flow
// ---

/// Basic if/else example
fn basicIf() void {
    const ts = std.time.timestamp();
    const is_even: bool = @mod(ts, 2) == 0;
    var parity: []const u8 = undefined;
    if (is_even) {
        parity = "even";
    } else {
        parity = "odd";
    }
    print("timestamp {d} is {s}\n", .{ ts, parity });
}

/// Basic if expression (like ternary)
fn basicIfExpression() void {
    const ts = std.time.timestamp();
    const is_even: bool = @mod(ts, 2) == 0;
    const parity = if (is_even) "even" else "odd"; // Unknown []u8
    print("timestamp {d} is {s}\n", .{ ts, parity });
}

/// Basic while loop example
fn basicWhile() void {
    // While supports `continue` and `break
    var i: i32 = 1;
    while (i <= 5) : (i += 1) {
        print("i is {d}\n", .{i});
    }
}

/// Basic for loop example
fn basicForLoop() void {
    const letters = [_]u8{ 'a', 'b', 'c' };

    // Loop (payload capture: `|| { ... }`)
    for (letters) |l| {
        print("{c}\n", .{l});
    }

    // Enumerate
    for (letters, 0..) |l, i| {
        print("{d}:{c}\n", .{ i, l });
    }

    // Inline loop (can also do `inline while`)
    inline for (letters) |l| print("{c}\n", .{l});
}

// ---
// Functions
// ---

/// Add two numbers
fn add(a: i8, b: i8) i8 {
    return a + b;
}

test "expect add 2 and 3 will result in 5" {
    try std.testing.expect(add(2, 3), 5);
}

/// Recursively compute factorial (will probably overflow, idk)
fn factorial(n: u8) u64 {
    if (n == 1) return 1;
    return n * factorial(n - 1);
}

fn basicFunctions() void {
    // With params
    const params_res = add(2, 3);
    print("Result (add): {d}\n", .{params_res});

    // Recursion
    const recursion_res = factorial(10);
    print("Result (factorial): {d}\n", .{recursion_res});
}

// ---
// Allocation
// ---

/// Example of allocating and freeing memory.
/// For slices, alloc/free
/// For single items, create/destroy
fn basicAllocation() !void {
    // Page allocation
    // Pros: simple
    // Cons: requests whole page of memory, system call is slow
    {
        const allocator = std.heap.page_allocator;
        const arr1 = try allocator.alloc(u8, 10);
        defer allocator.free(arr1);
        print("arr1.len, {d}\n", .{arr1.len});
    }

    // General purpose allocator
    // Can detect double-free and use-after-free issues and leaks
    {
        var gpa = std.heap.GeneralPurposeAllocator(.{}){};
        defer _ = gpa.deinit();
        const allocator = gpa.allocator();
        const bytes = try allocator.alloc(u8, 10);
        defer allocator.free(bytes);
        print("bytes.len, {d}\n", .{bytes.len});
    }
}

// ---
// Errors
// ---

// TODO:
// catch (handle error in block)
// try (catch and return error)
// errdefer (handle error in block after function return)

fn basicError() void {
    print("...\n", .{});
}

// ---
// Switch
// ---

fn basicSwitch() void {
    const num: i32 = 11;
    print("The number {d} is ", .{num});
    switch (num) {
        std.math.minInt(i32)...-1 => {
            print("negative", .{});
        },
        0 => {
            print("zero", .{});
        },
        1...std.math.maxInt(i32) => {
            print("positive", .{});
        },
        // else => {} // If not all cases are covered
    }
    print("\n", .{});
}

// ---
// Pointers
// ---

// ...

// ---
// Slices
// ---

// ...

// ---
// Unions
// ---

/// Undefined example
fn basicUndefined() void {
    // `undefined` must remain unused until overwritten
    var num: i32 = undefined;
    num = 3;
    print("num: {}\n", .{num});
}

/// Optional example
fn basicOptional() void {
    var num: ?i32 = null;
    num = 1;
    if (num) |n| {
        print("num: {}\n", .{n});
    }
}

/// Enum example
fn basicEnums() void {
    print("...\n", .{});
}

/// Union example
fn basicUnions() void {
    print("...\n", .{});
    // Union, tagged union
}

// ---
// Structs
// ---

// NOTE: `const` struct instances will require `self: *const Ninja` signature
// NOTE: `format` function used by `fmt`

const Ninja = struct {
    first_name: []const u8,
    last_name: []const u8,
    age: u8,

    fn greet(self: *Ninja) void {
        print("Hi! I'm {s} {s}\n", .{ self.first_name, self.last_name });
    }
};

fn basicStructs() void {
    var ninja1 = Ninja{ .first_name = "Kakashi", .last_name = "Hatake", .age = 27 };
    print("Ninja.first_name: {s}\n", .{ninja1.first_name});
    ninja1.last_name = "Sensei";
    ninja1.greet();
}

// ---
// Labelled blocks/loops
// ---

// ...

// ---
// Comptime
// ---

// Relevant: comptime, @typeInfo, @Type, @This, anytype

/// Generic array find function (with static predicate)
fn findWithStaticPredicate(comptime T: type, arr: []const T, predicate: fn (val: T) bool) ?T {
    for (arr) |v| {
        if (predicate(v)) {
            return v;
        }
    }
    return null;
}

/// Determine if a given u8 even
fn isEvenU8(int: u8) bool {
    return @mod(int, 2) == 0;
}

/// Basic comptime generic function example (1)
fn basicComptime1() void {
    const arr1 = [_]u8{ 1, 2, 3, 4, 5 };
    const maybeItem = findWithStaticPredicate(u8, &arr1, isEvenU8);
    if (maybeItem) |item| {
        print("Found an even number {d}\n", .{item});
    } else {
        print("Couldn't find an even number\n", .{});
    }
}

/// Generic array find function (with comptime generic predicate)
fn find(comptime T: type, arr: []const T, predicate: fn (comptime t: type, val: T) bool) ?T {
    for (arr) |v| {
        if (predicate(T, v)) {
            return v;
        }
    }
    return null;
}

/// Determine if a given integer is even
fn isEven(comptime T: type, int: T) bool {
    return @mod(int, 2) == 0;
}

/// Basic comptime generic function example (2)
fn basicComptime2() void {
    const arr1 = [_]u8{ 1, 2, 3, 4, 5 };
    const maybeItem = find(u8, &arr1, isEven);
    if (maybeItem) |item| {
        print("Found an even number {d}\n", .{item});
    } else {
        print("Couldn't find an even number\n", .{});
    }
}

// ---
// Opaque
// ---

// Type with unknown size/alignment
// Used to maintain type safety with types we don't have info about
// (Typically used to interop with C code that doesn't expose complete type info)

// ---
// Vector
// ---

// Can only contain bool/int/float/ptr types
// SIMD type

// ---
// Testing
// ---

// std.testing.expect
