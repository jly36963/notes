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
	"math/rand"
	"reflect"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

// ---
// package scope
// ---

var wg sync.WaitGroup
var mutex sync.Mutex

// ---
// main
// ---

func main() {
	// wait groups
	print(upper("wait groups"))
	wgPrintStrings([]string{"Kakashi", "Itachi", "Shisui", "Hashirama"})

	// wait groups (mutex)
	print(upper("wait groups (mutex)"))
	countToMutex(40, 4)

	// wait groups (atomic)
	print(upper("wait groups (atomic)"))
	countToAtomic(40, 4)

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
// wait groups
// ---

// wg -- allow for go-routines to finish (while wg counter is not 0)
// wg.Add -- add to wg counter
// wg.Done -- decrement wg counter
// wg.Wait -- block until wg counter is 0

func wgPrinter(a string) {
	fmt.Println(a)
	wg.Done() // reduce wg count by one
}

func wgPrintStrings(s []string) {
	delta := len(s) // number of go-routines / wg needed
	wg.Add(delta)   // add to wg counter
	for _, str := range s {
		go wgPrinter(str) // create go-routine (don't forget 'wg.Done()')
	}
	wg.Wait()
}

// ---
// wait groups (mutex)
// ---

// mutex (mutual exclusion) -- locking mechanism
// only one go-routine can do their critical section at a time
// prevent race conditions -- don't let multiple go-routines work on the same variable at once.

func countToMutex(n int, numOfGR int) {
	// shared state
	var counter int
	// iterations
	iterations := n / numOfGR
	if n%numOfGR != 0 {
		print("Number must be evenly divisible by number of go-routines")
		return
	}
	// go-routine function
	incrementor := func(name string, iterations int) {
		for i := 0; i < iterations; i++ {
			time.Sleep(time.Duration(rand.Intn(20)) * time.Millisecond)
			mutex.Lock() // lock variable
			counter++
			mutex.Unlock() // unlock variable
			print(format("%s: %d, Counter: %d", name, i, counter))
		}
		wg.Done()
	}
	// execution
	wg.Add(numOfGR)
	for i := 0; i < numOfGR; i++ {
		name := format("GR%d", i)
		go incrementor(name, iterations)
	}
	wg.Wait()

}

// ---
// wait groups (atomic)
// ---

// atomic methods change the variable using its location in memory.

func countToAtomic(n int, numOfGR int) {
	// shared state
	var counter int64
	// iterations
	iterations := n / numOfGR
	if n%numOfGR != 0 {
		print("Number must be evenly divisible by number of go-routines")
		return
	}
	// go-routine function
	incrementor := func(name string, iterations int) {
		for i := 0; i < iterations; i++ {
			time.Sleep(time.Duration(rand.Intn(20)) * time.Millisecond)
			atomic.AddInt64(&counter, 1)
			print(format("%s: %d, Counter: %d", name, i, atomic.LoadInt64(&counter)))
		}
		wg.Done()
	}
	// execution
	wg.Add(numOfGR)
	for i := 0; i < numOfGR; i++ {
		name := format("GR%d", i)
		go incrementor(name, iterations)
	}
	wg.Wait()
}

// ---
// channels (basics)
// ---

// use channels when you need to access the return values from concurrent processes
// channel with multiple values -- first in, first out

/*

// make channel (buffer channel)
c := make(chan int)

// put value on channel
go func() {
	c <- 42
}

//  get value from channel
fmt.Println(<-c)

*/

/*

// channel types
c := make(chan int) // receive and send (bidirectional)
cr := make(<-chan int) // receive
cs := make(chan<- int) // send

*/

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
