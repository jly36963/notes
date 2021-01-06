package types

import (
	"time"
)

// ---
// ninja
// ---

// Ninja -- a ninja
type Ninja struct {
	ID        string    `bson:"_id,omitempty"`
	FirstName string    `bson:"firstName,omitempty"`
	LastName  string    `bson:"lastName,omitempty"`
	CreatedAt time.Time `bson:"createdAt,omitempty"`
	UpdatedAt time.Time `bson:"updatedAt,omitempty"`
	DeletedAt time.Time `bson:"deletedAt,omitempty"`
	JutsuIDs  []string  `bson:"jutsuIds,omitempty"`
}

// ---
// jutsu
// ---

// Jutsu -- a jutsu
type Jutsu struct {
	ID           string    `bson:"_id,omitempty"`
	Name         string    `bson:"name,omitempty"`
	ChakraNature string    `bson:"chakraNature,omitempty"`
	Description  string    `bson:"description,omitempty"`
	CreatedAt    time.Time `bson:"createdAt,omitempty"`
	UpdatedAt    time.Time `bson:"updatedAt,omitempty"`
	DeletedAt    time.Time `bson:"deletedAt,omitempty"`
	NinjaIDs     []string  `bson:"ninjaIds,omitempty"`
}

// ---
// runtime details
// ---

// RuntimeDetails : runtime details, gets logged immediately
type RuntimeDetails struct {
	Os      string `json:"os"`
	Arch    string `json:"arch"`
	CPUs    int    `json:"cpus"`
	Version string `json:"version"`
}
