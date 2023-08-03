// ---
// Regular expressions
// ---

// ---
// Regular expressions (with metacharacters)
// ---

const basicRegularExpressions = () => {
  let re;
  re = /hello/; // literal regular expression
  re = /hello/g; // global search (all instances, not just first).
  re = /hello/i; // case insensitive regular expression
  re = /^hello/; // string starts with hello (^)
  re = /world$/; // string ends with world ($)
  re = /^hello$/; // string begins/ends with hello (^$)
  re = /h.llo/; // matches any ONE character (.)
  re = /he*llo/; // repeats previous character at least 0 times. (*) (equivalent to {0,})
  re = /he+llo/; // repeats previous character at least 1 time. (+) (equivalent to {1,})
  re = /gre?a?y/; // optional character (?)
  re = /gray\?/; // escape character (\)

  // brackets (character sets)
  re = /gr[ae]y/; // any one character in group
  re = /[^GF]ray/; // any one character not in group
  re = /[A-Z]ray/; // any one character in range

  // braces (quantifiers)
  re = /Hel{2}o/; // quantifier (exact)
  re = /Hel{2,4}o/; // quantifier (range)
  re = /hel{2,}o/; // quantifier (at least 'x' times)

  // parentheses (grouping)
  re = /^([0-9][a-z]){3}$/; // // using quantifiers with multiple characters (matches 0a0a0a)

  // shorthand character classes
  re = /\w/; // alphanumeric or underscore (word characters)
  re = /\W/; // symbols (non-word characters)
  re = /\d/; // digits
  re = /\D/; // non-digits (anything not 0-9)
  re = /\s/; // whitespace (space, tab)
  re = /\S/; // non-whitespace
  re = /run\b/; // word boundary (cuts off ends) (finds 'run', but not 'runs' or 'running'.)

  // assertions
  re = /x(?=y)/; // 'x' if only followed by 'y'
  re = /x(?!y)/; // 'x' if only NOT followed by 'y'
};

// ---
// Functions used with regular expressions
// ---

const basicRegularExpressionMethods = () => {
  let re;
  re = /hello/;
  let str;
  str = "hello there";

  // test() -- returns true/false in case of match (is 're' in 'str'?)
  const result2 = re.test(str);
  console.log(result2);
  // search() -- returns index of the first match or -1.
  const result4 = str.search(re);
  console.log(result4);
  // replace() -- returns new string with replacement made.
  const newStr = str.replace("hello", "hi");
  console.log(newStr);
  // exec() -- return array [string, index, input] or null.
  const result1 = re.exec(str);
  console.log(result1);
  console.log(result1[1]);
  console.log(result1.index);
  // match() -- return array [string, index, input] or null (is 're' in 'str'?)
  const result3 = str.match(re);
  console.log(result3);
};
