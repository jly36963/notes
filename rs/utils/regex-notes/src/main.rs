use regex::Regex;

fn main() {
    let text: String = "In order to survive, ".to_string()
        + "we cling to all we know and understand. "
        + "And label it reality. "
        + "But knowledge and understanding are ambiguous. "
        + "That reality could be an illusion. "
        + "All humans live with the wrong assumptions.";

    println!("text: {}", text);

    let contains = test_pattern(text.clone(), r"ambiguous".into());
    let begins_with = test_pattern(text.clone(), r"^In".into());
    let ends_with = test_pattern(text.clone(), r"assumptions.$".into());
    let one_or_more = test_pattern(text.clone(), r"Al+".into());
    let zero_or_one = test_pattern(text.clone(), r"labels?".into());
    let zero_or_more = test_pattern(text.clone(), r"il*usion".into());
    let one_of = test_pattern(text.clone(), r"B[aeiou]t".into());
    let match_or = test_pattern(text.clone(), r"equivocal|ambiguous".into());
    let not = test_pattern(text.clone(), r"[^sharingan]".into());
    let any_char = test_pattern(text.clone(), r"under.tanding".into());
    let zero_to_three = test_pattern(text.clone(), r"Al{0,3}".into());
    let insensitive = test_pattern(text.clone(), r"(?i)REALITY".into());
    let seven_lower = test_pattern(text.clone(), r"[a-z]{7}".into());
    let four_alumn = test_pattern(text.clone(), r"[[:alnum:]]{4} reality".into());

    println!("contains: {}", contains);
    println!("begins_with: {}", begins_with);
    println!("ends_with: {}", ends_with);
    println!("one_or_more: {}", one_or_more);
    println!("zero_or_one: {}", zero_or_one);
    println!("zero_or_more: {}", zero_or_more);
    println!("one_of: {}", one_of);
    println!("match_or: {}", match_or);
    println!("not: {}", not);
    println!("any_char: {}", any_char);
    println!("zero_to_three: {}", zero_to_three);
    println!("insensitive: {}", insensitive);
    println!("seven_lower: {}", seven_lower);
    println!("four_alumn: {}", four_alumn);
}

fn test_pattern(text: String, pattern: String) -> bool {
    let p: &str = &pattern[..];
    let t: &str = &text[..];
    let re = Regex::new(p).unwrap();
    re.is_match(t)
}
