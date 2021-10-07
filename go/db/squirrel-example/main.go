package main

import (
	"errors"
	"fmt"
	"log"
	"os"
	"runtime"
	"squirrel-example/dal/pg"
	"squirrel-example/types"

	"github.com/joho/godotenv"
)

// ---
// main
// ---

func main() {

	// ---
	// setup
	// ---

	getRuntimeDetails()
	// get connection string
	loadDotenv()
	connString, err := getConnectionString()
	if err != nil {
		log.Fatal(err)
	}
	// get client
	PostgresDal := &pg.PostgresDAL{}
	PostgresDal.GetClient(connString)

	// ---
	// CRUD
	// ---

	// create ninja
	ninja, err := PostgresDal.CreateNinja(types.NinjaNew{
		FirstName: "Kakashi",
		LastName:  "Hatake",
		Age:       27,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Create ninja")
	fmt.Printf("%+v\n", ninja)

	// select ninja
	ninjaID := ninja.ID
	ninja, err = PostgresDal.GetNinja(ninjaID)
	if err != nil {
		panic(err)
	}
	fmt.Println("Select ninja")
	fmt.Printf("%+v\n", ninja)

	// update ninja
	updates := types.NinjaNew{
		FirstName: "Kaka",
		LastName:  "Sensei",
	}
	ninja, err = PostgresDal.UpdateNinja(ninjaID, updates)
	if err != nil {
		panic(err)
	}
	fmt.Println("Update ninja")
	fmt.Printf("%+v\n", ninja)

	// create jutsu
	jutsu, err := PostgresDal.CreateJutsu(types.JutsuNew{
		Name:         "Chidori",
		ChakraNature: "Lightning",
		Description:  "Plover / a thousand birds",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Create jutsu")
	fmt.Printf("%+v\n", jutsu)

	// select jutsu
	jutsuID := jutsu.ID
	jutsu, err = PostgresDal.GetJutsu(jutsuID)
	if err != nil {
		panic(err)
	}
	fmt.Println("Select jutsu")
	fmt.Printf("%+v\n", jutsu)

	// update jutsu
	jutsu, err = PostgresDal.UpdateJutsu(jutsuID, types.JutsuNew{
		Description: "Lightning blade",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Update jutsu")
	fmt.Printf("%+v\n", jutsu)

	// create relation ninja + jutsu
	_, err = PostgresDal.CreateNinjaJutsu(ninjaID, jutsuID)
	if err != nil {
		panic(err)
	}
	fmt.Println("Associate ninja & jutsu")

	// get ninja with jutsu
	// TODO

	// delete relation
	_, err = PostgresDal.DeleteNinjaJutsu(ninjaID, jutsuID)
	if err != nil {
		panic(err)
	}
	fmt.Println("Remove association for ninja & jutsu")

	// delete ninja
	ninja, err = PostgresDal.DeleteNinja(ninjaID)
	if err != nil {
		panic(err)
	}
	fmt.Println("Delete ninja")
	fmt.Printf("%+v\n", ninja)

	// delete jutsu
	jutsu, err = PostgresDal.DeleteJutsu(jutsuID)
	if err != nil {
		panic(err)
	}
	fmt.Println("Delete jutsu")
	fmt.Printf("%+v\n", jutsu)

}

// ---
// helper func
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
	fmt.Printf("%+v\n", RuntimeDetails{
		Os:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		CPUs:    runtime.NumCPU(),
		Version: runtime.Version(),
	})
}
