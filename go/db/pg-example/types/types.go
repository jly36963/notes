package types

import (
	"time"
)

// ---
// ninjas
// ---

// Ninja -- a ninja
type Ninja struct {
	tableName struct{}  `pg:"ninjas"`
	ID        int       `pg:"id,pk,unique,notnull," json:"id,omitempty"`
	FirstName string    `pg:"first_name,notnull," json:"firstName,omitempty"`
	LastName  string    `pg:"last_name,notnull," json:"lastName,omitempty"`
	CreatedAt time.Time `pg:"created_at," json:"createdAt,omitempty"`
	UpdatedAt time.Time `pg:"updated_at," json:"updatedAt,omitempty"`
	DeletedAt time.Time `pg:"deleted_at," json:"deletedAt,omitempty"`
	Jutsus    []Jutsu   `pg:",many2many:ninjas_jutsus" json:"jutsus,omitempty"`
}

// ---
// jutsus
// ---

// Jutsu -- a jutsu
type Jutsu struct {
	tableName    struct{}  `pg:"jutsus"`
	ID           int       `pg:"id,pk,unique,notnull" json:"id,omitempty"`
	Name         string    `pg:"name,notnull" json:"name,omitempty"`
	ChakraNature string    `pg:"chakra_nature,notnull" json:"chakraNature,omitempty"`
	Description  string    `pg:"description,notnull" json:"description,omitempty"`
	CreatedAt    time.Time `pg:"created_at" json:"createdAt,omitempty"`
	UpdatedAt    time.Time `pg:"updated_at" json:"updatedAt,omitempty"`
	DeletedAt    time.Time `pg:"deleted_at,soft_delete" json:"deletedAt,omitempty"`
	Ninjas       []Ninja   `pg:",many2many:ninjas_jutsus,fk:ninja_id,joinFK:jutsu_id" json:"ninjas,omitempty"`
}

// ---
// ninjas_jutsus
// ---

// NinjaJutsu -- ninja & jutsu association
type NinjaJutsu struct {
	tableName struct{}  `pg:"ninjas_jutsus"`
	ID        int       `pg:"id,pk,unique" json:"omitempty"`
	NinjaID   int       `pg:"ninja_id" json:"ninjaId,omitempty"`
	JutsuID   int       `pg:"jutsu_id" json:"jutsuId,omitempty"`
	CreatedAt time.Time `pg:"created_at" json:"createdAt,omitempty"`
	UpdatedAt time.Time `pg:"updated_at," json:"updatedAt,omitempty"`
	DeletedAt time.Time `pg:"deleted_at," json:"deletedAt,omitempty"`
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
