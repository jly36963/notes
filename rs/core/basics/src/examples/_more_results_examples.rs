use std::io;
use std::io::ErrorKind;

/// More (file-related) results examples
fn _basic_result() -> () {
    let fp1: &str = "./data/abc.txt";
    let fp2: &str = "./data/hello.txt";

    // Match: similar to a switch, handle each case
    match File::open(fp2) {
        Ok(file) => println!("fp2 file: {:?}", file),
        Err(error) => match error.kind() {
            ErrorKind::NotFound => panic!("File not found {}", fp2),
            other_error => {
                panic!("Problem opening the file: {:?}", other_error)
            }
        },
    };

    // Unwrap: get value if Ok, panic if Err
    let is_file: bool = File::create(fp1).unwrap().metadata().unwrap().is_file();
    println!("fp1 file > metadata > is_file: {}", is_file);

    // Unwrap or else: get value from Ok, or compute it from the error using a closure
    let _f: File = File::open(fp1).unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create(fp1).unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });

    // Unwrap or: Get value from Ok or provide a fallback value
    let mut contents: String = String::new();
    match File::open("hello.txt") {
        Ok(mut f) => {
            let bytes_read = f.read_to_string(&mut contents).unwrap_or(0);
            println!("{} bytes were read", bytes_read);
        }
        Err(_) => {
            println!("Oops! failed to open the file");
        }
    }

    // Expect: panic if Err, with message
    let _f: File = File::open("hello.txt").expect("Failed to open hello.txt");
}

/// Basic propogation
/// The last expression evaluates to a result of the same type declared by the parent function
fn _result_with_propogate() -> Result<String, io::Error> {
    let f = File::open("hello.txt");

    let mut f = match f {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut s = String::new();

    match f.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(e) => Err(e),
    }
}

/// Basic propogation (?)
/// When a result is the same type as the parent function
/// result? -- continue function if Ok, return early with Err(e) if error
fn _result_with_propogate_qm_operator() -> Result<String, io::Error> {
    let mut f = File::open("hello.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?; // return early if Err
    Ok(s) // result must have been Ok
}

/// Basic propogation (multiple ?)
/// Both expressions return the same result, an Err from either will cause early return
fn _result_with_propogate_qm_operator_2() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
