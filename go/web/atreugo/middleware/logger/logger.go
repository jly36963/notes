package logger

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/savsgio/atreugo/v11"
)

type formattedLogEntry struct {
	Method string `json:"method"`
	Path   string `json:"path"`
	Time   string `json:"time"`
}

func PrettyLogger(ctx *atreugo.RequestCtx) error {
	// handle request
	ctx.Next()
	// log
	entry, _ := json.MarshalIndent(formattedLogEntry{
		fmt.Sprintf("%s", ctx.Method()), // method
		fmt.Sprintf("%s", ctx.Path()),   // path
		time.Now().Format(time.RFC3339), // time
	}, "", "  ")
	fmt.Println(fmt.Sprintf("\n%s\n", entry))
	return nil
}
