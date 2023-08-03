package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"go-gin/middleware/logger"
	"go-gin/routes/api"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	r := gin.New()
	// r := gin.Default() // default: gin instance with logger and recovery

	r.Use(gin.Recovery())                               // Use default recovery
	r.Use(gin.LoggerWithFormatter(logger.PrettyLogger)) // Use custom logger

	// Multipart memory threshold
	r.MaxMultipartMemory = 8 << 20 // 8 MiB (default is 32 MiB)

	api.Routes(r)

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

	port := os.Getenv("PORT")
	log.Println("port:", port)
	r.Run() // 0.0.0.0:8080 (unless PORT in .env)
}
