// ---
// modules
// ---

mod examples;
mod macros;
mod utils;

// ---
// main
// ---

fn main() {
    utils::print_section_header(String::from("basic vars"));
    examples::basic_vars();

    utils::print_section_header(String::from("basic strings"));
    examples::basic_strings();

    utils::print_section_header(String::from("basic operators"));
    examples::basic_operators();

    utils::print_section_header(String::from("basic numbers"));
    examples::basic_numbers();

    utils::print_section_header(String::from("basic functions"));
    examples::basic_functions();

    utils::print_section_header(String::from("basic closures"));
    examples::basic_closures();

    utils::print_section_header(String::from("basic unused_variables"));
    examples::basic_unused_variables();

    utils::print_section_header(String::from("basic if"));
    examples::basic_if();

    utils::print_section_header(String::from("basic loop"));
    examples::basic_loop();

    utils::print_section_header(String::from("basic while"));
    examples::basic_while();

    utils::print_section_header(String::from("basic for loop"));
    examples::basic_for_loop();

    utils::print_section_header(String::from("basic ownership"));
    examples::basic_ownership();

    utils::print_section_header(String::from("basic options"));
    examples::basic_options();

    utils::print_section_header(String::from("basic tuples"));
    examples::basic_tuples();

    utils::print_section_header(String::from("basic arrays"));
    examples::basic_arrays();

    utils::print_section_header(String::from("basic slices"));
    examples::basic_slices();

    utils::print_section_header(String::from("basic structs"));
    examples::basic_structs();

    utils::print_section_header(String::from("basic vectors"));
    examples::basic_vectors();

    utils::print_section_header(String::from("basic hashmaps"));
    examples::basic_hashmaps();

    utils::print_section_header(String::from("basic assert"));
    examples::basic_assert();

    utils::print_section_header(String::from("basic traits"));
    examples::basic_traits();

    utils::print_section_header(String::from("basic iterators"));
    examples::basic_iterators();

    utils::print_section_header(String::from("basic lifetimes"));
    examples::basic_lifetimes();

    utils::print_section_header(String::from("basic io"));
    examples::basic_io();

    utils::print_section_header(String::from("basic macros"));
    examples::basic_macros();

    utils::print_section_header(String::from("basic reflection"));
    examples::basic_reflection();
}
