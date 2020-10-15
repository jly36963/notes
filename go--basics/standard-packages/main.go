package main

import (
	"encoding/json"
	"fmt"
	"log"
	"runtime"
	"strings"
	"time"
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

	// json
	fmt.Println(strings.ToUpper("json"))
	useJson()

	// time
	fmt.Println(strings.ToUpper("time"))
	useTime()

	// path
	fmt.Println(strings.ToUpper("path"))
	usePath()
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

// ---
// json
// ---

type Person struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func useJson() {

	// struct -> []byte
	bytes, _ := json.Marshal(Person{
		FirstName: "Kakashi",
		LastName:  "Hatake",
	})
	// []byte -> struct
	var person Person
	err := json.Unmarshal(bytes, &person)
	if err != nil {
		fmt.Println("Error while parsing")
	}
	// print struct
	fmt.Println(fmt.Sprintf("%+v", person))
	// pretty print
	formattedBytes, _ := json.MarshalIndent(Person{
		FirstName: "Kakashi",
		LastName:  "Hatake",
	}, "", "  ")
	fmt.Println(fmt.Sprintf("%s", formattedBytes))
	// valid json
	isValid := json.Valid(formattedBytes) // boolean
	fmt.Println("isValid", isValid)
}

// ---
// time
// ---

func useTime() {
	// Date
	date := time.Date(2020, 10, 11, 12, 0, 0, 0, time.UTC)
	// Now
	now := time.Now()
	// Hour (Nanosecond, Second, Minute, Hour, Day, Weekday, Month, Year, YearDay)
	hour := time.Now().Hour()
	// Since
	beginning := time.Now()
	sinceDuration := time.Since(beginning) // duration
	// Until
	untilDuration := time.Until(time.Now().Add(time.Hour)) // duration
	// ParseDuration
	parsedDuration, _ := time.ParseDuration("4h30m")
	// Hours (also Nanoseconds, Microseconds, Milliseconds, Seconds, Minutes)
	hours := parsedDuration.Hours()
	// Add (time.Second, time.Minute, time.Hour)
	tomorrow := time.Now().Add(time.Hour * 24) // add time to a date
	// Sub
	start := time.Now()
	end := time.Now()
	difference := end.Sub(start) // difference between dates
	// AddDate
	newDate := time.Now().AddDate(3, 2, 1) // add 3 years, 2 months, 1 day
	// Before
	before := time.Now().Before(time.Now().Add(time.Hour)) // now is before now + 1hr
	// After
	after := time.Now().After(time.Now().Add(time.Hour * -1)) // now is after now - 1hr
	// Format
	formattedDate := time.Now().Format(time.RFC3339)
	// In
	timeSomewhereElse := time.Now().In(time.UTC)
	// Unix
	dateFromUnixTimestamp := time.Unix(1602745919, 0) // (s, ns) => date
	// Round
	pd, _ := time.ParseDuration("1h15m10s")
	roundedDuration := pd.Round(time.Minute)

	fmt.Println(
		"date", date,
		"now", now,
		"hour", hour,
		"sinceDuration", sinceDuration,
		"untilDuration", untilDuration,
		"parsedDuration", parsedDuration,
		"hours", hours,
		"tomorrow", tomorrow,
		"difference", difference,
		"newDate", newDate,
		"before", before,
		"after", after,
		"formattedDate", formattedDate,
		"timeSomewhereElse", timeSomewhereElse,
		"dateFromUnixTimestamp", dateFromUnixTimestamp,
		"roundedDuration", roundedDuration,
	)
}

// ---
// path
// ---

func usePath() {

}
