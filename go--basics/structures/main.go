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
	"fmt"
	"strings"
	// "encoding/json" // json
	// "math"
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

	// strings
	print(upper("strings"))
	useStringFunctions()

	// maps
	print(upper("maps"))

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
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---
