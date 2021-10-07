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
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Age       int64     `json:"age"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
	Jutsus    []Jutsu   `json:"jutsus,omitempty"`
}

// NinjaNew represents a new ninja that will be inserted or its updatable fields
type NinjaNew struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Age       int64  `json:"age"`
}

// ---
// jutsu
// ---

// Jutsu represents a jutsu in the database
type Jutsu struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	ChakraNature string    `json:"chakraNature"`
	Description  string    `json:"description"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt,omitempty"`
	Ninjas       []Ninja   `json:"ninjas,omitempty"`
}

// JutsuNew represents a new jutsu that will be inserted or its updatable fields
type JutsuNew struct {
	Name         string `json:"name"`
	ChakraNature string `json:"chakraNature"`
	Description  string `json:"description"`
}
