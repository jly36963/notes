package main

import (
	// standard packages

	"errors"
	"fmt"
	"log"
	"os"
	"runtime"
	"strings"
	"time"

	// external packages

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
	// gorm
	useGorm()
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

func getConnectionString() (connString string, err error) {
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
	connString = fmt.Sprintf("postgres://%s:%s@%s/%s", user, pw, loc, db)
	return
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
	ID        int64     `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt time.Time `json:"deleted_at"`
}

func useGorm() {
	// ---
	// connect to db
	// ---

	connString, err := getConnectionString()
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(connString)

	// ---
	// create table
	// ---

	// ---
	// query builder base
	// ---

	// ---
	// create (insert)
	// ---

	person1 := map[string]interface{}{
		"first_name": "Kakashi",
		"last_name":  "Hatake",
		"created_at": time.Now(),
		"updated_at": time.Now(),
		"deleted_at": nil,
	}

	person2 := map[string]interface{}{
		"first_name": "Hiruzen",
		"last_name":  "Sarutobi",
		"created_at": time.Now(),
		"updated_at": time.Now(),
		"deleted_at": nil,
	}

	fmt.Println(person1, person2)

	// ---
	// read (select) (all)
	// ---

	// ---
	// read (count)
	// ---

	// ---
	// read (select) (one)
	// ---

	// ---
	// update
	// ---

	// ---
	// delete (soft delete & restore)
	// ---

	// soft delete

	// restore

	// ---
	// delete (hard delete)
	// ---

	// ---
	// drop table
	// ---

	// ---
	// json
	// ---

	// ---
	// print results
	// ---

	bulkPrint(
		"Hello", "Hello",
	)

}
