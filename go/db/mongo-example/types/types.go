package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ---
// ninja
// ---

// Ninja -- a ninja
type Ninja struct {
	ID        primitive.ObjectID   `bson:"_id,omitempty"`
	FirstName string               `bson:"firstName,omitempty"`
	LastName  string               `bson:"lastName,omitempty"`
	CreatedAt time.Time            `bson:"createdAt,omitempty"`
	UpdatedAt time.Time            `bson:"updatedAt,omitempty"`
	DeletedAt time.Time            `bson:"deletedAt,omitempty"`
	JutsuIDs  []primitive.ObjectID `bson:"jutsuIds,omitempty"`
	Jutsus    []Jutsu              `bson:"jutsus,omitempty"`
}

// ---
// jutsu
// ---

// Jutsu -- a jutsu
type Jutsu struct {
	ID           primitive.ObjectID   `bson:"_id,omitempty"`
	Name         string               `bson:"name,omitempty"`
	ChakraNature string               `bson:"chakraNature,omitempty"`
	Description  string               `bson:"description,omitempty"`
	CreatedAt    time.Time            `bson:"createdAt,omitempty"`
	UpdatedAt    time.Time            `bson:"updatedAt,omitempty"`
	DeletedAt    time.Time            `bson:"deletedAt,omitempty"`
	NinjaIDs     []primitive.ObjectID `bson:"ninjaIds,omitempty"`
	Ninjas       []Ninja              `bson:"ninjas,omitempty"`
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
