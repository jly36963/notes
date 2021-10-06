package providers

import "go-pg-practice/dal/pgdal"

// Providers -- context/dependencies
type Providers struct {
	PGDAL pgdal.IPGDAL
}
