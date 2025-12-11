use std::any::{Any, TypeId};
use std::collections::{HashMap, HashSet};
use std::env;
use std::fs;
use std::fs::File;
use std::fs::OpenOptions;
use std::fs::Permissions;
use std::io::{BufReader, BufWriter, Read, Seek, Write};
use std::mem;
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;

// References and smart pointers:
// https://doc.rust-lang.org/std/primitive.reference.html
// https://doc.rust-lang.org/std/borrow/index.html
// https://doc.rust-lang.org/std/boxed/index.html
// https://doc.rust-lang.org/std/cell/index.html
// https://doc.rust-lang.org/std/convert/index.html
// https://doc.rust-lang.org/std/marker/index.html
// https://doc.rust-lang.org/std/mem/index.html

// Unsafe (pointers)
// https://doc.rust-lang.org/std/primitive.pointer.html
// https://doc.rust-lang.org/std/ffi/index.html
// https://doc.rust-lang.org/std/ptr/index.html

// ---
// Main
// ---

fn main() {
    let examples: Vec<(&str, fn())> = vec![
        ("basic_hashmaps", basic_hashmaps),
        ("basic_hashset", basic_hashset),
        ("basic_fmt", basic_fmt),
        ("basic_path", basic_path),
        ("basic_path_iter", basic_path_iter),
        ("basic_env", basic_env),
        ("basic_fs", basic_fs),
        ("basic_file", basic_file),
        ("basic_fs_file_descriptor", basic_fs_file_descriptor),
        ("basic_fs_buf", basic_fs_buf),
        ("basic_prelude", basic_prelude),
        ("basic_process", basic_process),
        ("basic_box", basic_box),
        ("basic_pin", basic_pin),
        ("basic_future", basic_future),
        ("basic_rc", basic_rc),
        ("basic_arc", basic_arc),
        ("basic_cell", basic_cell),
        ("basic_refcell", basic_refcell),
        ("basic_sync", basic_sync),
        ("basic_thread", basic_thread),
        ("basic_any", basic_any),
        ("basic_ops", basic_ops),
        ("basic_newtype", basic_newtype),
        ("basic_mem", basic_mem),
    ];
    for (title, example_func) in examples {
        print_section_header(title.into());
        example_func();
    }
}

// ---
// Utils
// ---

/// Convert a string to uppercase and print it
pub fn print_section_header(header: &str) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

// ---
// Examples
// ---

fn basic_hashset() {
    let hs0: HashSet<i32> = HashSet::new();
    let hs1: HashSet<i32> = HashSet::from([1, 2, 3, 4, 5]);
    let hs2: HashSet<i32> = HashSet::from([1, 2, 3]);
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

fn basic_hashmaps() {
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

fn basic_fmt() {
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

fn basic_path() {
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

fn basic_path_iter() {
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

fn basic_env() {
    // Also: join_paths, split_paths, var, vars, set_var, remove_var

    let results = vec![
        format!("env::args(): {:?}", env::args()),
        format!("env::args_os(): {:?}", env::args_os()),
        format!("env::consts::ARCH: {}", env::consts::ARCH),
        format!("env::consts::OS: {}", env::consts::OS),
        format!("env::consts::FAMILY: {}", env::consts::FAMILY),
        format!("env::current_dir(): {:?}", env::current_dir()),
        format!("env::current_exe(): {:?}", env::current_exe()),
        // format!("env::home_dir(): {:?}", env::home_dir()), // deprecated
        format!("env::vars().count(): {:?}", env::vars().count()),
    ];

    results.iter().for_each(|s| println!("{}", s));
}

fn basic_fs() {
    let dirname = Path::new("./example");
    let filename = dirname.join("file.txt");
    let filename2 = dirname.join("file2.txt");
    let filename3 = dirname.join("file3.txt");

    fs::create_dir_all(dirname).unwrap();
    File::create(&filename).unwrap();
    let resolved = fs::canonicalize(&filename);
    println!("resolved: {:?}", resolved);
    let contents = "Change is impossible in this fog of ignorance.";
    fs::write(&filename, &contents.as_bytes()).unwrap();
    let metadata = fs::metadata(&filename).unwrap();
    println!("metadata: {:?}", metadata);
    let contents = fs::read_to_string(&filename).unwrap();
    println!("contents: {}", contents);
    fs::set_permissions(&filename, Permissions::from_mode(0777)).unwrap();
    fs::copy(&filename, &filename2).unwrap();
    fs::rename(&filename2, &filename3).unwrap();

    // Cleanup
    fs::remove_file(&filename).unwrap();
    fs::remove_file(&filename3).unwrap();
    fs::remove_dir(dirname).unwrap();
}

fn basic_file() {
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
fn basic_fs_file_descriptor() {
    let data_dir = Path::new("./data");
    let input_dir = data_dir.join("input");
    let output_dir = data_dir.join("output");
    let filename = "report.txt";
    let file1_path = input_dir.join(&filename);
    let file2_path = output_dir.join(&filename);

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
    fs::create_dir_all(input_dir.clone()).unwrap();
    fs::create_dir(output_dir.clone()).unwrap();
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

fn basic_fs_buf() {
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

fn basic_prelude() {
    // prelude includes things rust automatically imports into every rust program.
    // It reduces verbosity of imports.
    // It is kept minimal to reduce unused imports.
    println!("...");
}

fn basic_process() {
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
/// Wrapping a trait object in a box gives it a known size.
fn basic_box() {
    // Move value from stack to heap using a Box
    let val: u8 = 5;
    let boxed: Box<u8> = Box::new(val);
    // Move value back to stack by dereferencing
    let val = *boxed;
    println!("Unboxed value: {}", val);
}

/// Basic Rc usage:
/// Docs: https://doc.rust-lang.org/std/rc/index.html
/// rc: single-threaded reference-counting pointers.
/// It provides shared ownership of a value.
/// No immutability, put Cell/RefCell inside Rc for mutability.
/// Cloning produces a new pointer to the same allocation in the heap.
/// When the last pointer is destroyed, the stored value is dropped.
fn basic_rc() {
    println!("...");
}

/// Rc: faster, no Send/Sync trait.
/// Arc: slower, has Send/Sync trait.
fn basic_arc() {
    let values: Vec<i32> = vec![1, 2, 3, 4, 5];
    println!("values: {:?}", values);

    let result_values: Vec<i32> = std::iter::repeat(0_i32).take(values.len()).collect();
    let shared_state = Arc::new(Mutex::new(result_values));
    let mut handles: Vec<_> = Vec::new();

    values.clone().into_iter().enumerate().for_each(|(i, n)| {
        let cloned_state = shared_state.clone();
        let join_handle = thread::spawn(move || {
            let current_res = n.pow(2);
            {
                let mut locked_state = cloned_state.lock().unwrap();
                locked_state[i] = current_res;
            }
        });
        handles.push(join_handle);
    });

    for jh in handles {
        jh.join().unwrap();
    }

    let results = shared_state.lock().unwrap();
    println!("results: {:?}", results);
}

/// Basic cell usage
/// Docs: https://doc.rust-lang.org/std/cell/index.html
/// Rust memory safety: either several immutable references or a single mutable reference.
/// Cell/RefCell: allow multiple mutable references (in a single-threaded context).
/// For multi-threaded mutability, use sync types (Mutex, RwLock, atomic).
/// cells provide "interior mutability", whereas typical Rust types exhibit "inherited mutability".
/// Cell: implements interior mutability by moving values in and out of the cell.
/// RefCell: cell with reference, requires acquiring a write lock before mutating.
fn basic_cell() {
    println!("...");
}
fn basic_refcell() {
    println!("...");
}

/// Basic Pin usage:
/// Docs: https://doc.rust-lang.org/std/pin/
/// Pin pins data to its location in memory (unless type has auto-trait Unpin).
/// It ensures that the pointee of any pointer type has a stable location in memory.
/// Pointee of pointer type can't be moved, can't be deallocated until drop.
/// Many types are freely moveable, Unpin auto-trait means the type doesn't care about pinning.
fn basic_pin() {
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
fn basic_future() {
    println!("...");
}

fn basic_sync() {
    // Docs: https://doc.rust-lang.org/std/sync/index.html
    println!("...");
}

fn basic_thread() {
    // https://doc.rust-lang.org/std/thread/index.html
    println!("...");
}

/// `Any` is a trait that enables dynamic typing of any 'static type through runtime reflection
fn basic_any() {
    // Type id
    {
        let boxed: Box<dyn Any> = Box::new(3_i32);
        // Typically want this
        let actual_id = (&*boxed).type_id();
        // Over this
        let boxed_id = boxed.type_id();
        assert_eq!(actual_id, TypeId::of::<i32>());
        assert_eq!(boxed_id, TypeId::of::<Box<dyn Any>>());
    }

    // Using Any
    {
        let v1 = "No one can know, not even Squidward's house";
        let v2 = 3;

        let handler = |value: Box<dyn Any>| {
            if value.is::<&str>() {
                println!("value is &str");
            } else {
                println!("value is not &str");
            }
        };
        println!("Running handler on value: {:?}", v1);
        handler(Box::new(v1));
        println!("Running handler on value: {:?}", v2);
        handler(Box::new(v2));
    }
    // Using Any (inner)
    {
        let v1 = "No one can know, not even Squidward's house";
        let v2 = 3;

        let handler = |value: Box<dyn Any>| {
            println!("value: {:?}", value);
            if let Some(&s) = value.downcast_ref::<&str>() {
                println!("{}", s);
            } else {
                println!("value is not &str");
            }
        };
        println!("Running handler on value: {:?}", v1);
        handler(Box::new(v1));
        println!("Running handler on value: {:?}", v2);
        handler(Box::new(v2));
    }
}

/// Add two arguments of the same type (that have the Add trait)
fn generic_add<T>(a: T, b: T) -> T
where
    T: std::ops::Add<T, Output = T>,
{
    a + b
}

fn basic_ops() {
    // Generic functions: a function with generalized types, often confined to specific trait behavior
    let i32_sum = generic_add(1, 2);
    let f64_sum = generic_add(1.0, 2.0);
    println!("generic_add (i32) sum: {}", i32_sum);
    println!("generic_add (f64) sum: {}", f64_sum);
}

mod rating {
    /// Rating for a business/service/etc (between 0.0 and 5.0)
    #[derive(Debug)]
    pub struct Rating(f32);

    impl Rating {
        // Use `std::convert::TryFrom` instead?
        pub fn from_f32(value: f32) -> Option<Self> {
            match value {
                v if v <= 5.0 && v >= 0.0 => Some(Self(value)),
                _ => None,
            }
        }
        pub fn get(&self) -> f32 {
            self.0
        }
    }
    impl Default for Rating {
        fn default() -> Self {
            Self(5.0)
        }
    }
}

fn basic_newtype() {
    let rating1 = rating::Rating::from_f32(4.9).unwrap();
    let rating2 = rating::Rating::default();

    let results = vec![
        format!("rating1: {:?}", rating1),
        format!("rating1.get(): {:?}", rating1.get()),
        format!("rating2.get(): {:?}", rating2.get()),
    ];

    results.iter().for_each(|s| println!("{}", s));
}

fn basic_mem() {
    let values = vec![1, 2, 3, 4, 5];

    // Also: drop, forget, replace, swap, take

    let results = vec![
        format!("values: {:?}", values),
        format!(
            "mem::align_of::<Vec<i32>>(): {:?}",
            mem::align_of::<Vec<i32>>()
        ),
        format!(
            "mem::align_of_val(&values): {:?}",
            mem::align_of_val(&values)
        ),
        format!(
            "mem::discriminant(&Some(2)): {:?}",
            mem::discriminant(&Some(2))
        ),
        format!(
            "mem::discriminant::<Option<i32>>(&None): {:?}",
            mem::discriminant::<Option<i32>>(&None)
        ),
        format!(
            "mem::needs_drop::<Vec<i32>>(): {:?}",
            mem::needs_drop::<Vec<i32>>()
        ),
        format!(
            "mem::size_of::<Vec<i32>>(): {:?}",
            mem::size_of::<Vec<i32>>()
        ),
        format!("mem::size_of_val(&values): {:?}", mem::size_of_val(&values)),
    ];

    results.iter().for_each(|s| println!("{}", s));
}
