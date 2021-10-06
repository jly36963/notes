// ---------
// golang (structures)
// ---------

package main

import (
	"encoding/json" // json
	"fmt"
	"math"
	"reflect"
	"strings"
)

func main() {
	// pointers
	printSectionTitle("pointers")
	usePointer()

	// strings
	printSectionTitle("strings")
	useStringFunctions()

	// maps
	printSectionTitle("maps")
	iterateMap()

	// slices
	printSectionTitle("slice")
	printSlice()

	// slices (iterating)
	printSectionTitle("slice (iterating)")
	iterateSlice([]string{"Kakashi", "Itachi", "Hiruzen", "Hashirama"})

	// slices (copying)
	printSectionTitle("slice (copying)")
	copySlice()

	// arrays
	printSectionTitle("array")
	printArrays()

	// arrays (copying)
	printSectionTitle("array (copying)")
	copyArray()

	// structs
	printSectionTitle("structs")
	createNinja()

	// interfaces
	printSectionTitle("interfaces")
	useInterface()

	// json
	printSectionTitle("json")
	useJson()
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

// ---
// pointers
// ---

/*

// * -- pointer, dereferencer
// & -- address

var x = 100 // set value
var p *int = &x // pointer to value's address
fmt.Println(a) // value
fmt.Println(&a) // address
fmt.Println(p) // address
fmt.Println(*p) // value (dereferenced)

*/

func usePointer() {
	// value
	a := 3
	// function to change value at location in memory
	changePointerValue := func(p *int) {
		fmt.Println(*p) // dereferenced value
		fmt.Println(p)  // address
		*p = 4          // change value
		fmt.Println(*p) // new value
		fmt.Println(p)  // address
	}
	// change value at location in memory
	changePointerValue(&a)
}

// ---
// strings
// ---

func useStringFunctions() {
	// examples
	examples := []interface{}{
		// whitespace
		strings.Trim("   Kakashi   ", " "), // Kakashi
		// split & join
		strings.Split("Hey there Kakashi", " "),                // [ Hey there Kakashi ]
		strings.Join([]string{"Hey", "there", "Kakashi"}, " "), // Hey there Kakashi
		// find
		strings.Contains("Hey there Kakashi", "Kakashi"), // true
		strings.Index("Hey there Kakashi", "Kakashi"),    // 10
		// replace
		strings.ReplaceAll("Hey there Kakashi", "Kakashi", "Kaka sensei"), // Hey there Kaka sensei
		// case
		strings.ToLower("Hey there Kakashi"),                // hey there kakashi
		strings.ToUpper("Hey there Kakashi"),                // HEY THERE KAKASHI
		strings.Title(strings.ToLower("Hey there Kakashi")), // Hey There Kakashi
		strings.ToTitle("Hey there Kakashi"),                // HEY THERE KAKASHI (wtf)
	}
	// iterate
	for _, e := range examples {
		fmt.Println(e)
	}
}

// ---
// maps
// ---

/*
if initializing an empty map: do it like this
m := make(map[string]string) // use 'make'
*/

func iterateMap() {
	names := map[string]string{
		"Kakashi":    "Hatake",
		"Konohamaru": "Sarutobi",
		"Iruka":      "Umino",
	}
	for k, v := range names {
		fmt.Println(fmt.Sprintf("%s %s", k, v))
	}
}

// ---
// slice
// ---

func printSlice() {
	names := []string{"Kakashi", "Itachi", "Hiruzen", "Hashirama"}
	fmt.Println(names)
}

// ---
// slice (iterating)
// ---

func iterateSlice(names []string) {
	// for loop
	for _, n := range names {
		fmt.Println(n)
	}
}

// ---
// slice (copying)
// ---

func copySlice() {
	// slice
	names := []string{"Kakashi", "Itachi", "Hiruzen", "Hashirama"}
	// copy
	namesCopy := make([]string, len(names))
	copy(namesCopy, names) // copy (dest, src)
	fmt.Println(namesCopy)
}

// ---
// array
// ---

// fixed length, uniform type
// slices are more flexible

func printArrays() {
	// shorthand
	ninja := [3]string{"Kakashi", "Iruka", "Konohamaru"}
	// normal
	var hokage [3]string
	hokage[0] = "Kakashi"
	hokage[1] = "Hiruzen"
	hokage[2] = "Hashirama"
	// for loop
	for _, n := range ninja {
		fmt.Println(n)
	}
	for _, h := range hokage {
		fmt.Println(h)
	}
}

// ---
// array (copying)
// ---

func copyArray() {
	// original array
	arr := [3]int{1, 2, 3}
	// copy value
	arrCopy := arr
	// copy reference
	arrRef := &arr

	// view type
	fmt.Println(fmt.Sprintf("%T", arrCopy))
	fmt.Println(fmt.Sprintf("%T", arrRef))
}

// ---
// structs
// ---

type Jutsu struct {
	id     int
	name   string
	nature string
}

type Ninja struct {
	id    int
	name  string
	age   int
	jutsu []Jutsu
}

func createNinja() {
	// jutsu
	chidori := Jutsu{
		id:     1,
		name:   "chidori",
		nature: "lightning",
	}
	kamui := Jutsu{
		id:     2,
		name:   "kamui",
		nature: "none",
	}
	susanoo := Jutsu{
		id:     3,
		name:   "susano'o",
		nature: "none",
	}
	// ninja
	kakashi := Ninja{
		id:    1,
		name:  "Kakashi Hatake",
		age:   46,
		jutsu: []Jutsu{chidori, kamui, susanoo},
	}
	fmt.Println(kakashi)
}

// ---
// interfaces
// ---

// interface
type geometry interface {
	area() float64
	perim() float64
}

// structs
type rect struct {
	width, height float64
}
type circle struct {
	radius float64
}

// methods for struct (rect)
func (r rect) area() float64 {
	return r.width * r.height
}
func (r rect) perim() float64 {
	return 2*r.width + 2*r.height
}

// methods for struct (circle)
func (c circle) area() float64 {
	return math.Pi * c.radius * c.radius
}
func (c circle) perim() float64 {
	return 2 * math.Pi * c.radius
}

// interface method
func measure(g geometry) {
	fmt.Println(reflect.TypeOf(g))
	fmt.Println(fmt.Sprintf("area: %.1f", g.area()))
	fmt.Println(fmt.Sprintf("perimeter: %.1f", g.perim()))
}
func useInterface() {
	// use interface method
	r := rect{width: 3, height: 4}
	c := circle{radius: 5}
	measure(r)
	measure(c)
}

// ---
// json
// ---

// json.Marshal -- input: interface{}; output: []byte, error
// json.Unmarshal -- input: []byte, interface{}; output: error

// struct
type jonin struct {
	Fn  string `json:"fn"`
	Ln  string `json:"ln"`
	Age int    `json:"age"`
}

func useJson() {
	// struct instance
	kakashi := jonin{
		Fn:  "Kakashi",
		Ln:  "Hatake",
		Age: 46,
	}
	// marshal
	bytes, err := json.Marshal(kakashi)
	if err != nil {
		fmt.Println(fmt.Sprintf("error: %s", err))
	}
	// unmarshal -- src (bytes), destination (struct)
	var kakashi2 jonin
	if err = json.Unmarshal(bytes, &kakashi2); err != nil {
		fmt.Println(fmt.Sprintf("error: %s", err))
		return
	}

	// re-marshal (check work)
	bytes, err = json.Marshal(kakashi2)
	if err != nil {
		fmt.Println(fmt.Sprintf("error: %s", err))
		return
	}

	// unmarshal (again)
	var kakashi3 jonin
	if err = json.Unmarshal(bytes, &kakashi3); err != nil {
		fmt.Println(fmt.Sprintf("error: %s", err))
	}

	fmt.Println(kakashi)
	fmt.Println(string(bytes))
	fmt.Println("")
	fmt.Println(kakashi2)
	fmt.Println(string(bytes))
	fmt.Println("")
	fmt.Println(kakashi3)
}
