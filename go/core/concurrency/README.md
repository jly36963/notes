# Concurrency

## Wait group

- wg -- allow for go-routines to finish (while wg counter is not 0)
- wg.Add -- add to wg counter
- wg.Done -- decrement wg counter
- wg.Wait -- block until wg counter is 0

- Remember to decrement wg count in each goroutine, or this will hang forever

- Creating a goroutine for each iteration might be naive/expensive
- In many cases, processing chunks (with a finite count of goroutines) is better

## Mutex

- mutex (mutual exclusion) -- locking mechanism
- only one go-routine can do their critical section at a time
- prevent race conditions -- don't let multiple go-routines work on the same
  variable at once.
