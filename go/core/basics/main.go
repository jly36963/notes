// ---
// Golang
// ---

// ---
// Assignment
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
// String formatting
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
	"errors"
	"fmt"
	"os/exec"
	"runtime"
	"strings"
)

func main() {
	printSectionTitle("runtime details")
	getRuntimeDetails()

	printSectionTitle("functions")
	basicFunctions()

	printSectionTitle("functions (tuple returns)")
	basicTupleReturn()

	printSectionTitle("function literals")
	basicFunctionLiteral()

	printSectionTitle("variadic args")
	basicVariadicArgs()

	printSectionTitle("currying")
	basicCurrying()

	printSectionTitle("closure (scope)")
	basicClosure()

	printSectionTitle("recursion")
	basicRecursion()

	printSectionTitle("defer")
	basicDefer()

	printSectionTitle("bash commands")
	runBashCommands([]string{"ls", "date", "pwd"})

	printSectionTitle("bash commands (args)")
	runBashCommandsWithArgs([][]string{
		{"ls", "-a"},
		{"echo", "hello there!!"},
		{"go", "version"},
	})

	printSectionTitle("if, else if, else")
	greet("Kakashi")

	printSectionTitle("for loop")
	basicForLoop()

	printSectionTitle("range")
	basicRange()

	printSectionTitle("switch")
	basicSwitch()
}

// ---
// Helpers
// ---

func printSectionTitle(s string) {
	fmt.Println("\n", strings.ToUpper(s), "\n")
}

// ---
// Runtime details
// ---

func getRuntimeDetails() {
	// Get runtime details (string slice)
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
// Functions
// ---

func add(a, b int) int {
	return a + b
}

func basicFunctions() {
	res := add(1, 2)
	fmt.Println(res)
}

// ---
// Functions (multiple returns)
// ---

func safeDivide(a, b int) (quotient float64, err error) {
	if b == 0 {
		return 0, errors.New("please do not divide by zero")
	}
	return float64(a) / float64(b), nil
}

func basicTupleReturn() {
	q, err := safeDivide(5, 3)
	if err != nil {
		fmt.Println("Oops, something went wrong")
		fmt.Println(err)
		return
	}
	fmt.Println(q)

}

// ---
// Function literal
// ---

func basicFunctionLiteral() {
	var subtract = func(a, b int) int {
		return a - b
	}

	res := subtract(3, 2)
	fmt.Println(res)
}

// ---
// Variadic functions
// ---

func getSum(nums ...int) int {
	total := 0
	for _, num := range nums {
		total += num
	}
	fmt.Println(total)
	return total
}

func basicVariadicArgs() {
	var res int

	// Variadic
	res = getSum(1, 2, 3, 4)
	fmt.Println(res)

	// Spread slice
	ints := []int{1, 2, 3, 4}
	res = getSum(ints...)
	fmt.Println(res)
}

// ---
// Currying
// ---

func addTwoNumbers(a int) func(b int) int {
	return func(b int) int {
		return a + b
	}
}

func basicCurrying() {
	addThree := addTwoNumbers(3)
	res := addThree(5)
	fmt.Println(res)
}

// ---
// Closure
// ---

func basicClosure() {
	g1 := "Hello Hashirama"
	{
		g1 := "Hello Itachi"
		fmt.Println(g1) // Itachi
	}
	fmt.Println(g1) // Hashirama
}

// ---
// Recursion
// ---

func fib(n int) int {
	if n <= 1 {
		return n
	}
	return fib(n-1) + fib(n-2)
}

func basicRecursion() {
	n := 20
	res := fib(20)
	fmt.Println("fib " + fmt.Sprint(n) + " is " + fmt.Sprint(res))
}

// ---
// Function (defer)
// ---

func deferredGreet(name string) {
	defer fmt.Println("How have you been?")    // Third
	defer fmt.Println("It's nice to see you!") // Second
	fmt.Println("Hello there " + name + "!")   // First
}

func basicDefer() {
	deferredGreet("Hiruzen")
}

// ---
// Bash commands
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
// Bash commands with args
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
// Conditionals (if, else if, else)
// ---

func greet(name string) {
	if name == "Kakashi" {
		fmt.Println("Hey Kaka sensei!")
	} else if name == "Yamato" {
		fmt.Println("Hey Tenzo!")
	} else {
		fmt.Println("Hello " + name + "!")
	}
}

// ---
// For loop
// ---

func greetLoop(names []string) {
	for i := 0; i < len(names); i++ {
		fmt.Println("Hello,", names[i])
	}
}

func basicForLoop() {
	greetLoop([]string{"Kakashi", "Hiruzen", "Iruka", "Yamato", "Itachi", "Hashirama"})
}

// ---
// Range
// ---

func greetRange(names []string) {
	for _, name := range names {
		fmt.Println("Hello,", name)
	}
}

func basicRange() {
	greetRange([]string{"Kakashi", "Hiruzen", "Iruka", "Yamato", "Itachi", "Hashirama"})
}

// ---
// Switch
// ---

// Breaks are likely unnecessary, switch logic completes on first match

func basicSwitch() {
	a := 1
	switch a {
	case 1:
		fmt.Println("Hello!!")
	case 2:
		fmt.Println("Hola!!")
	default:
		fmt.Println("Oi!!")
	}
}
