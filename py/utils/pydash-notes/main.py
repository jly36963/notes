"""Pydash examples."""

# ruff: noqa: PLR2004

from typing import Any

import pydash

# ---
# Main
# ---


def main():
    """Run pandas examples."""
    examples = {
        "lists": _basic_lists,
        "collections": _basic_collections,
        "chaining": _basic_chaining,
        "numerics": _basic_numerics,
        "dictionaries": _basic_dictionaries,
        "predicates": _basic_predicates,
        "strings": _basic_strings,
    }

    for title, example_fn in examples.items():
        print_section_title(title)
        example_fn()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print("\n# ---")
    print(f"# {string.upper()}")
    print("# ---\n")


def pretty_print_results(results: list[tuple[str, Any]]) -> None:
    """Pretty print each key/value."""
    for k, v in results:
        print(k, type(v), v, sep="\n")
        print()


# ---
# Examples
# ---


def _basic_lists():
    results = [
        (
            "pydash.concat([1, 2], [3, 4])",
            pydash.concat([1, 2], [3, 4]),
        ),
        (
            "pydash.difference([1, 2, 3], [1, 2])",
            pydash.difference([1, 2, 3], [1, 2]),
        ),
        (
            "pydash.find([1, 2, 3, 4], lambda x: x >= 3)",
            pydash.find([1, 2, 3, 4], lambda x: x >= 3),
        ),
        (
            "pydash.find_index([1, 2, 3, 4], lambda x: x >= 3)",
            pydash.find_index([1, 2, 3, 4], lambda x: x >= 3),
        ),
        (
            "pydash.flatten([[1, 2], [3, 4]])",
            pydash.flatten([[1, 2], [3, 4]]),
        ),
        (
            "pydash.flatten_deep([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])",
            pydash.flatten_deep([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]),
        ),
        (
            "pydash.for_in([1, 2, 3], lambda x: x)",
            pydash.for_in([1, 2, 3], lambda x: x),
        ),
        (
            "pydash.index_of([1, 2, 3, 4], 2)",
            pydash.index_of([1, 2, 3, 4], 2),
        ),
        (
            "pydash.intersection([1, 2, 3, 4], [3, 4, 5, 6])",
            pydash.intersection([1, 2, 3, 4], [3, 4, 5, 6]),
        ),
        (
            "pydash.last([1, 2, 3, 4])",
            pydash.last([1, 2, 3, 4]),
        ),
        (
            "pydash.pull_all([1, 0, 2, 0, 3, 0, 4], [0])",
            pydash.pull_all([1, 0, 2, 0, 3, 0, 4], [0]),
        ),
        (
            "pydash.reverse([1, 2, 3, 4])",
            pydash.reverse([1, 2, 3, 4]),
        ),
        (
            "pydash.sorted_uniq([1, 2, 1, 2, 3])",
            pydash.sorted_uniq([1, 2, 1, 2, 3]),
        ),
        (
            "pydash.union([1, 2, 3], [2, 3, 4], [3, 4, 5])",
            pydash.union([1, 2, 3], [2, 3, 4], [3, 4, 5]),
        ),
        (
            "pydash.uniq([1, 2, 3, 1, 2, 3])",
            pydash.uniq([1, 2, 3, 1, 2, 3]),
        ),
        (
            "pydash.without([1, 2, 3, 4], 2, 3)",
            pydash.without([1, 2, 3, 4], 2, 3),
        ),
        (
            "pydash.xor([1, 2, 3], [2, 3, 4])",
            pydash.xor([1, 2, 3], [2, 3, 4]),
        ),
    ]
    pretty_print_results(results)


def _basic_collections():
    # dictionaries: uses values
    # lists: uses elements
    results = [
        (
            "pydash.every([1, 2, 3, 4])",
            pydash.every([1, 2, 3, 4]),
        ),
        (
            "pydash.filter_([1, 2, 3, 4], lambda x: x > 2)",
            pydash.filter_([1, 2, 3, 4], lambda x: x > 2),
        ),
        (
            "pydash.find([1, 2, 3, 4], lambda x: x >= 2)",
            pydash.find([1, 2, 3, 4], lambda x: x >= 2),
        ),
        (
            "pydash.for_each([1, 2, 3, 4], lambda x: x)",
            pydash.for_each([1, 2, 3, 4], lambda x: x),
        ),
        (
            "pydash.includes([1, 2, 3, 4], 2)",
            pydash.includes([1, 2, 3, 4], 2),
        ),
        (
            "pydash.map_([1, 2, 3, 4], lambda x: x**2)",
            pydash.map_([1, 2, 3, 4], lambda x: x**2),
        ),
        (
            "pydash.partition([1, 2, 3, 4], lambda x: x >= 3)",
            pydash.partition([1, 2, 3, 4], lambda x: x >= 3),
        ),
        (
            "pydash.reduce_([1, 2, 3, 4], lambda total, x: total + x)",
            pydash.reduce_([1, 2, 3, 4], lambda total, x: total + x),
        ),
        (
            "pydash.reject([1, 2, 3, 4], lambda x: x > 2)",
            pydash.reject([1, 2, 3, 4], lambda x: x > 2),
        ),
        (
            "pydash.shuffle([1, 2, 3, 4])",
            pydash.shuffle([1, 2, 3, 4]),
        ),
        (
            "pydash.some([1, 2, 3, 4], lambda x: x > 3)",
            pydash.some([1, 2, 3, 4], lambda x: x > 3),
        ),
    ]
    pretty_print_results(results)


# ---
# functions
# ---

# just use built-in python tools


def _basic_chaining():
    result = (
        pydash.chain([1, 2, 3, 4])
        .concat([5, 6])
        .tap(lambda x: x)
        .sum()
        .apply(lambda x: x * 2)
        .value()
    )
    print(result)


def _basic_numerics():
    results = [
        (
            "pydash.ceil(5.5)",
            pydash.ceil(5.5),
        ),
        (
            "pydash.clamp(-5, 0, 10)",
            pydash.clamp(-5, 0, 10),
        ),
        (
            "pydash.floor(5.5)",
            pydash.floor(5.5),
        ),
        (
            "pydash.max_([1, 2, 3, 4])",
            pydash.max_([1, 2, 3, 4]),
        ),
        (
            "pydash.mean([1, 2, 3, 4])",
            pydash.mean([1, 2, 3, 4]),
        ),
        (
            "pydash.median([1, 2, 3, 4, 5])",
            pydash.median([1, 2, 3, 4, 5]),
        ),
        (
            "pydash.min_([1, 2, 3, 4, 5])",
            pydash.min_([1, 2, 3, 4, 5]),
        ),
        (
            "pydash.power(2, 8)",
            pydash.power(2, 8),
        ),
        (
            "pydash.round_(3.225, 2)",
            pydash.round_(3.225, 2),
        ),
        (
            "pydash.scale([1, 2, 3, 4])",
            pydash.scale([1, 2, 3, 4]),
        ),
        (
            "pydash.std_deviation([1, 18, 20, 4])",
            pydash.std_deviation([1, 18, 20, 4]),
        ),
        (
            "pydash.transpose([[1, 2], [3, 4]])",
            pydash.transpose([[1, 2], [3, 4]]),
        ),
        (
            "pydash.variance([1, 18, 20, 4])",
            pydash.variance([1, 18, 20, 4]),
        ),
    ]
    pretty_print_results(results)


def _basic_dictionaries():
    results = [
        (
            'pydash.clone({"a": 1})',
            pydash.clone({"a": 1}),
        ),
        (
            'pydash.clone_deep({"a": 1})',
            pydash.clone_deep({"a": 1}),
        ),
        (
            'pydash.find_key({"a": 1, "b": 2, "c": 3}, lambda x: x == 1)',
            pydash.find_key({"a": 1, "b": 2, "c": 3}, lambda x: x == 1),
        ),
        (
            'pydash.get({}, "a.b.c")',
            pydash.get({}, "a.b.c"),
        ),
        (
            'pydash.get({"a": 1}, "a")',
            pydash.get({"a": 1}, "a"),
        ),
        (
            'pydash.has({"a": 1}, "a")',
            pydash.has({"a": 1}, "a"),
        ),
        (
            'pydash.keys({"a": 1, "b": 2, "c": 3})',
            pydash.keys({"a": 1, "b": 2, "c": 3}),
        ),
        (
            'pydash.merge({"a": 1}, {"b": 2})',
            pydash.merge({"a": 1}, {"b": 2}),
        ),
        (
            'pydash.omit({"a": 1}, "a")',
            pydash.omit({"a": 1}, "a"),
        ),
        (
            'pydash.pick({"a": 1, "b": 2, "c": 3}, "a")',
            pydash.pick({"a": 1, "b": 2, "c": 3}, "a"),
        ),
    ]
    pretty_print_results(results)


def _basic_predicates():
    results = [
        (
            "pydash.eq(None, None)",
            pydash.eq(None, None),
        ),
        (
            "pydash.gt(5, 3)",
            pydash.gt(5, 3),
        ),
        (
            "pydash.gte(5, 3)",
            pydash.gte(5, 3),
        ),
        (
            "pydash.lt(3, 5)",
            pydash.lt(3, 5),
        ),
        (
            "pydash.lte(3, 5)",
            pydash.lte(3, 5),
        ),
        (
            "pydash.in_range(3, 0, 10)",
            pydash.in_range(3, 0, 10),
        ),
        (
            "pydash.is_dict({})",
            pydash.is_dict({}),
        ),
        (
            "pydash.is_list([])",
            pydash.is_list([]),
        ),
        (
            """pydash.is_list('{"hello": "world"}')""",
            pydash.is_list('{"hello": "world"}'),
        ),
    ]
    pretty_print_results(results)


def _basic_strings():
    # TODO: prune, truncate

    results = [
        (
            'pydash.camel_case("kakashi_hatake")',
            pydash.camel_case("kakashi_hatake"),
        ),
        (
            'pydash.capitalize("kakashi")',
            pydash.capitalize("kakashi"),
        ),
        (
            'pydash.chars("Kakashi")',
            pydash.chars("Kakashi"),
        ),
        (
            'pydash.clean("Kakashi    Hatake")',
            pydash.clean("Kakashi    Hatake"),
        ),
        (
            'pydash.deburr("déjà vu")',
            pydash.deburr("déjà vu"),
        ),
        (
            'pydash.escape("Hiruzen & Iruka")',
            pydash.escape("Hiruzen & Iruka"),
        ),
        (
            'pydash.human_case("omae_o_zutto_aishiteru")',
            pydash.human_case("omae_o_zutto_aishiteru"),
        ),
        (
            'pydash.join(["a", "b", "c"], " ")',
            pydash.join(["a", "b", "c"], " "),
        ),
        (
            'pydash.kebab_case("Hashirama Senju")',
            pydash.kebab_case("Hashirama Senju"),
        ),
        (
            'pydash.lower_case("ItachiUchiha")',
            pydash.lower_case("ItachiUchiha"),
        ),
        (
            "pydash.number_format(123456.78)",
            pydash.number_format(123456.78),
        ),
        (
            'pydash.pad("Yamato", 10)',
            pydash.pad("Yamato", 10),
        ),
        (
            'pydash.pascal_case("kakashi-hatake")',
            pydash.pascal_case("kakashi-hatake"),
        ),
        (
            'pydash.slugify("Iruka Umino")',
            pydash.slugify("Iruka Umino"),
        ),
        (
            'pydash.snake_case("Hiruzen Sarutobi")',
            pydash.snake_case("Hiruzen Sarutobi"),
        ),
        (
            'pydash.start_case("shisui-uchiha")',
            pydash.start_case("shisui-uchiha"),
        ),
        (
            'pydash.title_case("obito-uchiha")',
            pydash.title_case("obito-uchiha"),
        ),
        (
            'pydash.to_lower("--Itachi-Uchiha--")',
            pydash.to_lower("--Itachi-Uchiha--"),
        ),
        (
            'pydash.to_lower("--Fugaku-Uchiha--")',
            pydash.to_lower("--Fugaku-Uchiha--"),
        ),
        (
            'pydash.unescape("Hiruzen &amp; Iruka")',
            pydash.unescape("Hiruzen &amp; Iruka"),
        ),
        (
            'pydash.upper_case("obito-uchiha")  ',
            pydash.upper_case("obito-uchiha"),
        ),
    ]
    pretty_print_results(results)


# ---
# Run
# ---

main()
