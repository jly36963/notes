package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"time"
)

// ---
// main
// ---

func main() {
	// runtime
	printSectionTitle("runtime")
	getRuntimeDetails()
	// fmt
	printSectionTitle("fmt")
	useFmt()
	// log
	printSectionTitle("log")
	useLog()
	// strings
	printSectionTitle("strings")
	useStrings()
	// json
	printSectionTitle("json")
	useJson()
	// time
	printSectionTitle("time")
	useTime()
	// filepath
	printSectionTitle("filepath")
	useFilepath()
	// sort
	printSectionTitle("sort")
	useSort()
	// os
	printSectionTitle("os")
	useOs()
	// os (os.File)
	printSectionTitle("os (file)")
	useOsFile()
	// os (os/exec)
	printSectionTitle("exec")
	useExec()
	// math
	printSectionTitle("math")
	useMath()
	// net/http
	printSectionTitle("net/http (Get)")
	useNetHttpGet()
	printSectionTitle("net/http (Post)")
	useNetHttpPost()
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
	fmt.Printf("%+v\n", RuntimeDetails{
		Os:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		CPUs:    runtime.NumCPU(),
		Version: runtime.Version(),
	})
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

	// print results
	bulkPrint(
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

	// print results
	bulkPrint(
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
// path/filepath
// ---

// for os specific slash patterns, use `path/filepath` instead of `path`

func printFilePaths(path string) {
	fmt.Println("filepath.Walk()")
	filepath.Walk(path, func(path string, info os.FileInfo, err error) error {
		fmt.Println(path) // recursively print fp
		return nil
	})
}

func useFilepath() {
	fp := "client/build/index.html"
	// Base
	base := filepath.Base(fp) // string
	// Dir
	dir := filepath.Dir(fp) // string
	// Ext
	ext := filepath.Ext(fp) // string
	// IsAbs
	isAbs := filepath.IsAbs(fp) // boolean
	// Join
	cwd, _ := os.Getwd()                        // string, error
	joinedPath := filepath.Join(cwd, "main.go") // string
	// Match
	match, _ := filepath.Match("*.html", "index.html") // boolean, error
	// Split
	d, fn := filepath.Split(fp)

	// print results
	bulkPrint(
		"base", base,
		"dir", dir,
		"ext", ext,
		"isAbs", isAbs,
		"joinedPath", joinedPath,
		"match", match,
		"splitPath", d, fn,
	)

	// Walk
	printFilePaths("../")
}

// ---
// sort
// ---

func useSort() {
	// Float64s
	floats := []float64{5.2, -1.3, 0.7, -3.8, 2.6}
	sort.Float64s(floats)
	// Ints
	ints := []int{3, 2, 5, 4, 1}
	sort.Ints(ints)
	// Strings (case sensitive)
	strings := []string{"Kakashi", "Obito", "Itachi", "Hashirama"}
	sort.Strings(strings)

	// SliceStable
	s := []int{3, 2, 5, 4, 1}
	sort.SliceStable(s, func(i, j int) bool { return s[i] < s[j] })

	// Reverse
	letters := []string{"b", "c", "e", "a", "d"}
	sort.Sort(sort.Reverse(sort.StringSlice(letters)))

	// Search
	// *** will do later ***

	// print results
	bulkPrint(
		"floats", floats,
		"ints", ints,
		"strings", strings,
		"letters", letters,
		"s", s,
	)
}

// ---
// os
// ---

// https://golang.org/pkg/os/

/*

// Chdir
os.Chdir("../")

// Chmod
_ = os.Chmod("main.go", 0777) // chmod 777 main.go

// Clearenv
os.Clearenv() // clear env vars

// Exit
os.Exit(1) // exit with error

// Mkdir
_ = os.Mkdir("dir1", os.ModeDir) // (path string, perm FileMode) => error

// NewSyscallError
// ***

// Remove
_ = os.Remove("file.txt") // remove file or empty dir

// RemoveAll
_ = os.RemoveAll("dir1") // recursively remove until done or error

// Rename
_ = os.Rename("dir1", "dir2")

// Setenv
_ = os.Setenv("hello", "world") // hello=world

// Unsetenv
_ = os.Unsetenv("hello")

*/

func useOs() {
	// Getwd
	cwd, _ := os.Getwd()
	// Environ
	envVars := os.Environ() // []string ("key=value")
	// Getenv
	home := os.Getenv("HOME") // get value of env var
	// Getpid
	pid := os.Getpid() // int (pid of caller)
	// Hostname
	host, _ := os.Hostname()
	// LookupEnv
	user, foundEnvVar := os.LookupEnv("USER")
	// UserHomeDir
	homeDir, _ := os.UserHomeDir()

	// print results
	bulkPrint(
		"cwd", cwd,
		"len(envVars)", len(envVars),
		"home", home,
		"pid", pid,
		"host", host,
		"user", user, "foundEnvVar", foundEnvVar,
		"homeDir", homeDir,
	)
}

func useOsFile() {
	var f *os.File
	fn := "my-example-file.txt"

	// Create (will overwrite!)
	f, _ = os.Create(fn) // create/open
	name := f.Name()     // get name
	f.Close()            // close

	// Write
	f, _ = os.OpenFile(fn, os.O_WRONLY, os.ModePerm) // open for writing
	content := []byte("Hey Kakashi!")                // content to write
	n, _ := f.Write(content)                         // write
	f.Close()                                        // close

	// Read
	f, _ = os.Open(fn)       // open file
	b := make([]byte, n)     // receiver for read
	f.Read(b)                // read open file
	readContent := string(b) // []byte -> string
	f.Close()                // close file

	// Remove
	os.Remove(fn) // remove file or empty dir

	// print results
	bulkPrint(
		"name", name,
		"readContent", readContent,
	)
}

// ---
// exec
// ---

func useExec() {
	c := []string{"ls", "-a"}
	// Command
	command := exec.Command(c[0], c[1:]...)
	b, err := command.Output()
	if err != nil {
		fmt.Println(err)
	}
	output := strings.Split(string(b), "\n")

	// print results
	bulkPrint(
		"c", strings.Join(c, " "),
		"output", output,
	)
}

// ---
// math
// ---

// https://golang.org/pkg/math/

func round(n float64, p int) float64 {
	// move decimal place, round to int, move decimal place back
	a := math.Pow10(p)
	return math.Round(n*a) / a
}

func useMath() {
	// constants
	e := math.E
	pi := math.Pi
	phi := math.Phi
	// math
	abs := math.Abs(-1)         // 1
	ceil := math.Ceil(0.95)     // 1
	floor := math.Floor(1.05)   // 1
	rounded := math.Round(1.65) // 2
	// exp
	cbrt := math.Cbrt(27)  // 3
	exp := math.Exp(-1)    // 1/e
	pow := math.Pow(2, 3)  // 2**3
	pow10 := math.Pow10(3) // 10**3
	// log
	ln := math.Log(math.E) // 1
	log := math.Log10(10)  // 1
	// max/min
	max := math.Max(2, 3) // 3
	min := math.Min(2, 3) // 2
	// trig
	sin := math.Sin(pi / 2)         // 1
	cos := math.Cos(0)              // 1
	tan := math.Tan(pi / 4)         // 1
	csc := 1 / math.Sin(pi/2)       // 1
	sec := 1 / math.Cos(pi/2)       // 1
	cot := 1 / math.Tan(pi/4)       // 1
	asin := math.Asin(1)            // pi/2
	acos := math.Acos(0)            // pi/2
	atan := math.Atan(math.Inf(+1)) // pi/2

	// print results
	bulkPrint(
		// constants
		"e", round(e, 2),
		"pi", round(pi, 2),
		"phi", round(phi, 2),
		// math
		"abs", abs,
		"ceil", ceil,
		"floor", floor,
		"rounded", rounded,
		// exp
		"cbrt", cbrt,
		"exp", exp,
		"pow", pow,
		"pow10", pow10,
		// log
		"ln", ln,
		"log", log,
		// max/min
		"max", max,
		"min", min,
		// trig
		"sin", round(sin, 2),
		"cos", round(cos, 2),
		"tan", round(tan, 2),
		"csc", round(csc, 2),
		"sec", round(sec, 2),
		"cot", round(cot, 2),
		"asin", round(asin, 2),
		"acos", round(acos, 2),
		"atan", round(atan, 2),
	)
}

func useNetHttpGet() {
	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// make request
	url := "https://jsonplaceholder.typicode.com/users/1"
	res, err := http.Get(url) // struct -- Status, StatusCode, Content-Type, Body
	if err != nil {
		log.Println(err)
		return
	}
	// get body
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body) // []byte
	if err != nil {
		log.Println(err)
		return
	}
	// unmarshal body
	var user User
	if err = json.Unmarshal(body, &user); err != nil {
		log.Println(err)
		return
	}
	// print results
	bulkPrint(
		"user", fmt.Sprintf("%+v", user),
	)
}

func useNetHttpPost() {
	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// make request
	url := "https://jsonplaceholder.typicode.com/users"
	contentType := "application/json"
	postBody, err := json.Marshal(User{
		Id:   3,
		Name: "Hiruzen Sarutobi",
	})
	if err != nil {
		log.Println(err)
		return
	}
	data := bytes.NewBuffer(postBody)
	res, err := http.Post(url, contentType, data) // struct -- Status, StatusCode, Content-Type, Body
	if err != nil {
		log.Println(err)
		return
	}
	// get body
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body) // []byte
	if err != nil {
		log.Println(err)
		return
	}
	// unmarshal body
	var user User
	if err = json.Unmarshal(body, &user); err != nil {
		log.Println(err)
		return
	}

	// print results
	bulkPrint(
		"user", fmt.Sprintf("%+v", user),
	)

	// print results

}

// ---
// rand (math/rand)
// ---

// https://golang.org/pkg/math/rand/

// ---
// errors
// ---

// https://golang.org/pkg/errors/

// ---
// testing
// ---

// https://golang.org/pkg/testing/

// ---
// regexp
// ---

// https://golang.org/pkg/regexp/

// ---
// io
// ---

// https://golang.org/pkg/io/

// ---
// bufio
// ---

// https://golang.org/pkg/bufio/

// ---
// archive
// ---

// https://golang.org/pkg/archive/
