package main

import (
	// standard packages
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"runtime"
	"strings"
	"time"

	// external packages
	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v4"
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
	useSquirrel()
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

func rowsToMap(rows pgx.Rows) (resultMap []map[string]interface{}) {
	for rows.Next() {
		// get column names
		fds := rows.FieldDescriptions() // []pgproto3.FieldDescription
		columns := []string{}
		for _, fd := range fds {
			column := string(fd.Name)         // get column name
			columns = append(columns, column) // append
		}
		// get values
		values, vErr := rows.Values()
		if vErr != nil {
			fmt.Println("vErr", vErr)
		}
		//  create person
		person := make(map[string]interface{})
		for i := range columns {
			k := columns[i]
			v := values[i]
			person[k] = v
		}
		resultMap = append(resultMap, person)
	}
	return resultMap
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

func useSquirrel() {
	// ---
	// connect to db
	// ---

	connString, err := getConnectionString()
	if err != nil {
		log.Fatal(err)
	}
	db, err := pgx.Connect(context.Background(), connString)
	if err != nil {
		fmt.Println(err)
		log.Fatal("could not connect to db")
	}
	defer db.Close(context.Background())

	// ---
	// create table
	// ---

	_, createErr := db.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS persons (
			id SERIAL PRIMARY KEY,
			first_name varchar(255) NOT NULL,
			last_name varchar(255) NOT NULL,
			created_at timestamp,
			updated_at timestamp,
			deleted_at timestamp
		);`,
	)
	if createErr != nil {
		fmt.Println("Error while creating table")
		fmt.Println(createErr)
		return
	}

	// ---
	// query builder base
	// ---

	qb := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

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

	people := []map[string]interface{}{person1, person2}
	var insertedPeople []map[string]interface{}

	for _, person := range people {
		insertPersonQB := qb.Insert("persons").SetMap(person).Suffix(`RETURNING *`)
		insertPersonSQL, args, err := insertPersonQB.ToSql()
		fmt.Println("TCL: insertPersonSQL", insertPersonSQL)
		if err != nil {
			fmt.Println("Error while building sql")
			fmt.Println(err)
			return
		}
		rows, err := db.Query(context.Background(), insertPersonSQL, args...)
		if err != nil {
			fmt.Println("Error while inserting")
			fmt.Println(err)
			return
		}
		fmt.Println(rows)
		insertedPerson := rowsToMap(rows)[0]
		insertedPeople = append(insertedPeople, insertedPerson)
	}

	fmt.Println("TCL: insertedPeople", insertedPeople)

	// ---
	// read (select) (all)
	// ---

	selectedPeopleQB := qb.Select("*").From("persons").Where(sq.Eq{"deleted_at": nil})
	selectedPeopleSQL, _, err := selectedPeopleQB.ToSql()
	if err != nil {
		fmt.Println("error while building SQL statement")
		fmt.Println(err)
		return
	}
	rows, err := db.Query(context.Background(), selectedPeopleSQL)
	if err != nil {
		fmt.Println("error while fetching")
		fmt.Println(err)
		return
	}
	defer rows.Close()
	selectedPeople := rowsToMap(rows)

	// ---
	// read (count)
	// ---

	countPeopleQB := qb.Select("count(*)").From("persons").Where(sq.Eq{"deleted_at": nil})
	countPeopleSQL, _, err := countPeopleQB.ToSql()
	if err != nil {
		fmt.Println("error while building SQL statement")
		fmt.Println(err)
		return
	}
	rows, err = db.Query(context.Background(), countPeopleSQL)
	if err != nil {
		fmt.Println("error while counting")
		fmt.Println(err)
		return
	}
	defer rows.Close()
	count := rowsToMap(rows)[0]["count"]

	// ---
	// read (select) (one)
	// ---

	id := insertedPeople[0]["id"]
	selectedPersonQB := qb.Select("*").From("persons").Where(sq.Eq{"deleted_at": nil, "id": id})
	selectedPersonSQL, args, err := selectedPersonQB.ToSql()
	if err != nil {
		fmt.Println("error while building SQL statement")
		fmt.Println(err)
		return
	}
	rows, err = db.Query(context.Background(), selectedPersonSQL, args...)
	if err != nil {
		fmt.Println("error while fetching")
		fmt.Println(err)
		return
	}
	defer rows.Close()
	selectedPerson := rowsToMap(rows)[0]

	// ---
	// update
	// ---

	// "id" and "selectedPerson" declared/assigned above

	selectedPerson["first_name"] = "Kaka"
	selectedPerson["last_name"] = "Sensei"
	selectedPerson["updated_at"] = time.Now()
	updatedPersonQB := qb.Update("persons").Where(sq.Eq{"id": id}).SetMap(selectedPerson).Suffix("Returning *")
	updatedPersonSQL, args, err := updatedPersonQB.ToSql()
	if err != nil {
		fmt.Println("error while building SQL statement")
		fmt.Println(err)
		return
	}
	rows, err = db.Query(context.Background(), updatedPersonSQL, args...)
	if err != nil {
		fmt.Println("error while updating")
		fmt.Println(err)
		return
	}
	defer rows.Close()
	updatedPerson := rowsToMap(rows)[0]

	// ---
	// delete (soft delete & restore)
	// ---

	deletedPeople := []map[string]interface{}{}

	// soft delete

	for _, person := range insertedPeople {
		id := person["id"]
		now := time.Now()
		updates := map[string]interface{}{
			"id":         id,
			"updated_at": now,
			"deleted_at": now,
		}

		fmt.Println("id", id)
		updateQB := qb.Update("persons").Where(sq.Eq{"id": id}).SetMap(updates).Suffix(`Returning *`)
		updateSQL, args, err := updateQB.ToSql()
		if err != nil {
			fmt.Println("error while building SQL statement")
			fmt.Println(err)
			return
		}
		rows, err := db.Query(context.Background(), updateSQL, args...)
		if err != nil {
			fmt.Println("error while soft deleting")
			fmt.Println(err)
			return
		}
		defer rows.Close()
		deletedPerson := rowsToMap(rows)[0]
		deletedPeople = append(deletedPeople, deletedPerson)
	}

	// restore

	for _, person := range deletedPeople {
		id := person["id"]
		now := time.Now()
		updates := map[string]interface{}{
			"id":         id,
			"updated_at": now,
			"deleted_at": nil,
		}

		fmt.Println("id", id)
		updateQB := qb.Update("persons").Where(sq.Eq{"id": id}).SetMap(updates).Suffix(`Returning *`)
		updateSQL, args, err := updateQB.ToSql()
		if err != nil {
			fmt.Println("error while building SQL statement")
			fmt.Println(err)
			return
		}
		rows, err := db.Query(context.Background(), updateSQL, args...)
		if err != nil {
			fmt.Println("error while soft deleting")
			fmt.Println(err)
			return
		}
		defer rows.Close()
		deletedPerson := rowsToMap(rows)[0]
		deletedPeople = append(deletedPeople, deletedPerson)
	}

	// ---
	// delete (hard delete)
	// ---

	hardDeletedPeople := []map[string]interface{}{}

	for _, person := range insertedPeople {
		id := person["id"]

		deleteQB := qb.Delete("persons").Where(sq.Eq{"id": id}).Suffix(`Returning *`)
		deleteSQL, args, err := deleteQB.ToSql()
		if err != nil {
			fmt.Println("error while building SQL statement")
			fmt.Println(err)
			return
		}
		rows, err := db.Query(context.Background(), deleteSQL, args...)
		if err != nil {
			fmt.Println("error while soft deleting")
			fmt.Println(err)
			return
		}
		defer rows.Close()
		deletedPerson := rowsToMap(rows)[0]
		hardDeletedPeople = append(hardDeletedPeople, deletedPerson)
	}

	// ---
	// drop table
	// ---

	db.Exec(context.Background(), `DROP TABLE IF EXISTS persons;`)

	// ---
	// json
	// ---

	peopleJSON, err := json.MarshalIndent(people, "", "  ")
	if err != nil {
		fmt.Println("Error while stringifying")
		fmt.Println(err)
		return
	}
	insertedPeopleJSON, err := json.MarshalIndent(insertedPeople, "", "  ")
	if err != nil {
		fmt.Println("Error while stringifying")
		fmt.Println(err)
		return
	}
	selectedPeopleJSON, err := json.MarshalIndent(selectedPeople, "", "  ")
	if err != nil {
		fmt.Println("Error while stringifying")
		fmt.Println(err)
		return
	}
	selectedPersonJSON, err := json.MarshalIndent(selectedPerson, "", "  ")
	if err != nil {
		fmt.Println("Error while stringifying")
		fmt.Println(err)
		return
	}
	updatedPersonJSON, err := json.MarshalIndent(updatedPerson, "", "  ")
	if err != nil {
		fmt.Println("Error while stringifying")
		fmt.Println(err)
		return
	}

	// ---
	// print results
	// ---

	bulkPrint(
		"people", string(peopleJSON),
		"insertedPeople", string(insertedPeopleJSON),
		"selectedPeople", string(selectedPeopleJSON),
		"count", count,
		"selectedPerson", string(selectedPersonJSON),
		"updatedPerson", string(updatedPersonJSON),
	)

}
