package types

import (
	"time"

	"gorm.io/gorm"
)

// ---
// ninja
// ---

// Ninja -- a ninja
type Ninja struct {
	gorm.Model
	ID        uint       `column:"id"`
	FirstName string     `column:"first_name"`
	LastName  string     `column:"last_name"`
	CreatedAt *time.Time `column:"created_at"`
	UpdatedAt *time.Time `column:"updated_at"`
	DeletedAt *time.Time `column:"deleted_at"`
	Jutsus    []*Jutsu   `column:"jutsus" gorm:"many2many:ninjas_jutsus;"`
}

// // NinjaWithRelatedJutsu -- ninja with associated jutsus
// type NinjaWithRelatedJutsu struct {
// 	*Ninja
// 	Jutsus []*Jutsu `column:"jutsus" gorm:"many2many:ninjas_jutsus;"`
// }

// // NinjaModel -- gorm model
// type NinjaModel struct {
// 	*NinjaWithRelatedJutsu
// 	gorm.Model
// }

// TableName -- set table name
func (Ninja) TableName() string {
	return "ninjas"
}

// ---
// jutsu
// ---

// Jutsu -- a jutsu
type Jutsu struct {
	gorm.Model
	ID           uint       `column:"id" gorm:"primaryKey"`
	Name         string     `column:"name"`
	ChakraNature string     `column:"chakra_nature"`
	Description  string     `column:"description"`
	CreatedAt    *time.Time `column:"created_at"`
	UpdatedAt    *time.Time `column:"updated_at"`
	DeletedAt    *time.Time `column:"deleted_at"`
	Ninjas       []*Ninja   `column:"ninjas" gorm:"many2many:ninjas_jutsus;"`
}

// // JutsuWithRelatedNinja -- jutsu with associated ninjas
// type JutsuWithRelatedNinja struct {
// 	*Jutsu
// 	Ninjas []*Ninja `column:"ninjas" gorm:"many2many:ninjas_jutsus;"`
// }

// // JutsuModel -- gorm model
// type JutsuModel struct {
// 	*JutsuWithRelatedNinja
// 	gorm.Model
// }

// TableName -- set table name
func (Jutsu) TableName() string {
	return "jutsus"
}

// ---
// ninjas_jutsus
// ---

// NinjaJutsu -- ninja/jutsu associations
type NinjaJutsu struct {
	gorm.Model
	ID        uint       `column:"id" gorm:"primaryKey"`
	NinjaID   uint       `column:"ninja_id"`
	JutsuID   uint       `column:"jutsu_id"`
	CreatedAt *time.Time `column:"created_at"`
}

// // NinjaJutsuModel -- gorm model (join table)
// type NinjaJutsuModel struct {
// 	*NinjaJutsu
// 	gorm.Model
// }

// TableName -- set table name
func (NinjaJutsu) TableName() string {
	return "ninjas_jutsus"
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
