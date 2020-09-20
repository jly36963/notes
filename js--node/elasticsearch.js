// ----------
// elasticsearch + nodejs
// ----------

// install
`
npm i --save @elastic/elasticsearch
`;

// docs
// https://www.npmjs.com/package/@elastic/elasticsearch

// api reference
// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/16.x/api-reference.html

// ----------
// create client
// ----------

// import
const { Client } = require("@elastic/elasticsearch");

// instantiate
const client = new Client({
  nodes: [
    "http://localhost:9200",
    "http://localhost:9201",
    "http://localhost:9202",
  ],
});

// const client = new Client({ node: 'http://localhost:9200'});

// ------------
// create index
// ------------

const createIndex = async (client, config) => {
  try {
    const result = await client.indices.create(config);
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

await createIndex(client, {
  index: "jonin",
  body: {
    mappings: {
      properties: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        is_awesome: { type: "string" },
      },
    },
  },
});

// ------------
// delete index
// ------------

const deleteIndex = async (client, config) => {
  try {
    const result = await client.indices.delete(config);
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

await deleteIndex(client, {
  index: "jonin",
});

// ------------
// refresh index
// ------------

// make recent updates available in search

const refreshIndex = async (client, config) => {
  try {
    const response = await client.indices.refresh(config);
    return { data: response, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// example

await refreshIndex(client, { index: "jonin" });

// ------------
// add documents to index
// ------------

const indexDocument = async (client, config) => {
  try {
    const result = await client.index(config);
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// example

await indexDocument(client, {
  index: "jonin",
  body: {
    first_name: "Kakashi",
    last_name: "Hatake",
    is_awesome: "yes",
  },
});
await indexDocument(client, {
  index: "jonin",
  body: {
    first_name: "Tenzo",
    last_name: "Yamato",
    is_awesome: "yes",
  },
});

// ------------
// search
// ------------

const searchDocuments = async (client, config) => {
  try {
    const result = await client.search(config);
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// output structure
`
{
  body: object | boolean
  statusCode: number
  headers: object
  warnings: [string]
  meta: object
}
`;

// example

const esResponse = await searchDocuments(client, {
  index: "jonin",
  body: {
    query: {
      match: { firstName: "Kakashi" },
    },
  },
});
const { body } = esResponse.data;
console.log(body);

// ----------
// count
// ----------

const countDocuments = async (client, config) => {
  try {
    const count = await client.count(config);
    return { data: count, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// example

const esResponse = await countDocuments(client, {
  index: "jonin",
});
console.log(esResponse.data);

// ----------
// update
// ----------

const updateDocument = async (client, config) => {
  try {
    await client.update(config);
    return { data: "success", error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// example

await updateDocument(client, {
  index: "jonin",
  id: 1, // example id -- 6AGMyXEBAB4tac_CjboG
  body: {
    doc: {
      last_name: "HATAKE",
    },
  },
});

await updateDocument(client, {
  index: "jonin",
  id: 2, // example id -- 6AGMyXEBAB4tac_CjboG
  body: {
    doc: {
      last_name: "YAMATO",
    },
  },
});

await refreshIndex(client, { index: "jonin" });

// ----------
// update by query
// ----------

const updateDocumentsByQuery = async (client, config) => {
  try {
    const result = await client.updateByQuery(config);
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

await updateDocumentsByQuery(client, {
  index: "jonin",
  body: {
    query: {
      match_all: {},
    },
    script: {
      source: "ctx._source.is_awesome = params.is_awesome",
      params: {
        is_awesome: "definitely",
      },
    },
  },
});

await refreshIndex(client, { index: "jonin" });

// ----------
// delete
// ----------

const deleteDocumentsByQuery = async (client, config) => {
  try {
    await client.deleteByQuery(config);
    return { data: "success", error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// example

await deleteDocumentsByQuery(client, {
  index: "jonin",
  body: {
    query: {
      match_all: {}, // delete all
    },
  },
});

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------

// ----------
//
// ----------
