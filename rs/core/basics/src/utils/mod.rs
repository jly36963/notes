/// Convert a string to uppercase and print it
pub fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

/// Get the type name of a value as a String
pub fn type_of<T>(_: &T) -> String {
    format!("{}", std::any::type_name::<T>())
}
