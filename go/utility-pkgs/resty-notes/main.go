package main

import (
	"encoding/json"
	"fmt"
	"runtime"
	"strings"

	resty "github.com/go-resty/resty/v2"
)

// ---
// Main
// ---

func main() {
	getRuntimeDetails()
	useRestyGet()
	useRestyPost()
	useRestyGetWithQuery()
}

// ---
// Helper func
// ---

func bulkPrint(args ...interface{}) {
	for _, a := range args {
		fmt.Println(a)
	}
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

// ---------
// notes
// ---------

// ---
// Runtime details
// ---

type RuntimeDetails struct {
	Os      string `json:"os"`
	Arch    string `json:"arch"`
	CPUs    int    `json:"cpus"`
	Version string `json:"version"`
}

func getRuntimeDetails() {
	printSectionTitle("runtime")

	fmt.Printf("%+v\n", RuntimeDetails{
		Os:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		CPUs:    runtime.NumCPU(),
		Version: runtime.Version(),
	})
}

// ---
// Resty
// ---

func useRestyGet() {
	printSectionTitle("resty (get)")

	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// make client
	client := resty.New()
	// make request
	url := "https://jsonplaceholder.typicode.com/users/1"
	token := "aacb3424a31c6133ad"
	res, resErr := client.R().
		EnableTrace().
		SetHeader("Token", token). // set header (token)
		Get(url)
	if resErr != nil {
		fmt.Println(resErr)
		return
	}
	// use res
	statusCode := res.StatusCode()
	status := res.Status()
	time := res.Time()
	body := res.Body()
	var user User
	unmarshalErr := json.Unmarshal(body, &user)
	if unmarshalErr != nil {
		fmt.Println(unmarshalErr)
		return
	}

	// print results
	bulkPrint(
		"statusCode", statusCode,
		"status", status,
		"time", time,
		"body", string(body),
		"user", fmt.Sprintf("%+v", user),
	)
}

func useRestyPost() {
	printSectionTitle("resty (post)")

	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// make client
	client := resty.New()
	// make request
	url := "https://jsonplaceholder.typicode.com/users"
	data := User{
		Id:   3,
		Name: "Hiruzen Sarutobi",
	}
	res, resErr := client.R().
		EnableTrace().
		SetHeader("Content-Type", "application/json").
		SetBody(data). // string, bytes, or struct
		Post(url)
	if resErr != nil {
		fmt.Println(resErr)
		return
	}
	// use res
	statusCode := res.StatusCode()
	status := res.Status()
	time := res.Time()
	body := res.Body()
	var user User
	unmarshalErr := json.Unmarshal(body, &user)
	if unmarshalErr != nil {
		fmt.Println(unmarshalErr)
		return
	}

	// print results
	bulkPrint(
		"statusCode", statusCode,
		"status", status,
		"time", time,
		"body", string(body),
		"user", fmt.Sprintf("%+v", user),
	)
}

func useRestyGetWithQuery() {
	printSectionTitle("resty (get)(query)")

	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// make client
	client := resty.New()
	// make request
	url := "https://jsonplaceholder.typicode.com/users"
	token := "aacb3424a31c6133ad"
	query := map[string]string{
		"limit": "5",
		"sort":  "name",
		"order": "asc",
	}
	res, resErr := client.R().
		EnableTrace().
		SetHeader("Token", token). // set header (token)
		SetQueryParams(query).     // jsonplaceholder doesn't actually use this
		Get(url)
	if resErr != nil {
		fmt.Println(resErr)
		return
	}
	// use res
	body := res.Body()
	var users []User
	unmarshalErr := json.Unmarshal(body, &users)
	if unmarshalErr != nil {
		fmt.Println(unmarshalErr)
		return
	}

	// print results
	bulkPrint(
		"users", fmt.Sprintf("%+v", users),
	)
}
