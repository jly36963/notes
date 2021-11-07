package api

import (
	// standard packages
	"encoding/json"
	"fmt"
	"strconv"

	// external packages
	"github.com/savsgio/atreugo/v11"
	"github.com/valyala/fasthttp"

	// local packages
	"go-atreugo/middleware/auth"
)

func AddRouter(r *atreugo.Atreugo) {

	// subrouter (group)
	sr := r.NewGroupPath("/api")

	// @route -- GET /api
	// @desc -- return 200 OK
	// @access -- public
	sr.GET("", func(ctx *atreugo.RequestCtx) error {
		// payload
		payload, _ := json.Marshal(struct{}{})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
		return nil
	})

	// @route -- GET /api/hello
	// @desc -- redirect to "/api/hello-world"
	// @access -- public
	sr.GET("/hello", func(ctx *atreugo.RequestCtx) error {
		ctx.Redirect("/hello-world", fasthttp.StatusMovedPermanently)
		return nil
	})

	// @route -- GET /api/hello-world
	// @desc -- return "Hello World!"
	// @access -- public
	sr.GET("/hello-world", func(ctx *atreugo.RequestCtx) error {
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
		return nil
	})

	// @route -- GET /api/store/search
	// @desc -- return query param
	// @access -- public
	sr.GET("/store/search", func(ctx *atreugo.RequestCtx) error {
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
		return nil
	})

	type User struct {
		Id        int    `json:"id"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}

	// @route -- GET /api/user/:id
	// @desc -- return user
	// @access -- private
	sr.GET("/user/{id}", func(ctx *atreugo.RequestCtx) error {
		id, err := strconv.Atoi(fmt.Sprintf("%s", ctx.UserValue("id")))
		if err != nil {
			ctx.Error("Error while fetching user", fasthttp.StatusInternalServerError)
			return nil
		}
		// get user from db
		// *** db fetch logic here ***
		user := User{
			id,        // id
			"Kakashi", // firstName
			"Hatake",  // lastName
		}
		// payload
		payload, err2 := json.Marshal(user)
		if err2 != nil {
			ctx.Error("Error while fetching user", fasthttp.StatusInternalServerError)
			return nil
		}
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
		return nil
	}).UseBefore(auth.CheckToken)

	// @route -- POST /api/user/create
	// @desc -- add user to db and return new user
	// @access -- private
	sr.POST("/user/create", func(ctx *atreugo.RequestCtx) error {
		var user User
		b := ctx.PostBody() // []bytes
		err1 := json.Unmarshal(b, &user)
		if err1 != nil {
			ctx.Error("Error while creating user", fasthttp.StatusInternalServerError)
			return nil
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
			return nil
		}
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
		return nil
	}).UseBefore(auth.CheckToken)

	// @route -- POST /api/file/upload
	// @desc -- handle file upload
	// @access -- private
	// @notes -- to save: `fasthttp.SaveMultipartFile(file, "desired-filename.ext")`
	sr.POST("/file/upload", func(ctx *atreugo.RequestCtx) error {
		// get file from multipart form
		file, err := ctx.FormFile("file")
		if err != nil {
			ctx.Error("Error while processing file", fasthttp.StatusInternalServerError)
			return nil
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
		return nil
	}).UseBefore(auth.CheckToken)

	// @route -- POST /api/file/upload-multiple
	// @desc -- handle file uploads
	// @access -- private
	sr.POST("/file/upload-multiple", func(ctx *atreugo.RequestCtx) error {
		// get files from multipart form
		form, err := ctx.MultipartForm()
		if err != nil {
			ctx.Error("Error while processing file", fasthttp.StatusInternalServerError)
			return nil
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
		return nil
	}).UseBefore(auth.CheckToken)

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
