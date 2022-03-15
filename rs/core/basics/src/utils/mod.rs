pub fn print_section_header(header: String) {
    println!("{}", header.to_ascii_uppercase());
}

pub fn type_of<T>(_: &T) -> String {
    format!("{}", std::any::type_name::<T>())
}
