package main

// ---
// imports
// ---

import (
	// standard packages
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"runtime"
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
	// runtime
	logRuntimeDetails()
	// dotenv
	loadDotenv()
	// server config
	config := atreugo.Config{
		Addr:         getAddr(),
		NotFoundView: NotFoundView,
	}
	// server
	r := atreugo.New(config)
	// middleware
	r.UseBefore(logger.PrettyLogger)
	// routers
	api.AddRouter(r)
	// listen
	err := r.ListenAndServe()
	if err != nil {
		panic(err)
	}
}

// ---
// runtime details
// ---

func logRuntimeDetails() {
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

// ---
// load dotenv
// ---

func loadDotenv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// ---
// get addr (used in atreugo config)
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
		// payload
		payload, _ := json.Marshal(struct {
			Message string `json:"message"`
		}{
			Message: "Not found",
		})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusNotFound)
		ctx.SetBody(payload)
	} else {
		// payload
		html, _ := ioutil.ReadFile("client/build/index.html")
		payload := string(html)
		// response
		ctx.SetContentType("text/html; charset=utf-8")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.HTTPResponse(payload)
	}
	return nil

}
