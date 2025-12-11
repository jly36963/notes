package api

import (
	// standard packages
	"log"
	"net/http"

	// local packages
	"go-gin/middleware/auth" // auth middleware

	// external packages
	"github.com/gin-gonic/gin" // gin framework
)

func Routes(r *gin.Engine) {

	// subrouter (grouped routes)
	sr := r.Group("/api")
	{
		// @route -- GET /api
		// @desc -- return 200 OK
		// @access -- public
		sr.GET("", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{})
		})

		// @route -- GET /api/hello
		// @desc -- redirect to /api/hello-world (status 301)
		// @access -- public
		sr.GET("/hello", func(c *gin.Context) {
			c.Redirect(http.StatusMovedPermanently, "/hello-world")
		})

		// @route -- GET /api/hello-world
		// @desc -- return "Hello World"
		// @access -- public
		sr.GET("/hello-world", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Hello world!",
			})
		})

		// @route -- GET /api/store/search
		// @desc -- return query
		// @access -- public
		sr.GET("/store/search", func(c *gin.Context) {
			// c.DefaultQuery("name", "Kakashi") // default
			// c.Query("lastName") // c.Request.URL.Query().Get("lastname")
			// c.Request.URL.Query() // map (type url.Values)
			query := c.Request.URL.Query() // map[string][]string
			c.JSON(http.StatusOK, gin.H{
				"query": query,
			})
		})

		// @route -- GET /api/user/:id
		// @desc -- return user
		// @access -- protected
		sr.GET("/user/:id", auth.CheckToken, func(c *gin.Context) {
			id := c.Param("id")
			// *** db fetch logic here ***
			c.JSON(http.StatusOK, gin.H{
				"id":   id,
				"name": "Kakashi Hatake",
			})
		})

		type User struct {
			Id        int    `json:"id"`
			FirstName string `json:"firstName"`
			LastName  string `json:"lastName"`
		}

		// @route -- POST /api/user/create
		// @desc -- create and return user
		// @access -- protected
		sr.POST("/user/create", auth.CheckToken, func(c *gin.Context) {
			var user User
			c.BindJSON(&user)
			// validate post body
			// *** validation logic here
			// add user to db
			// *** db insert logic here ***
			newUser := User{
				46,             // id
				user.FirstName, // firstName
				user.LastName,  // lastName
			}
			c.JSON(http.StatusOK, gin.H{
				"user": newUser,
			})
		})

		// @route -- POST /api/file/upload
		// @desc -- handle file (form/multipart)
		// @access -- protected
		// @notes -- to save file, use `c.SaveUploadedFile(file, dst)`
		sr.POST("/file/upload", auth.CheckToken, func(c *gin.Context) {
			// get file
			file, _ := c.FormFile("file")
			// get file name
			fn := file.Filename
			log.Println("fn:", fn)
			// response
			c.JSON(http.StatusOK, gin.H{
				"fn": fn,
			})
		})

		// @route -- POST /api/file/upload-multiple
		// @desc -- handle files (form/multipart)
		// @access -- protected
		sr.POST("/file/upload-multiple", auth.CheckToken, func(c *gin.Context) {
			// form
			form, _ := c.MultipartForm() // get multipart form
			files := form.File["files"]  // "files" -- field name
			// use files
			fns := []string{}
			for _, file := range files {
				fn := file.Filename
				fns = append(fns, fn)
			}

			// response
			c.JSON(http.StatusOK, gin.H{
				"fns": fns,
			})
		})
	}
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
