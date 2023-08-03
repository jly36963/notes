package main

// ---
// imports
// ---

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	"go-gorilla/middleware/logger"
	"go-gorilla/routes/api"
)

// ---
// main
// ---

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := mux.NewRouter()
	r.Use(logger.PrettyLogger)
	api.AddRouter(r)

	port := os.Getenv("PORT")
	var p string
	if len(port) > 0 {
		p = fmt.Sprintf(":%v", port)
	} else {
		p = ":5000"
	}

	fmt.Println(fmt.Sprintf("Server starting on port %v", p))
	http.ListenAndServe(p, r)
}
