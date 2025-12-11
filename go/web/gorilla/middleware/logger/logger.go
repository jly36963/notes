package logger

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// ---
// wrapped response writer
// ---

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func WrapResponseWriter(w http.ResponseWriter) *loggingResponseWriter {
	return &loggingResponseWriter{w, http.StatusOK}
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

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

func PrettyLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// start timer
		start := time.Now()

		// request
		// fmt.Println(fmt.Sprintf("%+v\n", r))

		// wrap
		ww := WrapResponseWriter(w)

		// go to route
		next.ServeHTTP(ww, r)

		// log
		entry, _ := json.MarshalIndent(formattedLogEntry{
			r.Method,                             // method
			fmt.Sprintf("%s", r.URL),             // path
			ww.statusCode,                        // status
			fmt.Sprintf("%s", time.Since(start)), // duration
			time.Now().Format(time.RFC3339),      // time
		}, "", "  ")
		// return entry
		fmt.Println(fmt.Sprintf("%s\n\n", entry))
	})
}

// wrapped response strategy
// https://ndersson.me/post/capturing_status_code_in_net_http/

// other strategy
// https://blog.questionable.services/article/guide-logging-middleware-go/
