// ---------------
// graphql
// ---------------

// ---------------
// install & import
// ---------------

// server
`
npm install graphql --save
npm install express --save
npm install express-graphql --save
`
// client
`
npm install graphql-tag
`
// server imports
const { graphql, buildSchema } = require('graphql');
// client imports
const { gql } = require('graphql-tag');


// ---------------
// sending requests to a graphql api
// ---------------

// import
const axios = require('axios');
const { gql } = require('graphql-tag');

// query
const gqlQuery = gql`
  query HeroNameAndFriends {
  hero {
    name
    # Queries can have comments!
    friends {
      name
    }
  }
}
`

// function
const makeQuery = async (gqlQuery) => {
  try {
    const data = { query: gqlQuery };
    const apiResponse = await axios.post('http://localhost:5000/graphql-api/', data)
    console.log(apiResponse);
  } catch (err) {
    console.log(err);
  }
}

// execution
makeQuery(gqlQuery);



// ---------------
// queries
// ---------------

// gql uses 'tagged template literals'

// docs
  // https://graphql.org/learn/queries/

// request
gql`
query HeroNameAndFriends {
  hero {
    name
    # Queries can have comments!
    friends {
      name
    }
  }
}
`

// response
`
{
  "data": {
    "hero": {
      "name": "R2-D2",
        "friends": [
          {
            "name": "Luke Skywalker"
          },
          {
            "name": "Han Solo"
          },
          {
            "name": "Leia Organa"
          }
        ]
    }
  }
}
`

// request (arguments)
gql`
query HumanNameAndHeight {
  human(id: "1000") {
    name
    height
  }
}
`

// response (arguments)
`
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
        "height": 1.72
    }
  }
}
`

// request (variables)
  // $variableName: Type
gql`
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
{
  "episode": "JEDI"
}
`

// request (default variables)
gql`
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
`

// response (variables)
`
{
  "data": {
    "hero": {
      "name": "R2-D2",
        "friends": [
          {
            "name": "Luke Skywalker"
          },
          {
            "name": "Han Solo"
          },
          {
            "name": "Leia Organa"
          }
        ]
    }
  }
}
`

// request (directives)
  // specify how much to return (simplified or detailed view example)
  // condition
    // @include(if: Boolean)
    // @skip(if: Boolean)
    
// skipped


// ---------------
// mutations
// ---------------

// request
gql`
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
{
  "ep": "JEDI",
    "review": {
    "stars": 5,
      "commentary": "This is a great movie!"
  }
}
`

// response
`
{
  "data": {
    "createReview": {
      "stars": 5,
        "commentary": "This is a great movie!"
    }
  }
}
`


// ---------------
// metadata
// ---------------

// get type in response

// request
gql`
{
  search(text: "an") {
    __typename
    ...on Human {
      name
    }
    ...on Droid {
      name
    }
    ...on Starship {
      name
    }
  }
}
`

// response
`
{
  "data": {
    "search": [
      {
        "__typename": "Human",
        "name": "Han Solo"
      },
      {
        "__typename": "Human",
        "name": "Leia Organa"
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1"
      }
    ]
  }
}
`


// ---------------
// types
// ---------------

// type

gql`
type Character {
  name: String!
  appearsIn: [Episode!]!
}
`

// graphql object type -- Character
// fields -- name, appearsIn
// ! -- non-nullable (types are nullable by default)
// scalar types -- String Int Float Boolean ID
  // resolves to single scalar object (no sub-selections)
// array types -- [Episode]
  // resolves to an array of objects (of type specified)
  // will eventually resolve to scalars (leaves of the tree)

// type (arguments)

gql`
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
`

// enums
  // specify set of allowed values

gql`
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
`

// interfaces
  // abstract type that includes a specified set of required fields

gql`
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
`

// interfaces (implements)
gql`
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}
`
gql`
type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
`

// inline fragments
  // https://graphql.org/learn/queries/#inline-fragments

// union types
  // https://graphql.org/learn/schema/#union-types



// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




// ---------------
//
// ---------------




