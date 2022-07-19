package utils

import (
	"fmt"
	"strings"
)

func PrintSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}
