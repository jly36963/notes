package main

import (
	"fmt"
	"strings"
)

func main() {
	optionExample()
	optionUsage()

	resultExample()
	resultUsage()
}

// ---
// Option
// ---

// Attempt to create golang equivalent of Rust Option
// https://doc.rust-lang.org/std/option

// TODO: sql and json traits
// TODO: and, or, xor, and_then, or_else, as_ref

// Option type is a safer approach to a nilable type
type Option[T any] struct {
	value T
	ok    bool
}

// Option factory (some case)
func Some[T any](value T) Option[T] {
	return Option[T]{value: value, ok: true}
}

// Option factory (none case)
func None[T any]() Option[T] {
	return Option[T]{}
}

// Option is some
func (option *Option[T]) IsSome() bool {
	return option.ok
}

// Option is none
func (option *Option[T]) IsNone() bool {
	return !option.ok
}

// Option is some and passes function predicate
func (option *Option[T]) IsSomeAnd(f func(T) bool) bool {
	return option.ok && f(option.value)
}

// Panic if none, return some-case value
func (option *Option[T]) Unwrap() T {
	if !option.ok {
		panic("Unwrap called on None")
	}
	return option.value
}

// Use value if some, else use provided fallback value
func (option *Option[T]) UnwrapOr(fallback T) T {
	if option.ok {
		return option.value
	}
	return fallback
}

// Use value if some, use type default if none
func (option *Option[T]) UnwrapOrDefault() T {
	return option.value
}

// Get value (go lacks sum types / pattern matching).
// NOTE: use after checking IsSome.
func (option *Option[T]) Get() T {
	return option.value
}

// Use value if some, else get fallback from provided function
func (option *Option[T]) UnwrapOrElse(fallback func() T) T {
	if option.ok {
		return option.value
	}
	return fallback()
}

// Panic (with message) if none, return some-case value
func (option *Option[T]) Expect(msg string) T {
	if !option.ok {
		panic(msg)
	}
	return option.value
}

// Map some case, leave none alone, return option
func (option *Option[T]) Map(f func(T) T) Option[T] {
	if option.ok {
		return Some(f(option.value))
	}
	return None[T]()
}

// Map some case, replace none with fallback, return value
func (option *Option[T]) MapOr(fallback T, f func(T) T) T {
	if option.ok {
		return f(option.value)
	}
	return fallback
}

// Map if some case, else get fallback value from function, returns value
func (option *Option[T]) MapOrElse(fNone func() T, fSome func(T) T) T {
	if option.ok {
		return fSome(option.value)
	}
	return fNone()
}

// Return option, only returns Some if some case and predicate passes
func (option *Option[T]) Filter(f func(T) bool) Option[T] {
	if option.ok && f(option.value) {
		return Some(option.value)
	}
	return None[T]()
}

func optionExample() {
	// Some (value)
	someInt := Some[int8](1)
	fmt.Println("someInt", someInt)

	// Some (pointer)
	myInt := int8(1)
	somePointerInt := Some[*int8](&myInt)
	fmt.Println("somePointerInt", somePointerInt)

	// None
	noneInt := None[int8]()
	fmt.Println("noneInt", noneInt)
}

func optionUsage() {
	getOptionString := func() Option[string] {
		return Some("Hello, World!")
	}

	optStr := getOptionString()
	fmt.Println(optStr)

	// // Go lacks sum type & pattern match
	// let my_num: i32 = match Some(5) {
	//   Some(x) => x + 5,
	//   None => 0,
	// };
	// println!("{}", my_num)

	// IsSome
	if optStr.IsSome() {
		fmt.Println("Some case")
		fmt.Println(optStr.Get())
	} else {
		fmt.Println("None case")
	}

	// IsNone
	if optStr.IsNone() {
		fmt.Println("None case")
	} else {
		fmt.Println("Some case")
		fmt.Println(optStr.Get())
	}

	// IsSomeAnd
	containsHello := func(s string) bool {
		return strings.Contains(s, "Hello")
	}
	if optStr.IsSomeAnd(containsHello) {
		fmt.Println("Yup")
	}

	// Unwrap
	fmt.Println(optStr.Unwrap())

	// UnwrapOr
	fmt.Println(optStr.UnwrapOr("Olá, Mundo"))

	// UnwrapOrDefault
	fmt.Println(optStr.UnwrapOrDefault())

	// UnwrapOrElse
	getFallbackValue := func() string {
		return "Olá, Mundo"
	}
	fmt.Println(optStr.UnwrapOrElse(getFallbackValue))

	// Expect
	fmt.Println(optStr.Expect("Expected some string"))

	// Map
	fmt.Println(optStr.Map(strings.ToUpper))

	// MapOr
	fmt.Println(optStr.MapOr("Olá, Mundo", strings.ToUpper))

	// MapOrElse
	fmt.Println(optStr.MapOrElse(getFallbackValue, strings.ToUpper))

	// Filter
	fmt.Println(optStr.Filter(containsHello))

}

// ---
// Result
// ---

func resultExample() {
	// TODO: ...
}
func resultUsage() {
	// TODO: ...
}
