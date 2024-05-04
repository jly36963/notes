const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer {
        const gpa_check = gpa.deinit();
        printSectionTitle("GPA check (deferred)");
        print("{}\n", .{gpa_check});
    }
    var allocator = gpa.allocator();

    printSectionTitle("Basic std out");
    try basicIO();

    printSectionTitle("Basic types");
    basicTypes();

    printSectionTitle("Basic allocation");
    try basicAllocation();

    printSectionTitle("Basic array-list");
    try basicArrayList(allocator);

    printSectionTitle("Basic file-system");
    try basicFileSystem(allocator);

    printSectionTitle("Basic fmt");
    try basicFmt(allocator);

    printSectionTitle("Basic json");
    try basicJson(allocator);

    printSectionTitle("Basic random");
    try basicRandom();

    printSectionTitle("Basic hash-map");
    try basicHashMap(allocator);

    printSectionTitle("Basic sorting");
    basicSorting();
}

// ---
// Helpers
// ---

fn printSectionTitle(s: []const u8) void {
    print("\n// ---\n", .{});
    print("// {s}", .{s});
    print("\n// ---\n\n", .{});
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

    // ArenaAllocator
    {
        var gpa = std.heap.GeneralPurposeAllocator(.{}){};
        const allocator = gpa.allocator();
        var arena = std.heap.ArenaAllocator.init(allocator);
        defer arena.deinit();
        const arena_allocator = arena.allocator();

        var list1 = std.ArrayList(u8).init(arena_allocator);
        inline for (0..5) |i| try list1.append(i);
        var list2 = std.ArrayList(u8).init(arena_allocator);
        inline for ('a'..'f') |c| try list2.append(c);

        print("list1, {any}\n", .{list1.items});
        print("list2, {any}\n", .{list2.items});

        for (list1.items) |n| {
            print("n: {d}\n", .{n});
        }
    }

    // TODO
    // FixedBufferAllocator
}

// ---
// ArrayList
// ---

fn basicArrayList(allocator: std.mem.Allocator) !void {
    var list = std.ArrayList(u8).init(allocator);
    defer list.deinit();
    inline for (0..5) |i| try list.append(i);
    try list.appendSlice(&[_]u8{ 6, 7, 8, 9, 10 });
    print("list u8: {any}\n", .{list.items});
}

// ---
// Filesystem
// ---

fn basicFileSystem(allocator: std.mem.Allocator) !void {
    const data_dir = "data";
    const example_fn = "example.txt";

    const cwd = std.fs.cwd();

    // Get cwd path
    const cwd_path = try cwd.realpathAlloc(allocator, ".");
    defer allocator.free(cwd_path);

    // Get data dir path
    const data_dir_path = try std.fs.path.join(allocator, &[_][]const u8{ cwd_path, data_dir });
    defer allocator.free(data_dir_path);

    // Create directory (fs.makeDirAbsolute)
    std.fs.makeDirAbsolute(data_dir_path) catch |err| switch (err) {
        // Directory already exists, that's ok here (`fs.SelfExePathError.PathAlreadyExists`)
        error.PathAlreadyExists => print("Directory '{s}' already exists.\n", .{data_dir}),
        // Idk what happened, return error
        else => return err,
    };

    // Get filepath
    const fp1 = try std.fs.path.join(allocator, &[_][]const u8{ cwd_path, data_dir, example_fn });
    defer allocator.free(fp1);

    // Create and act on file
    {
        // Create file (creates and returns file descriptor)
        // .truncate: should file be truncated on creation?
        // .exclusive: should throw error if file already exists?
        const file1 = try cwd.createFile(fp1, .{ .read = true });
        defer file1.close();

        // Write file
        _ = try file1.writeAll("Did you try 'W' for 'Wumbo'?\n");

        // Read file (readToEndAlloc)
        try file1.seekTo(0);
        const contents = try file1.readToEndAlloc(allocator, 1_000);
        defer allocator.free(contents);
        print("Contents of file: {s}", .{contents});

        // Get stats
        const stat = try file1.stat();
        print("file stat: {any}\n", .{stat});
    }

    // Clean up file
    try std.fs.deleteFileAbsolute(fp1);
    try std.fs.deleteDirAbsolute(data_dir_path);
}

// // Create directory (Dir.makeDir)
// cwd.makeDir(data_dir) catch |err| switch (err) {
//     // Directory already exists, that's ok here (`fs.SelfExePathError.PathAlreadyExists`)
//     error.PathAlreadyExists => print("Directory '{s}' already exists.\n", .{data_dir}),
//     // Idk what happened, return error
//     else => return err,
// };

// // Using `realpath`
// const cwd_path = blk: {
//     var buffer: [100]u8 = undefined;
//     try cwd.realpath(".", &buffer);
//     break :blk buffer;
// };

// // Read file (readAll)
// var contents = blk: {
//     var buffer: [100]u8 = undefined;
//     try file1.seekTo(0);
//     _ = try file1.readAll(&buffer);
//     break :blk buffer;
// };

// // Dir.deleteTree (dangerous)
// try cwd.deleteTree(dataDir);

// ---
// fmt
// ---

fn basicFmt(allocator: std.mem.Allocator) !void {
    const template1 = "Is {s} an instrument?";

    // Using std.fmt.allocPrint
    const str1 = try std.fmt.allocPrint(
        allocator,
        template1,
        .{"mayonnaise"},
    );
    defer allocator.free(str1);

    // Using ArrayList(T).writer
    var list2 = std.ArrayList(u8).init(allocator);
    defer list2.deinit();
    try list2.writer().print(
        template1,
        .{"horseradish"},
    );
    const str2 = list2.items;

    print("str1: {s}\n", .{str1});
    print("str2: {s}\n", .{str2});
}

// ---
// JSON
// ---

const Ninja = struct {
    first_name: []const u8,
    last_name: []const u8,
    age: u8,

    fn greet(self: *Ninja) void {
        print("Hi! I'm {s} {s}\n", .{ self.first_name, self.last_name });
    }
};

fn basicJson(allocator: std.mem.Allocator) !void {
    var ninja1 = Ninja{ .first_name = "Kakashi", .last_name = "Hatake", .age = 27 };

    // Convert struct1 -> json
    var ninja1_json = std.ArrayList(u8).init(allocator);
    defer ninja1_json.deinit();
    try std.json.stringify(
        ninja1,
        .{ .whitespace = .indent_2 },
        ninja1_json.writer(),
    );
    print("ninja1_json: {s}\n", .{ninja1_json.items});

    // Convert json -> struct2
    const parsed = try std.json.parseFromSlice(
        Ninja,
        allocator,
        ninja1_json.items,
        .{},
    );
    defer parsed.deinit();
    var ninja2 = parsed.value;
    ninja2.first_name = "Kaka";
    ninja2.last_name = "Sensei";

    // Print struct2
    var ninja2_json = std.ArrayList(u8).init(allocator);
    defer ninja2_json.deinit();
    try std.json.stringify(
        ninja2,
        .{ .whitespace = .indent_2 },
        ninja2_json.writer(),
    );
    print("ninja2_json: {s}\n", .{ninja2_json.items});
}

fn basicRandom() !void {

    // // Seeded random (posix only, MacOS excluded)
    // const rand = blk: {
    //     var seed: u64 = undefined;
    //     try std.posix.getrandom(std.mem.asBytes(&seed));
    //     const prng = std.rand.DefaultPrng.init(seed);
    //     break :blk prng.random();
    // };

    // Crypto random
    const rand = std.crypto.random;

    const random_f64 = rand.float(f64);
    print("random_f64: {d}\n", .{random_f64});
    const random_bool = rand.boolean();
    print("random_bool: {}\n", .{random_bool});
    const random_u8 = rand.int(u8);
    print("random_u8: {d}\n", .{random_u8});
    const random_digit = rand.intRangeAtMost(u8, 0, 9);
    print("random_digit: {d}\n", .{random_digit});
}

fn basicHashMap(allocator: std.mem.Allocator) !void {
    var map = std.AutoHashMap(u8, []const u8).init(allocator);
    defer map.deinit();

    try map.put('x', "shish");
    try map.put('y', "ipsilon");
    try map.put('z', "zeh");

    print("count: {d}\n", .{map.count()});
    print("get(x): {?s}\n", .{map.get('x')});
    print("get(a): {?s}\n", .{map.get('a')});
    print("contains(z): {}\n", .{map.contains('z')});

    // Iterating (yields pointers to keys/values)
    {
        print("Looping with `iterator`:\n", .{});
        var iter = map.iterator();
        while (iter.next()) |entry| {
            print("entry: {c} -> {s}\n", .{ entry.key_ptr.*, entry.value_ptr.* });
        }
    }
    {
        print("Looping with `keyIterator`:\n", .{});
        var iter = map.keyIterator();
        while (iter.next()) |key| {
            print("key: {c} \n", .{key.*});
        }
    }
    {
        print("Looping with `valueIterator`:\n", .{});
        var iter = map.valueIterator();
        while (iter.next()) |value| {
            print("value: {s} \n", .{value.*});
        }
    }
}

fn basicSorting() void {
    var arr1 = [_]u8{ 0, 2, 1, 3, 2, 4, 3, 5 };
    std.mem.sort(u8, &arr1, {}, comptime std.sort.asc(u8));
    print("sorted []u8: {any}\n", .{arr1});
}
