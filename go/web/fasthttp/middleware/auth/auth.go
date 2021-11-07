package auth

import (
	// standard packages
	"encoding/json"

	// external packages
	"github.com/valyala/fasthttp"
)

func CheckToken(h fasthttp.RequestHandler) fasthttp.RequestHandler {
	return fasthttp.RequestHandler(func(ctx *fasthttp.RequestCtx) {
		// get token
		token := ctx.Request.Header.Peek("token")
		// validate token
		validToken := len(token) >= 3
		if validToken {
			// use handler
			h(ctx)
		} else {
			// 401 response
			payload, _ := json.Marshal(struct{}{})
			// response
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusUnauthorized)
			ctx.SetBody(payload)
		}
	})
}
