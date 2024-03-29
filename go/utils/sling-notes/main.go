package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/dghubble/sling"
)

// receive (shorthand: response -> struct)
// https://github.com/dghubble/sling#receive

// ---
// Main
// ---

func main() {
	useSlingGet()
	useSlingPost()
	useSlingGetWithHeader()
	useSlingGetWithQuery()

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

// ---
// Sling
// ---

func useSlingGet() {
	printSectionTitle("sling (Get)")

	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// create client
	client := &http.Client{}
	// build request
	url := "https://jsonplaceholder.typicode.com"
	path := "/users/1"
	req, reqErr := sling.New().Get(url).Path(path).Request()
	if reqErr != nil {
		fmt.Println(reqErr)
		return
	}
	// make request
	res, resErr := client.Do(req)
	if reqErr != nil {
		fmt.Println(resErr)
		return
	}
	// get body
	defer res.Body.Close()
	body, readErr := ioutil.ReadAll(res.Body) // []byte
	if readErr != nil {
		log.Println(readErr)
		return
	}
	// unmarshal body
	var user User
	unmarshalErr := json.Unmarshal(body, &user)
	if unmarshalErr != nil {
		log.Println(unmarshalErr)
		return
	}
	// print results
	bulkPrint(
		"user", fmt.Sprintf("%+v", user),
	)
}

func useSlingPost() {
	printSectionTitle("sling (Get)")

	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// create client
	client := &http.Client{}
	// build request
	url := "https://jsonplaceholder.typicode.com"
	path := "/users"
	data := &User{
		Id:   3,
		Name: "Hiruzen Sarutobi",
	}
	req, reqErr := sling.New().Post(url).Path(path).BodyJSON(data).Request()
	if reqErr != nil {
		fmt.Println(reqErr)
		return
	}
	// make request
	res, resErr := client.Do(req)
	if reqErr != nil {
		fmt.Println(resErr)
		return
	}
	// get body
	defer res.Body.Close()
	body, readErr := ioutil.ReadAll(res.Body) // []byte
	if readErr != nil {
		log.Println(readErr)
		return
	}
	// unmarshal body
	var user User
	unmarshalErr := json.Unmarshal(body, &user)
	if unmarshalErr != nil {
		log.Println(unmarshalErr)
		return
	}
	// print results
	bulkPrint(
		"user", fmt.Sprintf("%+v", user),
	)
}

func useSlingGetWithHeader() {
	printSectionTitle("sling (Get)(Header)")

	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// create client
	client := &http.Client{}
	// build request
	url := "https://jsonplaceholder.typicode.com"
	path := "/users/1"
	token := "afc56ac56caf5b6c5fa65" // jsonplaceholder doesn't actually use this
	req, reqErr := sling.New().Get(url).Set("token", token).Path(path).Request()
	if reqErr != nil {
		fmt.Println(reqErr)
		return
	}
	// make request
	res, resErr := client.Do(req)
	if reqErr != nil {
		fmt.Println(resErr)
		return
	}
	// get body
	defer res.Body.Close()
	body, readErr := ioutil.ReadAll(res.Body) // []byte
	if readErr != nil {
		log.Println(readErr)
		return
	}
	// unmarshal body
	var user User
	unmarshalErr := json.Unmarshal(body, &user)
	if unmarshalErr != nil {
		log.Println(unmarshalErr)
		return
	}
	// print results
	bulkPrint(
		"user", fmt.Sprintf("%+v", user),
	)
}

func useSlingGetWithQuery() {
	printSectionTitle("sling (Get)(Query)")

	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// create client
	client := &http.Client{}
	// build request
	url := "https://jsonplaceholder.typicode.com"
	path := "/users"
	params := &User{Id: 3, Name: "Hiruzen"} // jsonplaceholder doesn't actually use these
	req, reqErr := sling.New().Get(url).Path(path).QueryStruct(params).Request()
	if reqErr != nil {
		fmt.Println(reqErr)
		return
	}
	// make request
	res, resErr := client.Do(req)
	if reqErr != nil {
		fmt.Println(resErr)
		return
	}
	// get body
	defer res.Body.Close()
	body, readErr := ioutil.ReadAll(res.Body) // []byte
	if readErr != nil {
		log.Println(readErr)
		return
	}
	// unmarshal body
	var users []User
	unmarshalErr := json.Unmarshal(body, &users)
	if unmarshalErr != nil {
		log.Println(unmarshalErr)
		return
	}
	// print results
	bulkPrint("user", fmt.Sprintf("%+v", users))
}
