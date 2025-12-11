package main

import (
	"fmt"
	"strings"

	"github.com/go-gota/gota/dataframe"
	"github.com/go-gota/gota/series"
)

// docs: https://pkg.go.dev/github.com/go-gota/gota/dataframe
// github: https://github.com/go-gota/gota

func main() {
	printSectionTitle("basic creation 1")
	basicCreation1()
	printSectionTitle("basic creation 2")
	basicCreation2()
	printSectionTitle("basic creation 3")
	basicCreation3()
	printSectionTitle("basic creation 4")
	basicCreation4()
	printSectionTitle("basic selection")
	basicSelection()
	printSectionTitle("basic rename")
	basicRename()
	printSectionTitle("basic concat")
	basicConcat()
	printSectionTitle("basic filtering")
	basicFiltering()
	printSectionTitle("basic mutate")
	basicMutate()
	printSectionTitle("basic arrange (sort)")
	basicArrange()
	printSectionTitle("basic groupby")
	basicGroupBy()
}

// Create a dataframe from multiple series
func basicCreation1() {
	df := dataframe.New(
		series.New([]string{"a", "b", "c", "d", "e"}, series.String, "col1"),
		series.New([]int{1, 2, 3, 4, 5}, series.Int, "col2"),
		series.New([]float64{1.0, 2.0, 3.0, 4.0, 5.0}, series.Float, "col3"),
	)
	fmt.Println("Types")
	fmt.Println(df.Types())
	fmt.Println("Names")
	fmt.Println(df.Names())
	fmt.Println("Dims")
	fmt.Println(df.Dims())
	fmt.Println("Ncol")
	fmt.Println(df.Ncol())
	fmt.Println("Nrow")
	fmt.Println(df.Nrow())
	fmt.Println("Describe")
	fmt.Println(df.Describe()) // Aggregation stats about each column
	fmt.Println("df")
	fmt.Println(df)
}

// Create a dataframe from a slice of structs
func basicCreation2() {
	type Ninja struct {
		FirstName string
		LastName  string
		Age       int
	}
	df := dataframe.LoadStructs([]Ninja{
		{"Kakashi", "Hatake", 27},
		{"Iruka", "Umino", 25},
		{"Hiruzen", "Sarutobi", 68},
	})
	fmt.Println(df)
}

// Create a dataframe from slice of map[string]interface{}
func basicCreation3() {
	df := dataframe.LoadMaps([]map[string]interface{}{
		{"FirstName": "Kakashi", "LastName": "Hatake", "age": 27},
		{"FirstName": "Tenzo", "LastName": "Yamato", "age": 26},
		{"FirstName": "Iruka", "LastName": "Umino", "age": 25},
	})
	fmt.Println(df)
}

// Create a dataframe from a csv string
func basicCreation4() {
	csv := "" +
		"FirstName,LastName,Age" + "\n" +
		"Kakashi,Hatake,27" + "\n" +
		"Tenzo,Yamato,26" + "\n" +
		"Iruka,Umino,25"
	df := dataframe.ReadCSV(strings.NewReader(csv))
	fmt.Println(df)
}

// Return a simple dataframe for example usage
func getSimpleDf() dataframe.DataFrame {
	return dataframe.New(
		series.New([]string{"a", "b", "c", "d", "e"}, series.String, "col1"),
		series.New([]int{1, 2, 3, 4, 5}, series.Int, "col2"),
		series.New([]float64{1.0, 2.0, 3.0, 4.0, 5.0}, series.Float, "col3"),
	)
}

// Get rows (subset) or columns (select)
func basicSelection() {
	df := getSimpleDf()
	subsetRows := df.Subset([]int{1, 2})
	fmt.Println("subsetRows")
	fmt.Println(subsetRows)
	selectedCols := df.Select([]string{"col1", "col2"})
	fmt.Println("selectedCols")
	fmt.Println(selectedCols)
	col := df.Col("col1")
	fmt.Println("col")
	fmt.Println(col)
	elem := df.Elem(0, 0) // row, col
	fmt.Println("elem")
	fmt.Println(elem)
}

func basicRename() {
	df := getSimpleDf()
	renameResult := df.Rename("col1", "COL1")
	fmt.Println("renameResult")
	fmt.Println(renameResult)
}

func basicConcat() {
	df := getSimpleDf()
	concatResult := df.Concat(df)
	fmt.Println("concatResult")
	fmt.Println(concatResult)
}

// Filter using predicate
func basicFiltering() {
	// Filter uses "or" if multiple filters.
	// Use FilterAggregation + And for multiple "and" filters
	// Chain filters for combinations (chaining single filters is "and")
	// compFunc can be used for custom filters (use currying to include additional variables)
	// Comparators: Less, LessEq, Greater, GreaterEq, Eq, Neq, In
	df := getSimpleDf()

	filterResult := df.Filter(
		dataframe.F{Colname: "col2", Comparator: series.LessEq, Comparando: 3},
	)
	fmt.Println("filterResult")
	fmt.Println(filterResult)

	filterAggregationResult := df.FilterAggregation(
		dataframe.And,
		dataframe.F{Colname: "col2", Comparator: series.LessEq, Comparando: 3},
		dataframe.F{Colname: "col1", Comparator: series.Neq, Comparando: "c"},
	)
	fmt.Println("filterAggregationResult")
	fmt.Println(filterAggregationResult)

	chainFilterResult := df.
		Filter(dataframe.F{Colname: "col2", Comparator: series.GreaterEq, Comparando: 3}).
		Filter(dataframe.F{Colname: "col1", Comparator: series.Neq, Comparando: "c"})
	fmt.Println("chainFilterResult")
	fmt.Println(chainFilterResult)

	compFuncResult := df.Filter(dataframe.F{
		Colname:    "col2",
		Comparator: series.CompFunc,
		Comparando: func(el series.Element) bool {
			if el.Type() == series.Int {
				if val, ok := el.Val().(int); ok {
					return val%2 == 0
				}
			}
			return false
		},
	})
	fmt.Println("compFuncResult")
	fmt.Println(compFuncResult)
}

// Add or replace column
func basicMutate() {
	df := getSimpleDf()
	mutateResult := df.Mutate(
		series.New([]string{"e", "d", "c", "b", "a"}, series.String, "col4"),
	)
	fmt.Println("mutateResult")
	fmt.Println(mutateResult)
}

// Sort dataframe
func basicArrange() {
	df := getSimpleDf()
	df2 := df.Mutate(
		series.New([]string{"a", "a", "a", "b", "b"}, series.String, "col4"),
	)
	sorted := df2.Arrange(
		dataframe.Sort("col4"),    // primary sort
		dataframe.RevSort("col2"), // secondary sort
	)
	fmt.Println("sorted")
	fmt.Println(sorted)
}

// Group dataframe
func basicGroupBy() {
	// Can group by multiple columns (variadic)
	// Aggregations: MAX, MIN, MEAN, MEDIAN, COUNT, STD, SUM
	// aggregation types should be same length as aggregation cols
	// Only returns the columns used in groupby/agg
	df := getSimpleDf()
	df2 := df.Mutate(
		series.New([]string{"a", "a", "a", "b", "b"}, series.String, "col4"),
	)
	agg := df2.
		GroupBy("col4").
		Aggregation(
			[]dataframe.AggregationType{dataframe.Aggregation_MAX},
			[]string{"col3"},
		)
	fmt.Println("agg")
	fmt.Println(agg)
}

// TODO: joins (InnerJoin, LeftJoin, RightJoin, CrossJoin)
// TODO: apply (Capply, Rapply)
// TODO: set (Set)
// TODO: conversion (WriteCSV, WriteJSON, String, Maps)
// TODO: agg (GetGroups)
// TODO: mutate (Drop)

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}
