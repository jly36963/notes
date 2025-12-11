package redisdal

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

type IRedisDAL interface {
	// client
	GetClient()
	// strings
	StringSet(k, v string) string
	StringGet(k string) string
	StringExp(k string) bool
	StringDel(k string) int64
	// lists
	ListLpush(k, s string) int64
	ListRpush(k, s string) int64
	ListLrange(k string, start, stop int64) []string
	ListLlen(k string) int64
	ListLpop(k string) string
	ListRpop(k string) string
	ListDel(k string) int64
	// sets
	SetAdd(k, s string) int64
	SetCard(k string) int64
	SetMembers(k string) []string
	SetIsMember(k, s string) bool
	SetDel(k string) int64
	// sorted sets
	SortedAdd(k string, s float64, m string) int64
	SortedCard(k string) int64
	SortedCount(k string, lb, rb int64) int64
	SortedScore(k, m string) float64
	SortedRank(k, m string) int64
	SortedRemRangeByRank(k string, lb, rb int64) int64
	SortedRange(k string, lb, rb int64) []string
	SortedDel(k string) int64
	// hashes
	// TODO
}

type RedisDAL struct {
	client *redis.Client
	ctx    context.Context
}

func (dal *RedisDAL) getContext() {
	dal.ctx = context.TODO()
}

func (dal *RedisDAL) getClient() {
	// client options
	options := redis.Options{
		Addr: "127.0.0.1:6379",
	}
	// create client
	client := redis.NewClient(&options)
	// test client
	if err := client.Ping(dal.ctx).Err(); err != nil {
		panic("Could not get redis client")
	}
	// save client to struct
	dal.client = client
}

// SetUp gets the context and redis client
func (dal *RedisDAL) SetUp() {
	dal.getContext()
	dal.getClient()
}

// StringSet ...
func (dal *RedisDAL) StringSet(k, v string, t time.Duration) string {
	val, err := dal.client.Set(dal.ctx, k, v, t).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// StringGet ...
func (dal *RedisDAL) StringGet(k string) string {
	val, err := dal.client.Get(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// StringExp ...
func (dal *RedisDAL) StringExp(k string, t time.Duration) bool {
	val, err := dal.client.Expire(dal.ctx, k, t).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// StringDel ...
func (dal *RedisDAL) StringDel(k string) int64 {
	val, err := dal.client.Del(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// ListLpush ...
func (dal *RedisDAL) ListLpush(k, s string) int64 {
	val, err := dal.client.LPush(dal.ctx, k, s).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// ListRpush ...
func (dal *RedisDAL) ListRpush(k, s string) int64 {
	val, err := dal.client.LPush(dal.ctx, k, s).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// ListLrange ...
func (dal *RedisDAL) ListLrange(k string, start, stop int64) []string {
	val, err := dal.client.LRange(dal.ctx, k, start, stop).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// ListLlen ...
func (dal *RedisDAL) ListLlen(k string) int64 {
	val, err := dal.client.LLen(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// ListLpop ...
func (dal *RedisDAL) ListLpop(k string) string {
	val, err := dal.client.LPop(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// ListRpop ...
func (dal *RedisDAL) ListRpop(k string) string {
	val, err := dal.client.RPop(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// ListDel ...
func (dal *RedisDAL) ListDel(k string) int64 {
	val, err := dal.client.Del(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SetAdd ...
func (dal *RedisDAL) SetAdd(k, s string) int64 {
	val, err := dal.client.SAdd(dal.ctx, k, s).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SetCard ...
func (dal *RedisDAL) SetCard(k string) int64 {
	val, err := dal.client.SCard(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SetMembers ...
func (dal *RedisDAL) SetMembers(k string) []string {
	val, err := dal.client.SMembers(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SetIsMember ...
func (dal *RedisDAL) SetIsMember(k, s string) bool {
	val, err := dal.client.SIsMember(dal.ctx, k, s).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SetDel ...
func (dal *RedisDAL) SetDel(k string) int64 {
	val, err := dal.client.Del(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SortedAdd ...
func (dal *RedisDAL) SortedAdd(k string, s float64, m string) int64 {
	member := redis.Z{
		Score:  s,
		Member: m,
	}
	val, err := dal.client.ZAdd(dal.ctx, k, &member).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SortedCard ...
func (dal *RedisDAL) SortedCard(k string) int64 {
	val, err := dal.client.ZCard(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SortedCount ...
func (dal *RedisDAL) SortedCount(k string, lb, rb int64) int64 {
	val, err := dal.client.ZCount(dal.ctx, k, fmt.Sprint(lb), fmt.Sprint(rb)).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SortedScore ...
func (dal *RedisDAL) SortedScore(k, m string) float64 {
	val, err := dal.client.ZScore(dal.ctx, k, m).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SortedRank ...
func (dal *RedisDAL) SortedRank(k, m string) int64 {
	val, err := dal.client.ZRank(dal.ctx, k, m).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SortedRemRangeByRank ...
func (dal *RedisDAL) SortedRemRangeByRank(k string, lb, rb int64) int64 {
	val, err := dal.client.ZRemRangeByRank(dal.ctx, k, lb, rb).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SortedRange ...
func (dal *RedisDAL) SortedRange(k string, lb, rb int64) []string {
	val, err := dal.client.ZRange(dal.ctx, k, lb, rb).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// SortedDel ...
func (dal *RedisDAL) SortedDel(k string) int64 {
	val, err := dal.client.Del(dal.ctx, k).Result()
	if err != nil {
		panic(err)
	}
	return val
}
