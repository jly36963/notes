package main

import (
	"fmt"
	"log"
	"runtime"
	"strings"
)

func main() {
	// runtime
	fmt.Println(strings.ToUpper("runtime details"))
	getRuntimeDetails()

	// fmt
	fmt.Println(strings.ToUpper("fmt"))
	useFmt()

	// log
	fmt.Println(strings.ToUpper("log"))
	useLog()

	// strings
	fmt.Println(strings.ToUpper("strings"))
	useStrings()
}

// ---
// runtime details
// ---

func getRuntimeDetails() {
	// get runtime details (string slice)
	details := []string{
		fmt.Sprintf("os: %v", runtime.GOOS),
		fmt.Sprintf("arch: %v", runtime.GOARCH),
		fmt.Sprintf("CPUs: %v", runtime.NumCPU()),
		fmt.Sprintf("GR: %v", runtime.NumGoroutine()),
		fmt.Sprintf("v: %v", runtime.Version()),
	}
	// print each detail (for loop)
	for _, d := range details {
		fmt.Println(d)
	}
}

// ---
// fmt
// ---

// https://golang.org/pkg/fmt/

// format verbs
// %s -- string
// %v -- default value
// %+v -- struct with field names
// %#v -- golang representation
// %T -- golang type
// %d -- integer (base 10)
// %f -- floating point
// %e -- floating point (decimal notation)

func useFmt() {
	// Println
	fmt.Println("Hello world!") // print string
	// Sprintf
	name := "Kakashi"
	greeting := fmt.Sprintf("Hello %s!", name)
	fmt.Println(greeting)
	// Printf
	firstName := "Itachi"
	fmt.Printf("Hello %s!", firstName)

}

// ---
// log
// ---

// in many cases, it's like fmt.Print but with a date in front

/*

// Fatal -- Print() + os.Exit(1)
log.Fatal("Error!")
// Fatalf -- Printf() + os.Exit(1)
log.Fatalf("Error occured at %v", time.Now())
// Fatalln -- Println() + os.Exit(1)
log.Fatalln("Error!")

*/

func useLog() {
	// Println
	log.Println("Hello World!")
	// Printf
	firstName := "Itachi"
	log.Printf("Hello %s!", firstName)
}

// ---
// strings
// ---

func useStrings() {

	// Compare -- just use comparison operators (==, <, >, etc)
	comparison := strings.Compare("Kakashi", "Obito") // -1, 0, or 1
	// Contains
	containsSubstring := strings.Contains("Kakashi", "Kaka") // boolean
	// ContainsAny
	containsAnyChars := strings.ContainsAny("Kakashi", "ak") // boolean
	// HasPrefix
	hasPrefix := strings.HasPrefix("Kakashi", "Kaka") // boolean
	// HasSuffix
	hasSuffix := strings.HasSuffix("Kakashi", "hi") // boolean
	// Index (also LastIndex)
	indexFound := strings.Index("Kakashi", "hi") // int (-1 if not found)
	// IndexAny (also LastIndexAny)
	indexOfAny := strings.IndexAny("Kakashi", "ka") // int (-1 if none found)
	// Join
	joinedStringSlice := strings.Join([]string{"Kakashi", "Hashirama"}, ", ") // string
	// Replace
	replacedOnce := strings.Replace("kakashi", "k", "K", 1) // string
	// ReplaceAll
	replacedAll := strings.ReplaceAll("KAkAshi HAtAke", "A", "a") // string
	// Split
	stringSlice := strings.Split("Kakashi, Yamato, Hashirama, Iruka", ", ") // []string
	// Title
	titleCase := strings.Title("kakashi") // string
	// ToLower
	lowerCase := strings.ToLower("Kakashi") // string
	// ToUpper
	upperCase := strings.ToUpper("kakashi") // string
	// Trim (also TrimLeft, TrimRight)
	trimmed := strings.Trim("   Kakashi   ", " ") // string

	fmt.Println(
		"comparison", comparison,
		"containsSubstring", containsSubstring,
		"containsAnyChars", containsAnyChars,
		"hasPrefix", hasPrefix,
		"hasSuffix", hasSuffix,
		"indexFound", indexFound,
		"indexOfAny", indexOfAny,
		"joinedStringSlice", joinedStringSlice,
		"replacedOnce", replacedOnce,
		"replacedAll", replacedAll,
		"stringSlice", stringSlice,
		"titleCase", titleCase,
		"lowerCase", lowerCase,
		"upperCase", upperCase,
		"trimmed", trimmed,
	)
}
