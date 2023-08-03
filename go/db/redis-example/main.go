package main

import (
	"fmt"
	"redis-example/dal/redisdal"
	"runtime"
)

func main() {
	getRuntimeDetails()

	redisDAL := redisdal.RedisDAL{}
	redisDAL.SetUp()

	// String
	var result interface{}
	result = redisDAL.StringSet("name", "Kakashi", 60*1e9)
	fmt.Printf("String SET result: %v (%T)\n", result, result)
	result = redisDAL.StringGet("name")
	fmt.Printf("String GET result: %v (%T)\n", result, result)
	result = redisDAL.StringDel("name")
	fmt.Printf("String DEL result: %v (%T)\n", result, result)
	// List
	result = redisDAL.ListLpush("dates", "2021-09-15")
	fmt.Printf("List LPUSH result: %v (%T)\n", result, result)
	result = redisDAL.ListRpush("dates", "2021-05-26")
	fmt.Printf("List RPUSH result: %v (%T)\n", result, result)
	result = redisDAL.ListLrange("dates", 0, -1)
	fmt.Printf("List LRANGE result: %v (%T)\n", result, result)
	result = redisDAL.ListLlen("dates")
	fmt.Printf("List LLEN result: %v (%T)\n", result, result)
	result = redisDAL.ListLpop("dates")
	fmt.Printf("List LPOP result: %v (%T)\n", result, result)
	result = redisDAL.ListRpop("dates")
	fmt.Printf("List RPOP result: %v (%T)\n", result, result)
	result = redisDAL.ListDel("dates")
	fmt.Printf("List DEL result: %v (%T)\n", result, result)
	// Set
	for i, color := range []string{"red", "yellow", "blue", "red"} {
		result = redisDAL.SetAdd("colors", color)
		fmt.Printf("List SADD (%d) result: %v, (%T)\n", i, result, result)
	}
	result = redisDAL.SetCard("colors")
	fmt.Printf("Set SCARD result: %v (%T)\n", result, result)
	result = redisDAL.SetMembers("colors")
	fmt.Printf("Set SMEMBERS result: %v (%T)\n", result, result)
	result = redisDAL.SetIsMember("colors", "red")
	fmt.Printf("Set SISMEMBER result: %v (%T)\n", result, result)
	result = redisDAL.SetDel("colors")
	fmt.Printf("Set DEL result: %v (%T)\n", result, result)
	// Sorted set
	scoreItems := []struct {
		score  float64
		player string
	}{
		{score: 500, player: "Player 1"},
		{score: 400, player: "Player 2"},
		{score: 300, player: "Player 3"},
		{score: 200, player: "Player 4"},
		{score: 100, player: "Player 5"},
	}
	for i, s := range scoreItems {
		result = redisDAL.SortedAdd("scores", s.score, s.player)
		fmt.Printf("Sorted set ZADD (%d) result: %v, (%T)\n", i, result, result)
	}
	result = redisDAL.SortedCard("scores")
	fmt.Printf("Sorted set ZCARD result: %v, (%T)\n", result, result)
	result = redisDAL.SortedScore("scores", "Player 1")
	fmt.Printf("Sorted set ZSCORE result: %v, (%T)\n", result, result)
	result = redisDAL.SortedRank("scores", "Player 3")
	fmt.Printf("Sorted set ZRANK result: %v, (%T)\n", result, result)
	result = redisDAL.SortedRemRangeByRank("scores", 0, -4)
	fmt.Printf("Sorted set ZREMRANGEBYRANK result: %v (%T)\n", result, result)
	result = redisDAL.SortedRange("scores", -10, -1)
	reversedResult := reverseStringSlice(result.([]string))
	fmt.Printf("Sorted set ZRANGE result: %v (%T)\n", reversedResult, reversedResult)
	result = redisDAL.SortedDel("scores")
	fmt.Printf("Sorted set DEL result: %v, (%T)\n", result, result)
}

// ---
// Runtime details
// ---

// RuntimeDetails : runtime details, gets logged immediately
type RuntimeDetails struct {
	Os      string `json:"os"`
	Arch    string `json:"arch"`
	CPUs    int    `json:"cpus"`
	Version string `json:"version"`
}

func getRuntimeDetails() {
	fmt.Printf("%+v\n", RuntimeDetails{
		Os:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		CPUs:    runtime.NumCPU(),
		Version: runtime.Version(),
	})
}

// ---
// Utils
// ---

func reverseStringSlice(s []string) []string {
	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		s[i], s[j] = s[j], s[i]
	}
	return s
}
