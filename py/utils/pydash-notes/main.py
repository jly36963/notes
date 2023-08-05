import pydash


def basic_lists():
    # concat
    pydash.concat([1, 2], [3, 4])  # [1,2,3,4]
    # difference -- elements only in one
    pydash.difference([1, 2, 3], [1, 2])  # [3]
    # find
    pydash.find([1, 2, 3, 4], lambda x: x >= 3)  # 3
    # find_index
    pydash.find_index([1, 2, 3, 4], lambda x: x >= 3)  # 2
    # flatten -- flatten one dimension
    pydash.flatten([[1, 2], [3, 4]])  # [1,2,3,4]
    # flatten_deep -- flatten recuresively
    pydash.flatten_deep([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])  # [1,2,3,4,5,6,7,8]
    # for_in
    pydash.for_in([1, 2, 3], lambda x: x)
    # index_of
    pydash.index_of([1, 2, 3, 4], 2)  # 1
    # intersection -- overlap
    pydash.intersection([1, 2, 3, 4], [3, 4, 5, 6])  # [3,4]
    # last
    pydash.last([1, 2, 3, 4])  # 4
    # pull_all
    pydash.pull_all([1, 0, 2, 0, 3, 0, 4], [0])  # [1,2,3,4]
    # reverse
    pydash.reverse([1, 2, 3, 4])  # [4,3,2,1]
    # sorted_uniq
    pydash.sorted_uniq([1, 2, 1, 2, 3])  # [1,2,3]
    # union -- any
    pydash.union([1, 2, 3], [2, 3, 4], [3, 4, 5])  # [1,2,3,4,5]
    # uniq
    pydash.uniq([1, 2, 3, 1, 2, 3])  # [1,2,3]
    # without
    pydash.without([1, 2, 3, 4], 2, 3)  # [1,4]
    # xor
    pydash.xor([1, 2, 3], [2, 3, 4])  # [1,4]


def basic_collections():
    # dictionaries -- uses values
    # lists -- uses elements

    # every
    pydash.every([1, 2, 3, 4])  # True
    # filter_
    pydash.filter_([1, 2, 3, 4], lambda x: x > 2)  # [3,4]
    # find
    pydash.find([1, 2, 3, 4], lambda x: x >= 2)  # 2
    # for_each
    pydash.for_each([1, 2, 3, 4], lambda x: x)  # print, append, etc
    # includes
    pydash.includes([1, 2, 3, 4], 2)  # True
    # map_
    pydash.map_([1, 2, 3, 4], lambda x: x ** 2)
    # partition
    pydash.partition([1, 2, 3, 4], lambda x: x >= 3)  # [[3,4],[1,2]]
    # reduce_
    pydash.reduce_([1, 2, 3, 4], lambda total, x: total + x)
    # reject -- inverse of filter_
    # ...
    # shuffle
    pydash.shuffle([1, 2, 3, 4])  # shuffled list
    # some
    pydash.some([1, 2, 3, 4], lambda x: x > 3)  # True

# ---
# functions
# ---

# just use built-in python tools


def basic_chaining():
    # chain -- wrap starting value in pydash.chain(), chain methods, call .value() to execute
    # tap -- use a callback on an intermediate value in the chain (returns original value)
    # thru -- use a callback on an intermediate value in the chain (returns modified value)

    (
        pydash.chain([1, 2, 3, 4])
        .concat([5, 6])
        .tap(lambda x: x)  # print, grab, access
        .sum()
        .thru(lambda x: x * 2)  # mutate
        .value()
    )


def basic_numerics():
    # add, subtract, multiply, divide,

    # min_, max_ round_, sum_

    # ceil
    pydash.ceil(5.5)  # 6
    # clamp
    pydash.clamp(-5, 0, 10)  # 0
    # floor
    pydash.floor(5.5)  # 5
    # max_
    pydash.max_([1, 2, 3, 4])  # 4
    # mean
    pydash.mean([1, 2, 3, 4])  # 2.5
    # median
    pydash.median([1, 2, 3, 4, 5])  # 3
    # min_
    pydash.min_([1, 2, 3, 4, 5])  # 1
    # power
    pydash.power(2, 8)  # 256
    # round_
    pydash.round_(3.225, 2)  # 3.23
    # scale
    pydash.scale([1, 2, 3, 4])  # [0.25, 0.5, 0.75, 1.0]
    # std_deviation
    pydash.std_deviation([1, 18, 20, 4])  # 8.35
    # transpose
    pydash.transpose([[1, 2], [3, 4]])  # [[1,3],[2,4]]
    # variance
    pydash.variance([1, 18, 20, 4])  # 69.69


def basic_dictionaries():
    # clone -- shallow copy
    pydash.clone({'a': 1})  # {'a': 1}
    # clone_deep -- deep copy
    pydash.clone_deep({'a': 1})  # {'a': 1}
    # find_key
    pydash.find_key({'a': 1, 'b': 2, 'c': 3}, lambda x: x == 1)  # 'a'
    # get
    pydash.get({}, 'a.b.c')  # None
    pydash.get({'a': 1}, 'a')  # 1
    # has
    pydash.has({'a': 1}, 'a')  # True
    # keys
    pydash.keys({'a': 1, 'b': 2, 'c': 3})  # ['a','b','c']
    # merge
    pydash.merge({'a': 1}, {'b': 2})  # {'a':1, 'b':2}
    # omit
    pydash.omit({'a': 1}, 'a')  # {}
    # pick
    pydash.pick({'a': 1, 'b': 2, 'c': 3}, 'a')  # {'a': 1}


def basic_predicates():
    # has a bunch of is_type (ie: is_dict, is_json, is_float)

    # eq
    pydash.eq(None, None)  # True
    # gt
    pydash.gt(5, 3)  # True
    # gte
    pydash.gte(5, 3)  # True
    # lt
    pydash.lt(3, 5)  # True
    # lte
    pydash.lte(3, 5)  # True
    # in_range
    pydash.in_range(3, 0, 10)  # True
    # is_dict
    pydash.is_dict({})  # True
    # is_list
    pydash.is_list([])  # True


def basic_strings():
    # camel_case
    pydash.camel_case("kakashi_hatake")  # "kakashiHatake"
    # capitalize -- capitalize first character, lowercase the rest
    pydash.capitalize("kakashi")  # "Kakashi"
    # chars
    pydash.chars('Kakashi')  # ['K','a','k','a','s','h','i']
    # clean -- replace multiple spaces with single space
    pydash.clean("Kakashi    Hatake")  # "Kakashi Hatake"
    # deburr -- replace latin-1 supplementary letters to basic latin letters
    pydash.deburr('déjà vu')  # "deja vu"
    # escape -- escape html characters to their entities (ie: &<>"'\)
    pydash.escape("Hiruzen & Iruka")  # "Hiruzen &amp; Iruka"
    # human_case -- first letter capitalized and words separated with spaces
    pydash.human_case("omae_o_zutto_aishiteru")  # "Omae o zutto aishiteru"
    # join
    pydash.join(['a', 'b', 'c'], ' ')  # "a b c"
    # kebab_case
    pydash.kebab_case("Hashirama Senju")  # "hashirama-senju"
    # lower_case
    pydash.lower_case('ItachiUchiha')  # "itachi uchiha"
    # number_format
    pydash.number_format(123456.78)  # "123,456.78"
    # pad
    pydash.pad("Yamato", 10)  # "  Yamato  "
    # pascal_case
    pydash.pascal_case('kakashi-hatake')  # "KakashiHatake"
    # prune
    # TODO
    # slugify
    pydash.slugify('Iruka Umino')  # "iruka-umino"
    # snake_case
    pydash.snake_case("Hiruzen Sarutobi")  # "hiruzen_sarutobi"
    # start_case -- capitalize all words, convert to spaces
    pydash.start_case('shisui-uchiha')  # "Shisui Uchiha"
    # title_case -- in pydash, title_case capitalizes all words.
    pydash.title_case('obito-uchiha')  # "Obito-uchiha"
    # to_lower
    pydash.to_lower('--Itachi-Uchiha--')  # "--itachi-uchiha--"
    # to_lower
    pydash.to_lower('--Fugaku-Uchiha--')  # "--FUGAKU-UCHIHA--"
    # truncate
    # TODO
    # unescape
    pydash.unescape("Hiruzen &amp; Iruka")  # "Hiruzen & Iruka"
    # upper_case
    pydash.upper_case("obito-uchiha")  # OBITO UCHIHA
