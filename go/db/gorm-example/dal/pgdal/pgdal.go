package pgdal

import (
	// "gorm-practice/connections/pg/DB"
	"errors"
	"fmt"
	"gorm-practice/types"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// ---
// postgres
// ---

// IPGDAL -- describes DAL methods
type IPGDAL interface {
	// connection
	GetConnectionString() error
	GetConnection() error
	AutoMigrate() (success bool, err error)
	// ninjas
	GetNinja(id uint) (ninja types.Ninja, err error)
	InsertNinja(ninja types.Ninja) (insertedNinja types.Ninja, err error)
	UpdateNinja(id uint, updates types.Ninja) (updatedNinja types.Ninja, err error)
	DeleteNinja(id uint) (deletedNinja types.Ninja, err error)
	// jutsus
	GetJutsu(id uint) (jutsu types.Jutsu, err error)
	InsertJutsu(jutsu types.Jutsu) (insertedJutsu types.Jutsu, err error)
	UpdateJutsu(id uint, updates types.Jutsu) (updatedJutsu types.Jutsu, err error)
	DeleteJutsu(id uint) (deletedJutsu types.Jutsu, err error)
	// ninjas_jutsus
	AddKnownJutsu(ninjaID uint, jutsuID uint) (success bool, err error)
	RemoveKnownJutsu(ninjaID uint, jutsuID uint) (success bool, err error)
	GetNinjaWithRelatedJutsu(id uint) (ninjaWithRelatedJutsu types.Ninja, err error)
	GetJutsuWithRelatedNinja(id uint) (jutsuWithRelatedNinja types.Jutsu, err error)
}

// PGDAL -- implementation of IPGDAL interface
type PGDAL struct {
	url  string
	pgdb *gorm.DB
}

// ---
// connection
// ---

// // PGDB -- database connection
// var PGDB *gorm.DB

// GetConnectionString -- load env vars and format into connection string
func (pgdal *PGDAL) GetConnectionString() (err error) {
	// use env
	user := os.Getenv("PG_USER")
	pw := os.Getenv("PG_PW")
	loc := os.Getenv("PG_LOC")
	db := os.Getenv("PG_DB")
	for _, part := range []string{user, pw, loc, db} {
		if len(part) == 0 {
			err = errors.New("could not format connection string, check environment variables")
			fmt.Println(err)
			return
		}
	}
	// format conn string
	connString := fmt.Sprintf("postgres://%s:%s@%s/%s", user, pw, loc, db)
	fmt.Println("Postgres connection string")
	fmt.Println(connString)
	pgdal.url = connString
	return
}

// ---
// connect to db
// ---

// GetConnection -- get connection string and create connection
func (pgdal *PGDAL) GetConnection() (err error) {
	err = pgdal.GetConnectionString()
	if err != nil {
		return
	}
	pgdal.pgdb, err = gorm.Open(postgres.Open(pgdal.url), &gorm.Config{})
	return
}

// AutoMigrate -- auto migrate models
func (pgdal *PGDAL) AutoMigrate() (success bool, err error) {
	// migrate
	err = pgdal.pgdb.AutoMigrate(&types.Ninja{}, &types.Jutsu{}, &types.NinjaJutsu{})
	if err != nil {
		success = false
		return
	}
	// set up join table
	err = pgdal.pgdb.SetupJoinTable(&types.Ninja{}, "Jutsus", &types.NinjaJutsu{})
	success = true
	return
}

// ---
// ninja
// ---

// GetNinja -- db method
func (pgdal *PGDAL) GetNinja(id uint) (ninja types.Ninja, err error) {
	result := pgdal.pgdb.Find(&ninja, id)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// InsertNinja -- db method
func (pgdal *PGDAL) InsertNinja(ninja types.Ninja) (insertedNinja types.Ninja, err error) {
	// insert ninja
	result := pgdal.pgdb.Create(&ninja)
	err = result.Error
	if err != nil {
		return
	}
	insertedNinjaID := ninja.ID

	// return inserted ninja
	result = pgdal.pgdb.Find(&insertedNinja, insertedNinjaID)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// UpdateNinja -- db method
func (pgdal *PGDAL) UpdateNinja(id uint, updates types.Ninja) (updatedNinja types.Ninja, err error) {
	// update ninja
	result := pgdal.pgdb.Model(&types.Ninja{}).Where(types.Ninja{ID: id}).Updates(updates)
	err = result.Error
	if err != nil {
		return
	}
	// get updated ninja
	result = pgdal.pgdb.Find(&updatedNinja, id)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// DeleteNinja -- db method
func (pgdal *PGDAL) DeleteNinja(id uint) (deletedNinja types.Ninja, err error) {
	// get ninja that will be deleted
	result := pgdal.pgdb.Find(&deletedNinja, id)
	err = result.Error
	if err != nil {
		return
	}
	// delete ninja
	result = pgdal.pgdb.Delete(&types.Ninja{}, id)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// ---
// jutsu
// ---

// GetJutsu -- db method
func (pgdal *PGDAL) GetJutsu(id uint) (jutsu types.Jutsu, err error) {
	result := pgdal.pgdb.Find(&jutsu, id)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// InsertJutsu -- db method
func (pgdal *PGDAL) InsertJutsu(jutsu types.Jutsu) (insertedJutsu types.Jutsu, err error) {
	// insert jutsu
	result := pgdal.pgdb.Create(&jutsu)
	err = result.Error
	if err != nil {
		return
	}
	insertedJutsuID := jutsu.ID

	// return inserted jutsu
	result = pgdal.pgdb.Find(&insertedJutsu, insertedJutsuID)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// UpdateJutsu -- db method
func (pgdal *PGDAL) UpdateJutsu(id uint, updates types.Jutsu) (updatedJutsu types.Jutsu, err error) {
	// update jutsu
	result := pgdal.pgdb.Model(&types.Jutsu{}).Where(types.Jutsu{ID: id}).Updates(updates)
	err = result.Error
	if err != nil {
		return
	}
	// get updated jutsu
	result = pgdal.pgdb.Find(&updatedJutsu, id)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// DeleteJutsu -- db method
func (pgdal *PGDAL) DeleteJutsu(id uint) (deletedJutsu types.Jutsu, err error) {
	// get jutsu that will be deleted
	result := pgdal.pgdb.Find(&deletedJutsu, id)
	err = result.Error
	if err != nil {
		return
	}
	// delete jutsu
	result = pgdal.pgdb.Delete(&types.Jutsu{}, id)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// ---
// ninjas_jutsus
// ---

// GetNinjaWithRelatedJutsu -- db method
func (pgdal *PGDAL) GetNinjaWithRelatedJutsu(id uint) (ninjaWithRelatedJutsu types.Ninja, err error) {
	result := pgdal.pgdb.Preload("Jutsus").Find(&ninjaWithRelatedJutsu, id)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// GetJutsuWithRelatedNinja -- db method
func (pgdal *PGDAL) GetJutsuWithRelatedNinja(id uint) (jutsuWithRelatedNinja types.Jutsu, err error) {
	result := pgdal.pgdb.Preload("Ninjas").Find(&jutsuWithRelatedNinja, id)
	err = result.Error
	if err != nil {
		return
	}
	return
}

// AddKnownJutsu -- db method
func (pgdal *PGDAL) AddKnownJutsu(ninjaID uint, jutsuID uint) (success bool, err error) {
	association := types.NinjaJutsu{
		NinjaID: ninjaID,
		JutsuID: jutsuID,
	}
	// insert ninja
	result := pgdal.pgdb.Create(&association)
	err = result.Error
	if err != nil {
		success = false
		return
	}
	success = true
	return
}

// RemoveKnownJutsu -- db method
func (pgdal *PGDAL) RemoveKnownJutsu(ninjaID uint, jutsuID uint) (success bool, err error) {
	association := types.NinjaJutsu{
		NinjaID: ninjaID,
		JutsuID: jutsuID,
	}
	// find association to delete
	result := pgdal.pgdb.Where(&association).Find(&association)
	err = result.Error
	if err != nil {
		success = false
		return
	}
	// delete it
	result = pgdal.pgdb.Delete(&types.NinjaJutsu{}, association.ID)
	err = result.Error
	if err != nil {
		success = false
		return
	}
	success = true
	return
}
