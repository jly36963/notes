package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/spf13/cobra"
)

func main() {
	printSectionTitle("basic greet (positionals)")
	basicGreetPositionals()

	printSectionTitle("basic greet (flags)")
	basicGreetFlags()

	printSectionTitle("basic subcommands")
	basicSubcommands()
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

func basicGreetPositionals() {
	greetCmd := &cobra.Command{
		// Use: Usage string
		Use: "greet [name]",
		// Aliases: aliases that can be used
		Aliases: []string{"g", "greeter", "grt"},
		// Short: Short description shown in "help" output
		Short: "Greet is a very simple greet program",
		// Long: Long description shown in "Help <cmd>" output
		Long: "...",
		// Example: Example usage
		Example: "greet Itachi",
		// Args: Positional args validation
		Args: func(cmd *cobra.Command, args []string) error {
			if len(args) > 1 {
				return errors.New("requires 0 or 1 args")
			}
			return nil
		},
		// Run: Command handler
		Run: func(cmd *cobra.Command, args []string) {
			person := "friend"
			if len(args) > 0 {
				person = args[0]
			}
			fmt.Println("Hello", person)
		},
	}

	greetCmd.SetArgs([]string{"Kakashi"})
	greetCmd.Execute()
}

func basicGreetFlags() {
	// Flag values
	var Verbose bool
	var Name string
	var Count int

	// Command
	greetCmd := &cobra.Command{
		Use:     "greet",
		Aliases: []string{"g", "greeter", "grt"},
		Short:   "greet is a very simple greet program",
		Example: "greet -n Kakashi -c 2",
		Run: func(cmd *cobra.Command, args []string) {
			if Verbose {
				fmt.Println("Verbose option was passed")
			}
			greeting := "Hello " + Name
			for i := 0; i < Count; i++ {
				fmt.Println(greeting)
			}
		},
	}

	// Setup (flags)(normally this is done in an init func)
	greetCmd.PersistentFlags().BoolVarP(&Verbose, "verbose", "v", false, "verbose output")
	greetCmd.Flags().StringVarP(&Name, "name", "n", "friend", "name to greet")
	greetCmd.Flags().IntVarP(&Count, "count", "c", 1, "number of times to greet")

	// Parse and handle
	greetCmd.SetArgs([]string{"-n", "Kakashi", "-c", "2"})
	greetCmd.Execute()
}

func basicSubcommands() {
	// root
	rootCmd := &cobra.Command{}

	// math
	mathCmd := &cobra.Command{
		Use:     "math",
		Short:   "math is a very simple math program",
		Example: "math add 2 3",
	}
	rootCmd.AddCommand(mathCmd)

	// math > add
	addCmd := &cobra.Command{
		Use:     "add <a> <b>",
		Short:   "add 2 integers",
		Example: "math add 2 3",
		Args: func(cmd *cobra.Command, args []string) error {
			if len(args) != 2 {
				return errors.New("requires 2 positional args")
			}
			return nil
		},
		Run: func(cmd *cobra.Command, args []string) {
			a, err := strconv.Atoi(args[0])
			if err != nil {
				panic("positional must be an int")
			}
			b, err := strconv.Atoi(args[1])
			if err != nil {
				panic("positional must be an int")
			}
			diff := a + b
			result := fmt.Sprintf("%d + %d = %d", a, b, diff)
			fmt.Println(result)
		},
	}
	mathCmd.AddCommand(addCmd)

	// math > sub
	subCmd := &cobra.Command{
		Use:     "sub <a> <b>",
		Short:   "subtract 2 integers",
		Example: "math sub 2 3",
		Args: func(cmd *cobra.Command, args []string) error {
			if len(args) != 2 {
				return errors.New("requires 2 positional args")
			}
			return nil
		},
		Run: func(cmd *cobra.Command, args []string) {
			a, err := strconv.Atoi(args[0])
			if err != nil {
				panic("positional must be an int")
			}
			b, err := strconv.Atoi(args[1])
			if err != nil {
				panic("positional must be an int")
			}
			diff := a - b
			result := fmt.Sprintf("%d + %d = %d", a, b, diff)
			fmt.Println(result)
		},
	}
	mathCmd.AddCommand(subCmd)

	// math > mul
	mulCmd := &cobra.Command{
		Use:     "mul <a> <b>",
		Short:   "multiply 2 integers",
		Example: "math mul 2 3",
		Args: func(cmd *cobra.Command, args []string) error {
			if len(args) != 2 {
				return errors.New("requires 2 positional args")
			}
			return nil
		},
		Run: func(cmd *cobra.Command, args []string) {
			a, err := strconv.Atoi(args[0])
			if err != nil {
				panic("positional must be an int")
			}
			b, err := strconv.Atoi(args[1])
			if err != nil {
				panic("positional must be an int")
			}
			prod := a * b
			result := fmt.Sprintf("%d * %d = %d", a, b, prod)
			fmt.Println(result)
		},
	}
	mathCmd.AddCommand(mulCmd)

	// math > div
	divCmd := &cobra.Command{
		Use:     "div <a> <b>",
		Short:   "divide 2 integers",
		Example: "math div 2 3",
		Args: func(cmd *cobra.Command, args []string) error {
			if len(args) != 2 {
				return errors.New("requires 2 positional args")
			}
			return nil
		},
		Run: func(cmd *cobra.Command, args []string) {
			a, err := strconv.Atoi(args[0])
			if err != nil {
				panic("positional must be an int")
			}
			b, err := strconv.Atoi(args[1])
			if err != nil {
				panic("positional must be an int")
			}
			quot := 0.0
			if b != 0 {
				quot = float64(a) / float64(b)
			}
			result := fmt.Sprintf("%d * %d = %f", a, b, quot)
			fmt.Println(result)
		},
	}
	mathCmd.AddCommand(divCmd)

	// math > sum
	var sumCmd *cobra.Command
	sumCmd = &cobra.Command{
		Use:     "sum <a..>",
		Short:   "math is a very simple math program",
		Example: "math sum 2 3 4",
		Args: func(cmd *cobra.Command, args []string) error {
			if len(args) < 1 {
				return errors.New("requires at least 1 positional argument")
			}
			return nil
		},
		Run: func(cmd *cobra.Command, args []string) {
			sum := reduce(
				args,
				func(acc int, curr string) int {
					n, _ := strconv.Atoi(curr)
					return acc + n
				},
				0,
			)
			result := fmt.Sprintf("The sum of %v is %d", args, sum)
			fmt.Println(result)
		},
	}
	mathCmd.AddCommand(sumCmd)

	// Parse and handle
	rootCmd.SetArgs([]string{"math", "sum", "2", "3", "5"})
	rootCmd.Execute()

}

func reduce[I any, O any](items []I, reducerFunc func(acc O, curr I) O, initial O) O {
	result := initial
	for _, item := range items {
		result = reducerFunc(result, item)
	}
	return result
}

// docs: https://cobra.dev/
// github: https://github.com/spf13/cobra
// command (pkg.go): https://pkg.go.dev/github.com/spf13/cobra#Command
// generator: https://github.com/spf13/cobra-cli/blob/main/README.md
