package main

import (
	// standard packages

	"encoding/json"
	"fmt"
	"log"
	"runtime"
	"strings"

	// external packages

	"github.com/joho/godotenv"

	// modules

	"mongo-practice/dal/mongodal"
	"mongo-practice/providers"
	"mongo-practice/types"
)

// ---
// main
// ---

func main() {
	// runtime
	getRuntimeDetails()
	// load .env
	loadDotenv()
	// get providers
	providers := getProviders()
	// use mongo
	useMongo(providers)

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
// providers
// ---

func getProviders() (p *providers.Providers) {
	p = &providers.Providers{
		MongoDAL: &mongodal.MongoDAL{},
	}
	// connect providers
	var err error
	err = p.MongoDAL.GetConnection()
	if err != nil {
		fmt.Println("error while getting connection")
		fmt.Println(err)
	}
	// return
	return
}

// ---
// gorm
// ---

func useMongo(providers *providers.Providers) {

	mongo := providers.MongoDAL

	// ---
	// insert ninja
	// ---

	insertedNinja, err := mongo.InsertNinja(types.Ninja{
		FirstName: "Kakashi",
		LastName:  "Hatake",
	})

	if err != nil {
		fmt.Println(err)
		return
	}

	// ---
	// select ninja
	// ---

	ninja, err := mongo.GetNinja(insertedNinja.ID)

	if err != nil {
		fmt.Println(err)
		return
	}

	// ---
	// update ninja
	// ---

	updatedNinja, err := mongo.UpdateNinja(insertedNinja.ID, types.Ninja{FirstName: "Kaka", LastName: "Sensei"})

	if err != nil {
		fmt.Println(err)
		return
	}

	// ---
	// insert jutsu
	// ---

	insertedJutsu, err := mongo.InsertJutsu(types.Jutsu{
		Name:         "Chidori",
		ChakraNature: "Lightning",
		Description:  "Lightning blade",
	})

	if err != nil {
		fmt.Println(err)
		return
	}

	// ---
	// associate ninja/jutsu
	// ---

	success, err := mongo.AddKnownJutsu(insertedNinja.ID, insertedJutsu.ID)

	if err != nil {
		fmt.Println(err)
		return
	}

	// ---
	// get ninja with jutsu
	// ---

	ninjaWithRelatedJutsu, err := mongo.GetNinjaWithRelatedJutsu(insertedNinja.ID)

	if err != nil {
		fmt.Println(err)
		return
	}

	// ---
	// print results
	// ---

	bulkPrint(
		"insertedNinja", stringify(insertedNinja),
		"ninja", stringify(ninja),
		"updatedNinja", stringify(updatedNinja),
		"insertedJutsu", stringify(insertedJutsu),
		"successfulAssociation", success,
		"ninjaWithRelatedJutsu", stringify(ninjaWithRelatedJutsu),
	)
}

// ---
// helper func
// ---

func stringify(thing ...interface{}) (str string) {
	thingAsJSON, err := json.MarshalIndent(thing, "", "  ")
	if err != nil {
		str = "Invalid input, could not stringify"
		return
	}
	str = string(thingAsJSON)
	return
}

func bulkPrint(args ...interface{}) {
	for _, a := range args {
		fmt.Println(a)
		fmt.Println("")
	}
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

func getRuntimeDetails() {
	printSectionTitle("runtime")

	fmt.Printf("%+v\n", types.RuntimeDetails{
		Os:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		CPUs:    runtime.NumCPU(),
		Version: runtime.Version(),
	})
}
