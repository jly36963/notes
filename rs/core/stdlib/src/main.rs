mod examples;
mod utils;

fn main() {
    utils::print_section_header(String::from("basic collections"));
    examples::basic_collections();

    utils::print_section_header(String::from("basic fmt"));
    examples::basic_fmt();

    utils::print_section_header(String::from("basic path"));
    examples::basic_path();

    utils::print_section_header(String::from("basic env"));
    examples::basic_env();

    utils::print_section_header(String::from("basic io"));
    examples::basic_io();

    utils::print_section_header(String::from("basic fs"));
    examples::basic_fs();

    utils::print_section_header(String::from("basic os"));
    examples::basic_os();

    utils::print_section_header(String::from("basic prelude"));
    examples::basic_prelude();

    utils::print_section_header(String::from("basic process"));
    examples::basic_process();

    utils::print_section_header(String::from("basic box"));
    examples::basic_box();

    utils::print_section_header(String::from("basic pin"));
    examples::basic_pin();

    utils::print_section_header(String::from("basic future"));
    examples::basic_future();

    utils::print_section_header(String::from("basic rc"));
    examples::basic_rc();

    utils::print_section_header(String::from("basic cell"));
    examples::basic_cell();

    utils::print_section_header(String::from("basic sync"));
    examples::basic_sync();

    utils::print_section_header(String::from("basic panic"));
    examples::basic_panic();

    utils::print_section_header(String::from("basic any"));
    examples::basic_any();
}

// https://doc.rust-lang.org/std/
