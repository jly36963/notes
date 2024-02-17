const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    printSectionTitle("Basic std out");
    try basicStdOut();

    printSectionTitle("Basic print");
    basicPrint();

    printSectionTitle("Basic interpolation");
    basicInterpolation();

    printSectionTitle("Basic types");
    basicTypes();

    printSectionTitle("Basic undefined");
    basicUndefined();

    printSectionTitle("Basic optional");
    basicOptional();

    printSectionTitle("Basic functions");
    basicFunctions();
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
// Examples
// ---

fn basicStdOut() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, {s}!\n", .{"world"});
}

fn basicPrint() void {
    print("Hello again!!\n", .{});
}

fn basicInterpolation() void {
    print("Hey there, {s}!\n", .{"Kakashi"});
}

fn basicTypes() void {
    // Primitive
    const u: u32 = 22;
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
}

fn basicUndefined() void {
    var num: i32 = undefined; // Should be unused or overwritten before using
    num = 3;
    print("num: {}\n", .{num});
}

fn basicOptional() void {
    var num: ?i32 = null;
    num = 1;
    if (num) |n| {
        print("num: {}\n", .{n});
    }
}

/// Add two numbers
fn add(a: i8, b: i8) i8 {
    return a + b;
}

test "expect add 2 and 3 will result in 5" {
    try std.testing.expect(add(2, 3), 5);
}

fn basicFunctions() void {
    // With params
    const res = add(2, 3);
    print("Add result: {d}\n", .{res});
}
