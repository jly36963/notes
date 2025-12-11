package auth

import (
	"encoding/json"
	"log"
	"net/http"
)

func CheckToken(f http.HandlerFunc) http.HandlerFunc {
	// if token is valid, use provided HandlerFunc.
	// otherwise, return 401 error response.
	return func(w http.ResponseWriter, r *http.Request) {
		// get token
		token := r.Header.Get("Token")
		// validate token
		validToken := len(token) > 0
		if validToken {
			f(w, r)
		} else {
			// payload
			payload, err := json.Marshal(struct {
				Message string `json:"message"`
			}{
				"Improper auth",
			})
			if err != nil {
				log.Println(err)
			}
			// response
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write(payload)
		}
	}
}

/*

// ---
// alternate method (http.Handler & r.Handle)
// ---

// middleware

func CheckToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get token from headers
		token := r.Header.Get("Token")
		// validate token
		if len(token) == 0 {
			// bad token
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		// go to route
		next.ServeHTTP(w, r)
	})
}

// route

// @route -- GET /api/user/:id
// @desc -- return user
// @access -- private
sr.Handle("/hello-world", auth.CheckToken(http.HandlerFunc(
	func(w http.ResponseWriter, r *http.Request) {
		// payload
		payload, err := json.Marshal(struct {
			Message string `json:"message"`
		}{
			"Hello World!",
		})
		if err != nil {
			log.Println(err)
		}
		// response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(payload)
	}))).Methods("GET")

*/
