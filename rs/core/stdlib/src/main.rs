use std::any::{Any, TypeId};
use std::collections::{HashMap, HashSet};
use std::env;
use std::fs;
use std::fs::File;
use std::fs::OpenOptions;
use std::fs::Permissions;
use std::io::{BufReader, BufWriter, Read, Seek, Write};
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::process::Command;

// https://doc.rust-lang.org/std/

// ---
// Main
// ---

fn main() {
    print_section_header(String::from("basic hashmaps"));
    basic_hashmaps();

    print_section_header(String::from("basic hashset"));
    basic_hashset();

    print_section_header(String::from("basic fmt"));
    basic_fmt();

    print_section_header(String::from("basic path"));
    basic_path();

    print_section_header(String::from("basic path (iter)"));
    basic_path_iter();

    print_section_header(String::from("basic env"));
    basic_env();

    print_section_header(String::from("basic fs (1)"));
    basic_fs_1();

    print_section_header(String::from("basic fs (2)"));
    basic_fs_2();

    print_section_header(String::from("basic fs (3)"));
    basic_fs_3();

    print_section_header(String::from("basic prelude"));
    basic_prelude();

    print_section_header(String::from("basic process"));
    basic_process();

    print_section_header(String::from("basic box"));
    basic_box();

    print_section_header(String::from("basic pin"));
    basic_pin();

    print_section_header(String::from("basic future"));
    basic_future();

    print_section_header(String::from("basic rc"));
    basic_rc();

    print_section_header(String::from("basic cell"));
    basic_cell();

    print_section_header(String::from("basic sync"));
    basic_sync();

    print_section_header(String::from("basic panic"));
    basic_panic();

    print_section_header(String::from("basic any"));
    basic_any();
}

// ---
// Utils
// ---

/// Convert a string to uppercase and print it
pub fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

// ---
// Examples
// ---

pub fn basic_hashset() -> () {
    let hs0: HashSet<i32> = HashSet::new();
    let hs1 = HashSet::from([1, 2, 3, 4, 5]);
    let hs2 = HashSet::from([1, 2, 3]);
    let hs3: HashSet<i32> = HashSet::from([0, 10]);

    let results = vec![
        format!("hs0: {:?}", hs0),
        format!("hs1: {:?}", hs1),
        format!("hs1.capacity(): {:?}", hs1.capacity()),
        format!("hs1.contains(&1): {:?}", hs1.contains(&1)),
        format!("hs1.difference(&hs2): {:?}", hs1.difference(&hs2)),
        format!("hs1.get(1): {:?}", hs1.get(&1)),
        format!("hs0.is_empty(): {:?}", hs0.is_empty()),
        format!("hs1.is_disjoint(&hs3): {:?}", hs1.is_disjoint(&hs3)),
        format!("hs2.is_subset(&hs1): {:?}", hs2.is_subset(&hs1)),
        format!("hs1.is_superset(&hs2): {:?}", hs1.is_superset(&hs2)),
        format!("hs1.iter().map(...): {:?}", hs1.iter().map(|n| n + 1)),
        format!("hs1.len(): {:?}", hs1.len()),
        format!("hs1.union(&hs3): {:?}", hs1.union(&hs3)),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

pub fn basic_hashmaps() -> () {
    let hm0: HashMap<String, i32> = HashMap::new();
    let mut hm1: HashMap<String, i32> = HashMap::from([
        (String::from("a"), 1),
        (String::from("b"), 2),
        (String::from("c"), 3),
    ]);
    hm1.insert(String::from("d"), 4);

    let results = vec![
        format!("hm0: {:?}", hm0),
        format!("hm1: {:?}", hm1),
        format!("hm1.capacity(): {:?}", hm1.capacity()),
        format!("hm1.contains_key(\"a\"): {:?}", hm1.contains_key("a")),
        format!("hm1.get(\"a\".into()): {:?}", hm1.get("a".into())),
        format!(
            "hm1.get(\"e\".into()).unwrap_or(&5): {:?}",
            hm1.get("e".into()).unwrap_or(&5)
        ),
        format!("hm1.keys(): {:?}", hm1.keys()),
        format!("hm1.is_empty(): {:?}", hm1.is_empty()),
        format!(
            "hm1.iter().map(...): {:?}",
            hm1.iter().map(|(k, v)| format!("k: {}, v: {}", k, v))
        ),
        format!("hm1.len(): {:?}", hm1.len()),
        format!("hm1.values(): {:?}", hm1.values()),
    ];
    results.iter().for_each(|s| println!("{}", s));

    println!("For loop through hm1");
    for (k, v) in &hm1 {
        println!("k: {}, v: {}", k, v);
    }
}

pub fn basic_fmt() -> () {
    let results = vec![
        // Uses Display trait
        format!("Hello, {}!", "world"),
        // Uses Debug trait
        format!("{:?}", (1, 2)),
        // Pretty print debug (#?)
        format!("{:#?}", (1, 2, 3)),
        // Positional params
        format!("{2}, {1}, {0}", "c", "b", "a"),
        // Named params
        format!("name: {name}", name = "Kakashi"),
    ];

    results.iter().for_each(|s| println!("{}", s));
}

/// Path: used for cross-platform path manipulation.
pub fn basic_path() -> () {
    let path1 = Path::new("./a/b/c.txt");

    let results = vec![
        format!("path1: {:?}", path1),
        format!("path.parent().unwrap(): {:?}", path1.parent()),
        format!("path1.file_stem(): {:?}", path1.file_stem()),
        format!("path1.extension(): {:?}", path1.extension()),
        format!("path1.is_dir(): {:?}", path1.is_dir()),
        format!("path1.is_file(): {:?}", path1.is_file()),
        format!("path1.ends_with(\".txt\"): {:?}", path1.ends_with(".txt")),
        format!("path1.exists(): {:?}", path1.exists()),
        format!("path1.is_absolute(): {:?}", path1.is_absolute()),
        format!("path1.is_relative(): {:?}", path1.is_relative()),
        format!("path1.starts_with(\".\"): {:?}", path1.starts_with(".")),
        format!(
            "path1.with_extension(\"json\"): {:?}",
            path1.with_extension("json")
        ),
        format!(
            "path1.with_file_name(\"d\"): {:?}",
            path1.with_file_name("d")
        ),
    ];

    results.iter().for_each(|s| println!("{}", s));

    // Join
    let joined1 = Path::new(".").join("src");
    println!("joined: {:?}", joined1);
    let joined2: PathBuf = [".", "target", "debug"].iter().collect();
    println!("joined: {:?}", joined2);
}

fn basic_path_iter() -> () {
    let path1 = Path::new("./a/b/c.txt");

    // Components of path
    println!("path iter:");
    for p in path1.iter() {
        println!("{:?}", p);
    }
    println!("path components:");
    for p in path1.components() {
        println!("{:?}", p);
    }
    // Read directory
    println!("dir contents:");
    for entry in Path::new(".").read_dir().unwrap() {
        println!("{:?}", entry.unwrap());
    }
}

/// Env: used for inspection/manipulation of the process's environment.
pub fn basic_env() -> () {
    #[allow(deprecated)]
    let results = vec![
        format!("env::args(): {:?}", env::args()),
        format!("env::args_os(): {:?}", env::args_os()),
        format!("env::consts::ARCH: {}", env::consts::ARCH),
        format!("env::consts::OS: {}", env::consts::OS),
        format!("env::consts::FAMILY: {}", env::consts::FAMILY),
        format!("env::current_dir(): {:?}", env::current_dir()),
        format!("env::current_exe(): {:?}", env::current_exe()),
        format!("env::home_dir(): {:?}", env::home_dir()), // deprecated
        format!("env::vars().count(): {:?}", env::vars().count()),
    ];

    // Also: join_paths, split_paths, var, vars, set_var, remove_var

    results.iter().for_each(|s| println!("{}", s));
}

pub fn basic_file() -> () {
    let filename = "README.md";
    let path = Path::new(filename);
    let fd = File::open(&path).expect("Could not open file");

    let results = vec![
        format!("path: {:?}", path),
        format!("fd: {:?}", fd),
        format!("fd.metadata(): {:?}", fd.metadata()),
        format!(
            "std::fs::read_to_string(&path): {:?}",
            std::fs::read_to_string(&path)
        ),
    ];

    results.iter().for_each(|s| println!("{}", s));
}

/// fs examples using File and Path types
/// File::open() is read-only
/// File::create() is write-only
/// OpenOptions::new() allows for more flexibility
/// Also see `write!` macro`
pub fn basic_fs_1() -> () {
    let data_dir = "./data";
    let input_dir = Path::new(data_dir).join("input");
    let output_dir = Path::new(data_dir).join("output");
    let filename = "report.txt";
    let file1_path = input_dir.join(Path::new(filename));
    let file2_path = output_dir.join(Path::new(filename));

    let results = vec![
        format!("data_dir: {:?}", data_dir),
        format!("input_dir: {:?}", input_dir),
        format!("output_dir: {:?}", output_dir),
        format!("filename: {:?}", filename),
        format!("file1_path: {:?}", file1_path),
        format!("file2_path: {:?}", file2_path),
    ];

    results.iter().for_each(|s| println!("{}", s));

    // Create dirs
    std::fs::create_dir_all(input_dir.clone()).unwrap();
    std::fs::create_dir(output_dir.clone()).unwrap();
    // Create file
    let mut fd1 = OpenOptions::new()
        .create(true)
        .read(true)
        .write(true)
        .append(true)
        .open(file1_path.clone())
        .unwrap();
    // Write to file
    fd1.write_all("Who you calling pinhead?".as_bytes())
        .unwrap();
    // Rewind to beginning of stream before read
    fd1.rewind().unwrap();
    // Read file
    let mut contents1 = String::new();
    fd1.read_to_string(&mut contents1).unwrap();
    println!("{}", contents1);
    let mut vec_contents1 = Vec::new();
    fd1.read_to_end(&mut vec_contents1).unwrap();
    println!("{}", String::from_utf8(vec_contents1).unwrap());
    // Copy file
    fs::copy(file1_path.clone(), file2_path.clone()).unwrap();
    // Append to copied file
    let mut fd2 = OpenOptions::new()
        .read(true)
        .write(true)
        .append(true)
        .open(file2_path.clone())
        .unwrap();

    fd2.write_all(" I can't see my forehead".as_bytes())
        .unwrap();
    fd2.rewind().unwrap();
    // Read copied file
    let mut contents2 = String::new();
    fd2.read_to_string(&mut contents2).unwrap();
    println!("{}", contents2);

    // Cleanup
    fs::remove_file(file2_path.clone()).unwrap();
    fs::remove_file(file1_path.clone()).unwrap();
    fs::remove_dir(output_dir).unwrap();
    fs::remove_dir(input_dir).unwrap();
    fs::remove_dir(data_dir).unwrap();
}

pub fn basic_fs_2() -> () {
    let dir1 = Path::new("./example");
    let file1 = dir1.join("file.txt");

    // Create temp directory
    fs::create_dir_all(dir1).unwrap();
    // Create file
    let f = File::create(file1.clone()).unwrap();
    {
        // Write to file
        // Buffer is flushed once writer is out of scope
        let mut writer = BufWriter::new(f);
        let contents: &[u8] =
            "You focus on the trivial, and lose sight of what is most important.".as_bytes();
        let _bytes_written = writer.write(contents).unwrap_or(0);
    }
    {
        // Read file
        let fd = File::open(file1.clone()).unwrap();
        let mut reader = BufReader::new(fd);
        let mut contents = String::new();

        let _bytes_read = reader.read_to_string(&mut contents).unwrap_or(0);
        println!("contents: {}", contents);

        /*
        // Read file (iterator)
        use std::io::prelude::*;
        let reader = BufReader::new(fd);
        for line in reader.lines() {
            println!("{}", line.unwrap_or("".into()));
        }
        */
    }
    // Cleanup
    fs::remove_file(file1).unwrap();
    fs::remove_dir(dir1).unwrap();
}

/// Basic fs usage
pub fn basic_fs_3() -> () {
    let dirname = "./example";
    let filename = "./example/file.txt";
    let filename2 = "./example/file2.txt";
    let filename3 = "./example/file3.txt";

    // Create directory
    fs::create_dir_all(dirname).unwrap();
    // Create file
    let _f = File::create(filename).unwrap();
    // Get resolved path
    let resolved = fs::canonicalize(filename);
    println!("resolved: {:?}", resolved);
    // Write to file (convenient version of io write_all)
    let contents: &[u8] = "Change is impossible in this fog of ignorance.".as_bytes();
    fs::write(filename, contents).unwrap();
    // Get metadata
    let metadata = fs::metadata(filename).unwrap();
    println!("metadata: {:?}", metadata);
    // Read contents (convenient version of io read_to_string)
    let contents = fs::read_to_string(filename).unwrap();
    println!("contents: {}", contents);
    // Set permissions
    let permissions = Permissions::from_mode(0777);
    fs::set_permissions(filename, permissions).unwrap();
    // Copy file
    fs::copy(filename, filename2).unwrap();
    // Rename file
    fs::rename(filename2, filename3).unwrap();
    // Cleanup
    // Prefering specific deletions over potentially-dangerous `remove_dir_all`,
    fs::remove_file(filename).unwrap();
    fs::remove_file(filename3).unwrap();
    fs::remove_dir(dirname).unwrap();
}

/// Basic prelude usage:
/// prelude includes things rust automatically imports into every rust program.
/// It reduces verbosity of imports.
/// It is kept minimal to reduce unused imports.
pub fn basic_prelude() -> () {
    println!("...");
}

/// Basic process usage
pub fn basic_process() -> () {
    // Command
    let output = Command::new("echo")
        .arg("If I had a dollar for every brain you don't have, I'd have one dollar.")
        .output()
        .unwrap();
    let s = String::from_utf8(output.stdout).unwrap_or("".into());
    print!("command output: {}", s);
}

/// Basic Box usage:
/// Box is a pointer type for heap allocation.
/// It is the simplest form of heap allocation in Rust.
/// It has defined size.
pub fn basic_box() -> () {
    // Reference/dereference

    // Move value from stack to heap using a Box
    let val: u8 = 5;
    let boxed: Box<u8> = Box::new(val);
    // Move value back to stack by dereferencing
    let val = *boxed;
    println!("Unboxed value: {}", val);
}

/// Basic Pin usage:
/// Docs: https://doc.rust-lang.org/std/pin/
/// Pin pins data to its location in memory (unless type has auto-trait Unpin).
/// It ensures that the pointee of any pointer type has a stable location in memory.
/// Pointee of pointer type can't be moved, can't be deallocated until drop.
/// Many types are freely moveable, Unpin auto-trait means the type doesn't care about pinning.
pub fn basic_pin() -> () {
    println!("...");
}

/// Basic Future usage:
/// Docs: https://doc.rust-lang.org/stable/std/future/trait.Future.html
/// Future: a representation of asynchronous operation.
/// It is a value that might not have finished computing yet.
/// Enables a thread to do other things while waiting for the value to be available.
/// Under the hood: it is polled, woken when ready, registered for wakeup if not yet available.
/// Poll returns either Pending or Ready(val).
/// Futures need an executor (eg: tokio), which is not part of the std library
pub fn basic_future() -> () {
    println!("...");
}

/// Basic Rc usage:
/// Docs: https://doc.rust-lang.org/std/rc/index.html
/// rc: single-threaded reference-counting pointers.
/// It provides shared ownership of a value.
/// No immutability, put Cell/RefCell inside Rc for mutability.
/// Cloning produces a new pointer to the same allocation in the heap.
/// When the last pointer is destroyed, the stored value is dropped.
/// Rc: faster, no Send/Sync trait.
/// Arc: slower, has Send/Sync trait.
pub fn basic_rc() -> () {
    println!("...");
}

/// Basic cell usage
/// Docs: https://doc.rust-lang.org/std/cell/index.html
/// Rust memory safety: either several immutable references or a single mutable reference.
/// Cell/RefCell: allow multiple mutable references (in a single-threaded context).
/// For multi-threaded mutability, use sync types (Mutex, RwLock, atomic).
/// cells provide "interior mutability", whereas typical Rust types exhibit "inherited mutability".
/// Cell: implements interior mutability by moving values in and out of the cell.
/// RefCell: cell with reference, requires acquiring a write lock before mutating.
pub fn basic_cell() -> () {
    println!("...");
}

/// Basic sync usage:
/// Docs: https://doc.rust-lang.org/std/sync/index.html
pub fn basic_sync() -> () {
    println!("...");
}

/// Basic panic usage:
/// Docs: https://doc.rust-lang.org/std/macro.panic.html
/// Docs2; https://doc.rust-lang.org/nomicon/unwinding.html
pub fn basic_panic() -> () {
    println!("...");
}

/// Basic Any usage:
/// Any is a trait that enables dynamic typing of any 'static type through runtime reflection
pub fn basic_any() -> () {
    let boxed: Box<dyn Any> = Box::new(3_i32);
    // Typically want this
    let actual_id = (&*boxed).type_id();
    // Over this
    let boxed_id = boxed.type_id();
    assert_eq!(actual_id, TypeId::of::<i32>());
    assert_eq!(boxed_id, TypeId::of::<Box<dyn Any>>());
}
