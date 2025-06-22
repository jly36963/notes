# Pydash

## Examples

```
# ---
# LISTS
# ---

pydash.concat([1, 2], [3, 4])
<class 'list'>
[1, 2, 3, 4]

pydash.difference([1, 2, 3], [1, 2])
<class 'list'>
[3]

pydash.find([1, 2, 3, 4], lambda x: x >= 3)
<class 'int'>
3

pydash.find_index([1, 2, 3, 4], lambda x: x >= 3)
<class 'int'>
2

pydash.flatten([[1, 2], [3, 4]])
<class 'list'>
[1, 2, 3, 4]

pydash.flatten_deep([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
<class 'list'>
[1, 2, 3, 4, 5, 6, 7, 8]

pydash.for_in([1, 2, 3], lambda x: x)
<class 'list'>
[1, 2, 3]

pydash.index_of([1, 2, 3, 4], 2)
<class 'int'>
1

pydash.intersection([1, 2, 3, 4], [3, 4, 5, 6])
<class 'list'>
[3, 4]

pydash.last([1, 2, 3, 4])
<class 'int'>
4

pydash.pull_all([1, 0, 2, 0, 3, 0, 4], [0])
<class 'list'>
[1, 2, 3, 4]

pydash.reverse([1, 2, 3, 4])
<class 'list'>
[4, 3, 2, 1]

pydash.sorted_uniq([1, 2, 1, 2, 3])
<class 'list'>
[1, 2, 3]

pydash.union([1, 2, 3], [2, 3, 4], [3, 4, 5])
<class 'list'>
[1, 2, 3, 4, 5]

pydash.uniq([1, 2, 3, 1, 2, 3])
<class 'list'>
[1, 2, 3]

pydash.without([1, 2, 3, 4], 2, 3)
<class 'list'>
[1, 4]

pydash.xor([1, 2, 3], [2, 3, 4])
<class 'list'>
[1, 4]

# ---
# COLLECTIONS
# ---

pydash.every([1, 2, 3, 4])
<class 'bool'>
True

pydash.filter_([1, 2, 3, 4], lambda x: x > 2)
<class 'list'>
[3, 4]

pydash.find([1, 2, 3, 4], lambda x: x >= 2)
<class 'int'>
2

pydash.for_each([1, 2, 3, 4], lambda x: x)
<class 'list'>
[1, 2, 3, 4]

pydash.includes([1, 2, 3, 4], 2)
<class 'bool'>
True

pydash.map_([1, 2, 3, 4], lambda x: x**2)
<class 'list'>
[1, 4, 9, 16]

pydash.partition([1, 2, 3, 4], lambda x: x >= 3)
<class 'list'>
[[3, 4], [1, 2]]

pydash.reduce_([1, 2, 3, 4], lambda total, x: total + x)
<class 'int'>
10

pydash.reject([1, 2, 3, 4], lambda x: x > 2)
<class 'list'>
[1, 2]

pydash.shuffle([1, 2, 3, 4])
<class 'list'>
[1, 2, 3, 4]

pydash.some([1, 2, 3, 4], lambda x: x > 3)
<class 'bool'>
True

# ---
# NUMERICS
# ---

pydash.ceil(5.5)
<class 'float'>
6.0

pydash.clamp(-5, 0, 10)
<class 'int'>
0

pydash.floor(5.5)
<class 'float'>
5.0

pydash.max_([1, 2, 3, 4])
<class 'int'>
4

pydash.mean([1, 2, 3, 4])
<class 'float'>
2.5

pydash.median([1, 2, 3, 4, 5])
<class 'int'>
3

pydash.min_([1, 2, 3, 4, 5])
<class 'int'>
1

pydash.power(2, 8)
<class 'int'>
256

pydash.round_(3.225, 2)
<class 'float'>
3.22

pydash.scale([1, 2, 3, 4])
<class 'list'>
[0.25, 0.5, 0.75, 1.0]

pydash.std_deviation([1, 18, 20, 4])
<class 'float'>
8.347903928532

pydash.transpose([[1, 2], [3, 4]])
<class 'list'>
[[1, 3], [2, 4]]

pydash.variance([1, 18, 20, 4])
<class 'float'>
69.6875

# ---
# DICTIONARIES
# ---

pydash.clone({"a": 1})
<class 'dict'>
{'a': 1}

pydash.clone_deep({"a": 1})
<class 'dict'>
{'a': 1}

pydash.find_key({"a": 1, "b": 2, "c": 3}, lambda x: x == 1)
<class 'str'>
a

pydash.get({}, "a.b.c")
<class 'NoneType'>
None

pydash.get({"a": 1}, "a")
<class 'int'>
1

pydash.has({"a": 1}, "a")
<class 'bool'>
True

pydash.keys({"a": 1, "b": 2, "c": 3})
<class 'list'>
['a', 'b', 'c']

pydash.merge({"a": 1}, {"b": 2})
<class 'dict'>
{'a': 1, 'b': 2}

pydash.omit({"a": 1}, "a")
<class 'dict'>
{}

pydash.pick({"a": 1, "b": 2, "c": 3}, "a")
<class 'dict'>
{'a': 1}

# ---
# PREDICATES
# ---

pydash.eq(None, None)
<class 'bool'>
True

pydash.gt(5, 3)
<class 'bool'>
True

pydash.gte(5, 3)
<class 'bool'>
True

pydash.lt(3, 5)
<class 'bool'>
True

pydash.lte(3, 5)
<class 'bool'>
True

pydash.in_range(3, 0, 10)
<class 'bool'>
True

pydash.is_dict({})
<class 'bool'>
True

pydash.is_list([])
<class 'bool'>
True

pydash.is_list('{"hello": "world"}')
<class 'bool'>
False

# ---
# STRINGS
# ---

pydash.camel_case("kakashi_hatake")
<class 'str'>
kakashiHatake

pydash.capitalize("kakashi")
<class 'str'>
Kakashi

pydash.chars("Kakashi")
<class 'list'>
['K', 'a', 'k', 'a', 's', 'h', 'i']

pydash.clean("Kakashi    Hatake")
<class 'str'>
Kakashi Hatake

pydash.deburr("déjà vu")
<class 'str'>
deja vu

pydash.escape("Hiruzen & Iruka")
<class 'str'>
Hiruzen &amp; Iruka

pydash.human_case("omae_o_zutto_aishiteru")
<class 'str'>
Omae o zutto aishiteru

pydash.join(["a", "b", "c"], " ")
<class 'str'>
a b c

pydash.kebab_case("Hashirama Senju")
<class 'str'>
hashirama-senju

pydash.lower_case("ItachiUchiha")
<class 'str'>
itachi uchiha

pydash.number_format(123456.78)
<class 'str'>
123,457

pydash.pad("Yamato", 10)
<class 'str'>
  Yamato

pydash.pascal_case("kakashi-hatake")
<class 'str'>
KakashiHatake

pydash.slugify("Iruka Umino")
<class 'str'>
iruka-umino

pydash.snake_case("Hiruzen Sarutobi")
<class 'str'>
hiruzen_sarutobi

pydash.start_case("shisui-uchiha")
<class 'str'>
Shisui Uchiha

pydash.title_case("obito-uchiha")
<class 'str'>
Obito-uchiha

pydash.to_lower("--Itachi-Uchiha--")
<class 'str'>
--itachi-uchiha--

pydash.to_lower("--Fugaku-Uchiha--")
<class 'str'>
--fugaku-uchiha--

pydash.unescape("Hiruzen &amp; Iruka")
<class 'str'>
Hiruzen & Iruka

pydash.upper_case("obito-uchiha")
<class 'str'>
OBITO UCHIHA

```
