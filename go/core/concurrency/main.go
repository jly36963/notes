// ---
// Concurrency
// ---

package main

import (
	"fmt"
	"math/rand"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

func main() {
	// wait groups
	fmt.Println(strings.ToUpper("wait groups"))
	wgPrintStrings([]string{"Kakashi", "Itachi", "Shisui", "Hashirama"})

	// wait groups (mutex)
	fmt.Println(strings.ToUpper("wait groups (mutex)"))
	countToMutex(40, 4)

	// wait groups (atomic)
	fmt.Println(strings.ToUpper("wait groups (atomic)"))
	countToAtomic(40, 4)

	fmt.Println(strings.ToUpper(""))
	fmt.Println(strings.ToUpper(""))
	fmt.Println(strings.ToUpper(""))
}

// ---
// Wait groups
// ---

// wg -- allow for go-routines to finish (while wg counter is not 0)
// wg.Add -- add to wg counter
// wg.Done -- decrement wg counter
// wg.Wait -- block until wg counter is 0

func wgPrinter(a string) {
	wg := sync.WaitGroup{}
	fmt.Println(a)
	wg.Done() // reduce wg count by one
}

func wgPrintStrings(s []string) {
	wg := sync.WaitGroup{}
	delta := len(s) // number of go-routines / wg needed
	wg.Add(delta)   // add to wg counter
	for _, str := range s {
		go wgPrinter(str) // create go-routine (don't forget 'wg.Done()')
	}
	wg.Wait()
}

// ---
// Wait groups (mutex)
// ---

// mutex (mutual exclusion) -- locking mechanism
// only one go-routine can do their critical section at a time
// prevent race conditions -- don't let multiple go-routines work on the same variable at once.

func countToMutex(n int, numOfGR int) {
	wg := sync.WaitGroup{}
	mutex := sync.Mutex{}
	// shared state
	var counter int
	// iterations
	iterations := n / numOfGR
	if n%numOfGR != 0 {
		fmt.Println("Number must be evenly divisible by number of go-routines")
		return
	}
	// go-routine function
	incrementor := func(name string, iterations int) {
		for i := 0; i < iterations; i++ {
			time.Sleep(time.Duration(rand.Intn(20)) * time.Millisecond)
			mutex.Lock() // lock variable
			counter++
			mutex.Unlock() // unlock variable
			fmt.Printf("%s: %d, Counter: %d", name, i, counter)
		}
		wg.Done()
	}
	// execution
	wg.Add(numOfGR)
	for i := 0; i < numOfGR; i++ {
		name := fmt.Sprintf("GR%d", i)
		go incrementor(name, iterations)
	}
	wg.Wait()

}

// ---
// wait groups (atomic)
// ---

// atomic methods change the variable using its location in memory.

func countToAtomic(n int, numOfGR int) {
	wg := sync.WaitGroup{}
	// shared state
	var counter int64
	// iterations
	iterations := n / numOfGR
	if n%numOfGR != 0 {
		fmt.Println("Number must be evenly divisible by number of go-routines")
		return
	}
	// go-routine function
	incrementor := func(name string, iterations int) {
		for i := 0; i < iterations; i++ {
			time.Sleep(time.Duration(rand.Intn(20)) * time.Millisecond)
			atomic.AddInt64(&counter, 1)
			fmt.Printf("%s: %d, Counter: %d", name, i, atomic.LoadInt64(&counter))
		}
		wg.Done()
	}
	// execution
	wg.Add(numOfGR)
	for i := 0; i < numOfGR; i++ {
		name := fmt.Sprintf("GR%d", i)
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
