package pgdal

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"go-pg-practice/types"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

// ---
// postgres
// ---

// IPGDAL -- describes DAL methods
type IPGDAL interface {
	// connection
	GetConnectionString() error
	GetConnection() error
	TestConnection() error
	InitAssociations()
	// ninjas
	GetNinja(id int) (ninja types.Ninja, err error)
	InsertNinja(ninja types.Ninja) (insertedNinja types.Ninja, err error)
	UpdateNinja(id int, updates types.Ninja) (updatedNinja types.Ninja, err error)
	DeleteNinja(id int) (deletedNinja types.Ninja, err error)
	// jutsus
	GetJutsu(id int) (jutsu types.Jutsu, err error)
	InsertJutsu(jutsu types.Jutsu) (insertedJutsu types.Jutsu, err error)
	UpdateJutsu(id int, updates types.Jutsu) (updatedJutsu types.Jutsu, err error)
	DeleteJutsu(id int) (deletedJutsu types.Jutsu, err error)
	// ninjas_jutsus
	AddKnownJutsu(ninjaID int, jutsuID int) (success bool, err error)
	RemoveKnownJutsu(ninjaID int, jutsuID int) (success bool, err error)
	GetNinjaWithRelatedJutsu(id int) (ninjaWithRelatedJutsu types.Ninja, err error)
	GetJutsuWithRelatedNinja(id int) (jutsuWithRelatedNinja types.Jutsu, err error)
}

// PGDAL -- implementation of IPGDAL interface
type PGDAL struct {
	url    string
	config *pg.Options
	db     *pg.DB
}

// ---
// connection
// ---

// GetConnectionString -- get pg config from env vars
func (pgdal *PGDAL) GetConnectionString() (err error) {
	// get env vars
	engine := "postgres"
	user := os.Getenv("PG_USER")
	password := os.Getenv("PG_PW")
	host := os.Getenv("PG_HOST")
	port := os.Getenv("PG_PORT")
	database := os.Getenv("PG_DB")
	ssl := os.Getenv("PG_SSL")
	// ensure not empty
	for _, part := range []string{engine, user, password, host, port, database, ssl} {
		if len(part) == 0 {
			err = errors.New("pg config missing values, check environment variables")
			fmt.Println(err)
			return
		}
	}
	// format connection url
	url := fmt.Sprintf("%s://%s:%s@%s:%s/%s", engine, user, password, host, port, database)
	if ssl != "true" {
		url = fmt.Sprintf("%s?sslmode=disable", url)
	}
	pgdal.url = url
	return
}

// GetConnection -- get db connection using pg config
func (pgdal *PGDAL) GetConnection() (err error) {
	// get connection string
	err = pgdal.GetConnectionString()
	if err != nil {
		return
	}
	// get config
	pgdal.config, err = pg.ParseURL(pgdal.url)
	if err != nil {
		return
	}
	// connect
	db := pg.Connect(pgdal.config)
	// set db
	pgdal.db = db
	return
}

// TestConnection -- test db connection
func (pgdal *PGDAL) TestConnection() (err error) {
	ctx := context.Background()
	if err = pgdal.db.Ping(ctx); err != nil {
		return
	}
	return
}

// InitAssociations -- initialize many to many join table relations
func (pgdal *PGDAL) InitAssociations() {
	orm.RegisterTable((*types.NinjaJutsu)(nil))
}

// ---
// helper functions
// ---

func getTimeUTC() (now time.Time) {
	loc, _ := time.LoadLocation("UTC")
	now = time.Now().In(loc)
	return
}

// ---
// ninja
// ---

// GetNinja -- db method
func (pgdal *PGDAL) GetNinja(id int) (ninja types.Ninja, err error) {
	ninja = types.Ninja{ID: id}
	if err = pgdal.db.Model(&ninja).WherePK().Select(); err != nil {
		fmt.Println(err)
		return
	}
	return
}

// InsertNinja -- db method
func (pgdal *PGDAL) InsertNinja(ninja types.Ninja) (insertedNinja types.Ninja, err error) {
	ninja.CreatedAt = getTimeUTC()
	if _, err = pgdal.db.Model(&ninja).Returning("*").Insert(); err != nil {
		fmt.Println(err)
		return
	}
	insertedNinja = ninja
	return
}

// UpdateNinja -- db method
func (pgdal *PGDAL) UpdateNinja(id int, updates types.Ninja) (updatedNinja types.Ninja, err error) {
	ninja := updates
	ninja.ID = id
	ninja.UpdatedAt = getTimeUTC()
	if _, err = pgdal.db.Model(&ninja).WherePK().UpdateNotZero(); err != nil {
		fmt.Println(err)
		return
	}
	updatedNinja = ninja
	return
}

// DeleteNinja -- db method
func (pgdal *PGDAL) DeleteNinja(id int) (deletedNinja types.Ninja, err error) {
	ninja := types.Ninja{ID: id}
	if _, err = pgdal.db.Model(&ninja).WherePK().Delete(); err != nil {
		fmt.Println(err)
		return
	}
	deletedNinja = ninja
	return
}

// ---
// jutsu
// ---

// GetJutsu -- db method
func (pgdal *PGDAL) GetJutsu(id int) (jutsu types.Jutsu, err error) {
	jutsu = types.Jutsu{ID: id}
	if err = pgdal.db.Model(&jutsu).WherePK().Select(); err != nil {
		fmt.Println(err)
		return
	}
	return
}

// InsertJutsu -- db method
func (pgdal *PGDAL) InsertJutsu(jutsu types.Jutsu) (insertedJutsu types.Jutsu, err error) {
	jutsu.CreatedAt = getTimeUTC()
	if _, err = pgdal.db.Model(&jutsu).Returning("*").Insert(); err != nil {
		fmt.Println(err)
		return
	}
	insertedJutsu = jutsu
	return
}

// UpdateJutsu -- db method
func (pgdal *PGDAL) UpdateJutsu(id int, updates types.Jutsu) (updatedJutsu types.Jutsu, err error) {
	jutsu := updates
	jutsu.ID = id
	jutsu.UpdatedAt = getTimeUTC()
	if _, err = pgdal.db.Model(&jutsu).WherePK().UpdateNotZero(); err != nil {
		fmt.Println(err)
		return
	}
	updatedJutsu = jutsu
	return
}

// DeleteJutsu -- db method
func (pgdal *PGDAL) DeleteJutsu(id int) (deletedJutsu types.Jutsu, err error) {
	jutsu := types.Jutsu{ID: id}
	if _, err = pgdal.db.Model(&jutsu).WherePK().Delete(); err != nil {
		fmt.Println(err)
		return
	}
	deletedJutsu = jutsu
	return
}

// ---
// ninjas_jutsus
// ---

// GetNinjaWithRelatedJutsu -- db method
func (pgdal *PGDAL) GetNinjaWithRelatedJutsu(id int) (ninjaWithRelatedJutsu types.Ninja, err error) {
	ninja := types.Ninja{ID: id}
	if err = pgdal.db.Model(&ninja).Relation("Jutsus").WherePK().Select(); err != nil {
		fmt.Println(err)
		return
	}
	ninjaWithRelatedJutsu = ninja
	return
}

// GetJutsuWithRelatedNinja -- db method
func (pgdal *PGDAL) GetJutsuWithRelatedNinja(id int) (jutsuWithRelatedNinja types.Jutsu, err error) {
	jutsu := types.Jutsu{ID: id}
	if err = pgdal.db.Model(&jutsu).Relation("Ninjas").WherePK().Select(); err != nil {
		fmt.Println(err)
		return
	}
	jutsuWithRelatedNinja = jutsu
	return
}

// AddKnownJutsu -- db method
func (pgdal *PGDAL) AddKnownJutsu(ninjaID int, jutsuID int) (success bool, err error) {
	ninjaJutsu := types.NinjaJutsu{
		NinjaID:   ninjaID,
		JutsuID:   jutsuID,
		CreatedAt: getTimeUTC(),
	}
	ninjaJutsu.CreatedAt = getTimeUTC()
	if _, err = pgdal.db.Model(&ninjaJutsu).Returning("*").Insert(); err != nil {
		fmt.Println(err)
		return
	}
	success = true
	return
}

// RemoveKnownJutsu -- db method
func (pgdal *PGDAL) RemoveKnownJutsu(ninjaID int, jutsuID int) (success bool, err error) {
	_, err = pgdal.db.Model(&types.NinjaJutsu{}).
		Where("ninja_id = ?", ninjaID).
		Where("jutsu_id = ?", jutsuID).
		Delete()
	if err != nil {
		fmt.Println(err)
		return
	}
	success = true
	return
}
