package api

// imports
import (
	// standard packages
	"encoding/json"
	"fmt"
	"strconv"

	// local packages
	"go-fasthttp/middleware/auth"

	// external packages
	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"
)

func AddRouter(r *router.Router) {

	// subrouter (group)
	sr := r.Group("/api")

	// @route -- GET /api
	// @desc -- return 200 OK
	// @access -- public
	sr.GET("", func(ctx *fasthttp.RequestCtx) {
		// payload
		payload, _ := json.Marshal(struct{}{})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	})

	// @route -- GET /api/hello
	// @desc -- redirect to "/api/hello-world"
	// @access -- public
	sr.GET("/hello", func(ctx *fasthttp.RequestCtx) {
		ctx.Redirect("/hello-world", fasthttp.StatusMovedPermanently)
	})

	// @route -- GET /api/hello-world
	// @desc -- return "Hello World!"
	// @access -- public
	sr.GET("/hello-world", func(ctx *fasthttp.RequestCtx) {
		// payload
		payload, _ := json.Marshal(struct {
			Message string `json:"message"`
		}{
			"Hello World!",
		})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	})

	// @route -- GET /api/store/search
	// @desc -- return query param
	// @access -- public
	sr.GET("/store/search", func(ctx *fasthttp.RequestCtx) {
		// query
		q := string(ctx.QueryArgs().Peek("q"))
		// payload
		payload, _ := json.Marshal(struct {
			Q string `json:"q"`
		}{
			q,
		})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	})

	type User struct {
		Id        int    `json:"id"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}

	// @route -- GET /api/user/:id
	// @desc -- return user
	// @access -- private
	sr.GET("/user/{id}", auth.CheckToken(func(ctx *fasthttp.RequestCtx) {
		id, _ := strconv.Atoi(fmt.Sprintf("%s", ctx.UserValue("id")))
		// get user from db
		// *** db fetch logic here ***
		user := User{
			id,        // id
			"Kakashi", // firstName
			"Hatake",  // lastName
		}
		// payload
		payload, _ := json.Marshal(user)
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	}))

	// @route -- POST /api/user/create
	// @desc -- add user to db and return new user
	// @access -- private
	sr.POST("/user/create", auth.CheckToken(func(ctx *fasthttp.RequestCtx) {
		var user User
		b := ctx.PostBody() // []bytes
		err1 := json.Unmarshal(b, &user)
		if err1 != nil {
			ctx.Error("Error while creating user", fasthttp.StatusInternalServerError)
		}
		// get user from db
		// *** db fetch logic here ***
		newUser := User{
			46,             // id
			user.FirstName, // firstName
			user.LastName,  // lastName
		}
		// payload
		payload, err2 := json.Marshal(newUser)
		if err2 != nil {
			ctx.Error("Error while fetching new user", fasthttp.StatusInternalServerError)
		}
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	}))

	// @route -- POST /api/file/upload
	// @desc -- handle file upload
	// @access -- private
	// @notes -- to save: `fasthttp.SaveMultipartFile(file, "desired-filename.ext")`
	sr.POST("/file/upload", auth.CheckToken(func(ctx *fasthttp.RequestCtx) {
		// get file from multipart form
		file, err := ctx.FormFile("file")
		if err != nil {
			ctx.Error("Error while processing file", fasthttp.StatusInternalServerError)
			return
		}
		fn := file.Filename
		// payload
		payload, _ := json.Marshal(struct {
			Fn string `json:"fn"`
		}{
			Fn: fn,
		})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	}))

	// @route -- POST /api/file/upload-multiple
	// @desc -- handle file uploads
	// @access -- private
	sr.POST("/file/upload-multiple", auth.CheckToken(func(ctx *fasthttp.RequestCtx) {
		// get files from multipart form
		form, err := ctx.MultipartForm()
		if err != nil {
			ctx.Error("Error while processing file", fasthttp.StatusInternalServerError)
			return
		}
		fns := []string{}
		filesMap := form.File
		for _, files := range filesMap {
			for _, file := range files {
				fn := file.Filename
				fns = append(fns, fn)
			}
		}
		// payload
		payload, _ := json.Marshal(struct {
			Fns []string `json:"fns"`
		}{
			Fns: fns,
		})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	}))
}

// ---
// statuses
// ---

// 200 -- StatusOK
// 300 -- StatusMovedPermanently
// 400 -- StatusBadRequest
// 401 -- StatusUnauthorized
// 402 -- StatusPaymentRequired
// 403 -- StatusForbidden
// 404 -- StatusNotFound
// 500 -- StatusInternalServerError
// 503 -- StatusServiceUnavailable
