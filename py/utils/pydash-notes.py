# ---------
# pydash
# ---------

# pip install pydash

# ---
# imports
# ---

from pydash import _
# import pydash as _
# from pydash import concat

# ---
# lists (arrays)
# ---

# concat
_.concat([1, 2], [3, 4])  # [1,2,3,4]
# difference -- elements only in one
_.difference([1, 2, 3], [1, 2])  # [3]
# find
_.find([1, 2, 3, 4], lambda x: x >= 3)  # 3
# find_index
_.find_index([1, 2, 3, 4], lambda x: x >= 3)  # 2
# flatten -- flatten one dimension
_.flatten([[1, 2], [3, 4]])  # [1,2,3,4]
# flatten_deep -- flatten recuresively
_.flatten_deep([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])  # [1,2,3,4,5,6,7,8]
# for_in
_.for_in([1, 2, 3], lambda x: x)
# index_of
_.index_of([1, 2, 3, 4], 2)  # 1
# intersection -- overlap
_.intersection([1, 2, 3, 4], [3, 4, 5, 6])  # [3,4]
# last
_.last([1, 2, 3, 4])  # 4
# pull_all
_.pull_all([1, 0, 2, 0, 3, 0, 4], [0])  # [1,2,3,4]
# reverse
_.reverse([1, 2, 3, 4])  # [4,3,2,1]
# sorted_uniq
_.sorted_uniq([1, 2, 1, 2, 3])  # [1,2,3]
# union -- any
_.union([1, 2, 3], [2, 3, 4], [3, 4, 5])  # [1,2,3,4,5]
# uniq
_.uniq([1, 2, 3, 1, 2, 3])  # [1,2,3]
# without
_.without([1, 2, 3, 4], 2, 3)  # [1,4]
# xor
_.xor([1, 2, 3], [2, 3, 4])  # [1,4]


# ---
# collections
# ---

# dictionaries -- uses values
# lists -- uses elements

# every
_.every([1, 2, 3, 4])  # True
# filter_
_.filter_([1, 2, 3, 4], lambda x: x > 2)  # [3,4]
# find
_.find([1, 2, 3, 4], lambda x: x >= 2)  # 2
# for_each
_.for_each([1, 2, 3, 4], lambda x: x)  # print, append, etc
# includes
_.includes([1, 2, 3, 4], 2)  # True
# map_
_.map_([1, 2, 3, 4], lambda x: x ** 2)
# partition
_.partition([1, 2, 3, 4], lambda x: x >= 3)  # [[3,4],[1,2]]
# reduce_
_.reduce_([1, 2, 3, 4], lambda total, x: total + x)
# reject -- inverse of filter_
# ...
# shuffle
_.shuffle([1, 2, 3, 4])  # shuffled list
# some
_.some([1, 2, 3, 4], lambda x: x > 3)  # True

# ---
# functions
# ---

# just use built-in python tools

# ---
# chaining
# ---

# chain -- wrap starting value in _.chain(), chain methods, call .value() to execute
# tap -- use a callback on an intermediate value in the chain (returns original value)
# thru -- use a callback on an intermediate value in the chain (returns modified value)

(
    _.chain([1, 2, 3, 4])
    .concat([5, 6])
    .tap(lambda x: x)  # print, grab, access
    .sum()
    .thru(lambda x: x * 2)  # mutate
    .value()
)


# ---
# numerical
# ---

# add, subtract, multiply, divide,

# min_, max_ round_, sum_

# ceil
_.ceil(5.5)  # 6
# clamp
_.clamp(-5, 0, 10)  # 0
# floor
_.floor(5.5)  # 5
# max_
_.max_([1, 2, 3, 4])  # 4
# mean
_.mean([1, 2, 3, 4])  # 2.5
# median
_.median([1, 2, 3, 4, 5])  # 3
# min_
_.min_([1, 2, 3, 4, 5])  # 1
# power
_.power(2, 8)  # 256
# round_
_.round(3.225, 2)  # 3.23
# scale
_.scale([1, 2, 3, 4])  # [0.25, 0.5, 0.75, 1.0]
# std_deviation
_.std_deviation([1, 18, 20, 4])  # 8.35
# transpose
_.transpose([[1, 2], [3, 4]])  # [[1,3],[2,4]]
# variance
_.variance([1, 18, 20, 4])  # 69.69

# ---
# objects (dictionaries)
# ---

# clone -- shallow copy
_.clone({'a': 1})  # {'a': 1}
# clone_deep -- deep copy
_.clone_deep({'a': 1})  # {'a': 1}
# find_key
_.find_key({'a': 1, 'b': 2, 'c': 3}, lambda x: x == 1)  # 'a'
# get
_.get({}, 'a.b.c')  # None
_.get({'a': 1}, 'a')  # 1
# has
_.has({'a': 1}, 'a')  # True
# keys
_.keys({'a': 1, 'b': 2, 'c': 3})  # ['a','b','c']
# merge
_.merge({'a': 1}, {'b': 2})  # {'a':1, 'b':2}
# omit
_.omit({'a': 1}, 'a')  # {}
# pick
_.pick({'a': 1, 'b': 2, 'c': 3}, 'a')  # {'a': 1}

# ---
# predicates
# ---

# has a bunch of is_type (ie: is_dict, is_json, is_float)

# eq
_.eq(None, None)  # True
# gt
_.gt(5, 3)  # True
# gte
_.gte(5, 3)  # True
# lt
_.lt(3, 5)  # True
# lte
_.lte(3, 5)  # True
# in_range
_.in_range(3, 0, 10)  # True
# is_dict
_.is_dict({})  # True
# is_list
_.is_list([])  # True

# ---
# strings
# ---

# camel_case
_.camel_case("kakashi_hatake")  # "kakashiHatake"
# capitalize -- capitalize first character, lowercase the rest
_.capitalize("kakashi")  # "Kakashi"
# chars
_.chars('Kakashi')  # ['K','a','k','a','s','h','i']
# clean -- replace multiple spaces with single space
_.clean("Kakashi    Hatake")  # "Kakashi Hatake"
# deburr -- replace latin-1 supplementary letters to basic latin letters
_.deburr('déjà vu')  # "deja vu"
# escape -- escape html characters to their entities (ie: &<>"'\)
_.escape("Hiruzen & Iruka")  # "Hiruzen &amp; Iruka"
# human_case -- first letter capitalized and words separated with spaces
_.human_case("omae_o_zutto_aishiteru")  # "Omae o zutto aishiteru"
# join
_.join(['a', 'b', 'c'], ' ')  # "a b c"
# kebab_case
_.kebab_case("Hashirama Senju")  # "hashirama-senju"
# lower_case
_.lower_case('ItachiUchiha')  # "itachi uchiha"
# number_format
_.number_format(123456.78)  # "123,456.78"
# pad
_.pad("Yamato", 10)  # "  Yamato  "
# pascal_case
_.pascal_case('kakashi-hatake')  # "KakashiHatake"
# prune
# ...
# slugify
_.slugify('Iruka Umino')  # "iruka-umino"
# snake_case
_.snake_case("Hiruzen Sarutobi")  # "hiruzen_sarutobi"
# start_case -- capitalize all words, convert to spaces
_.start_case('shisui-uchiha')  # "Shisui Uchiha"
# title_case -- in pydash, title_case capitalizes all words.
_.title_case('obito-uchiha')  # "Obito-uchiha"
# to_lower
_.to_lower('--Itachi-Uchiha--')  # "--itachi-uchiha--"
# to_lower
_.to_lower('--Fugaku-Uchiha--')  # "--FUGAKU-UCHIHA--"
# truncate
# ...
# unescape
_.unescape("Hiruzen &amp; Iruka")  # "Hiruzen & Iruka"
# upper_case
_.upper_case("obito-uchiha")  # OBITO UCHIHA
