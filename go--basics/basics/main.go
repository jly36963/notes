// ---------
// golang
// ---------

/*

# in `.zprofile`

# set $GOPATH and add to PATH
export GOPATH="$HOME/go"
PATH="$GOPATH/bin:$PATH"

*/

// ---
// terms
// ---

// predeclared identifiers
// bool, byte, complex64, complex128, error, float32, float64, int, int8, int16, int32, int64
// rune, string, uint, uint8, uint32, uint64,

// common types
// bool, error, float64, int, string

// alias
// byte -- uint8
// rune -- int32

// constants
// true false iota

// zero value
// nil

// functions
// append, cap, close, complex, copy, delete, imag, len,
// make, new, panic, print, println, real, recover

// keywords
// break, case, chan, const, continue, default, defer, else, fallthrough, for
// func, go, goto, if, import, interface, map, package, range, return, select,
// struct, switch, type, var

// ---
// operators
// ---

/*

math
+ - * / %

assignment
= :=
-= += *= /+ %=
&= ^= |=

increment
++ --

bitwise
>> << & | ^ &^

logical
&& || !

comparison
== != <= >=

*/

// ---
// assignment
// ---

/*

// short variable declarations
// declare and assign
// only works in functions
a := 6

// var (declare and assgn)
// works anywhere
var b int = 6
var b = 6

// var (declare)
// value is empty when declaring without assignment
var c int // empty (0, "", [], etc)
c = 5 // assign a value

// const
// character, string, boolean, numeric values only
// no short declaration
const greeting  = "Hello"

*/

// ---
// string formatting
// ---

/*

// format value
name := Kakashi
greeting := fmt.Sprintf("Hello %v", name)

// %s -- string
// %q -- safely escaped, double-quoted string
// %T -- type
// %v -- value
// %d -- integer (base 10)
// %f -- float
// float (precision)
fmt.Sprintf("number: %.2f", 2.20254)
// float (scientific notation)
 fmt.Sprintf("number: %.2e", .00001245)

*/

// ---
// entry point
// ---

package main

// ---
// imports
// ---

import (
	"fmt"
	"os/exec"
	"runtime"
	"strings"
)

// ---
// main
// ---

func main() {
	// runtime
	print(upper("runtime details"))
	getRuntimeDetails()

	// functions
	print(upper("functions"))
	add(1, 2)

	// functions (multiple returns)
	print(upper("functions (multiple returns)"))
	getSumAndProduct(3, 4) // x,y := getSumAndProduct(3,4)

	// functions (anonymous)
	print(upper("anonymous functions"))
	subtract(3, 2)

	// functions (variadic)
	print(upper("variadic functions"))
	getSum(1, 2, 3, 4)           // any number of arguments
	getSum([]int{1, 2, 3, 4}...) // spread slice

	// functions (currying)
	print(upper("currying"))
	addTwoNumbers(3)(5)

	// scope (closure)
	print(upper("scope / closure"))
	scopedGreet()

	// functions (recursion)
	print(upper("recursion"))
	getFibSequenceTo(20)

	// functions (defer)
	print(upper("defer"))
	deferredGreet("Hiruzen")

	// bash commands
	print(upper("bash commands"))
	runBashCommands([]string{"ls", "date", "pwd"})

	// bash commands (args)
	print(upper("bash commands (args)"))
	runBashCommandsWithArgs([][]string{
		[]string{"ls", "-a"},
		[]string{"echo", "hello there!!"},
		[]string{"go", "version"},
	})

	// control flow (if)
	print(upper("if, else if, else"))
	greet("Kakashi")

	// control flow (for loop)
	print(upper("for loop"))
	printNames([]string{"Kakashi", "Hiruzen", "Iruka", "Yamato", "Itachi", "Hashirama"})

	// control flow (switch)
	print(upper("switch"))
	getSnackbarColor("success")

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
// runtime details
// ---

func getRuntimeDetails() {
	// get runtime details (string slice)
	details := []string{
		format("os: %v", runtime.GOOS),
		format("arch: %v", runtime.GOARCH),
		format("CPUs: %v", runtime.NumCPU()),
		format("GR: %v", runtime.NumGoroutine()),
		format("v: %v", runtime.Version()),
	}
	// print each detail (for loop)
	for _, d := range details {
		print(d)
	}
}

// ---
// functions
// ---

// short variable declarations can only exist inside functions

func add(a, b int) int {
	sum := a + b // short variable declaration
	print(sum)
	return sum
}

// ---
// functions (multiple returns)
// ---

func getSumAndProduct(a int, b int) (sum int, product int) {
	sum = a + b
	product = a * b
	print(sum)
	print(product)
	return
}

// x,y := getSumAndProduct(3,4)

// ---
// anonymous functions (function literal)
// ---

var subtract = func(a, b int) int {
	difference := a + b
	print(difference)
	return difference
}

// ---
// variadic functions (example -- sum)
// ---

func getSum(nums ...int) int {
	total := 0
	for _, num := range nums {
		total += num
	}
	print(total)
	return total
}

// ---
// currying
// ---

func addTwoNumbers(a int) func(b int) int {
	return func(b int) int {
		sum := a + b
		print(sum)
		return sum
	}
}

// ---
// closure
// ---

func scopedGreet() {
	g1 := "Hello Hashirama"
	{
		g1 := "Hello Itachi"
		print(g1) // Itachi
	}
	print(g1) // Hashirama
}

// ---
// recursion
// ---

// iterative > tail recursion > recursion

// helper
func fibHelper(n, first, second int) int {
	if n == 0 {
		return first
	}
	return fibHelper(n-1, second, first+second)
}

// recursive function
func fib(n int) int {
	return fibHelper(n, 0, 1)
}

// get fib sequence
func getFibSequenceTo(n int) []int {
	sequence := []int{}
	for i := 0; i < n; i++ {
		sequence = append(sequence, fib(i))
	}
	print(sequence)
	return sequence
}

// ---
// function (defer)
// ---

func deferredGreet(name string) string {
	defer fmt.Println("How have you been?")            // third
	defer fmt.Println("It's nice to see you!")         // second
	fmt.Println(fmt.Sprintf("Hello there, %s!", name)) // first
	return ":D"
}

// ---
// bash commands
// ---

func runBashCommands(commands []string) {
	results := []string{}
	for _, c := range commands {
		out, err := exec.Command(c).Output()
		if err != nil {
			fmt.Println(err)
		}
		results = append(results, string(out))
	}
	print(results)
}

// ---
// bash commands with args
// ---

func runBashCommandsWithArgs(commands [][]string) {
	results := []string{}
	for _, c := range commands {
		out, err := exec.Command(c[0], c[1:]...).Output()
		if err != nil {
			print(err)
		}
		results = append(results, string(out))
	}
	print(results)
}

// ---
// if, else if, else
// ---

func greet(name string) {
	if name == "Kakashi" {
		print("Hey Kaka sensei!")
	} else if name == "Yamato" {
		print("Hey Tenzo!")
	} else {
		print(format("Hello %v!", name))
	}
}

// ---
// for loop
// ---

func printNames(names []string) {
	for i := 0; i < len(names); i++ {
		print(names[i])
	}
}

// ---
// switch
// ---

func getSnackbarColor(alertType string) string {
	var color string
	switch alertType {
	case "info":
		color = "gray"
		break
	case "success":
		color = "green"
		break
	case "error":
		color = "red"
		break
	case "warning":
		color = "yellow"
		break
	default:
		color = "gray"
	}
	print(color)
	return color
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
