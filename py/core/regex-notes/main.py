# ---
# regular expressions
# ---

# https://docs.python.org/3/library/re.html

import re

# ---
# raw string literals
# ---

# similar to string literals, except:
# \ is taken literally unless escaping ' or "

# when using regular expressions, use raw strings
# if not, you have to double up (\\ to escape \).

# raw and formatted string literals can be combined
# rf'hey there {name}!'

raw_string = r'string'


# ---
# special characters
# ---

# . -- matches any character except newline. (includes newline with DOTALL flag)
# ^ -- matches the start of the string (matches newline in MULTILINE mode)
# $ -- matches the end of string (or just before newline at end of string)
# * -- matches 0 or more repetitions of preceding re. (ab* = a, ab, abb, etc)
# + -- matches 1 or more repetitions of preceding re (ab+ = ab, abb, abbb, etc)
# ? -- matches 0 or 1 repetition of the preceding re (ab? = a, ab)
# *?, +?, ?? -- non greedy, minimal versions of *,+,?
# {m} -- matches 'm' copies of of previous re (a{6} = aaaaaa)
# {m,n} -- matches 'm' to 'n' copies (a{4,6} = aaaa, aaaaa, aaaaaa)
# {m,n}? -- minimal version of {m,n} (a{3,5}? only matches 3 char from aaaaaa)
# \ -- escapes special characters. (use raw strings to avoid complications)

# [] -- set of characters
# [amk] matches a, m, or k.
# [a-z] matches a-z ([a-z]+ matches all lowercase sequences)
# [0-9] matches any digit
# [0-9A-Fa-f] matches any hexadecimal digit
# [A-Za-z] matches any letter (upper\lower)
# [^m] matches anything except m.

# A|B -- matches re A or B
# (...) -- used to group characters in a re. (gets really complicated)

# r'\d+' -- matches sequences of digits
# r'\D+' -- matches sequences of non-digits
# r'\s+' -- matches whitespace sequences
# r'\S+' -- matches non-whitespace sequences
# r'\w+' -- matches alpha-numeric sequences
# r'\W+' -- matches non-alpha-numeric sequences


# ---
# re.search (boolean value) (1 -- what is searched for, 2 -- what is searched)
# ---

patterns = ['term1', 'term2']
text = 'This is a string containing term1.'

for pattern in patterns:
    print(f'searching for {pattern}')

    if re.search(pattern, text):
        print('MATCH!')
    else:
        print('no match.')

# ---
# re.search (returns re object)
# ---

text = 'This is a string containing term1.'
match = re.search('term1', text)
if match:
    print(match.start())  # 22

# ---
# re.split (1 -- split by what, 2 -- what is split)
# ---

split_term = '@'
email = 'user@gmail.com'
print(re.split(split_term, email))  # ['user', 'gmail.com']


# ---
# re.findall
# ---

# example 1
match = re.findall('match', 'test phrase with the word "match".')  # ['match']

# example 2


def multi_re_find(pattern, phrase):
    print(f'searching for pattern: {pattern}')
    print(re.findall(pattern, phrase))
    print('\n')


test_phrase = 'sdsd..sssddd..sdddsddd...dsds...dssssss...sddddd'
test_pattern = r'sd*'

multi_re_find(test_pattern, test_phrase)  # returns all matches (s, sd, sdd, etc)
