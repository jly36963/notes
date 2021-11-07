package logger

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

// ---
// formatted logger
// ---

type formattedLogEntry struct {
	Method   string `json:"method"`
	Path     string `json:"path"`
	Status   int    `json:"status"`
	Duration string `json:"duration"`
	Time     string `json:"time"`
}

func PrettyLogger(param gin.LogFormatterParams) string {
	// pretty json
	entry, _ := json.MarshalIndent(formattedLogEntry{
		param.Method,
		param.Path,
		param.StatusCode,
		fmt.Sprintf("%s", param.Latency),
		param.TimeStamp.Format(time.RFC1123),
	}, "", "  ")
	// return entry
	return fmt.Sprintf("%s\n\n", entry)
}
