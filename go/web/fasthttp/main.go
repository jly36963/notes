package main

// ---
// imports
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
	// server
	r := router.New()

	// add routers
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
	// add middleware
	handler := r.Handler // *fasthttp.RequestCtx
	handler = logger.PrettyLogger(handler)
	handler = NotFoundHandler(handler)
	// listen
	fasthttp.ListenAndServe(p, handler)
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

/*


// ---
// github.com/qiangxue/fasthttp-routing
// ---

import (
	// standard packages
	"fmt"
	"log"
	"os"
	"reflect"
	"runtime"

	// local packages
	"go-fasthttp/routes/api"

	// external packages
	"github.com/joho/godotenv"
	routing "github.com/qiangxue/fasthttp-routing" // routing
	"github.com/valyala/fasthttp"
)

func main() {
	// server
	r := routing.New()
	AddRouter(r)
	// serve
	fasthttp.ListenAndServe(":5000", r.HandleRequest)
}

func AddRouter(r *routing.Router) {

	// subrouter (group)
	sr := r.Group("/api")

	// @route -- GET /api/hello-world
	// @desc -- return "Hello World!"
	// @access -- public
	sr.Get("/hello-world", func(c *routing.Context) error {
		// payload
		payload, _ := json.Marshal(struct {
			Message string `json:"message"`
		}{
			"Hello World!",
		})
		// response
		c.SetContentType("application/json")
		c.SetStatusCode(fasthttp.StatusOK)
		c.SetBody(payload)
		return nil // error
	})
}

// routing
// r.Context extends fasthttp.RequestCtx
// r.NotFound()

// context
// c.Param() // path params


*/
