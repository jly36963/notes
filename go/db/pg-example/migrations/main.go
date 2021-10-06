package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/go-pg/migrations/v8"
	"github.com/go-pg/pg/v10"
	"github.com/joho/godotenv"
)

const usageText = `This program runs command on the db. Supported commands are:
  - init - creates version info table in the database
  - up - runs all available migrations.
  - up [target] - runs available migrations up to the target one.
  - down - reverts last migration.
  - reset - reverts all migrations.
  - version - prints current db version.
  - set_version [version] - sets db version without running migrations.

Usage:
  go run *.go <command> [args]
`

// based on -- https://github.com/go-pg/migrations/blob/v8/example/main.go

// ---
// main
// ---

func main() {
	flag.Usage = usage
	flag.Parse()

	// load .env
	LoadDotenv()

	// get db from mpgdal
	mpgdal := &MPGDAL{}
	err := mpgdal.GetConnection()
	if err != nil {
		fmt.Println("error while getting pg connection")
		panic(err)
	}
	err = mpgdal.TestConnection()
	if err != nil {
		fmt.Println("Error while testing pg connection")
		panic(err)
	}
	db := mpgdal.db
	defer db.Close()

	// migrate
	oldVersion, newVersion, err := migrations.Run(db, flag.Args()...)
	if err != nil {
		exitf(err.Error())
	}
	if newVersion != oldVersion {
		fmt.Printf("migrated from version %d to %d\n", oldVersion, newVersion)
	} else {
		fmt.Printf("version is %d\n", oldVersion)
	}
}

// ---
// helpers
// ---

func usage() {
	fmt.Print(usageText)
	flag.PrintDefaults()
	os.Exit(2)
}

func errorf(s string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, s+"\n", args...)
}

func exitf(s string, args ...interface{}) {
	errorf(s, args...)
	os.Exit(1)
}

// ---
// connection
// ---

// IMPGDAL -- migration pgdal interface
type IMPGDAL interface {
	// connection
	GetConnectionString() error
	GetConnection() error
	TestConnection() error
}

// MPGDAL -- migration pgdal instance
type MPGDAL struct {
	url    string
	config *pg.Options
	db     *pg.DB
}

// LoadDotenv -- load env vars from .env file
func LoadDotenv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// GetConnectionString -- get pg config from env vars
func (mpgdal *MPGDAL) GetConnectionString() (err error) {
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
	mpgdal.url = url
	return
}

// GetConnection -- get db connection using pg config
func (mpgdal *MPGDAL) GetConnection() (err error) {
	// get connection string
	err = mpgdal.GetConnectionString()
	if err != nil {
		return
	}
	// get config
	mpgdal.config, err = pg.ParseURL(mpgdal.url)
	if err != nil {
		return
	}
	// connect
	db := pg.Connect(mpgdal.config)
	// set db
	mpgdal.db = db
	return
}

// TestConnection -- test db connection
func (mpgdal *MPGDAL) TestConnection() (err error) {
	ctx := context.Background()
	if err = mpgdal.db.Ping(ctx); err != nil {
		return
	}
	return
}
