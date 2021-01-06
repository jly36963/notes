// ---------
// golang (structures)
// ---------

// ---
// entry point
// ---

package main

// ---
// imports
// ---

import (
	"encoding/json" // json
	"fmt"
	"math"
	"reflect"
	"strings"
	// "math/rand"
	// "os"
	// "os/exec" // exec
	// "sort"
	// "sync"
	// "sync/atomic"
	// "time"
	// "context"
)

// ---
// main
// ---

func main() {

	// pointers
	print(upper("pointers"))
	usePointer()

	// strings
	print(upper("strings"))
	useStringFunctions()

	// maps
	print(upper("maps"))
	iterateMap()

	// slices
	print(upper("slice"))
	printSlice()

	// slices (iterating)
	print(upper("slice (iterating)"))
	iterateSlice([]string{"Kakashi", "Itachi", "Hiruzen", "Hashirama"})

	// slices (copying)
	print(upper("slice (copying)"))
	copySlice()

	// arrays
	print(upper("array"))
	printArrays()

	// arrays (copying)
	print(upper("array (copying)"))
	copyArray()

	// structs
	print(upper("structs"))
	createNinja()

	print(upper("interfaces"))
	useInterface()

	print(upper("json"))
	useJson()

	print(upper(""))

	print(upper(""))

	print(upper(""))

	print(upper(""))
}

// ---
// shorthand function names
// ---

var print = fmt.Println
var upper = strings.ToUpper
var format = fmt.Sprintf
var typeOf = reflect.TypeOf

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
		print(*p) // dereferenced value
		print(p)  // address
		*p = 4    // change value
		print(*p) // new value
		print(p)  // address
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
		print(e)
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
	print(names)
}

// ---
// slice (iterating)
// ---

func iterateSlice(names []string) {
	// for loop
	for _, n := range names {
		print(n)
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
	print(namesCopy)
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
		print(n)
	}
	for _, h := range hokage {
		print(h)
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
	print(format("%T", arrCopy))
	print(format("%T", arrRef))
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
	print(kakashi)
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
	print(typeOf(g))
	print(format("area: %.1f", g.area()))
	print(format("perimeter: %.1f", g.perim()))
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
	bytes, err1 := json.Marshal(kakashi)
	if err1 != nil {
		print(format("error: %s", err1))
	}
	// unmarshal
	var kakashi2 jonin
	err2 := json.Unmarshal(bytes, &kakashi2) // src (bytes), destination (struct)
	if err2 != nil {
		print(format("error: %s", err2))
	}

	// re-marshal (check work)
	bytes2, err3 := json.Marshal(kakashi2)
	if err3 != nil {
		print(format("error: %s", err3))
	}

	// unmarshal (again)
	var kakashi3 jonin
	err4 := json.Unmarshal(bytes2, &kakashi3)
	if err4 != nil {
		print(format("error: %s", err4))
	}

	print(kakashi)
	print(string(bytes))
	print("")
	print(kakashi2)
	print(string(bytes2))
	print("")
	print(kakashi3)
}

// ---
//
// ---

// ---
//
// ---
