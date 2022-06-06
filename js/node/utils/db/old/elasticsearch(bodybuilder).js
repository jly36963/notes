// --------------
// bodybuilder
// --------------

// install
`
npm i --save @elastic/elasticsearch bodybuilder
`;

// --------------
// example 1
// --------------

// import
const bodybuilder = require("bodybuilder");
// body
const body = bodybuilder()
  .query("match", "message", "this is a test") // add query
  .build(); // build query
// log
console.log(body);
// result of build
`
{
  query: {
    match: {
      message: 'this is a test'
    }
  }
}
`;

// --------------
// example 1
// --------------

// import
const bodybuilder = require("bodybuilder");
// body
const body = bodybuilder()
  .query("match", "message", "this is a test")
  .filter("term", "user", "kimchy")
  .notFilter("term", "user", "cassie")
  .aggregation("terms", "user")
  .build();

// --------------
// sort
// --------------

const bodybuilder = require("bodybuilder");

// sort by one criteria
const body = bodybuilder().sort("timestamp", "desc").build();

// sort by two criteria
const body = bodybuilder()
  .sort([{ categories: "desc" }, { content: "asc" }])
  .build();

// --------------
// from & size
// --------------

const page = 3; // which group of results (pagination)
const limit = 10; // size of result group
const offset = limit * (page - 1); // where current result group starts

const body = bodybuilder().from(offset).size(limit).build();

// --------------
// clone
// --------------

// create cloned instance (separate location in memory)

const bodyA = bodybuilder().size(10);

const bodyB = bodyA.clone().from(20);

// bodyA: { size: 10 }
// bodyB: { size: 10, from: 20 }

// --------------
// query
// --------------

// match_all
const body = bodybuilder().query("match_all").build();

const body = bodybuilder().query("match_all", { boost: 1.2 }).build();

// match
const body = bodybuilder().query("match", "message", "this is a test").build();

// terms
const body = bodybuilder()
  .query("terms", "user", ["kakashi", "yamato"])
  .build();

// nested
const body = bodybuilder()
  .query("nested", { path: "obj1", score_mode: "avg" }, (q) => {
    return q
      .query("match", "obj1.name", "blue")
      .query("range", "obj1.count", { gt: 5 });
  })
  .build();

// orQuery ('should' query)
const body = bodybuilder()
  .orQuery("match", "message", "this is a test")
  .build();

// notQuery ('must_not' query)
const body = bodybuilder()
  .notQuery("match", "message", "this is a test")
  .build();

// --------------
// filter
// --------------

const body = bodybuilder().filter("term", "user", "kakashi").build();

// --------------
// aggregation
// --------------

const body = bodybuilder().aggregation("max", "price").build();

const body = bodybuilder()
  .aggregation("percentiles", "load_time", {
    percents: [95, 99, 99.9],
  })
  .build();

const body = bodybuilder()
  .aggregation("date_range", "date", {
    format: "MM-yyy",
    ranges: [{ to: "now-10M/M" }, { from: "now-10M/M" }],
  })
  .build();

const body = bodybuilder()
  .aggregation("diversified_sampler", "user.id", { shard_size: 200 }, (a) => {
    return a.aggregation("significant_terms", "text", "keywords");
  })
  .build();

const body = bodybuilder()
  .aggregation(
    "terms",
    "title",
    {
      _meta: { color: "blue" },
    },
    "titles"
  )
  .build();

// --------------
//
// --------------
