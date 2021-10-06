package types

import (
	"time"
)

// ---
// ninja
// ---

// Ninja represents a ninja in the database
type Ninja struct {
	ID        string    `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Age       int64     `json:"age"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// NinjaNew represents a new ninja that will be inserted
type NinjaNew struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Age       int64  `json:"age"`
}
