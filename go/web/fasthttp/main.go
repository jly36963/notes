package main

// ---
// Imports
// ---

import (
	// standard packages
	"encoding/json"
	"fmt"
	"log"
	"os"
	"runtime"

	// local packages
	"go-fasthttp/middleware/logger"
	"go-fasthttp/routes/api"

	// external packages
	"github.com/fasthttp/router"
	"github.com/joho/godotenv"
	"github.com/valyala/fasthttp"
)

// ---
// Main
// ---

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	r := router.New()

	api.AddRouter(r)
	port := os.Getenv("PORT")
	var p string
	if len(port) > 0 {
		p = fmt.Sprintf(":%v", port)
	} else {
		p = ":5000"
	}
	fmt.Println(fmt.Sprintf("Server starting on port %v", p))
	handler := r.Handler // *fasthttp.RequestCtx
	handler = logger.PrettyLogger(handler)
	handler = NotFoundHandler(handler)
	fasthttp.ListenAndServe(p, handler)
}

// ---
// Runtime details
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

// ---
// NotFound handler
// ---

func NotFoundHandler(h fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		// original handler
		h(ctx)
		if ctx.Response.StatusCode() == fasthttp.StatusNotFound {
			// payload
			payload, _ := json.Marshal(struct{}{})
			// response
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusNotFound)
			ctx.SetBody(payload)
		}
	}
}
