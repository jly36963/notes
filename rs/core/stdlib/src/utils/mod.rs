pub fn print_section_header(header: String) {
    println!("");
    println!("{}", header.to_ascii_uppercase());
    println!("");
}

pub fn _type_of<T>(_: &T) -> String {
    format!("{}", std::any::type_name::<T>())
}
