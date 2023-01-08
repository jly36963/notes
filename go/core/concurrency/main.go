// ---
// Concurrency
// ---

package main

import (
	"fmt"
	"math"
	"strings"
	"sync"
	"time"

	"github.com/samber/lo"
)

func main() {
	// ---
	// Wait Group
	// ---

	printSectionTitle("wait group (read)")
	basicWGRead()

	printSectionTitle("wait group (read) (chunked)")
	basicWGChunkRead()

	printSectionTitle("wait group (map)")
	basicWGMap()

	printSectionTitle("wait group (map) (chunked)")
	basicWGChunkMap()

	printSectionTitle("wait group (map) (reduce)")
	basicWGChunkReduce()

	// ---
	// Channel
	// ---

	printSectionTitle("channels")
	basicChannels()
}

// ---
// Helpers
// ---

func printSectionTitle(s string) {
	fmt.Println("\n" + strings.ToUpper(s) + "\n")
}

// ---
// Wait groups (read)
// ---

func basicWGRead() {
	names := []string{"Kakashi", "Itachi", "Shisui", "Hashirama"}

	// Waitgroup count should be equal to number of go-routines
	wg := sync.WaitGroup{}
	delta := len(names)
	wg.Add(delta)

	// Iterate through names, starting a goroutine for each
	for _, name := range names {
		go (func(name string) {
			defer wg.Done()
			time.Sleep(10 * time.Millisecond)
			fmt.Println(name)
		})(name)
	}
	wg.Wait()
}

// ---
// Wait groups (chunk) (read)
// ---

// Use 4 goroutines to iterate through and read elements
// In this example, order will not be preserved

func basicWGChunkRead() {
	numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

	threads := 4
	chunkSize := int(math.Ceil(float64(len(numbers)) / float64(threads)))
	chunks := lo.Chunk(numbers, chunkSize)
	if len(chunks) != threads {
		panic("Chunk and thread counts should be equal")
	}
	wg := sync.WaitGroup{}
	wg.Add(threads)

	for _, chunk := range chunks {
		go (func(chunk []int) {
			for _, n := range chunk {
				time.Sleep(10 * time.Millisecond)
				fmt.Println(n)
			}
			wg.Done()
		})(chunk)
	}
	wg.Wait()
}

// ---
// Wait groups (map)
// ---

// Use goroutines to map a slice (preserve order)

func basicWGMap() {
	names := []string{"Kakashi", "Itachi", "Shisui", "Hashirama"}
	result := make([]string, len(names))

	// Waitgroup count should be equal to number of go-routines
	wg := sync.WaitGroup{}
	delta := len(names)
	wg.Add(delta)

	// Iterate through names, starting a goroutine for each
	for i, name := range names {
		go (func(i int, name string) {
			time.Sleep(10 * time.Millisecond)
			res := strings.ToUpper(name)
			result[i] = res
			wg.Done()
		})(i, name)
	}
	wg.Wait()

	fmt.Println(result)
}

// ---
// Wait groups (chunk) (map)
// ---

// Use 4 goroutines to map slice (order preserved)

func basicWGChunkMap() {
	numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	count := len(numbers)
	results := make([]int, count)

	threads := 4
	chunkSize := int(math.Ceil(float64(count) / float64(threads)))
	wg := sync.WaitGroup{}
	wg.Add(threads)

	for chunkIdx := 0; chunkIdx < threads; chunkIdx++ {
		start := chunkIdx * chunkSize
		stop := (chunkIdx + 1) * chunkSize
		if stop > count {
			// Don't go out of range (last chunk is partial)
			stop = count
		}
		go (func(src *[]int, dst *[]int, start, stop int) {
			for idx := start; idx < stop; idx++ {
				time.Sleep(10 * time.Millisecond)
				res := numbers[idx] * 2
				results[idx] = res
			}
			wg.Done()
		})(&numbers, &results, start, stop)
	}
	wg.Wait()

	fmt.Println(results)
}

// ---
// Wait groups (chunk) (reduce)
// ---

// Use 4 goroutines to reduce with
// Lock access on shared value during critical section
// This is to prevent race condition during read/write

func basicWGChunkReduce() {
	numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	count := len(numbers)
	result := 1

	threads := 4
	chunkSize := int(math.Ceil(float64(count) / float64(threads)))
	mutex := sync.Mutex{}
	wg := sync.WaitGroup{}
	wg.Add(threads)

	for chunkIdx := 0; chunkIdx < threads; chunkIdx++ {
		start := chunkIdx * chunkSize
		stop := (chunkIdx + 1) * chunkSize
		if stop > count {
			// Don't go out of range (last chunk is partial)
			stop = count
		}
		go (func(src *[]int, dst *int, start, stop int) {
			for idx := start; idx < stop; idx++ {
				time.Sleep(10 * time.Millisecond)
				curr := numbers[idx]
				// Lock access to shared variable
				mutex.Lock()
				acc := *dst       // Read shared value
				*dst = acc * curr // Set shared value
				fmt.Println(fmt.Sprintf("%d * %d = %d", acc, curr, *dst))
				mutex.Unlock()
			}
			wg.Done()
		})(&numbers, &result, start, stop)
	}
	wg.Wait()

	fmt.Println(result)
}

// ---
// Wait groups (atomic)
// ---

// Atomic mutations can prevent race conditions for read/write
// Eg: atomic.AddInt64(&counter, 1)

// TODO

// ---
// Channels (basics)
// ---

// Still don't really understand the use case, nor how it works

func basicChannels() {
	type ControlMsg int
	const (
		DoExit = iota
		ExitOk
	)
	type Job struct {
		data int
	}
	type Result struct {
		result int
		job    Job
	}

	doubler := func(jobs <-chan Job, results chan<- Result, control chan ControlMsg) {
		for {
			select {
			case msg := <-control:
				switch msg {
				case DoExit:
					fmt.Println("Exit goroutine")
					control <- ExitOk
					return
				default:
					panic("unhandled control message")
				}
			case job := <-jobs:
				results <- Result{result: job.data * 2, job: job}
			}
		}
	}

	jobs := make(chan Job, 50)
	results := make(chan Result, 50)
	control := make(chan ControlMsg) // Unbuffered

	go doubler(jobs, results, control)

	for i := 0; i < 30; i++ {
		jobs <- Job{i}
	}

	for {
		select {
		case result := <-results:
			fmt.Println(result)
		case <-time.After(500 * time.Millisecond):
			fmt.Println("Timed out")
			control <- DoExit
			<-control // Wait for channel response (unbuffered/blocking)
			fmt.Println("Done")
			return
		}
	}
}
