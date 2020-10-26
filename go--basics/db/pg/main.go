package main

import (
	// standard packages
	"encoding/json"
	"fmt"
	"log"
	"os"
	"runtime"
	"strings"
	"time"

	// external packages
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/joho/godotenv"
)

// ---
// main
// ---

func main() {
	// runtime
	getRuntimeDetails()
	// dotenv
	loadDotenv()
	// pg
	usePg()
}

// ---
// helper func (dotenv)
// ---

func loadDotenv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// ---
// helper func
// ---

func bulkPrint(args ...interface{}) {
	for _, a := range args {
		fmt.Println(a)
	}
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

// ---------
// notes
// ---------

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

func getRuntimeDetails() {
	printSectionTitle("runtime")

	fmt.Printf("%+v\n", RuntimeDetails{
		Os:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		CPUs:    runtime.NumCPU(),
		Version: runtime.Version(),
	})
}

// ---
// pg
// ---

// Person : db model
type Person struct {
	ID        int64     `pg:"id,pk"`
	FirstName string    `pg:"first_name,notnull"`
	LastName  string    `pg:"last_name,notnull"`
	CreatedAt time.Time `pg:"created_at"`
	UpdatedAt time.Time `pg:"updated_at"`
	DeletedAt time.Time `pg:"deleted_at,soft_delete"`
}

func usePg() {
	// ---
	// connect to db
	// ---

	db := pg.Connect(&pg.Options{
		Addr:     ":5432",
		User:     os.Getenv("PG_USER"),
		Password: os.Getenv("PG_PW"),
		Database: os.Getenv("PG_DB"),
	})

	defer db.Close()

	// ---
	// create table
	// ---

	if err := db.Model((*Person)(nil)).CreateTable(&orm.CreateTableOptions{
		IfNotExists: true,
	}); err != nil {
		fmt.Println("Error while creating table")
		fmt.Println(err)
		return
	}

	// ---
	// create (insert)
	// ---

	person1 := &Person{
		FirstName: "Kakashi",
		LastName:  "Hatake",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		DeletedAt: time.Time{},
	}
	person2 := &Person{
		FirstName: "Hiruzen",
		LastName:  "Sarutobi",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		DeletedAt: time.Time{},
	}
	people := []*Person{person1, person2}

	// insert multiple (alternative syntax)
	if _, err := db.Model(&people).Returning("*").Insert(); err != nil {
		fmt.Println("Error while inserting")
		fmt.Println(err)
		return
	}

	/*
		// insert multiple (alternative syntax)
		if _, err := db.Model(person1, person2).Insert(); err != nil {
			fmt.Println("Error while inserting")
			fmt.Println(err)
			return
		}


		if _, err := db.Model(people).Returning("*").Insert(); err != nil {
			fmt.Println("Error while inserting")
			fmt.Println(err)
			return
		}

	*/

	/*
		// insert one record
		if _, err := db.Model(person1).Returning("*").Insert(); err != nil {
			fmt.Println("Error while inserting")
			fmt.Println(err)
			return
		}
	*/

	// ---
	// read (select) (all)
	// ---

	selectedPeople := []Person{}
	if err := db.Model(&selectedPeople).Select(); err != nil {
		fmt.Println("Error while fetching (many)")
		fmt.Println(err)
		return
	}

	// ---
	// read (select) (all) (count)
	// ---

	count, err := db.Model((*Person)(nil)).Count()
	if err != nil {
		fmt.Println("Error while counting")
		fmt.Println(err)
		return
	}

	// ---
	// read (select) (primary key)
	// ---

	selectedPerson := &Person{ID: person1.ID}
	if err := db.Model(selectedPerson).WherePK().Select(); err != nil {
		fmt.Println("Error while fetching (one)")
		fmt.Println(err)
		return
	}

	// ---
	// update
	// ---

	person1.FirstName = "Kaka"
	person1.LastName = "Sensei"
	person1.UpdatedAt = time.Now()

	fmt.Println("person1", person1)

	if _, err := db.Model(person1).WherePK().Update(); err != nil {
		fmt.Println("Error while updating")
		fmt.Println(err)
		return
	}

	// ---
	// delete (soft delete)
	// ---

	// soft delete
	if _, err := db.Model(&people).WherePK().Delete(); err != nil {
		fmt.Println("Error while deleting")
		fmt.Println(err)
		return
	}

	// count
	postSoftDeleteCount, err := db.Model(&Person{}).Count()
	if err != nil {
		fmt.Println("Error while counting")
		fmt.Println(err)
		return
	}

	// undo soft delete
	restoredPeople := []*Person{person1, person2}

	person1.DeletedAt = time.Time{}
	person1.UpdatedAt = time.Now()
	person2.DeletedAt = time.Time{}
	person2.UpdatedAt = time.Now()

	if _, err := db.Model(&restoredPeople).WherePK().Column("deleted_at", "updated_at").Update(); err != nil {
		fmt.Println("Error while updating")
		fmt.Println(err)
		return
	}

	// count
	postRestoreCount, err := db.Model(&Person{}).Count()
	if err != nil {
		fmt.Println("Error while counting")
		fmt.Println(err)
		return
	}

	// real delete
	if _, err := db.Model(&people).WherePK().ForceDelete(); err != nil {
		fmt.Println("Error while deleting (hard)")
		fmt.Println(err)
		return
	}

	// count
	postHardDeleteCount, err := db.Model(&Person{}).Count()
	if err != nil {
		fmt.Println("Error while counting")
		fmt.Println(err)
		return
	}

	// ---
	// json
	// ---

	peopleJSON, err := json.MarshalIndent(people, "", "  ")
	if err != nil {
		fmt.Println("Error while stringifying")
		fmt.Println(err)
		return
	}
	updatedPersonJSON, err := json.MarshalIndent(person1, "", "  ")
	if err != nil {
		fmt.Println("Error while stringifying")
		fmt.Println(err)
		return
	}

	restoredPeopleJSON, err := json.MarshalIndent(restoredPeople, "", "  ")
	if err != nil {
		fmt.Println("Error while stringifying")
		fmt.Println(err)
		return
	}

	// ---
	// drop table
	// ---

	if err := db.Model((*Person)(nil)).DropTable(&orm.DropTableOptions{
		IfExists: true,
		Cascade:  true,
	}); err != nil {
		fmt.Println("Error while dropping table")
		fmt.Println(err)
		return
	}

	// ---
	// print results
	// ---

	bulkPrint(
		"people", people,
		"count", count,
		"postSoftDeleteCount", postSoftDeleteCount,
		"postRestoreCount", postRestoreCount,
		"postHardDeleteCount", postHardDeleteCount,
		"people", string(peopleJSON),
		"updatedPersonJSON", string(updatedPersonJSON),
		"restoredPeople", string(restoredPeopleJSON),
	)

}
