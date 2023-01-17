package main

import (
	"fmt"
	"runtime"
	"strings"

	"github.com/asaskevich/govalidator"
)

// ---
// main
// ---

func main() {
	// runtime
	getRuntimeDetails()
	// govalidator
	useGovalidator()
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
// govalidator
// ---

func useGovalidator() {
	printSectionTitle("govalidator")

	// ---
	// transform
	// ---

	// CamelCaseToUnderscore
	// ReplacePattern
	// Reverse
	// Trim
	// UnderscoreToCamelCase

	// ---
	// validate
	// ---

	// https://github.com/asaskevich/govalidator#list-of-functions

	// Contains
	contains := govalidator.Contains("Kakashi", "Kaka") // true
	// HasLowerCase
	hasLowerCase := govalidator.HasLowerCase("Kakashi") // true
	// HasUpperCase
	hasUpperCase := govalidator.HasUpperCase("Kakashi") // true
	// HasWhitespace
	hasWhitespace := govalidator.HasWhitespace("Kakashi Hatake") // true
	// InRange
	inRange := govalidator.InRange(5, 0, 10) // true
	// IsASCII
	isASCII := govalidator.IsASCII("Hello") // true
	// IsAlpha
	isAlpha := govalidator.IsAlpha("Hiruzen") // true
	// IsAlphanumeric
	isAlphanumeric := govalidator.IsAlphanumeric("Hiruzen") // true
	// IsCIDR
	isCIDR := govalidator.IsCIDR("192.168.100.14/24") // true
	// IsEmail
	isEmail := govalidator.IsEmail("Yamato@gmail.com") // true
	// IsIP
	isIP := govalidator.IsIP("0.0.0.0") // true
	// IsISBN
	isISBN := govalidator.IsISBN("0738095236881", 13) // true
	// IsIn
	members := []string{"Kakashi", "Obito", "Itachi", "Hiruzen", "Hashirama"}
	isIn := govalidator.IsIn("Kakashi", members...) // true
	// IsInt
	isInt := govalidator.IsInt("3") // true
	// IsJSON
	isJSON := govalidator.IsJSON(`{ "name": "Kakashi" }`) // true
	// IsSHA256
	sha := "3c79f858976a783fcccc89d10b9191c1bb2c781b0f421beacc1e5f78a8b89b87"
	isSHA256 := govalidator.IsSHA256(sha) // true
	// IsSSN
	isSSN := govalidator.IsSSN("555-66-4444") // true
	// IsUUID
	isUUID := govalidator.IsUUID("d6a58f8e-bf61-4aa4-98f5-fba99a540fb1") // true

	// ---
	// utility
	// ---

	// Each
	// Filter
	// Find
	// Map
	// Reduce
	// Some

	// print results
	bulkPrint(
		"contains", contains,
		"hasLowerCase", hasLowerCase,
		"hasUpperCase", hasUpperCase,
		"hasWhitespace", hasWhitespace,
		"inRange", inRange,
		"isASCII", isASCII,
		"isAlpha", isAlpha,
		"isAlphanumeric", isAlphanumeric,
		"isCIDR", isCIDR,
		"isEmail", isEmail,
		"isIP", isIP,
		"isISBN", isISBN,
		"isIn", isIn,
		"isInt", isInt,
		"isJSON", isJSON,
		"isSHA256", isSHA256,
		"isSSN", isSSN,
		"isUUID", isUUID,
	)
}

// type
type Person struct {
	Name  string `json:"name"`
	Email string `json:"email" valid:"email"`
}
