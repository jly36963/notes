#[cfg_attr(rustfmt, rustfmt_skip)] // skip formatting
macro_rules! ternary {
    ($condition: expr, $_true: expr, $_false: expr) => {
        if $condition { $_true } else { $_false }
    };
}

pub(crate) use ternary;

// macros from another module
// https://stackoverflow.com/a/67140319
