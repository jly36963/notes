package providers

import (
	"gorm-practice/dal/pgdal"
)

// Providers -- context/dependencies
type Providers struct {
	PGDAL pgdal.IPGDAL
}
