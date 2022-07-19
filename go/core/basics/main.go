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

package main

import (
	"fmt"
	"os/exec"
	"runtime"
	"strings"
)

func main() {
	// runtime
	fmt.Println(strings.ToUpper("runtime details"))
	getRuntimeDetails()

	// functions
	fmt.Println(strings.ToUpper("functions"))
	add(1, 2)

	// functions (multiple returns)
	fmt.Println(strings.ToUpper("functions (multiple returns)"))
	getSumAndProduct(3, 4) // x,y := getSumAndProduct(3,4)

	// functions (anonymous)
	fmt.Println(strings.ToUpper("anonymous functions"))
	subtract(3, 2)

	// functions (variadic)
	fmt.Println(strings.ToUpper("variadic functions"))
	getSum(1, 2, 3, 4)           // any number of arguments
	getSum([]int{1, 2, 3, 4}...) // spread slice

	// functions (currying)
	fmt.Println(strings.ToUpper("currying"))
	addTwoNumbers(3)(5)

	// scope (closure)
	fmt.Println(strings.ToUpper("scope / closure"))
	scopedGreet()

	// functions (recursion)
	fmt.Println(strings.ToUpper("recursion"))
	getFibSequenceTo(20)

	// functions (defer)
	fmt.Println(strings.ToUpper("defer"))
	deferredGreet("Hiruzen")

	// bash commands
	fmt.Println(strings.ToUpper("bash commands"))
	runBashCommands([]string{"ls", "date", "pwd"})

	// bash commands (args)
	fmt.Println(strings.ToUpper("bash commands (args)"))
	runBashCommandsWithArgs([][]string{
		{"ls", "-a"},
		{"echo", "hello there!!"},
		{"go", "version"},
	})

	// control flow (if)
	fmt.Println(strings.ToUpper("if, else if, else"))
	greet("Kakashi")

	// control flow (for loop)
	fmt.Println(strings.ToUpper("for loop"))
	printNames([]string{"Kakashi", "Hiruzen", "Iruka", "Yamato", "Itachi", "Hashirama"})

	// control flow (switch)
	fmt.Println(strings.ToUpper("switch"))
	getSnackbarColor("success")

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
// functions
// ---

// short variable declarations can only exist inside functions

func add(a, b int) int {
	sum := a + b // short variable declaration
	fmt.Println(sum)
	return sum
}

// ---
// functions (multiple returns)
// ---

func getSumAndProduct(a int, b int) (sum int, product int) {
	sum = a + b
	product = a * b
	fmt.Println(sum)
	fmt.Println(product)
	return
}

// x,y := getSumAndProduct(3,4)

// ---
// anonymous functions (function literal)
// ---

var subtract = func(a, b int) int {
	difference := a + b
	fmt.Println(difference)
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
	fmt.Println(total)
	return total
}

// ---
// currying
// ---

func addTwoNumbers(a int) func(b int) int {
	return func(b int) int {
		sum := a + b
		fmt.Println(sum)
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
		fmt.Println(g1) // Itachi
	}
	fmt.Println(g1) // Hashirama
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
	fmt.Println(sequence)
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
	fmt.Println(results)
}

// ---
// bash commands with args
// ---

func runBashCommandsWithArgs(commands [][]string) {
	results := []string{}
	for _, c := range commands {
		out, err := exec.Command(c[0], c[1:]...).Output()
		if err != nil {
			fmt.Println(err)
		}
		results = append(results, string(out))
	}
	fmt.Println(results)
}

// ---
// if, else if, else
// ---

func greet(name string) {
	if name == "Kakashi" {
		fmt.Println("Hey Kaka sensei!")
	} else if name == "Yamato" {
		fmt.Println("Hey Tenzo!")
	} else {
		fmt.Println(fmt.Sprintf("Hello %v!", name))
	}
}

// ---
// for loop
// ---

func printNames(names []string) {
	for i := 0; i < len(names); i++ {
		fmt.Println(names[i])
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
	fmt.Println(color)
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
