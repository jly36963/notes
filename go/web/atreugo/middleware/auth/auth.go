package auth

import (
	"encoding/json"

	"github.com/savsgio/atreugo/v11"
	"github.com/valyala/fasthttp"
)

func CheckToken(ctx *atreugo.RequestCtx) error {
	// get token
	token := ctx.Request.Header.Peek("token")
	// validate token
	validToken := len(token) >= 3
	if validToken {
		// use handler
		ctx.Next()
	} else {
		// 401 response
		payload, _ := json.Marshal(struct{}{})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusUnauthorized)
		ctx.SetBody(payload)
	}
	return nil
}
