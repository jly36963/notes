package main

// ---
// imports
// ---

import (
	// standard imports

	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"

	// external imports
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	// local packages
	"go-gorilla/middleware/logger"
	"go-gorilla/routes/api"
)

// ---
// main
// ---

func main() {
	// runtime details
	getRuntimeDetails()
	// dotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// mux router
	r := mux.NewRouter()

	// middleware
	r.Use(logger.PrettyLogger)

	// add routes
	api.AddRouter(r)
	// server config
	port := os.Getenv("PORT")
	var p string
	if len(port) > 0 {
		p = fmt.Sprintf(":%v", port)
	} else {
		p = ":5000"
	}
	// serve
	fmt.Println(fmt.Sprintf("Server starting on port %v", p))
	http.ListenAndServe(p, r)
}

// ---
// runtime details
// ---

func getRuntimeDetails() {
	// get runtime details (string array)
	details := []string{
		fmt.Sprintf("os: %v", runtime.GOOS),
		fmt.Sprintf("arch: %v", runtime.GOARCH),
		fmt.Sprintf("CPUs: %v", runtime.NumCPU()),
		fmt.Sprintf("GR: %v", runtime.NumGoroutine()),
		fmt.Sprintf("version: %v", runtime.Version()),
	}
	// print each detail (for loop)
	for _, d := range details {
		fmt.Println(d)
	}
}
