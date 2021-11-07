package main

// ---
// imports
// ---

import (
	// standard packages

	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"strings"

	// external packages
	"github.com/gin-gonic/gin" // gin framework
	"github.com/joho/godotenv" // dotenv

	// local packages
	"go-gin/middleware/logger"
	"go-gin/routes/api"
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
	// instantiate gin server
	r := gin.New()
	// middleware
	r.Use(gin.Recovery())                               // use default recovery
	r.Use(gin.LoggerWithFormatter(logger.PrettyLogger)) // use custom logger
	// multipart memory threshold
	r.MaxMultipartMemory = 8 << 20 // 8 MiB (default is 32 MiB)
	// add router
	api.Routes(r) // index router
	// spa and api 404 handler
	r.LoadHTMLFiles("client/build/index.html")
	r.NoRoute(func(c *gin.Context) {
		// get path and determine if it is an api request
		path := c.Request.URL.Path
		isApi := strings.HasPrefix(path, "/api")
		if isApi {
			// unknown api route
			c.JSON(http.StatusNotFound, gin.H{"message": "Not found"})
		} else {
			// serve html page (SPA)
			c.HTML(http.StatusOK, "index.html", gin.H{
				"title": "Gin Example",
			})
		}

	})

	// server config
	port := os.Getenv("PORT")
	log.Println("port:", port)
	// start server
	r.Run() // 0.0.0.0:8080 (unless PORT in .env)
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
		log.Print(d)
	}
}

// ---
// gin default instance
// ---

/*
r := gin.Default() // gin instance with logger and recovery
*/
