package main

// ---
// Imports
// ---

import (
	// standard packages
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	// local packages
	"go-atreugo/middleware/logger"
	"go-atreugo/routes/api"

	// external packages
	"github.com/joho/godotenv"
	"github.com/savsgio/atreugo/v11"
	"github.com/valyala/fasthttp"
)

func main() {
	loadDotenv()
	config := atreugo.Config{
		Addr:         getAddr(),
		NotFoundView: NotFoundView,
	}
	r := atreugo.New(config)
	r.UseBefore(logger.PrettyLogger)
	api.AddRouter(r)
	err := r.ListenAndServe()
	if err != nil {
		panic(err)
	}
}

// ---
// Load dotenv
// ---

func loadDotenv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// ---
// Get addr (used in atreugo config)
// ---

func getAddr() string {
	port := os.Getenv("PORT")
	var addr string
	if len(port) > 0 {
		addr = fmt.Sprintf("0.0.0.0:%v", port)
	} else {
		addr = "0.0.0.0:5000"
	}
	return addr
}

// ---
// NotFound handler
// ---

func NotFoundView(ctx *atreugo.RequestCtx) error {
	path := string(ctx.Path())
	isApi := strings.HasPrefix(path, "/api")
	// determing if unknown api route or request for SPA
	if isApi {
		payload, _ := json.Marshal(struct {
			Message string `json:"message"`
		}{
			Message: "Not found",
		})

		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusNotFound)
		ctx.SetBody(payload)
	} else {
		html, _ := ioutil.ReadFile("client/build/index.html")
		payload := string(html)

		ctx.SetContentType("text/html; charset=utf-8")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.HTTPResponse(payload)
	}
	return nil
}
