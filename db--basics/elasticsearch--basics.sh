# ----------------
# ELASTIC STACK 
# ----------------

# ----------------------------------------------------------------------

# ---------------
# DOCKER (linux only)
# ---------------

# github repo
# https://github.com/elastic/stack-docker

# steps
  # run setup
  # write down password generated from setup
  # start docker-compose
  # enter user: 'elastic', pw: output_from_startup

# ---------------
# startup
# ---------------

# linux requirement
sysctl -w vm.max_map_count=262144
# setup
  # gives password to use (last line before exiting)
docker-compose -f setup.yml up
# start service
docker-compose up

# in browser
# http://localhost:5601

# u -- elastic
# p -- PT2XSVDPNvgyY+CWZIIMdg==

# ----------------------------------------------------------------------

# ----------------
# about elastic stack
# ----------------

# data stored as documents (json structure) (field names and field values)
# query elasticsearch using REST API
# elasticsearch is written in java, built on apache lucene

# elastic stack
  # elasticsearch (api backend)
    # ES queries are written in Query DSL (json structure)
  # logstash (data processing pipeline) (process logs and store in ES )
    # proprietary markup format (like json), can use conditional statements
    # logstash pipeline 
      # input plugins -- look at files, db, etc for data
      # filter plugins -- process data
      # output plugins -- store data (elasticsearch, kafka, etc)
    # example
      # read log file (line by line)
      # give structure to unstructured data
      # store as json in ES
  # kibana (analytics/visualization platform) (client/dashboard for showing ES data)
  # beats (lightweight data shpper)
    # filebeat -- collect/ship logfiles to ES/logstash (pre-conigured for many technologies)
    # metricbeat -- collect system/service metrics and ship.
    # packetbeat -- collect network data and ship
  # x-pack (adds additional features to ES and Kibana)
    # authentication/authorization
    # performance monitoring
    # machine learning in kibana
    # graph (analyze relationships in data)
    # use SQL queries with ES (will be converted to Query DSL)

# elastic stack workflow
  # data ingestion (logstash/beats)
  # search/analyse/store data (ES)
  # visualize (kibana)


# ----------------
# ES structure
# ----------------

# default -- each node will have 10 shards (5 shards, 1 replica for each shard)

# cluster > node > index > shard
  # clusters -- collection of nodes (servers)
  # nodes -- server that stores data and participates in the cluster's indexing/searching
  # index -- collection of documents (documents that share characteristics)
  # shard -- subdivision of index (makes scaling easier) (distribute data and processing)
  # document -- basic unit of information that can be indexed (expressed as json)

# replication is important
  # replica shards/nodes prevent data loss in case of shard/node failure
  # primary and replica shards aren't stored in the same node
  # replicas are kept in sync
  # whenever an action effects the primary shard, it will then cascade down to the replica shards

# number of shards cannot be changed after index creation. this would mess up their algorithms.
# changing routing can also cause problems

# ----------------
# queries (curl)
# ----------------

# curl
# HTTP verb
# endpoint (or url if cluster)
# query
# content header (application/json) (if query has body)
# auth (user/pw)

# ----------------
# queries (in kibana)
# ----------------

# health check
GET /_cluster/health # api (_cluster) command (health)

# nodes
GET /_cat/nodes?v # check nodes
GET /_nodes

# indices
GET /_cat/indices?v # query indices
PUT /index1 # create index
DELETE /index1 # delete index



# ----------------
# create index (custom)
# ----------------

<<KIBANA
PUT /index1 
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 2
  }
}
KIBANA

# ----------------
# index documents (add documents)
# ----------------

# unless changed, adding a document to a DNE index will create that index.
  # best practice is to create indices in advance
# id can be specified in endpoint (otherwise it's auto generated)
  # POST /products/_doc/100

<<KIBANA
POST /products/_doc
{
  "name": "Coffee Maker",
  "price": 64,
  "in_stock": 10
}
KIBANA

# ----------------
# retrieve document
# ----------------

<<KIBANA
GET /products/_doc/100
KIBANA

# ----------------
# update document
# ----------------

# updating values (additive -- overwrites specified values)

<<KIBANA
POST /products/_update/100
{
  "in_stock": 10
}
KIBANA

# add new values

<<KIBANA
POST /products/_update/100
{
  "tags": ["electronics", "appliances"]
}
KIBANA

# ----------------
# update documents (2)
# ----------------

# decrement "in_stock"
  # "source": "ctx._source.in_stock--"
# assign new value
  #  "source": "ctx._source.in_stock = 10"

<<KIBANA
POST /products/_update/100
{
  "script": {
    "source": "ctx._source.in_stock--"
  }
}
KIBANA

# update (params)

<<KIBANA
POST /products/_update/100
{
  "script": {
    "source": "ctx._source.in_stock *= params.quantity",
    "params": {
      "quantity": 2
    }
  }
}
KIBANA

# update (conditional) (no operation)
  # won't return "result": "updated" if skipped

<<KIBANA
POST /products/_update/100
{
  "script": {
    "source": """
      if (ctx._source.in_stock == 0) {
        ctx.op = 'noop';
      } 
      ctx._source.in_stock -= params.quantity
    """,
    "params": {
      "quantity": 1
    }
  }
}
KIBANA

# update (conditional) (no operation)
  # will always return "result": "updated" (even if skipped)

<<KIBANA
POST /products/_update/100
{
  "script": {
    "source": """
      if (ctx._source.in_stock == 0) {
        ctx.op = 'noop';
      } 
      ctx._source.in_stock -= params.quantity
    """,
    "params": {
      "quantity": 1
    }
  }
}
KIBANA

# ----------------
# upsert (insert (DNE) or update (exists))
# ----------------

# run script if exists, insert (upsert) if DNE

<<KIBANA
POST /products/_update/101
{
  "script": {
    "source": "ctx._source.in_stock += params.quantity",
    "params": {
      "quantity": 2
    }
  },
  "upsert": {
    "name": "Blender",
    "price": 39,
    "in_stock": 5
  }
}
KIBANA

# ----------------
# replace documents
# ----------------

<<KIBANA
PUT /products/_doc/100
{
  "name": "Coffee Pot",
  "price": 24,
  "in_stock": 18
}
KIBANA


# ----------------
# delete documents
# ----------------

<<KIBANA
DELETE /products/_doc/100
KIBANA

# ----------------
# optimistic concurrency control
# ----------------

# prevent race conditions
  # only update if "_primary_term" and "_seq_no" match

<<KIBANA
GET /products/_doc/100
KIBANA

<<KIBANA
GET /products/_doc/100

POST /products/_update/100?if_primary_term=1&if_seq_no=9
{
  "doc": {
    "in_stock": 12
  }
}
KIBANA

# ----------------
# multi-document api (update by query)
# ----------------

# update all

<<KIBANA
POST /products/_update_by_query
{
  "conflicts": "proceed",
  "script": {
    "source": "ctx._source.in_stock--"
  },
  "query": {
    "match_all": {}
  }
}
KIBANA

# ----------------
# multi-document api (delete by query)
# ----------------

<<KIBANA
POST /products/_delete_by_query
{
  "conflicts": "proceed",
  "query": {
    "match_all": {}
  }
}
KIBANA


# ----------------
# batch processing (bulk api)
# ----------------

# if manually setting headers (ie -- curl):
  # Content-Type: application/x-ndjson

# index and create
  # if document already exists:
    # create throws error
    # index will overwrite

<<KIBANA
POST /_bulk
{ "index": { "_index": "products", "_id": 200 } }
{ "name": "Expresso Machine", "price": 199,  "in_stock": 5 }
{ "create": {"_index": "products",  "_id": 201 } }
{ "name": "Milk Frother", "price": 149,  "in_stock": 14 }
KIBANA

# update and delete

<<KIBANA
POST /_bulk
{ "update": { "_index": "products", "_id": 201 } }
{ "doc": { "price": 129 }}
{ "delete": { "_index": "products", "_id": 200 } }
KIBANA

# actions for same index
  # if index is specified in path, it doesn't need to be in the NDJSON
<< KIBANA
POST products/_bulk
{ "create": { "_id": 201 } }
{ "name": "Milk Frother", "price": 149,  "in_stock": 14 }
KIBANA

# ----------------
# meta fields
# ----------------
_index # name of the document's index
_id # document's id
_source # original JSON object used during indexing
_field_names # names of fields (with non-null values)
_routing # stores the value used to route a document to a shard
_version # internal version (if document is grabbed by _id)

# ----------------
# data types
# ----------------

# arrays
  # arrays are allowed (types must be uniform)
  # arrays of objects are flattened/mixed (use nested type instead)

text # full text values (for search)
keyword # structured text data (tags, categories, etc) (for aggregations)
numeric # float, integer, double, byte, short, long
date # string, long, integer (usually long -- ms since epoch)
binary # base64 encoded binary value
range # define upper/lower boundary ("lte", "gte") (integer_range, float_range, long_range, double_range, date_range)
object # added as JSON, stored as k/v pairs internally. (nested allowed)
nested # special object type, allows for querying arrays of objects, requires special query
geo_point # lat longs (four specific allowable formats)
geo_shape # point, polygon, linestring, multipoint, multilinestring, multipolygon, geometrycollection, envelope, circle
ip # IPv4 an IPv6
completion # used for aut-complete ("search as you type")
attachment # text from documents (requires 'ingest attachment processor plugin')


# ----------------
# mapping
# ----------------

# mappping
  # https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html

# mapping params
  # https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-params.html

# mapping -- process of defining how a document, and the fields it contains, are stored and indexed.
  # which text fields are full text
  # which numeric fields are numbers, dates, or geolocations

# mapping is dynamic by default 

# explicit mapping

<<KIBANA
PUT /my-index
{
  "mappings": {
    "properties": {
      "age":  { "type": "integer" },  
      "email":  { "type": "keyword"  }, 
      "name":   { "type": "text"  }   
    }
  }
}
KIBANA


# add mapping to existing index (new field)

<<KIBANA
PUT /products/_mapping
{
  "properties": {
    "discount": {
      "type": "double"
    }
  }
}
KIBANA

# view mapping
<<KIBANA
GET /my-index/_mapping
KIBANA

# modifying a mapping
  # cannot be done. it would invalidate indexed data


# ----------------
# analyzers
# ----------------

# input --> character filters --> tokenizer --> token filters --> output
  # character filters -- manipulate text before tokenization (removes html markup, etc)
  # tokenizer -- splits, removes whitespace and insignificant symbols
  # token filters -- lowercase, etc

# character filters
  # html_strip -- strips element tags and decodes html entities (&amp;)
  # mapping -- replace values using keys/values
  # pattern_replace -- replace using regular expressions

# tokenizers
  # word oriented -- full text to individual words
    # standard -- splits words by whitespace and removes irrelevant symbols
    # letter -- splits words by anything !alpha (space, symbol, number, etc)
    # lowercase -- like letter, but also lowercases all terms
    # whitespace -- splits words by whitespace (doesn't remove irrelevant symbols)
    # uax_url_email -- like standard, but preserves URLs and email addresses as single tokens.
  # partial word -- text/words to fragments. (used for partial word matching)
    # ngram -- breaks text into words, then emits N-grams of specified length 
      # "Red wine" --> ngram (min 2, max 10) --> Re, Red, ed, wi, win, wine, in, ine, ne
    # edge_ngram -- breaks text into words, then emits N-grams (only from beginning)
      # "Red wine" --> edge_ngram (min 2, max 10) --> Re, Red, wi, win, wine
  # structured text -- structured text to token (email addresses, zip codes, identifiers, etc)
    # keyword -- return text as one term (does nothing, but analyzer requires a tokenizer)
    # pattern -- split text where word separator matches
    # path_hierarchy -- split path into tree (/a, /a/b, /a/b/c)

# token filters
  # standard -- does nothing (acts as placeholder)
  # lowercase -- return lowercase
  # uppercase -- return uppercase
  # nGram -- like 'ngram' tokenizer
  # edgeNGram -- like 'edge_ngram' tokenizer
  # stop -- removes stop words (default _english_) (frequent, little semantic value) (deprecated practice)
  # word_delimiter -- splits words to subwords, performs transformations
    # split on number to letter, lower to upper, etc
    # remove possessive (person's)
  # stemmer -- stems only (remove -ing, -s, -ed)
  # keyword_marker -- prevent certain words from being stemmed
  # snowball -- stems using 'Snowball' algorithm. (just use 'stemmer')
  # synonym -- add/replace tokens based on synonym config file
  # trim -- remove edge whitespace
  # length -- remove tokens if (x < min) or (x > max)
  # truncate -- truncate to maximum length

# built in analyzers
  # standard -- 'standard' tokenizer, 'lowercase' token filter, optional 'stop' token filter
  # simple -- 'letter' tokenizer, 'lowercase' token filter
  # stop -- 'letter' tokenizer, 'lowercase' and 'stop' token filter
  # english -- 'standard' tokenizer, 'lowercase' & 'stop' & 'stemmer' token filter
  # keyword -- 'keyword' tokenizer
  # pattern -- 'pattern' tokenizer
  # whitespace -- 'whitespace' tokenizer

# basic analysis
<<KIBANA
POST /_analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase"],
  "text": "I'm in the mood for drinking semi-dry red wine!" 
}
KIBANA

# custom analyzer, customized analyzer and filter
<<KIBANA
PUT /existing_analyzer_config
{
  "settings": {
    "analysis": {
      "analyzer": {
        "english_stop": {
          "type": "standard",
          "stopwords": "_english_"
        },
        "my_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "standard",
          "filter": ["standard", "lowercase, "trim", "stemmer"],
        }
      },
      "filter": {
        "my_stemmer": {
          "type": "stemmer",
          "name": "english"
        }
      }
    }
  }
}

POST /existinc_analyzer_config/_analyze
{
  "analyzer": "english_stop",
  "text": "I'm in the mood for drinking semi-dry red wine!" 
}

POST /existinc_analyzer_config/_analyze
{
  "tokenizer": "standard",
  "filter": ["my_stemmer"],
  "text": "I'm in the mood for drinking semi-dry red wine!" 
}

POST /analyzers_test/_analyze
{
  "analyzer": "my_analyzer",
  "text": "I'm in the mood for drinking semi-dry <em>red</em> wine!" 
}
KIBANA

# mappings with analyzers (uses "my_analyzer" from above)
<<KIBANA
PUT /analyzers_test/_mapping
{
  "properties": {
    "description": {
      "type": "text",
      "analyzer": "my_analyzer"
    },
    "teaser": {
      "type": "text",
      "analyzer": "standard"
    }
  }
}

POST /analyzers_test/1
{
  "description": "running",
  "teaser": "running"
}

GET /analyzers_test/_search
{
  "query": {
    "term": {
      "description": {
        "value": "running"
      }
    }
  }
}
KIBANA

# ----------------
# inverted index
# ----------------

# inverted index
  # result of the analysis process
  # a mapping of terms and documents (which terms appear in a given doc)
  # there will be an inverted index for each full-text field

# ----------------
# adding analyzer to existing index
# ----------------

# close index (shutdown)
# add analyzer
# re-open index

<<KIBANA
POST /analyzers_test/_close

PUT /analyzers_test/_settings
{
  "analysis": {
    "analyzer": {
      "french_stop": {
        "type": "standard",
        "stopwords": "_french_"
      }
    }
  }
}

POST /analyzers_test/_open
KIBANA

# ----------------
# URI query
# ----------------

# match everything (will not always return everything, use 'size' param to configure)
<<KIBANA
GET /product/_search?q=*
KIBANA

# pass k/v pairs
<<KIBANA
GET /product/_search?q=name:Lobster
GET /product/_search?q=tags:Meat
KIBANA

# and (multiple conditions)
  # when not using kibana, replace ' ' with '%20'
<<KIBANA
GET /product/_search?q=tags:Meat AND name:Beef
KIBANA


# ----------------
# dsl query (basics)
# ----------------

# types
  # leaf query -- regular query
  # compound query -- multiple leaf queries, combined with AND/OR

# when a cluster receives a request from the client:
  # the node/shard that has the requested data becomes the "coordinating node"
  # coordinating node -- responsible for sending queries to other nodes and assembling results

# relevance
  # Okapi BM25 -- current Elasticsearch algorithm
    # better at handling stop words
    # improves field-length norm factor
    # can be configured
  # DF/IDF -- document frequency, inverse document frequency
    # DF -- more significant when term appears in document multiple times. 
    # IDF -- less significant when term appears in many documents
    # relevant if appears many times in document, but not many times across index.
  # field-length norm -- terms are less significant if field is long.

# match all (no condition used to subset)
<<KIBANA
GET /product/_search
{
  "query": {
    "match_all": {}
  }
}
KIBANA

# explain api (explain why document does (not) match query)
<<KIBANA
GET /twitter/_explain/0
{
    "query" : {
    "match" : { "message" : "elasticsearch" }
    }
}
KIBANA

# full text vs term query
  # full text will get analyzed before search (character filter, tokenization, token filter)
  # term will be searched for in the inverted index (no analyzer) 
<<KIBANA
GET /product/_search
{
  "query": {
    "match": {
      "name": "lobster"
    }
  }
}

GET /product/_search
{
  "query": {
    "term": {
      "name": "lobster"
    }
  }
}
KIBANA


# ----------------
# search (term level queries)
# ----------------

# search (basic)
<<KIBANA
GET /product/_search
{ "query": { "term": { "is_active": true } } }
KIBANA

# search (add options)
<<KIBANA
GET /product/_search
{ 
  "query": { 
    "term": { 
      "is_active": {
        "value": true
      } 
    } 
  } 
}
KIBANA

# search (multiple terms)
<<KIBANA
GET /product/_search
{ 
  "query": { 
    "term": { 
      "tags.keyword": [ "cake", "ice cream" ]
    } 
  } 
}
KIBANA

# search (id)
<<KIBANA
GET /product/_search
{ 
  "query": { 
    "ids": [1,2,3] 
  } 
}
KIBANA

# range
<<KIBANA
GET /product/_search
{ 
  "query": { 
    "range": {
      "in_stock": {
        "gte": 1,
        "lte": 5
      }
    }
  } 
}
KIBANA

# date range examples
  # first -- default
  # second -- specified format
  # third -- date math

# date range
  # date math -- "gte": "2019/01/01||-1y",
  # round month -- "gte": "2019/01/01||-1y/M"
  # now -- "gte": "now||-1M/d"
  # dates are rounded differently, depending on gte, gt, lte, lt

<<KIBANA
GET /product/_search
{ 
  "query": { 
    "range": {
      "created": {
        "gte": "2019/01/01",
        "lte": "2019/12/31"
      }
    }
  } 
}

GET /product/_search
{ 
  "query": { 
    "range": {
      "created": {
        "gte": "2019/01/01",
        "lte": "2019/12/31",
        "format": "yyyy/MM/dd"
      }
    }
  } 
}

GET /product/_search
{ 
  "query": { 
    "range": {
      "created": {
        "gte": "2019/01/01 || -1y",
        "lte": "2019/12/31 || +1y",
        "format": "yyyy/MM/dd"
      }
    }
  } 
}
KIBANA

# match (non-null) (return documents that contain an indexed value for a field)
<<KIBANA
GET /product/_search
{ 
  "query": { 
    exists: {
      "field": "tags"
    }
  } 
}
KIBANA

# match (prefixes)
<<KIBANA
GET /product/_search
{
  "query": {
    "prefix": {
      "name": {
        "value": "lo"
      }
    }
  }
}

GET /product/_search
{
  "query": {
    "prefix": {
      "tags.keyword": "Vege"
    }
  }
}

GET /product/_search
{
  "query": {
    "match_phrase_prefix" : {
      "message" : {
        "query" : "quick brown f"
      }
    }
  }
}
KIBANA

# match (wildcard)
  # ? -- any single character
  # * -- any characters, zero or more times
<<KIBANA
GET /product/_search
{ 
  "query": { 
    wildcard: {
      "tags.keyword": "r?n*"
    }
  } 
}
KIBANA

# match (regex)

<<KIBANA
GET /product/_search
{ 
  "query": { 
    regexp: {
      "tags.keyword": "Veget[a-zA-Z]+ble"
    }
  } 
}
KIBANA

# ----------------
# search (full text queries)
# ----------------

# match query goes through analysis process?
  # use lowercase terms in match (if standard analyzer)?


# match
  # returns documents in order of relevance
<<KIBANA
GET /recipe/_search
{
  "query": {
    "match": {
      "title": "Recipes with pasta or spaghetti"
    }
  }
}
KIBANA

# match (all -- all terms must appear)
<<KIBANA
GET /recipe/_search
{
  "query": {
    "match": {
      "title": {
        "query": "pasta spaghetti",
        "operator": "and"
      }
    }
  }
}
KIBANA

# match (phrase)
<<KIBANA
GET /recipe/_search
{
  "query": {
    "match_phrase": {
      "title": "puttanesca spaghetti"
    }
  }
}
KIBANA

# match (multiple field)
<<KIBANA
GET /recipe/_search
{
  "query": {
    "multi_match": {
      "query": "pasta",
      "fields": ['title', 'dexcription']
    }
  }
}
KIBANA

# ----------------
# compound queries (multiple leaf queries)
# ----------------

# match (multiple leaf queries)
  # query -- how well does it match? (gets score)
  # filter -- does it match? (removes !matches)
  # should -- it should match (boosts relevance scores)
# named query
  # "description": "pasta" --> "description": { "value": "pasta", "_name": "my_query_name"  }
  # this allows for naming of query. used for debugging
  # "matched queries" in response will return a list of matched named queries per document

# convenience wrapper (match)
  # match is a convenience wrapper of compound leaf queries (should)
    # match can be expressed as { query: bool: should: ["field": "value", ...] }
  # match (and) is a convenience wrapper of compound leaf queries (must)
    # match (and) can be expressed as { query: bool: must: ["field": "value", ...] }
<<KIBANA
GET /recipe/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "ingredients.name": "parmesan" } },
        { "match": { "description": "pasta" } } 
      ],
      "must_not": [
        { "match": { "ingredients.name": "tuna" } }
      ],
      "should": [
        { "match": { "ingredients.name": "oregano" } }
      ]
      "filter": [
        { "range": { "preparation_time_minutes": { "lte" : 20 } } }
      ]
    }
  }
}
KIBANA

# ----------------
# nested queries
# ----------------

# which departments (index) have female intern employees (nested index)
  # inner hits -- which employees triggered a 'department' hit
    # response will be a list of hits (departments) with nested objects (employees)
  # reduce overhead within the index -- "_source": false,
<<KIBANA
GET /department/_search
{
  "_source": false,
  "query": {
    "nested": {
      "path": "employees",
      "inner_hits": {},
      "query": {
        "bool": {
          "must": [
            { "match": { "employees.position": "intern" } },
            { "term": "employees.gender.keyword": { "value": "F" } }
          ]
        }
      }
    }
  }
}
KIBANA

# ----------------
# mapping document relationships
# ----------------

# https://www.elastic.co/guide/en/elasticsearch/reference/current/parent-join.html

# ----------------
# join (parent child)
# ----------------

# docs
  # https://www.elastic.co/guide/en/elasticsearch/reference/current/parent-join.html

# performance
  # performance decreases as documents, terms, and relations increase

# limitations
  # documents must be same index
  # parent/child docs must be indexed on same shard
  # only one join per index (as many relations as desired)
  # any child can only have one parent

# ----------------
# terms lookup
# ----------------

# find stories for a group of users (ie -- friends, following, etc)
  # index -- index to fetch from
  # id -- id to fetch from
  # path -- field to fetch from

<<KIBANA
GET /stories/_search
{
  "query": {
    "terms": {
      "user": {
        "index": "users",
        "type": "_doc",
        "id": 1,
        "path": "following"
      }
    }
  }
}
KIBANA

# ----------------
# source filtering
# ----------------

# specify fields to be returned (reduce payload)
  # key -- "ingredients.name"
  # keys -- "ingredients.*"
  # most keys -- "includes: ""ingredients", "excludes": "ingredients.quantity"
  # fields -- ["ingredients", "servings"]

<<KIBANA
GET /recipe/_search
{
  "_source": "ingredients.name",
  "query": {
    "match": { "title": "pasta" }
  }
}
KIBANA

# ----------------
# specify result size
# ----------------

# size
  # size -- how many documents to return
  # from -- where to start (offset)
<<KIBANA
GET /recipe/_search
{
  "size": 5
  "from": 0
  "query": {
    "match": {
      "title": "Recipes with pasta or spaghetti"
    }
  }
}
KIBANA

# ----------------
# sort
# ----------------

# sort
  # sort by prep time, then by document's "created"
<<KIBANA
GET /recipe/_search
{
  "_source": "created",
  "query": {
    "match": {
      "title": "pasta spaghetti"
    }
  },
  "sort": [ 
    { "preparation_time_minutes": "asc"}, 
    { "created": "desc" } 
  ]
}
KIBANA

# sort (multivalue-fields) (aggregations)
<<KIBANA
GET /recipe/default/_search
{
  "_source": "ratings",
  "query": {
    "match_all": {}
  },
  "sort": [
    { "ratings": { "order": "desc", "mode" "avg" } }
  ]

}
KIBANA


# ----------------
# aggregations
# ----------------

# metric aggs
  # name of result of aggregation (response key will match)
# aggs
  # min, max, avg, sum
  # cardinality -- distinct values (count)
  # value_count -- number of values extracted
  # stats -- returns count, min, max, avg, sum

<<KIBANA
GET /order/_search
{
  "query": { "match_all": {} },
  "aggs": {
    "total_sales": { "sum" { "field": "total_amount" } },
    "avg_sale": { "avg": { "field": "total_amount" } },
    "min_sale": { "min": { "field": "total_amount" } },
    "max_sale": { "max": { "field": "total_amount" } },
    "amt_stats": { "stats": { "field": "total_amount" } },
  }
}
KIBANA

# bucket aggs (term aggregation)
  # DOC COUNTS ARE APPROXIMATE!!
  # returns -- "aggregations": { "name": { buckets: [ "key", "doc_count" ] } }
  # missing -- bucket for documents missing the specified field
<<KIBANA
GET /order/_search
{
  "query": { "match_all": {} },
  "aggs":  {
    "status_terms" { "terms": { "field": "status.keyword", "missing": "no_status_field" } }
  },

}
KIBANA

# nested aggregations
  # bucket aggregation, then metric aggregation
<<KIBANA
GET /order/_search
{
  "query": { "match_all": {} },
  "aggs":  {
    "status_terms" { "terms": { "field": "status.keyword", "missing": "no_status_field" } },
    "status_stats": { "stats": { "field": "total_amount" } },
  },

}
KIBANA

# filter aggregation
<<KIBANA
GET /order/_search
{
  "query": { "match_all": {} },
  "aggs": {
    "low_value": { 
      "filter": { "range": { "total_amount": { "lte": 50 } } },
      "aggs": { 
        "avg_amount": { "avg": { "field": "total_amount" } }
      }
    }
  }
}
KIBANA

# filters aggregation
<<KIBANA
GET /order/_search
{
  "query": { "match_all": {} },
  "aggs": {
    "my_filter": { 
      "filters": {
        "filters": {
          "pasta": { "match": { "title": "pasta" } },
          "spaghetti": { "match": { "title": "spaghetti" } }
        }
      }
      "aggs": { 
        "avg_rating": { "avg": { "field": "ratings" } }
      }
    }
  }
}
KIBANA

# range aggregations (range, date_range)
  # to name buckets -- "keyed": true
<<KIBANA
GET /order/_search
{
  "query": { "match_all": {} },
  "aggs": {
    "amount_distribution": {
      "range": { 
        "field": "total_amount", 
        "ranges": [
          { "to": 50 },
          { "from": 50, "to": 100 },
          { "from": 100 }
        ]
      }
    }
  }
}

GET /order/_search
{
  "query": { "match_all": {} },
  "aggs": {
    "purchased_date_ranges": {
      "date_range": { 
        "field": "purchased_at", 
        "format": "yyyy-MM-dd"
        "ranges": [
          { "from": "2016-01-01", "to": "2016-01-01||+6M" },
          { "from": "2016-01-01||+6M", "to": "2016-01-01||+1y" }
        ]
      }
    }
  }
}
KIBANA

# histogram
  # interval -- bin size
  # min_doc_count -- response will only include bins that meet this threshold
<<KIBANA
GET /order/_search
{
  "query": { "match_all": {} },
  "aggs": {
    "amount_distribution": {
      "histogram": {
        "field": "total_amount",
        "interval": 25,
        "min_doc_count": 1
      }
    }
  }
}
GET /order/_search
{
  "query": { "match_all": {} },
  "aggs": {
    "amount_distribution": {
      "date_histogram": {
        "field": "purchased_at",
        "interval": "month"
      }
    }
  }
}
KIBANA

# global aggregation
  # https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-global-aggregation.html


# nested aggregation
  # find youngest employee
<<KIBANA
GET /department/_search
{
  "query": { "match_all": {} },
  "aggs": {
    "employees": {
      "nested": {
        "path": "employees"
      },
      "aggs": {
        "minimum_age": {
          "min": {
            "field": "employees_age"
          }
        }
      }
    }
  }
}
KIBANA


# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------



# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------



# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------



# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------



# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------



# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------



