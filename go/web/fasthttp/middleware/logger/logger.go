package logger

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/valyala/fasthttp"
)

type formattedLogEntry struct {
	Method   string `json:"method"`
	Path     string `json:"path"`
	Duration string `json:"duration"`
	Time     string `json:"time"`
}

func PrettyLogger(h fasthttp.RequestHandler) fasthttp.RequestHandler {
	return fasthttp.RequestHandler(func(ctx *fasthttp.RequestCtx) {
		// start timer
		start := time.Now()
		// handle request
		h(ctx)
		// log
		entry, _ := json.MarshalIndent(formattedLogEntry{
			fmt.Sprintf("%s", ctx.Method()),      // method
			fmt.Sprintf("%s", ctx.Path()),        // path
			fmt.Sprintf("%s", time.Since(start)), // duration
			time.Now().Format(time.RFC3339),      // time
		}, "", "  ")
		fmt.Println(fmt.Sprintf("%s\n\n", entry))
	})
}
