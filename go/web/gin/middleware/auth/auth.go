package auth

import (
	// standard packages
	"net/http"

	// external packages
	"github.com/gin-gonic/gin" // gin framework
)

func CheckToken(c *gin.Context) {
	tokenSlice := c.Request.Header["Token"]
	// no token
	if len(tokenSlice) == 0 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{})
		return
	}
	// validate token
	token := tokenSlice[0]
	if len(token) < 3 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{})
		return
	}
	// passed validation
	c.Next()

}
