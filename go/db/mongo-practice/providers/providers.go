package providers

import (
	"mongo-practice/dal/mongodal"
)

// Providers -- context/dependencies
type Providers struct {
	MongoDAL mongodal.IMongoDAL
}
