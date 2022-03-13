use std::any::{Any, TypeId};
use std::env;
use std::fs;
use std::fs::File;
use std::fs::Permissions;
use std::io::{BufReader, BufWriter, Read, Write};
use std::os::unix::fs::PermissionsExt;
use std::path::Path;
use std::process::Command;

/// Basic collections usage
pub fn basic_collections() -> () {
    // https://doc.rust-lang.org/std/collections/index.html
    println!("TODO");
}

/// Basic fmt usage
/// Formatting: https://doc.rust-lang.org/std/fmt/index.html#formatting-parameters
/// Macros: https://doc.rust-lang.org/std/fmt/index.html#related-macros
pub fn basic_fmt() -> () {
    format!("Hello");
    format!("Hello, {}!", "world"); // Uses Display trait
    format!("{:?}", (1, 2)); // Uses Debug trait
    format!("{:#?}", (1, 2, 3)); // Pretty print debug (#?)
    format!("{2}, {1}, {0}", "c", "b", "a"); // Positional params
    format!("name: {name}", name = "Kakashi");

    println!("Hey there, {}", "Kakashi");
}

/// Basic path usage
/// path: cross-platform path manipulation
pub fn basic_path() -> () {
    let path = Path::new("./a/b/c.txt");
    let parent = path.clone().parent().unwrap();
    let file_stem = path.clone().file_stem().unwrap();
    let extension = path.clone().extension().unwrap();
    let is_dir = path.clone().is_dir();
    let is_file = path.clone().is_file();
    let ends_with = path.clone().ends_with(".txt");
    let exists = path.clone().exists();
    let is_absolute = path.clone().is_absolute();
    let is_relative = path.clone().is_relative();
    let starts_with = path.clone().starts_with(".");
    let with_extension = path.clone().with_extension("json");
    let with_file_name = path.clone().with_file_name("d");

    println!("path: {:?}", path);
    println!("parent: {:?}", parent);
    println!("file_stem: {:?}", file_stem);
    println!("extension: {:?}", extension);
    println!("is_dir: {}", is_dir);
    println!("is_file: {}", is_file);
    println!("ends_with: {}", ends_with);
    println!("exists: {}", exists);
    println!("is_absolute: {}", is_absolute);
    println!("is_relative: {}", is_relative);
    println!("starts_with: {}", starts_with);
    println!("with_extension: {:?}", with_extension);
    println!("with_file_name: {:?}", with_file_name);

    // Components of path
    println!("path iter:");
    for p in path.iter() {
        println!("{:?}", p);
    }
    println!("path components:");
    for p in path.components() {
        println!("{:?}", p);
    }

    // Read directory
    println!("dir contents:");
    for entry in Path::new(".").read_dir().unwrap() {
        println!("{:?}", entry.unwrap());
    }

    // Join
    let joined: String = Path::new("./")
        .join("a")
        .join("b")
        .join("c.txt")
        .to_str()
        .unwrap()
        .into();
    println!("joined: {:?}", joined);
}

/// Basic env usage
/// env: inspection/manipulation of the process's environment
pub fn basic_env() -> () {
    // args
    let args = env::args();

    // args_os
    let args_os = env::args_os();

    // current_dir, current_exe, set_current_dir
    // Result<std::path::PathBuf> -> PathBuf -> Option<&str> -> &str -> std::string::String
    let current_dir: String = env::current_dir().unwrap().to_str().unwrap().into();
    let current_exe: String = env::current_exe().unwrap().to_str().unwrap().into();
    env::set_current_dir(Path::new("../")).unwrap();
    let current_dir_after: String = env::current_dir().unwrap().to_str().unwrap().into();

    // home_dir
    #[allow(deprecated)]
    let home_dir: String = env::home_dir().unwrap().to_str().unwrap().into();

    // join_paths, split_paths (path1:path2)
    let a = [Path::new("/bin"), Path::new("/usr/bin")];
    // Result<OsString, JoinPathsError> -> OsString ->  String
    let joined: String = env::join_paths(a.iter()).unwrap().into_string().unwrap();
    let joined_os_string: std::ffi::OsString = joined.clone().into();
    let split = env::split_paths(&joined_os_string);

    // var, set_var, remove_var, vars
    let key = "SECRET_BOX";
    env::set_var(key, "No one can know, not even SQUIDWARD'S HOUSE!");
    let var_after_set = env::var(key).unwrap_or("".into());
    env::remove_var(key);
    let var_after_remove = env::var(key).unwrap_or("".into());
    let vars = env::vars();

    // Print results
    println!("args:");
    for a in args {
        println!("{}", a);
    }
    println!("args_os:");
    for os_string in args_os {
        let a = os_string.into_string().unwrap();
        println!("{}", a);
    }
    println!("current_dir: {}", current_dir);
    println!("current_exe: {}", current_exe);
    println!("current_dir (after set): {}", current_dir_after);
    println!("home_dir (deprecated): {}", home_dir);
    println!("joined: {}", joined);
    println!("split:");
    for path_buf in split {
        println!("{:?}", path_buf);
    }
    println!("env var (after set): {}", var_after_set);
    println!("env var (after remove): {}", var_after_remove);
    println!("vars count: {}", vars.count());
    /*
    println!("vars:");
    for v in vars {
        let (k, v) = v;
        println!("{}: {}", k, v);
    }
    */
}

/// Basic io usage
pub fn basic_io() -> () {
    let dirname = "./example";
    let filename = "./example/file.txt";

    // Create temp directory
    fs::create_dir_all(dirname).unwrap();
    // Create file
    let f = File::create(filename).unwrap();
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
        let fd = File::open(filename).unwrap();
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
    fs::remove_file(filename).unwrap();
    fs::remove_dir(dirname).unwrap();
}

/// Basic fs usage
pub fn basic_fs() -> () {
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
    fs::remove_file(filename).unwrap();
    fs::remove_file(filename3).unwrap();
    fs::remove_dir(dirname).unwrap();
    /*
    // If not careful, this could be really bad
    fs::remove_dir_all(dirname).unwrap();
     */
}

/// Basic os usage
/// os-specific extensions to std packages
pub fn basic_os() -> () {
    println!("TODO");
}

/// Basic prelude usage
/// prelude: list of things rust automatically imports into every rust program
/// It reduces verbosity of imports
/// It is kept minimal to reduce unused imports
pub fn basic_prelude() -> () {
    println!("TODO");
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

/// Basic Box usage
/// Box: a pointer type for heap allocation
/// It is the simplest form of heap allocation in Rust
/// It has defined size
pub fn basic_box() -> () {
    // Reference/dereference

    // Move value from stack to heap using a Box
    let val: u8 = 5;
    let boxed: Box<u8> = Box::new(val);
    // Move value back to stack by dereferencing
    let val = *boxed;
    println!("Unboxed value: {}", val);
}

/// Basic Pin usage
/// Pin: pins data to its location in memory (unless type has auto-trait Unpin)
/// It ensures that the pointee of any pointer type has a stable location in memory.
/// Pointee of pointer type can't be moved, can't be deallocated until drop
/// Many types are freely moveable, Unpin auto-trait means the type doesn't care about pinning
pub fn basic_pin() -> () {
    // https://doc.rust-lang.org/std/pin/
    println!("TODO");
}

/// Basic Future usage
/// Future: a representation of asynchronous operation
/// It is a value that might not have finished computing yet
/// Enables a thread to do other things while waiting for the value to be available
/// Under the hood: it is polled, woken when ready, registered for wakeup if not yet available
/// Poll: returns either Pending or Ready(val)
pub fn basic_future() -> () {
    // https://doc.rust-lang.org/stable/std/future/trait.Future.html
    println!("TODO");
}

/// Basic Rc usage
/// rc: single-threaded reference-counting pointers
/// It provides shared ownership of a value.
/// No immutability, put Cell/RefCell inside Rc for mutability
/// Cloning produces a new pointer to the same allocation in the heap
/// When the last pointer is destroyed, the stored value is dropped
/// Rc: faster, no Send/Sync trait
/// Arc: slower, has Send/Sync trait
pub fn basic_rc() -> () {
    // https://doc.rust-lang.org/std/rc/index.html
    println!("TODO");
}

/// Basic cell usage
/// Rust memory safety: either several immutable references or a single mutable reference
/// Cell/RefCell: allow multiple mutable references (in a single-threaded context)
/// For multi-threaded mutability, use sync types (Mutex, RwLock, atomic)
/// cells provide "interior mutability", whereas typical Rust types exhibit "inherited mutability"
/// Cell: implements interior mutability by moving values in and out of the cell
/// RefCell: cell with reference, requires acquiring a write lock before mutating
pub fn basic_cell() -> () {
    // https://doc.rust-lang.org/std/cell/index.html
    println!("TODO");
}

/// Basic sync usage
pub fn basic_sync() -> () {
    // https://doc.rust-lang.org/std/sync/index.html
    // https://doc.rust-lang.org/std/sync/index.html#higher-level-synchronization-objects
    println!("TDOD");
}

/// Basic panic usage
pub fn basic_panic() -> () {
    // https://doc.rust-lang.org/std/macro.panic.html
    // https://doc.rust-lang.org/nomicon/unwinding.html
    println!("TDOD");
}

/// Basic Any usage
/// Any: trait that enables dynamic typing of any 'static type through runtime reflection
pub fn basic_any() -> () {
    let boxed: Box<dyn Any> = Box::new(3_i32);
    let actual_id = (&*boxed).type_id();
    let boxed_id = boxed.type_id();
    assert_eq!(actual_id, TypeId::of::<i32>());
    assert_eq!(boxed_id, TypeId::of::<Box<dyn Any>>());
}
